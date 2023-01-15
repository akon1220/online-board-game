import socket from 'socket.io'
import {
  SyncDataPoolGameController,
  SyncDataPoolInterface,
} from '../../mixin/sync_data_pool_game'
import { Pool } from '../../../socket_events/games/catan/pool'
import { SocketApp } from '../socket_app'
import { CatanSession } from './CatanSession'
import { PhaseGameInterface, PhaseGameController } from '../../mixin/phase_game'
import { MemberWaitingPhase } from './member_waitging_phase'

const MEMBER_WAIT_PHASE = 0

export class CatanGameApp extends SocketApp<CatanSession>
  implements SyncDataPoolInterface<Pool, CatanSession>, PhaseGameInterface {
  private static instances: { [key: string]: CatanGameApp } = {}

  static push = (app: CatanGameApp) => {
    CatanGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): CatanGameApp | undefined => {
    return CatanGameApp.instances[uuid]
  }

  static id = 'catan'

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = CatanGameApp.search(uuid)
    game?.accept(sock)
  }

  sync: SyncDataPoolGameController<Pool, CatanSession>
  phaseController: PhaseGameController<CatanGameApp>

  constructor(backRoomId: string, public phase = MEMBER_WAIT_PHASE) {
    super(backRoomId, CatanSession)
    CatanGameApp.push(this)
    this.sync = new SyncDataPoolGameController<Pool, CatanSession>(this, {
      phase: 'member waiting',
      members: [],
    })
    this.phaseController = new PhaseGameController<CatanGameApp>(
      this,
      new MemberWaitingPhase(this)
    )
  }

  filterPool = (session: CatanSession, pool: Pool) => {
    return pool
  }

  onEndGame = () => {
    this.back2Room(CatanGameApp.id)
    delete CatanGameApp.instances[this.uuid]
  }

  onAllPhaseEnd = () => {
    this.endGame()
  }

  onConnect = (session: CatanSession) => {
    // controlled by each phase
  }

  onReconnect = (session: CatanSession) => {
    // controlled by each phase
  }

  onDisconnect = (session: CatanSession) => {
    // controlled by each phase
  }

  updateMember = () => {
    this.sync.pool.members = Object.values(this.sessions).map((session) => ({
      name: session.userName,
      type: session.type,
      isOnline: session.sock !== undefined,
      uuid: session.uuid,
    }))
  }

  deleteGameLater = () => {
    this.ifEmptyForAWhileDo(() => {
      delete CatanGameApp.instances[this.uuid]
    })
  }
}
