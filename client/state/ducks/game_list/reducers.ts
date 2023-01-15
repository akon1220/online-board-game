import { GameListState, GameListActionTypes, FETCH_GAME_LIST } from './types'

const initialState: GameListState = {
  games: [],
  preReleaseGames: [],
}

export const gameListReducer = (
  state = initialState,
  action: GameListActionTypes
): GameListState => {
  switch (action.type) {
    case FETCH_GAME_LIST:
      return {
        games: action.games,
        preReleaseGames: action.preReleaseGames,
      }
    default:
      return state
  }
}
