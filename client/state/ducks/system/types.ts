import { SocketApp } from '@/socket_app'

export type SystemState = {
  app: SocketApp | undefined
  userName: string | undefined
  onSetUserName: ((userName: string) => void) | undefined
  loading: boolean | undefined
  isFormShown: boolean | undefined
}

export const SET_USER_NAME = 'SET_USER_NAME'
export const SET_ON_SET_USER_NAME = 'SET_ON_SET_USER_NAME'
export const SET_APP = 'SET_APP'
export const REMOVE_APP = 'REMOVE_APP'
export const SHOW_LOADER = 'SHOW_LOADER'
export const HIDE_LOADER = 'HIDE_LOADER'
export const SHOW_FORM = 'SHOW_FORM'
export const REMOVE_FORM = 'REMOVE_FORM'
type SetUserName = {
  type: typeof SET_USER_NAME
  userName: string | undefined
}

type SetOnSetUserName = {
  type: typeof SET_ON_SET_USER_NAME
  onSetUserName: (userName: string) => void
}

type SetAppAction = {
  type: typeof SET_APP
  app: SocketApp
}

type RemoveAppAction = {
  type: typeof REMOVE_APP
}
type ShowLoader = {
  type: typeof SHOW_LOADER
}
type HideLoader = {
  type: typeof HIDE_LOADER
}
type ShowForm = {
  type: typeof SHOW_FORM
}
type RemoveForm = {
  type: typeof REMOVE_FORM
}
export type SystemActionTypes =
  | SetUserName
  | SetOnSetUserName
  | SetAppAction
  | RemoveAppAction
  | ShowLoader
  | HideLoader
  | ShowForm
  | RemoveForm
