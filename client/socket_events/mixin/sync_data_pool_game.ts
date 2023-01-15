import { eventCreator, Socket } from '../index'

export const poolRefreshEvent = <T extends PoolType>(sock: Socket) =>
  eventCreator<T>('sync-data-pool/data-initialize')(sock)

export const poolRefreshRequestEvent = <T extends PoolType>(sock: Socket) =>
  eventCreator('sync-data-pool/pool-refresh-request')(sock)

export type PoolType =
  | string
  | number
  | boolean
  | null
  | { [key: string]: PoolType }
  | PoolType[]
