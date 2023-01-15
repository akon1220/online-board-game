import {
  SystemState,
  SystemActionTypes,
  SET_USER_NAME,
  SET_ON_SET_USER_NAME,
  SET_APP,
  REMOVE_APP,
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_FORM,
  REMOVE_FORM,
} from './types'

const initialState: SystemState = {
  app: undefined,
  userName: undefined,
  onSetUserName: undefined,
  loading: true,
  isFormShown: false,
}

export const systemReducer = (
  state = initialState,
  action: SystemActionTypes
): SystemState => {
  switch (action.type) {
    case SET_USER_NAME:
      return {
        ...state,
        userName: action.userName,
      }
    case SET_ON_SET_USER_NAME:
      return {
        ...state,
        onSetUserName: action.onSetUserName,
      }
    case SET_APP:
      return {
        ...state,
        app: action.app,
      }
    case REMOVE_APP:
      return {
        ...state,
        app: undefined,
      }
    case SHOW_LOADER:
      return {
        ...state,
        loading: true,
      }
    case HIDE_LOADER:
      return {
        ...state,
        loading: false,
      }
    case SHOW_FORM:
      return {
        ...state,
        isFormShown: true,
      }
    case REMOVE_FORM:
      return {
        ...state,
        isFormShown: false,
      }
    default:
      return state
  }
}
