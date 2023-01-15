import { eventCreator } from '../index'

export const startTurnBaseGameEvent = eventCreator('turn-base-game/start')

export const endTurnBaseGameEvent = eventCreator('turn-base-game/end')

export const turnStartNotifyEvent = eventCreator(
  'turn-base-game/turn-start-notify'
)

export const turnEndNotifyEvent = eventCreator('turn-base-game/turn-end-notify')
