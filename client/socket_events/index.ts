import { Socket } from 'socket.io-client'

export type Socket = {
  on: Function
  emit: Function
  removeListener: Function
}

export const eventCreator = <T = string>(eventName: string) => {
  return (sock: Socket) => {
    const __event = eventName
    const __sock = sock
    let __handler: ((payload: T) => void) | undefined
    const event = {
      emit: (payload: T) => {
        __sock.emit(__event, payload)
        return event
      },
      handle: (handler: (payload: T, sock: Socket) => void) => {
        __handler = (payload: T) => handler(payload, __sock)
        __sock.on(__event, __handler)
        return event
      },
      unhandle: () => {
        __sock.removeListener(__event, __handler)
        return event
      },
    }
    return event
  }
}
