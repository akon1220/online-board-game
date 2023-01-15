import socket from 'socket.io'
import Session from '../../../session'
import {
  SyncDataPoolGameController,
  SyncDataPoolInterface,
} from '../../mixin/sync_data_pool_game'
import { Pool, initialPool } from '../../../socket_events/games/word_wolf/pool'
import { SocketApp } from '../socket_app'
import {
  startGameEvent,
  finishDiscussionEvent,
  finishVoteEvent,
} from '../../../socket_events/games/word_wolf/event'
import { challengeList } from './challenge_list'

export class WordWolfGameApp extends SocketApp
  implements SyncDataPoolInterface<Pool> {
  private static instances: { [key: string]: WordWolfGameApp } = {}

  static push = (app: WordWolfGameApp) => {
    WordWolfGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): WordWolfGameApp | undefined => {
    return WordWolfGameApp.instances[uuid]
  }

  static id = 'word_wolf'

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = WordWolfGameApp.search(uuid)
    game?.accept(sock)
  }

  sync: SyncDataPoolGameController<Pool>

  constructor(backRoomId: string) {
    super(backRoomId)
    WordWolfGameApp.push(this)
    this.sync = new SyncDataPoolGameController<Pool>(this, initialPool)
  }

  filterPool = (session: Session, pool: Pool) => {
    pool.myId = session.uuid
    return pool
  }

  onEndGame = () => {
    this.back2Room(WordWolfGameApp.id)
    delete WordWolfGameApp.instances[this.uuid]
  }

  onConnect = (session: Session) => {
    if (session.sock === undefined) return
    this.sync.accept(session)
    startGameEvent(session.sock).handle(this.startGame)
    finishDiscussionEvent(session.sock).handle(this.finishDiscussion)
    finishVoteEvent(session.sock).handle((payload) =>
      this.finishVote(session, payload.votedUuid)
    )
  }

  onReconnect = (session: Session) => {
    this.onConnect(session)
    this.sync.flush()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDisconnect = (session: Session) => {
    this.ifEmptyForAWhileDo(() => {
      delete WordWolfGameApp.instances[this.uuid]
    })
  }

  startGame = () => {
    this.sync.pool.members = Object.values(this.sessions).map((session) => ({
      name: session.userName,
      type: 'citizen',
      uuid: session.uuid,
      votedNumber: 0,
      isVoteFinished: false,
    }))
    this.sync.pool.phase = 'discussion'
    this.setChallenge()
    this.selectWolf()
    this.sync.flush()
  }

  setChallenge = () => {
    const challenge =
      challengeList[Math.floor(Math.random() * challengeList.length)]

    if (Math.floor(Math.random() * 2) === 0) {
      this.sync.pool.wolfWord = challenge.firstWord
      this.sync.pool.citizenWord = challenge.secondWord
    } else {
      this.sync.pool.wolfWord = challenge.secondWord
      this.sync.pool.citizenWord = challenge.firstWord
    }
  }

  selectWolf = () => {
    const wolfMemberIndex = Math.floor(
      Math.random() * this.sync.pool.members.length
    )
    this.sync.pool.members[wolfMemberIndex].type = 'wolf'
  }

  finishDiscussion = () => {
    this.sync.pool.phase = 'vote'
    this.sync.flush()
  }

  finishVote = (session: Session, votedUuid: string) => {
    this.sync.pool.members.forEach((member) => {
      if (member.uuid === session.uuid) {
        member.isVoteFinished = true
      }

      if (member.uuid === votedUuid) {
        member.votedNumber += 1
      }
    })

    let isAllMemberVoted = true
    this.sync.pool.members.forEach((member) => {
      if (member.isVoteFinished === false) {
        isAllMemberVoted = false
      }
    })
    if (isAllMemberVoted) {
      this.sync.pool.phase = 'result'
    }
    this.sync.flush()
  }

  updateMember = () => {
    this.sync.pool.members = Object.values(this.sessions).map((session) => ({
      name: session.userName,
      type: 'citizen',
      uuid: session.uuid,
      votedNumber: 0,
      isVoteFinished: false,
    }))
  }

  deleteGameLater = () => {
    this.ifEmptyForAWhileDo(() => {
      delete WordWolfGameApp.instances[this.uuid]
    })
  }
}
