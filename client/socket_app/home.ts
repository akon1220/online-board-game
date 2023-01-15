import {
  launchRoomAppRequestEvent,
  roomAppLaunchedEvent,
} from '@/socket_events/home'
import { joinHomeAppEvent } from '@/socket_events/system'
import { ApplicationReturnStatus, SocketApp } from './socket_app'

export class HomeApp extends SocketApp {
  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    joinHomeAppEvent(this.sock).emit('')
    const nextURL = await this.receiveNewRoomURL()
    this.sock.removeAllListeners()
    this.sock.close()
    return { nextURL }
  }

  launchRoomApp = (gameId: string) => {
    if (this.sock) launchRoomAppRequestEvent(this.sock).emit({ gameId })
  }

  private receiveNewRoomURL = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (this.sock === undefined) {
        reject(new Error('no socket available'))
        return
      }
      const ev = roomAppLaunchedEvent(this.sock).handle(({ roomId }) => {
        ev.unhandle()
        resolve(`/room/${roomId}`)
      })
    })
  }
}
