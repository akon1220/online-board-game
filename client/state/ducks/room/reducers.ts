import {
  RoomState,
  RoomActionType,
  SET_ROOM_LINK,
  SET_ROOM_MEMBER,
  SET_GAME_INFO,
} from './types'

const initialState: RoomState = {
  link: '',
  members: [],
  gameId: '',
}

export const roomReducer = (state = initialState, action: RoomActionType) => {
  switch (action.type) {
    case SET_ROOM_LINK:
      return {
        ...state,
        link: action.link,
      }
    case SET_ROOM_MEMBER:
      return {
        ...state,
        members: action.members,
      }
    case SET_GAME_INFO:
      return {
        ...state,
        gameId: action.gameId,
      }
    default:
      return state
  }
}
