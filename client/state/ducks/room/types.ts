export type RoomState = {
  link: string
  members: string[]
  gameId: string
}

export const SET_ROOM_MEMBER = 'SET_ROOM_MEMBER'
export const SET_ROOM_LINK = 'SET_ROOM_LINK'
export const SET_GAME_INFO = 'SET_GAME_INFO'

type SetRoomMember = {
  type: typeof SET_ROOM_MEMBER
  members: string[]
}

type SetRoomLink = {
  type: typeof SET_ROOM_LINK
  link: string
}

type SetGameInfo = {
  type: typeof SET_GAME_INFO
  gameId: string
}

export type RoomActionType = SetRoomLink | SetRoomMember | SetGameInfo
