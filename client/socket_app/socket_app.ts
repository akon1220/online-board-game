import io, { Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'
import {
  connectEvent,
  noAppFoundEvent,
  appAcceptedEvent,
  joinAppEvent,
  endGameRequestEvent,
  gameEndedEvent,
  alreadyJoinedErrorEvent,
} from '@/socket_events/system'
import { SocketAppException } from './exceptions'

export type ApplicationReturnStatus = {
  nextURL: string
}

export class SocketApp {
  sock: typeof Socket
  constructor() {
    let sessionId = Cookies.get('session')
    if (sessionId === undefined) {
      sessionId = uuidv4()
      Cookies.set('session', sessionId)
    }
    this.sock = io({
      autoConnect: false,
      forceNew: true,
      query: {
        userName: Cookies.get('user') || 'Guest',
        sessionId,
      },
    })
  }

  /**
   * このメソッドはAppが終わるまで走り続ける。
   * Appが終了する時にこのメソッドからも抜ける。
   */
  exec = async (): Promise<ApplicationReturnStatus> => {
    throw Error('not implemented')
  }

  protected openSock = (): Promise<void> => {
    return new Promise((resolve) => {
      connectEvent(this.sock).handle(() => {
        resolve()
      })
      this.sock.open()
    })
  }

  closeSock = () => {
    this.sock.removeAllListeners()
    this.sock.disconnect()
  }

  protected join = (appId: string) => {
    const appUUID = this.getGameUUID()
    if (appUUID === undefined) throw new SocketAppException('no app')
    return new Promise((resolve, reject) => {
      noAppFoundEvent(this.sock).handle(() => {
        reject(new SocketAppException('no app'))
      })
      appAcceptedEvent(this.sock).handle(() => {
        resolve()
      })
      alreadyJoinedErrorEvent(this.sock).handle(() => {
        reject(new SocketAppException('already joined'))
      })
      joinAppEvent(this.sock).emit({
        appId,
        appUUID,
      })
    })
  }

  endGameRequest = () => {
    endGameRequestEvent(this.sock).emit('')
  }

  protected waitUntilGameEnded = (): Promise<string> => {
    return new Promise((resolve) => {
      gameEndedEvent(this.sock).handle(({ roomId }) => {
        resolve(`/room/${roomId}`)
      })
    })
  }

  protected getGameUUID = () => location.pathname.split('/').pop()
}
