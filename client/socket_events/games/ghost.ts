import { eventCreator } from '..'

export type Pool = {
  members: { [key: string]: { userName: string; point: number } }
  field: { [key: string]: number }
  ghostCard: number | null
  gameStarted: boolean
  myId: string
  waitingMembers: { name: string; isAccepted: boolean }[]
}

export const startGameEvent = eventCreator('ghost/start-game')
