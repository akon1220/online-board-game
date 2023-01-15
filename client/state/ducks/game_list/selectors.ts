import { RootState } from '@/state'
import { Game } from './types'

export const getGameList = (store: RootState): Game[] => {
  return store.gameList.games
}

export const getPreReleaseGameList = (store: RootState): Game[] => {
  return store.gameList.preReleaseGames
}

export const getGameInfo = (store: RootState, gameId: string | undefined) => {
  return store.gameList.games.find((game) => {
    return game.id === gameId
  })
}
