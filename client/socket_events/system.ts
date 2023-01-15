import { eventCreator } from './index'

export const disconnectEvent = eventCreator('disconnect')

export const connectEvent = eventCreator('connect')

export const joinHomeAppEvent = eventCreator('join/home')

export const joinAppEvent = eventCreator<{
  appId: string
  appUUID: string
}>('join/app')

export const alreadyJoinedErrorEvent = eventCreator(
  'system/already-joined-error'
)

export const noAppFoundEvent = eventCreator('join/no-app-found')

export const appAcceptedEvent = eventCreator('join/app-found')

export const endGameRequestEvent = eventCreator('system/end-game-request')

export const gameEndedEvent = eventCreator<{ roomId: string }>(
  'system/game-ended'
)
