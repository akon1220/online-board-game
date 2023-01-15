export type Pool = {
  members: {
    name: string
    type: 'wolf' | 'citizen'
    uuid: string
    votedNumber: number
    isVoteFinished: boolean
  }[]
  wolfWord: string
  citizenWord: string
  myId: string
  phase: Phase
}

export type Phase = 'start' | 'discussion' | 'vote' | 'result'

export const initialPool: Pool = {
  members: [],
  wolfWord: '',
  citizenWord: '',
  myId: '',
  phase: 'start',
}
