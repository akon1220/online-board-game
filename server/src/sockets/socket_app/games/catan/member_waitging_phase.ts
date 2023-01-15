import { Socket } from 'socket.io'
import { CatanGameApp } from '.'
import { CatanSession } from './CatanSession'
import { PhaseController } from '../../mixin/phase_game'
import { endMemberWaitingPhaseEvent } from '../../../socket_events/games/catan/events'
import { InitializePhase } from './initialize_phase'

export class MemberWaitingPhase implements PhaseController<CatanGameApp> {
  private release: (() => void) | undefined

  constructor(private app: CatanGameApp) {}

  takeCharge = () => {
    this.app.forEach((session: CatanSession) => {
      if (session.sock) this.registarEventHandlers(session.sock)
    })
    return new Promise<PhaseController<CatanGameApp> | null>((resolve) => {
      this.release = () => resolve(new InitializePhase(this.app))
      this.app.onConnect = this.onConnect
      this.app.onReconnect = this.onReconnect
      this.app.onDisconnect = this.onDisconnect
    })
  }

  onConnect = (session: CatanSession) => {
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
    delete this.app.sessions[session.sessionId]
    this.app.deleteGameLater()
    this.app.updateMember()
    this.app.sync.flush()
  }

  endPhase = () => {
    if (this.release) this.release()
  }

  registarEventHandlers = (sock: Socket) => {
    endMemberWaitingPhaseEvent(sock).handle(() => {
      this.endPhase()
    })
  }
}
