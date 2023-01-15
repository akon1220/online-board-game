import { SocketApp } from '@/socket_app'
import {
  SET_USER_NAME,
  SET_ON_SET_USER_NAME,
  SET_APP,
  REMOVE_APP,
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_FORM,
  REMOVE_FORM,
} from './types'

export const setUserName = (userName: string | undefined) => {
  return {
    type: SET_USER_NAME,
    userName,
  }
}

export const setOnSetUserName = (onSetUserName: (userName: string) => void) => {
  return {
    type: SET_ON_SET_USER_NAME,
    onSetUserName,
  }
}

export const setApp = (app: SocketApp) => {
  return {
    type: SET_APP,
    app,
  }
}

export const removeApp = () => {
  return {
    type: REMOVE_APP,
  }
}

export const showLoader = () => {
  return {
    type: SHOW_LOADER,
  }
}
export const hideLoader = () => {
  return {
    type: HIDE_LOADER,
  }
}

export const showForm = () => {
  return {
    type: SHOW_FORM,
  }
}

export const removeForm = () => {
  return {
    type: REMOVE_FORM,
  }
}

export type SystemAction =
  | ReturnType<typeof setUserName>
  | ReturnType<typeof setOnSetUserName>
  | ReturnType<typeof setApp>
  | ReturnType<typeof removeApp>
  | ReturnType<typeof showLoader>
  | ReturnType<typeof hideLoader>
  | ReturnType<typeof showForm>
  | ReturnType<typeof removeForm>
