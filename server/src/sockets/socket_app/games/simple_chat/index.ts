import socket from 'socket.io'
import Session from '../../../session'
import {
  messageSentRequestEvent,
  messageChangeEvent,
} from '../../../socket_events/games/simple_chat'
import { SocketApp } from '../socket_app'

export class SimpleChatGameApp extends SocketApp {
  private static instances: { [key: string]: SimpleChatGameApp } = {}

  static push = (app: SimpleChatGameApp) => {
    SimpleChatGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): SimpleChatGameApp | undefined => {
    return SimpleChatGameApp.instances[uuid]
  }

  static id = 'simple_chat'

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = SimpleChatGameApp.search(uuid)
    game?.accept(sock)
  }

  messages: { user: string | undefined; body: string; createdAt: Date }[] = []

  constructor(backRoomId: string) {
    super(backRoomId)
    SimpleChatGameApp.push(this)
  }

  onConnect = (session: Session) => {
    if (session.sock === undefined) return
    messageSentRequestEvent(session.sock).handle((payload) =>
      this.updateMessage({ ...payload, user: session.userName })
    )
    messageChangeEvent(session.sock).emit(this.messages)
  }

  onReconnect = this.onConnect

  onEndGame = () => {
    this.back2Room(SimpleChatGameApp.id)
    delete SimpleChatGameApp.instances[this.uuid]
  }

  onDisconnect = (session: Session) => {
    this.remove(session)
    this.ifEmptyForAWhileDo(() => {
      delete SimpleChatGameApp.instances[this.uuid]
    })
  }

  private updateMessage = ({
    user,
    body,
    createdAt,
  }: {
    user: string | undefined
    body: string
    createdAt: Date
  }) => {
    this.messages.push({ user, body, createdAt })
    this.forEach((sess) => {
      if (sess.sock) messageChangeEvent(sess.sock).emit(this.messages)
    })
  }
}
