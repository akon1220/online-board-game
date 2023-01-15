import { RootState } from '@/state'

export const getUserName = (store: RootState) => {
  return store.system.userName
}

export const getOnSetUserName = (store: RootState) => {
  return store.system.onSetUserName
}

export const isLoadingShown = (store: RootState) => {
  return store.system.loading
}

export const isFormShown = (store: RootState) => {
  return store.system.isFormShown
}

export const getAppInfo = (store: RootState) => {
  return store.system.app
}
