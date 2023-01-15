import { PAGE_TRANSITION } from './types'

export const pageTransition = (path: string) => {
  return {
    type: PAGE_TRANSITION,
    path,
  }
}

export type RouterActions = ReturnType<typeof pageTransition>
