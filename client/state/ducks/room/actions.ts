import { SET_ROOM_LINK, SET_ROOM_MEMBER, SET_GAME_INFO } from './types'

export const setRoomMember = (members: string[]) => {
  return {
    type: SET_ROOM_MEMBER,
    members,
  }
}

export const setRoomLink = (link: string) => {
  return {
    type: SET_ROOM_LINK,
    link,
  }
}

export const setGameInfo = (gameId: string) => {
  return {
    type: SET_GAME_INFO,
    gameId,
  }
}

export type RoomActions =
  | ReturnType<typeof setRoomMember>
  | ReturnType<typeof setRoomLink>
  | ReturnType<typeof setGameInfo>
