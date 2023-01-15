import { SocketApp } from '../games/socket_app'
import Session from '../../session'

export class RoomMembersController<S extends Session = Session> {
  constructor(private delegate: SocketApp<S>) {}

  get all(): { userName: string; uuid: string; accepted: boolean }[] {
    return this.delegate.sessionsInRoom.map((session) => ({
      userName: session.userName,
      uuid: session.uuid,
      accepted:
        Object.keys(this.delegate.sessions).indexOf(session.sessionId) !== -1,
    }))
  }

  get notAccepted(): { userName: string; uuid: string }[] {
    return this.delegate.sessionsInRoom
      .filter(
        (session) =>
          Object.keys(this.delegate.sessions).indexOf(session.sessionId) === -1
      )
      .map((session) => ({
        userName: session.userName,
        uuid: session.uuid,
      }))
  }

  get accepted(): { userName: string; uuid: string }[] {
    return this.delegate.sessionsInRoom
      .filter(
        (session) =>
          Object.keys(this.delegate.sessions).indexOf(session.sessionId) !== -1
      )
      .map((session) => ({
        userName: session.userName,
        uuid: session.uuid,
      }))
  }

  get isAcceptedAll(): boolean {
    return this.notAccepted.length === 0
  }
}
