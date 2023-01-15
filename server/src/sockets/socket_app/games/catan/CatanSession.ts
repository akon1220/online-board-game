import Session from '../../../session'

export class CatanSession extends Session {
  type: 'player' | 'spectator' = 'player'
}
