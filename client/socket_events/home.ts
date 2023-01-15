import { eventCreator } from './index'

export const launchRoomAppRequestEvent = eventCreator<{ gameId: string }>(
  'room/launch-room-app-request'
)

export const roomAppLaunchedEvent = eventCreator<{ roomId: string }>(
  'room/room-app-launched-event'
)
