import { RouterState, RouterAction, PAGE_TRANSITION } from './types'

const initialState: RouterState = {
  path: location.pathname,
}

export const routerReducer = (
  state = initialState,
  action: RouterAction
): RouterState => {
  switch (action.type) {
    case PAGE_TRANSITION:
      return {
        path: action.path,
      }
    default:
      return state
  }
}
