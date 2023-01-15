import Session from '../../session'
import { SocketApp } from '../games/socket_app'
import {
  startTurnBaseGameEvent,
  endTurnBaseGameEvent,
  turnStartNotifyEvent,
  turnEndNotifyEvent,
} from '../../socket_events/mixin/turn_base_game'

export interface TurnBaseGameInterface {
  nextSession: () => Session | null
  onLastTurnEnd: (lastSession: Session | null) => void
  turnStart: (session: Session) => void
}

type TurnBaseGame = SocketApp & TurnBaseGameInterface

export class TurnBaseGameController {
  currentSession: Session | null = null
  constructor(public app: TurnBaseGame) {}

  end: () => void = () => {
    //
  }

  start = async () => {
    this.app.forEach((session) => {
      if (session.sock === undefined) return
      startTurnBaseGameEvent(session.sock).emit('')
    })
    while (true) {
      const res = await this.nextTurn()
      if (res === false) break
    }
  }

  /**
   * return true if now your turn
   */
  rejoin = (session: Session): boolean => {
    if (session.sock === undefined) return false
    startTurnBaseGameEvent(session.sock).emit('')
    if (this.currentSession === session) {
      turnStartNotifyEvent(session.sock).emit('')
      return true
    }
    return false
  }

  private nextTurn = async (): Promise<boolean> => {
    const nextSession = this.app.nextSession()
    if (!nextSession?.sock) {
      this.endTurnBaseGame(this.currentSession)
      return false
    }
    this.currentSession = nextSession
    turnStartNotifyEvent(nextSession.sock).emit('')
    const res = await this.oneTurn(nextSession)
    turnEndNotifyEvent(nextSession.sock).emit('')
    if (res === false) this.endTurnBaseGame(this.currentSession)
    return res !== false
  }

  private oneTurn = async (session: Session) => {
    return new Promise((resolve) => {
      this.end = () => {
        this.end = () => {
          //
        }
        resolve()
      }
      this.app.turnStart(session)
    })
  }

  private endTurnBaseGame = (lastSession: Session | null) => {
    this.app.onLastTurnEnd(lastSession)
    this.app.forEach((session) => {
      if (session.sock === undefined) return
      endTurnBaseGameEvent(session.sock).emit('')
    })
  }

  defaultNextSessionSelector = (): Session | null => {
    const sessions = Object.values(this.app.sessions)
    const currentIndex = sessions.findIndex(
      (session) => session === this.currentSession
    )
    if (sessions.length === 0) return null
    if (currentIndex + 1 < sessions.length) return sessions[currentIndex + 1]
    return sessions[0]
  }
}
