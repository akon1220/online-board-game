import { SocketApp } from '@/socket_app/socket_app'
import {
  startTurnBaseGameEvent,
  endTurnBaseGameEvent,
  turnStartNotifyEvent,
  turnEndNotifyEvent,
} from '@/socket_events/mixin/turn_base_game'

export interface TurnBaseGameInterface {
  onStartTurnBaseGame: () => void
  onEndTurnBaseGame: () => void
  onMyTurnStart: () => void
  onMyTurnEnd: () => void
}

type TurnBaseGame = SocketApp & TurnBaseGameInterface

export class TurnBaseGameController {
  constructor(public app: TurnBaseGame) {
    this.handle()
  }

  handle = () => {
    startTurnBaseGameEvent(this.app.sock).handle(() =>
      this.app.onStartTurnBaseGame()
    )
    endTurnBaseGameEvent(this.app.sock).handle(() =>
      this.app.onEndTurnBaseGame()
    )
    turnStartNotifyEvent(this.app.sock).handle(() => this.app.onMyTurnStart())
    turnEndNotifyEvent(this.app.sock).handle(() => this.app.onMyTurnEnd())
  }
}
