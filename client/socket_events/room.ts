import { eventCreator } from './index'

export type Sendable =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Sendable }
  | Sendable[]

export const memberChangeEvent = eventCreator<{
  members: string[]
}>('room/member-change')

export const launchGameEvent = eventCreator<Sendable>('room/launch-game')

export const gameLaunchedEvent = eventCreator<{
  gameId: string
  gameUUID: string
}>('room/game-launched')

export const noRoomFoundEvent = eventCreator('room/no-room-found')

export const changeGameRequestEvent = eventCreator<{ gameId: string }>(
  'room/change-game-request'
)

export const setGameEvent = eventCreator<{ gameId: string }>('room/set-game')
