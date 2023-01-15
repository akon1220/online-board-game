import socket from 'socket.io'
import Session from '../../../session'
import { SocketApp } from '../socket_app'
import {
  SyncDataPoolInterface,
  SyncDataPoolGameController,
} from '../../mixin/sync_data_pool_game'
import { Pool, startGameEvent } from '../../../socket_events/games/ghost'

export class GhostGameApp extends SocketApp
  implements SyncDataPoolInterface<Pool> {
  private static instances: { [key: string]: GhostGameApp } = {}

  static push = (app: GhostGameApp) => {
    GhostGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): GhostGameApp | undefined => {
    return GhostGameApp.instances[uuid]
  }

  static id = 'ghost'

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = GhostGameApp.search(uuid)
    game?.accept(sock)
  }

  sync: SyncDataPoolGameController<Pool>

  constructor(backRoomId: string) {
    super(backRoomId)
    this.sync = new SyncDataPoolGameController<Pool>(this, {
      members: {},
      field: {},
      ghostCard: null,
      gameStarted: false,
      myId: '',
      waitingMembers: [],
    })
    GhostGameApp.push(this)
  }

  onConnect = (session: Session) => {
    if (session.sock === undefined) return
    this.sync.accept(session)
    startGameEvent(session.sock).handle(this.startGame)
  }

  onReconnect = this.onConnect

  onEndGame = () => {
    this.back2Room(GhostGameApp.id)
    delete GhostGameApp.instances[this.uuid]
  }

  onDisconnect = (session: Session) => {
    this.remove(session)
    this.ifEmptyForAWhileDo(() => {
      delete GhostGameApp.instances[this.uuid]
    })
  }

  filterPool = (session: Session, pool: Pool) => {
    pool.myId = session.uuid
    return pool
  }

  startGame = () => {
    if (this.sync.pool.gameStarted === true) return
    this.sync.pool.gameStarted = true
    for (const sessionId in this.sessions) {
      const uuid = this.sessions[sessionId].uuid
      this.sync.pool.members[uuid] = {
        userName: this.sessions[sessionId].userName,
        point: 0,
      }
    }
  }
}
