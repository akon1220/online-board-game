import { ThunkAction } from 'redux-thunk'
import { Dispatch } from 'redux'
import Cookies from 'js-cookie'
import { RootAction, RootState } from '@/state'
import { SocketApp } from '@/socket_app'
import { RoomApp } from '@/socket_app/room'
import { routerOperations } from '@/state/ducks/router'
import { PATH } from '@/constants'
import { HomeApp } from '@/socket_app/home'
import * as actions from './actions'

type Operation = ThunkAction<void, RootState, undefined, RootAction>

export const execClientApplication = (options?: {
  skipAskUserName?: boolean
}): Operation => {
  return async (dispatch, getStore) => {
    const store = getStore()
    store.system.app?.closeSock()
    let app: SocketApp
    let userName: string | undefined =
      options?.skipAskUserName === true ? 'Guest' : Cookies.get('user')
    dispatch(actions.setUserName(userName))
    if (userName === undefined) {
      userName = await waitForUserNameInput(dispatch)
      Cookies.set('user', userName)
    }
    try {
      app = await installApplication(dispatch)
      const paths = location.pathname.split('/')
      for (const name of paths) {
        if (name && name === 'game') {
          dispatch(actions.hideLoader())
        }
      }

      dispatch(actions.setApp(app))
    } catch (error) {
      // TODO Error Handling
      if (process.env.NODE_ENV === 'production') {
        alert(
          '予期せぬエラーが起こりました。もう一度ゲームをやり直すか、違うゲームで遊んでください。'
        )
      } else {
        alert(error)
        console.error(error)
      }
      dispatch(actions.removeApp())
      dispatch(routerOperations.pageTransition(PATH.HOME))
      return
    }

    try {
      // wait until the app is done
      const { nextURL } = await app.exec()
      waitForGoogleFormInput(dispatch, getStore)
      dispatch(actions.removeApp())
      dispatch(routerOperations.pageTransition(nextURL))
    } catch (error) {
      // TODO Error Handling: notification to the user
      if (error.type === 'no app') {
        alert('URLが正しくありません')
      } else if (error.type === 'already joined') {
        alert('すでにゲームに参加しています。')
      } else {
        if (process.env.NODE_ENV === 'production') {
          alert(
            '予期せぬエラーが起こりました。もう一度ゲームをやり直すか、違うゲームで遊んでください。'
          )
        } else {
          alert(error)
          console.error(error)
        }
      }
      dispatch(actions.removeApp())
      dispatch(routerOperations.pageTransition(PATH.HOME))
    }
  }
}

const waitForGoogleFormInput = (
  dispatch: Dispatch,
  getStore: () => RootState
) => {
  const app = getStore().system.app
  if (app === undefined) return
  if (!(app instanceof RoomApp || app instanceof HomeApp)) {
    dispatch(actions.showForm())
  }
}

const waitForUserNameInput = (dispatch: Dispatch): Promise<string> => {
  return new Promise((resolve) => {
    dispatch(
      actions.setOnSetUserName((userName: string) => {
        dispatch(actions.setUserName(userName))
        resolve(userName)
      })
    )
  })
}

export const closeForm = (): Operation => {
  return async (dispatch, getStore) => {
    const app = getStore().system.app
    if (app === undefined) return
    dispatch(actions.removeForm())
  }
}

export const launchRoomApp = (gameId: string): Operation => {
  return async (dispatch, getStore) => {
    const app = getStore().system.app
    if (app === undefined) return
    if (!(app instanceof HomeApp)) return
    app.launchRoomApp(gameId)
  }
}

export const back2Home = (): Operation => {
  return async (dispatch, getStore) => {
    const app = getStore().system.app
    if (app === undefined) return
    if (!(app instanceof RoomApp)) return
    app.backToHome()
  }
}

export const launchGameApp = (): Operation => {
  return async (dispatch, getStore) => {
    const app = getStore().system.app
    if (app === undefined) return
    if (!(app instanceof RoomApp)) return
    app.launchGameApp()
  }
}

export const changeGameApp = (newGameId: string): Operation => {
  return async (dispatch, getStore) => {
    const app = getStore().system.app
    if (app === undefined) return
    if (!(app instanceof RoomApp)) return
    app.changeGameApp(newGameId)
  }
}

const installApplication = async (dispatch: Dispatch): Promise<SocketApp> => {
  switch (getAppName()) {
    case 'room':
      return new RoomApp(dispatch)
    case 'home':
      return new HomeApp()
    case 'game':
      break
    default:
      throw Error('no app') // TODO: use Custom Error
  }
  await loadJS(`/${getGameName()}.js`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GameClass = (window as any).__PlaygroundAppClass as
    | typeof SocketApp
    | undefined
  if (GameClass === undefined) throw Error('no app') // TODO: use Custom Error
  return new GameClass()
}

const loadJS = (filepath: string): Promise<void> => {
  const scriptTag = document.createElement('script')
  scriptTag.src = filepath
  return new Promise((resolve, reject) => {
    scriptTag.onload = () => {
      scriptTag.remove()
      resolve()
    }
    scriptTag.onerror = () => reject(new Error('fail to load js')) // TODO: use custom error
    document.body.append(scriptTag)
  })
}

const getAppName = (): string => {
  const paths = location.pathname.split('/')
  for (const name of paths) {
    if (name) return name
  }
  return 'home'
}

const getGameName = (): string | undefined => {
  const paths = location.pathname.split('/')
  for (const name of paths) {
    if (name && name !== 'game') return name
  }
  throw Error('no game')
}
