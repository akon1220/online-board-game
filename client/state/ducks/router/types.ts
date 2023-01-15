export const PAGE_TRANSITION = 'PAGE_TRANSITION'

export type RouterState = {
  path: string
}

type PageTransitionAction = {
  type: typeof PAGE_TRANSITION
  path: string
}

export type RouterAction = PageTransitionAction
