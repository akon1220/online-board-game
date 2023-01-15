import { RootState } from '@/state'

export const getMembers = (store: RootState): string[] => {
  return store.room.members
}

export const getRoomLink = (store: RootState): string => {
  return store.room.link
}

export const getGameInfo = (store: RootState): string => {
  return store.room.gameId
}
