import socket from 'socket.io'
import Session from '../../../session'
import { SocketApp } from '../socket_app'
import {
  SyncDataPoolInterface,
  SyncDataPoolGameController,
} from '../../mixin/sync_data_pool_game'
import {
  Pool,
  selectCardEvent,
  startGameEvent,
} from '../../../socket_events/games/vulture'
import { RoomMembersController } from '../../mixin/room_members'

export class VultureGameApp extends SocketApp
  implements SyncDataPoolInterface<Pool> {
  private static instances: { [key: string]: VultureGameApp } = {}

  static push = (app: VultureGameApp) => {
    VultureGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): VultureGameApp | undefined => {
    return VultureGameApp.instances[uuid]
  }

  static id = 'vulture'

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = VultureGameApp.search(uuid)
    game?.accept(sock)
  }

  sync: SyncDataPoolGameController<Pool>
  roomMembers = new RoomMembersController(this)

  constructor(backRoomId: string) {
    super(backRoomId)
    this.sync = new SyncDataPoolGameController<Pool>(this, {
      handCards: {},
      selectedCards: {},
      members: {},
      roomMembers: this.roomMembers.all,
      field: {},
      deck: [],
      vultureCard: null,
      gameStarted: false,
      myId: '',
    })
    VultureGameApp.push(this)
  }

  onConnect = (session: Session) => {
    if (session.sock === undefined) return
    this.sync.accept(session)
    startGameEvent(session.sock).handle(this.startGame)
    selectCardEvent(session.sock).handle((num) => this.selectCard(num, session))
    if (this.sync.pool.gameStarted) return
    this.sync.pool.roomMembers = this.roomMembers.all
    this.sync.flush()
    if (this.roomMembers.isAcceptedAll) {
      this.startGame()
    }
  }

  onReconnect = this.onConnect

  onEndGame = () => {
    this.back2Room(VultureGameApp.id)
    delete VultureGameApp.instances[this.uuid]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDisconnect = (session: Session) => {
    this.ifEmptyForAWhileDo(() => {
      delete VultureGameApp.instances[this.uuid]
    })
  }

  filterPool = (session: Session, pool: Pool) => {
    pool.myId = session.uuid
    return pool
  }

  startGame = () => {
    if (this.sync.pool.gameStarted === true) return
    this.sync.pool.gameStarted = true
    for (const sessionId in this.sessions) {
      const uuid = this.sessions[sessionId].uuid
      this.sync.pool.members[uuid] = {
        userName: this.sessions[sessionId].userName,
        point: 0,
      }
      this.sync.pool.handCards[uuid] = Array.from(a15)
    }
    this.sync.pool.deck = Array.from(a10)
    this.drawFromDeck()
    this.sync.flush()
  }

  selectCard = async (num: number, session: Session) => {
    if (
      this.sync.pool.handCards[session.uuid] === undefined ||
      this.sync.pool.handCards[session.uuid].indexOf(num) === -1 ||
      Object.keys(this.sync.pool.field).length > 0
    )
      return

    this.sync.pool.selectedCards[session.uuid] = num

    for (const userId in this.sync.pool.members) {
      if (this.sync.pool.selectedCards[userId] === undefined) {
        this.sync.flush()
        return
      }
    }

    this.sync.flush()

    for (const userId in this.sync.pool.members) {
      this.sync.pool.handCards[userId] = this.sync.pool.handCards[
        userId
      ].filter((num) => num !== this.sync.pool.selectedCards[userId])
      this.sync.pool.field[userId] = this.sync.pool.selectedCards[userId]
      delete this.sync.pool.selectedCards[userId]
    }

    await sleepAsync(300)

    this.sync.flush()

    await sleepAsync(2000)

    const point = this.sync.pool.vultureCard
    if (point === null) return
    const sortedIds = Object.keys(this.sync.pool.field).sort((a, b) => {
      const aNum = this.sync.pool.field[a]
      const bNum = this.sync.pool.field[b]
      return point < 0 ? aNum - bNum : bNum - aNum
    })

    let winnerId: string | undefined

    for (let i = 0; i < sortedIds.length; ) {
      const iId = sortedIds[i]
      let j = i + 1
      for (; j < sortedIds.length; j++) {
        const jId = sortedIds[j]
        if (this.sync.pool.field[iId] !== this.sync.pool.field[jId]) break
      }
      if (i + 1 === j) {
        winnerId = iId
        break
      }
      i = j
    }

    if (winnerId !== undefined) this.sync.pool.members[winnerId].point += point
    this.sync.pool.field = {}
    this.drawFromDeck()
    this.sync.flush()
  }

  drawFromDeck = () => {
    const len = this.sync.pool.deck.length
    const index = this.getRandomInt(len)
    this.sync.pool.vultureCard = this.sync.pool.deck.splice(index, 1)[0]
  }

  getRandomInt = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max))
  }
}

const a15 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const a10 = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const sleepAsync = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
