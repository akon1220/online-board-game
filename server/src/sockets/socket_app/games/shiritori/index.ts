import socket from 'socket.io'
import Session from '../../../session'
import { SocketApp } from '../socket_app'
import {
  TurnBaseGameController,
  TurnBaseGameInterface,
} from '../../mixin/turn_base_game'
import {
  endMyTurnEvent,
  startGameEvent,
} from '../../../socket_events/games/shiritori'

export class ShiritoriGameApp extends SocketApp
  implements TurnBaseGameInterface {
  private static instances: { [key: string]: ShiritoriGameApp } = {}

  static push = (app: ShiritoriGameApp) => {
    ShiritoriGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): ShiritoriGameApp | undefined => {
    return ShiritoriGameApp.instances[uuid]
  }

  static id = 'shiritori'

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = ShiritoriGameApp.search(uuid)
    game?.accept(sock)
  }

  turn: TurnBaseGameController

  constructor(backRoomId: string) {
    super(backRoomId)
    this.turn = new TurnBaseGameController(this)
    this.nextSession = this.turn.defaultNextSessionSelector

    ShiritoriGameApp.push(this)
  }

  onConnect = (session: Session) => {
    if (session.sock === undefined) return
    startGameEvent(session.sock).handle(this.turn.start)
  }

  onReconnect = (session: Session) => {
    const isMyTurn = this.turn.rejoin(session)
    if (isMyTurn) this.turnStart(session)
  }

  onEndGame = () => {
    this.back2Room(ShiritoriGameApp.id)
    delete ShiritoriGameApp.instances[this.uuid]
  }

  onDisconnect = () => {
    this.ifEmptyForAWhileDo(() => {
      delete ShiritoriGameApp.instances[this.uuid]
    })
  }

  nextSession: () => Session | null

  turnStart = (session: Session) => {
    if (session.sock === undefined) return
    const ev = endMyTurnEvent(session.sock).handle(() => {
      ev.unhandle()
      this.turn.end()
    })
  }

  onLastTurnEnd = () => {
    this.endGame()
  }
}
