import socket from 'socket.io'
import {
  launchRoomAppRequestEvent,
  roomAppLaunchedEvent,
} from '@server/sockets/socket_events/home'
import { RoomApp } from './room'

export class HomeApp {
  static delegate = (sock: socket.Socket) => {
    new HomeApp(sock)
  }

  constructor(public sock: socket.Socket) {
    sock.removeAllListeners()
    launchRoomAppRequestEvent(sock).handle(this.launchRoomApp)
  }

  private launchRoomApp = ({ gameId }: { gameId: string }) => {
    const room = new RoomApp(gameId)
    roomAppLaunchedEvent(this.sock).emit({ roomId: room.uuid })
  }
}
