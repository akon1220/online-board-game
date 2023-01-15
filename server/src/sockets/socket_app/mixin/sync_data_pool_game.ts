import Session from '../../session'
import { SocketApp } from '../games/socket_app'
import {
  poolRefreshRequestEvent,
  poolRefreshEvent,
  PoolType,
} from '../../socket_events/mixin/sync_data_pool_game'

export interface SyncDataPoolInterface<
  T extends PoolType,
  S extends Session = Session
> {
  filterPool: (session: S, pool: T) => T
}

export class SyncDataPoolGameController<
  T extends PoolType,
  S extends Session = Session
> {
  private sessions: { [key: string]: S } = {}
  private events: { [key: string]: { unhandle: Function }[] } = {}

  constructor(
    public app: SyncDataPoolInterface<T, S> & SocketApp<S>,
    public pool: T
  ) {}

  accept = (session: S) => {
    if (session.sock === undefined) return
    this.sessions[session.uuid] = session
    const ev = poolRefreshRequestEvent<T>(session.sock).handle(() =>
      this.flush(session)
    )
    this.events[session.uuid] = [ev]
  }

  remove = (session: S) => {
    for (const ev of this.events[session.uuid]) ev.unhandle()
    delete this.events[session.uuid]
    delete this.sessions[session.uuid]
  }

  flush = (session?: S) => {
    if (session !== undefined && session.sock) {
      const pool = this.app.filterPool(session, this.copy())
      poolRefreshEvent<T>(session.sock).emit(pool)
      return
    }
    this.forEach((sess: S) => {
      if (sess.sock === undefined) return
      const pool = this.app.filterPool(sess, this.copy())
      poolRefreshEvent<T>(sess.sock).emit(pool)
    })
  }

  copy = (): T => {
    return JSON.parse(JSON.stringify(this.pool))
  }

  private forEach = (f: (session: S) => void) => {
    for (const session of Object.values(this.sessions)) f(session)
  }
}
