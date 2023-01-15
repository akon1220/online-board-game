import * as actions from './actions'

export const setRoomLink = () => {
  const link = location.href
  return actions.setRoomLink(link)
}

export const setRoomMember = (members: string[]) => {
  return actions.setRoomMember(members)
}

export const setGameInfo = (gameId: string) => {
  return actions.setGameInfo(gameId)
}
