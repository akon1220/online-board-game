import socket from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import Session from '../../session'
import {
  appAcceptedEvent,
  endGameRequestEvent,
  gameEndedEvent,
  disconnectEvent,
  alreadyJoinedErrorEvent,
} from '../../socket_events/system'
import { RoomApp } from '../room'
import { Sendable } from '../../socket_events/room'

export abstract class SocketApp<S extends Session = Session> {
  uuid: string = uuidv4()
  sessions: { [sessionId: string]: S } = {}
  sessionsInRoom: { sessionId: string; userName: string; uuid: string }[] = []
  config: Sendable = ''

  constructor(
    public backRoomId: string | undefined,
    private SessionClass = Session
  ) {}

  accept = (sock: socket.Socket) => {
    const sessionId = sock.handshake.query.sessionId
    if (sessionId === undefined || this.sessions[sessionId] === undefined) {
      this.handleConnection(sock, sessionId)
      return
    }

    const session = this.sessions[sessionId]
    if (session.sock !== undefined) {
      alreadyJoinedErrorEvent(sock).emit('')
      return
    }
    this.handleReconnection(session, sock)
  }

  private handleConnection = (sock: socket.Socket, sessionId: string) => {
    const session = new this.SessionClass(sock, sessionId) as S
    this.sessions[sessionId] = session
    const ev = disconnectEvent(sock).handle(() =>
      this.handleDisconnection(session, ev)
    )
    appAcceptedEvent(sock).emit('')
    endGameRequestEvent(sock).handle(() => {
      this.beforeEndGame()
      this.endGame()
    })
    return this.onConnect(session)
  }

  private handleDisconnection = (session: S, ev: { unhandle: () => void }) => {
    ev.unhandle()
    session.sock?.removeAllListeners()
    this.sessions[session.sessionId].sock = undefined
    return this.onDisconnect(session)
  }

  private handleReconnection = (session: S, sock: socket.Socket) => {
    session.sock = sock
    const ev = disconnectEvent(sock).handle(() =>
      this.handleDisconnection(session, ev)
    )
    appAcceptedEvent(sock).emit('')
    endGameRequestEvent(sock).handle(this.endGame)
    return this.onReconnect(session)
  }

  protected endGame = () => {
    if (this.onEndGame() === false) return
    this.forEach((sess) => {
      sess.sock?.removeAllListeners()
      sess.sock?.disconnect()
    })
  }

  /**
   * return false to reject connection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected abstract onConnect: (session: S) => void

  beforeEndGame = () => {
    //
  }

  protected abstract onEndGame: () => boolean | void

  protected abstract onDisconnect: (session: S) => void

  protected abstract onReconnect: (session: S) => void

  protected remove = (session: S) => {
    delete this.sessions[session.sessionId]
  }

  protected ifEmptyForAWhileDo = (cb: Function) => {
    if (this.isEmpty()) {
      setTimeout(() => {
        if (this.isEmpty()) cb()
      }, 10000) // 10 sec
    }
  }

  private isEmpty = (): boolean => {
    for (const id in this.sessions) {
      const session = this.sessions[id]
      if (session.sock !== undefined) return false
    }
    return true
  }

  protected back2Room = (gameId: string) => {
    const room = new RoomApp(gameId, this.backRoomId)
    this.forEach((sess) => {
      if (sess.sock) gameEndedEvent(sess.sock).emit({ roomId: room.uuid })
    })
  }

  forEach = (f: (session: S) => void) => {
    for (const id in this.sessions) {
      f(this.sessions[id])
    }
  }
}
