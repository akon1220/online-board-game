import { combineReducers } from 'redux'
import { gameListReducer, GameListActions } from './game_list'
import { routerReducer, RouterActions } from './router'
import { roomReducer, RoomActions } from './room'
import { systemReducer, SystemAction } from './system'

export const rootReducer = combineReducers({
  system: systemReducer,
  gameList: gameListReducer,
  router: routerReducer,
  room: roomReducer,
})

export type RootAction =
  | SystemAction
  | GameListActions
  | RouterActions
  | RoomActions
