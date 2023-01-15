import { ThunkAction } from 'redux-thunk'
import { RootState, RootAction } from '@/state'
import { Game } from './types'
import * as action from './actions'

type Operation = ThunkAction<void, RootState, undefined, RootAction>

export const fetchGameList = (): Operation => {
  return async (dispatch) => {
    const res = await fetch('/api/games', { method: 'GET' })
    const { games, preReleaseGames } = (await res.json()) as {
      games: Game[]
      preReleaseGames: Game[]
    }
    dispatch(action.setGameList(games, preReleaseGames))
  }
}
