import {
  poolRefreshEvent,
  poolRefreshRequestEvent,
  PoolType,
} from '@/socket_events/mixin/sync_data_pool_game'
import { SocketApp } from '../socket_app'

export interface SyncDataPoolInterface<T extends PoolType> {
  onPoolInitialized: (data: T) => void
  onPoolUpdated: (pool: T, previous: T) => void
}

export class SyncDataPoolGameController<T extends PoolType> {
  /**
   * don't mutate this directly
   */
  pool: T | undefined = undefined

  get copy(): T | undefined {
    if (this.pool === undefined) return undefined
    return JSON.parse(JSON.stringify(this.pool))
  }

  constructor(public app: SyncDataPoolInterface<T> & SocketApp) {}

  subscribe = () => {
    poolRefreshEvent<T>(this.app.sock).handle(this.refreshPool)
    this.refreshRequest()
  }

  refreshRequest = () => {
    poolRefreshRequestEvent<T>(this.app.sock).emit('')
  }

  private refreshPool = (data: T) => {
    if (this.pool === undefined) {
      this.pool = data
      this.app.onPoolInitialized(this.pool)
    } else {
      const old = this.pool
      this.pool = data
      this.app.onPoolUpdated(this.pool, old)
    }
  }
}
