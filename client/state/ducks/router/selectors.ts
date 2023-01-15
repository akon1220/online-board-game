import { RootState } from '@/state'

export const getPath = (store: RootState): string => {
  return store.router.path
}
