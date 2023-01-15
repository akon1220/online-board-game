import socket from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import Session from '../session'
import {
  memberChangeEvent,
  launchGameEvent,
  gameLaunchedEvent,
  Sendable,
  noRoomFoundEvent,
  changeGameRequestEvent,
  setGameEvent,
} from '../socket_events/room'
import { GamePool, GameId } from './games'
import { SocketApp } from './games/socket_app'

export class RoomApp extends SocketApp {
  private static instances: { [key: string]: RoomApp } = {}

  static push = (room: RoomApp) => {
    RoomApp.instances[room.uuid] = room
  }

  static search = (roomId: string): RoomApp | undefined => {
    return RoomApp.instances[roomId]
  }

  static delegate = (sock: socket.Socket, roomId: string) => {
    const room = RoomApp.search(roomId)
    if (room === undefined) {
      noRoomFoundEvent(sock).emit('')
      return
    }
    room.accept(sock)
  }

  uuid: string
  gameId: string

  constructor(gameId: string, roomId?: string) {
    super(undefined)
    this.uuid = roomId || uuidv4()
    this.gameId = gameId
    RoomApp.push(this)
  }

  onConnect = (session: Session) => {
    if (session.sock === undefined) return
    launchGameEvent(session.sock).handle(this.launchGame)
    changeGameRequestEvent(session.sock).handle((payload) =>
      this.changeGame(payload.gameId)
    )
    setGameEvent(session.sock).emit({ gameId: this.gameId })
    this.forEach((sess) => {
      if (sess.sock === undefined) return
      memberChangeEvent(sess.sock).emit({
        members: Object.keys(this.sessions).map(
          (key) => this.sessions[key].userName
        ),
      })
      setGameEvent(sess.sock).emit({ gameId: this.gameId })
    })
  }

  onDisconnect = (session: Session) => {
    // TODO delete room when room is empty for a decent time
    delete this.sessions[session.uuid]
    this.forEach((sess) => {
      if (sess.sock === undefined) return
      memberChangeEvent(sess.sock).emit({
        members: Object.keys(this.sessions)
          .filter((key) => this.sessions[key].sock !== undefined)
          .map((key) => this.sessions[key].userName),
      })
    })
  }

  onReconnect = this.onConnect

  onEndGame = () => {
    delete RoomApp.instances[this.uuid]
  }

  private launchGame = (config: Sendable) => {
    // TODO: 複数人がほぼ同時スタートを押した時の対応
    const GameAppClass = GamePool[this.gameId as GameId]
    if (GameAppClass === undefined) {
      // TODO: Error Handling
    }
    const game = new GameAppClass(this.uuid)
    game.sessionsInRoom = Object.values(this.sessions).map((session) => ({
      sessionId: session.sessionId,
      uuid: session.uuid,
      userName: session.userName,
    }))
    game.config = config
    this.forEach((sess) => {
      if (sess.sock === undefined) return
      gameLaunchedEvent(sess.sock).emit({
        gameId: this.gameId,
        gameUUID: game.uuid,
      })
    })
    this.endGame()
  }

  private changeGame = (newGameId: string) => {
    this.gameId = newGameId
    this.forEach((sess) => {
      if (sess.sock === undefined) return
      setGameEvent(sess.sock).emit({ gameId: this.gameId })
    })
  }
}
