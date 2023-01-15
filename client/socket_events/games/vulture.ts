import { eventCreator } from '..'

export type Pool = {
  handCards: { [key: string]: number[] }
  selectedCards: { [key: string]: number }
  members: { [key: string]: { userName: string; point: number } }
  roomMembers: { userName: string; uuid: string; accepted: boolean }[]
  field: { [key: string]: number }
  deck: number[]
  vultureCard: number | null
  gameStarted: boolean
  myId: string
}

export const startGameEvent = eventCreator('vulture/start-game')

export const selectCardEvent = eventCreator<number>('vulture/select-card')
