import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { rootReducer } from './ducks'
export { RootAction } from './ducks'

export const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk))
}

export type RootState = ReturnType<typeof rootReducer>
