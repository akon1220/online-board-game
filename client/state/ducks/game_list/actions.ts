import { FETCH_GAME_LIST, Game } from './types'

export const setGameList = (games: Game[], preReleaseGames: Game[]) => {
  return {
    type: FETCH_GAME_LIST,
    games,
    preReleaseGames,
  }
}

export type GameListActions = ReturnType<typeof setGameList>
