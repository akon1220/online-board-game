import socket from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

class Session {
  sock: socket.Socket | undefined
  uuid: string
  userName: string
  constructor(sock: socket.Socket, public sessionId: string) {
    this.sock = sock
    this.uuid = uuidv4()
    this.userName = sock.handshake.query.userName || 'Guest'
  }
}

export default Session
