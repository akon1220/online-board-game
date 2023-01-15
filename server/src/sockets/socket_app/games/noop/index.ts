import socket from 'socket.io'
import Session from '../../../session'
import { SocketApp } from '../socket_app'

export class NoopGameApp extends SocketApp {
  private static instances: { [key: string]: NoopGameApp } = {}

  static push = (app: NoopGameApp) => {
    NoopGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): NoopGameApp | undefined => {
    return NoopGameApp.instances[uuid]
  }

  static id = 'noop'

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = NoopGameApp.search(uuid)
    game?.accept(sock)
  }

  constructor(backRoomId: string) {
    super(backRoomId)
    NoopGameApp.push(this)
  }

  onConnect = () => {
    //
  }

  onReconnect = this.onConnect

  onEndGame = () => {
    this.back2Room(NoopGameApp.id)
    delete NoopGameApp.instances[this.uuid]
  }

  onDisconnect = (session: Session) => {
    this.remove(session)
    this.ifEmptyForAWhileDo(() => {
      delete NoopGameApp.instances[this.uuid]
    })
  }
}
