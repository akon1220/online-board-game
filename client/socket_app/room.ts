import { Dispatch } from 'redux'
import {
  memberChangeEvent,
  launchGameEvent,
  gameLaunchedEvent,
  noRoomFoundEvent,
  changeGameRequestEvent,
  setGameEvent,
} from '@/socket_events/room'
import { PATH } from '@/constants'
import { roomOperations } from '@/state/ducks/room'
import { BaseError } from '@/base_error'
import { ApplicationReturnStatus, SocketApp } from './socket_app'
import { routerOperations } from '@/state/ducks/router'

// eslint-disable-next-line prettier/prettier
class BackToHomeException extends BaseError {}

export class RoomApp extends SocketApp {
  dispatch: Dispatch
  constructor(dispatch: Dispatch) {
    super()
    this.dispatch = dispatch
  }

  launchGameApp = () => {
    launchGameEvent(this.sock).emit('')
  }

  changeGameApp = (gameId: string) => {
    changeGameRequestEvent(this.sock).emit({ gameId })
  }

  backToHome = () => {
    // be empty
  }

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    const roomId = this.getRoomId()
    if (roomId === undefined) throw Error('no room') // TODO: create custom error and handle this
    setGameEvent(this.sock).handle((payload) => this.setGame(payload.gameId))
    memberChangeEvent(this.sock).handle(this.memberChange)
    noRoomFoundEvent(this.sock).handle(this.noRoomFound)
    await this.join('room')
    let nextURL: string = PATH.HOME

    try {
      nextURL = await this.gameAppLaunched()
    } catch (exception) {
      if (exception instanceof BackToHomeException) {
        nextURL = PATH.HOME
      } else {
        this.closeSock()
        throw exception
      }
    }

    this.closeSock()
    return { nextURL }
  }

  private memberChange = ({ members }: { members: string[] }) => {
    this.dispatch(roomOperations.setRoomMember(members))
  }

  private noRoomFound = () => {
    alert('部屋が見つかりませんでした。')
    this.dispatch(routerOperations.pageTransition(PATH.HOME))
  }

  setGame = (newGameId: string) => {
    this.dispatch(roomOperations.setGameInfo(newGameId))
  }

  private gameAppLaunched = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (this.sock === undefined) {
        reject(Error('no socket available'))
      }

      this.backToHome = () => {
        reject(new BackToHomeException())
      }

      const ev = gameLaunchedEvent(this.sock).handle(({ gameId, gameUUID }) => {
        ev.unhandle()
        resolve(`${PATH.GAME}${gameId}/${gameUUID}`)
      })
    })
  }

  private getRoomId = () => location.pathname.split('/').pop()
}
