export const FETCH_GAME_LIST = 'FETCH_GAME_LIST'

export type Game = {
  id: string
  name: string
  image: string
  description: string
  acceptableMemberCount: number[]
  maxDuration: number
  minDuration: number
  status: 'no release' | 'before release' | 'release'
  rule: string
}

export type GameListState = {
  games: Game[]
  preReleaseGames: Game[]
}

type FetchGameListAction = {
  type: typeof FETCH_GAME_LIST
  games: Game[]
  preReleaseGames: Game[]
}

export type GameListActionTypes = FetchGameListAction
