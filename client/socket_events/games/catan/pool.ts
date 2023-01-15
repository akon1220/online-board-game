type Phases = 'member waiting' | 'initialize phase'

export type Pool = {
  phase: Phases
  members: {
    name: string
    type: 'player' | 'spectator'
    isOnline: boolean
    uuid: string
  }[]
}
