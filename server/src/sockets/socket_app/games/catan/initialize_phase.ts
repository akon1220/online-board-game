import { Socket } from 'socket.io'
import { PhaseController } from '../../mixin/phase_game'
import { CatanGameApp } from '.'
import { CatanSession } from './CatanSession'
import { endInitializePhaseEvent } from '../../../socket_events/games/catan/events'

export class InitializePhase implements PhaseController<CatanGameApp> {
  private release: (() => void) | undefined

  constructor(private app: CatanGameApp) {}

  takeCharge = () => {
    this.app.sync.pool.phase = 'initialize phase'
    this.app.sync.flush()
    return new Promise<PhaseController<CatanGameApp> | null>((resolve) => {
      this.release = () => resolve(null)
      this.app.onConnect = this.onConnect
      this.app.onReconnect = this.onReconnect
      this.app.onDisconnect = this.onDisconnect
    })
  }

  onConnect = (session: CatanSession) => {
    session.type = 'spectator'
    this.app.sync.accept(session)
    if (session.sock) this.registarEventHandlers(session.sock)
    this.app.updateMember()
    this.app.sync.flush()
  }

  onReconnect = (session: CatanSession) => {
    if (session.sock) this.registarEventHandlers(session.sock)
    this.app.updateMember()
    this.app.sync.flush()
  }

  onDisconnect = (session: CatanSession) => {
    this.app.deleteGameLater()
    this.app.updateMember()
    this.app.sync.flush()
  }

  endPhase = () => {
    if (this.release) this.release()
  }

  registarEventHandlers = (sock: Socket) => {
    endInitializePhaseEvent(sock).handle(() => {
      this.endPhase()
    })
  }
}
