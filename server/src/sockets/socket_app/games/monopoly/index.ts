import socket from 'socket.io'
import Session from '../../../session'
import { SocketApp } from '../socket_app'
import {
  SyncDataPoolInterface,
  SyncDataPoolGameController,
} from '../../mixin/sync_data_pool_game'
import {
  rollDiceRequestEvent,
  endMyTurnRequestEvent,
  buyAssetRequestEvent,
  startAuctionRequestEvent,
  sendAuctionPriceRequestEvent,
  startAssetAcquisitionRequestEvent,
  cancelAssetAcquisitionRequestEvent,
  sendAssetAcquisitionPriceRequestEvent,
  judgeAssetAcquisitionRequestEvent,
  startAssetSaleRequestEvent,
  cancelAssetSaleRequestEvent,
  sendAssetSalePriceRequestEvent,
  judgeAssetSaleRequestEvent,
  mortgageAssetRequestEvent,
  releaseMortgageAssetRequestEvent,
  doMoveActionRequestEvent,
  doEventActionRequestEvent,
  releaseJailTryActionRequestEvent,
  goToJailRequestEvent,
  startBuyingJudgementRequestEvent,
  startChangeFacilityRequestEvent,
  endChangeFacilityRequestEvent,
  cancelChangeFacilityRequestEvent,
  releaseJailWithMoneyRequestEvent,
} from '../../../socket_events/games/monopoly'
import {
  Pool,
  PoolModel,
  initialPool,
  AssetId,
  Result,
  Event,
  stationAssetIdList,
  assetGroupList,
  AssetGroupId,
} from '../../../socket_events/games/monopoly/pool'
import {
  chanceList,
  challengeList,
} from '../../../socket_events/games/monopoly/eventList.data'
import { assetList } from '../../../socket_events/games/monopoly/assetList.data'
import { initialPanelList } from '../../../socket_events/games/monopoly/panelList.data'
import { RoomMembersController } from '../../mixin/room_members'

export class MonopolyGameApp extends SocketApp
  implements SyncDataPoolInterface<Pool> {
  private static instances: { [key: string]: MonopolyGameApp } = {}

  static push = (app: MonopolyGameApp) => {
    MonopolyGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): MonopolyGameApp | undefined => {
    return MonopolyGameApp.instances[uuid]
  }

  static id = 'monopoly'

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = MonopolyGameApp.search(uuid)
    game?.accept(sock)
  }

  get poolModel() {
    return new PoolModel(this.sync.pool)
  }

  sync: SyncDataPoolGameController<Pool>
  roomMembers = new RoomMembersController(this)

  constructor(backRoomId: string) {
    super(backRoomId)
    this.sync = new SyncDataPoolGameController<Pool>(this, {
      ...initialPool,
      roomMembers: this.roomMembers.all,
    })
    MonopolyGameApp.push(this)
  }

  onConnect = (session: Session) => {
    if (session.sock === undefined) return
    this.sync.accept(session)
    rollDiceRequestEvent(session.sock).handle(this.rollDice)
    endMyTurnRequestEvent(session.sock).handle(this.onEndTurn)
    goToJailRequestEvent(session.sock).handle(() =>
      this.goToJailActionIfThreeConsecutive(session)
    )
    doMoveActionRequestEvent(session.sock).handle((payload) => {
      this.doMoveAction(session, payload.movePanelCount)
    })
    doEventActionRequestEvent(session.sock).handle(() =>
      this.doEventAction(session)
    )
    releaseJailWithMoneyRequestEvent(session.sock).handle(() => {
      this.releaseJailWithMoney(session)
    })
    releaseJailTryActionRequestEvent(session.sock).handle(() =>
      this.releaseJailTryAction(session)
    )
    startBuyingJudgementRequestEvent(session.sock).handle(
      this.startBuyingJudgement
    )
    buyAssetRequestEvent(session.sock).handle((payload) =>
      this.buyAsset(payload, session)
    )
    startAuctionRequestEvent(session.sock).handle((payload) =>
      this.startAuction(payload)
    )
    startChangeFacilityRequestEvent(session.sock).handle((payload) =>
      this.startChangeFacility(payload)
    )
    endChangeFacilityRequestEvent(session.sock).handle((payload) =>
      this.endChangeFacility(payload)
    )
    cancelChangeFacilityRequestEvent(session.sock).handle(
      this.cancelChangeFacility
    )
    sendAuctionPriceRequestEvent(session.sock).handle((payload) => {
      this.receiveAuctionPrice(payload, session)
    })
    startAssetAcquisitionRequestEvent(session.sock).handle((payload) => {
      this.startAssetAcquisition(payload, session)
    })
    cancelAssetAcquisitionRequestEvent(session.sock).handle(
      this.cancelAssetAcquisition
    )
    sendAssetAcquisitionPriceRequestEvent(session.sock).handle((payload) => {
      this.sendAssetAcquisitionPrice(payload, session)
    })
    judgeAssetAcquisitionRequestEvent(session.sock).handle(
      this.judgeAssetAcquisition
    )
    startAssetSaleRequestEvent(session.sock).handle((payload) => {
      this.startAssetSale(payload, session)
    })
    cancelAssetSaleRequestEvent(session.sock).handle(this.cancelAssetSale)
    sendAssetSalePriceRequestEvent(session.sock).handle((payload) => {
      this.sendAssetSalePrice(payload, session)
    })
    judgeAssetSaleRequestEvent(session.sock).handle((payload) => {
      this.judgeAssetSale(payload, session)
    })
    mortgageAssetRequestEvent(session.sock).handle((payload) => {
      this.mortgageAsset(payload, session)
    })
    releaseMortgageAssetRequestEvent(session.sock).handle((payload) => {
      this.releaseMortgageAsset(payload, session)
    })
    if (this.sync.pool.isGameStarted) return
    this.sync.pool.roomMembers = this.roomMembers.all
    if (this.roomMembers.isAcceptedAll) {
      this.startGame()
    }
  }

  onReconnect = (session: Session) => {
    this.onConnect(session)
    this.sync.flush()
  }

  beforeEndGame = () => {
    this.sync.pool.isGameStarted = false
    this.sync.flush()
  }

  onEndGame = () => {
    this.back2Room(MonopolyGameApp.id)
    delete MonopolyGameApp.instances[this.uuid]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDisconnect = (session: Session) => {
    this.ifEmptyForAWhileDo(() => {
      delete MonopolyGameApp.instances[this.uuid]
    })
  }

  filterPool = (session: Session, pool: Pool) => {
    pool.myId = session.uuid
    return pool
  }

  initializeGame = () => {
    this.sync.pool = JSON.parse(JSON.stringify(initialPool))
  }

  startGame = () => {
    this.initializeGame()

    this.sync.pool.isGameStarted = true

    const turnIndices = []
    for (
      let turnIdx = 1;
      turnIdx <= Object.keys(this.sessions).length;
      turnIdx++
    ) {
      turnIndices.push(turnIdx)
    }
    const shuffledTurnIndices = turnShuffle(turnIndices)
    for (const sessionId in this.sessions) {
      const uuid = this.sessions[sessionId].uuid
      this.sync.pool.players[uuid] = {
        userName: this.sessions[sessionId].userName,
        position: initialPlayerPosition,
        isInJail: false,
        releaseJailTryCount: 0,
        moneyAmount: initialPlayerMoneyAmount,
        colorCode: this.getPlayerColorCode(),
        turnIndex: shuffledTurnIndices.shift() as number,
        auctionPrice: null,
      }
    }

    this.sync.pool.currentTurnPlayerId = this.findNextTurnPlayerId()

    console.log('start game!')

    this.sync.flush()
  }

  rollDice = () => {
    this.resetAuction()
    this.resetPlayerAuction()
    this.resetEvent()

    this.sync.pool.diceResults.push({
      firstDiceEye: this.poolModel.getRandomNumberFromOneToSix(),
      secondDiceEye: this.poolModel.getRandomNumberFromOneToSix(),
      hasMoved: false,
    })

    this.sync.flush()
  }

  resetEvent = () => {
    this.sync.pool.chanceCard = null
    this.sync.pool.challengeCard = null
  }

  markDiceResult = () => {
    this.sync.pool.diceResults.forEach((diceResult) => {
      diceResult.hasMoved = true
    })
  }

  doMoveAction = (session: Session, movePanelCount: number) => {
    this.markDiceResult()

    let currentPosition = this.sync.pool.players[session.uuid].position
    currentPosition += movePanelCount
    if (currentPosition >= panelCount) {
      this.sync.pool.players[session.uuid].moneyAmount += goBonusMoneyAmount
      currentPosition %= panelCount
    } else if (currentPosition < 0) {
      currentPosition += panelCount
    }
    this.sync.pool.players[session.uuid].position = currentPosition
    this.doPanelAction(session, currentPosition)

    this.sync.flush()
  }

  startBuyingJudgement = () => {
    this.sync.pool.isInTheMiddleOfBuying = true

    this.sync.flush()
  }

  buyAsset = ({ position }: { position: number }, session: Session) => {
    this.sync.pool.isInTheMiddleOfBuying = false

    const panel = this.sync.pool.panelList[position]
    if (panel.type === 'asset') {
      panel.playerId = session.uuid
      this.sync.pool.panelList[position] = panel
      this.sync.pool.players[panel.playerId].moneyAmount -=
        assetList[panel.assetId].price
    }
    this.sync.flush()
  }

  startAuction = ({ position }: { position: number }) => {
    this.sync.pool.isInTheMiddleOfBuying = false

    this.sync.pool.isAuctionStarted = true
    const panel = this.sync.pool.panelList[position]
    if (panel.type === 'asset') {
      this.sync.pool.auctionTargetAssetId = panel.assetId
    }
    this.sync.flush()
  }

  receiveAuctionPrice = (
    { moneyAmount }: { moneyAmount: number },
    session: Session
  ) => {
    this.sync.pool.players[session.uuid].auctionPrice = moneyAmount
    const players = this.sync.pool.players
    let isAllPlayerSentAuctionMoney = true
    Object.keys(players).forEach((key) => {
      if (
        key !== this.sync.pool.currentTurnPlayerId &&
        players[key].auctionPrice === null
      ) {
        isAllPlayerSentAuctionMoney = false
      }
    })
    this.sync.pool.isAuctionDone = isAllPlayerSentAuctionMoney

    this.sync.flush()

    if (isAllPlayerSentAuctionMoney) {
      this.finishAuction()
    }

    this.sync.flush()
  }

  finishAuction = () => {
    const winnerId = this.findAuctionWinnerId()
    if (winnerId !== '')
      this.handlePayment(
        winnerId,
        -(this.sync.pool.players[winnerId].auctionPrice as number)
      )

    const targetPanel = this.sync.pool.panelList.find((panel) => {
      return (
        panel.type === 'asset' &&
        panel.assetId === this.sync.pool.auctionTargetAssetId
      )
    })

    if (targetPanel?.type === 'asset') targetPanel.playerId = winnerId

    this.sync.pool.isAuctionStarted = false
  }

  findAuctionWinnerId = () => {
    let maxAuctionPrice = 0
    let auctionWinnerId = ''
    Object.keys(this.sync.pool.players).forEach((key) => {
      const auctionPrice = this.sync.pool.players[key].auctionPrice
      if (auctionPrice && auctionPrice > maxAuctionPrice) {
        maxAuctionPrice = auctionPrice
        auctionWinnerId = key
      }
    })
    return auctionWinnerId
  }

  resetAuction = () => {
    this.sync.pool.auctionTargetAssetId = null
    this.sync.pool.isAuctionStarted = false
    this.sync.pool.isAuctionDone = false
  }

  resetPlayerAuction = () => {
    this.poolModel.playerListArray.forEach((player) => {
      this.sync.pool.players[player.id].auctionPrice = null
    })
  }

  startAssetAcquisition = (
    { assetId }: { assetId: AssetId },
    session: Session
  ) => {
    this.sync.pool.acquisitionEvent.isInTheMiddle = true
    this.sync.pool.acquisitionEvent.targetAssetId = assetId
    const targetPanel = this.sync.pool.panelList.find((panel) => {
      return panel.type === 'asset' && panel.assetId === assetId
    })
    if (targetPanel?.type === 'asset') {
      this.sync.pool.acquisitionEvent.ownerPlayerId = targetPanel.playerId
    }
    this.sync.pool.acquisitionEvent.acquirerPlayerId = session.uuid

    this.sync.flush()
  }

  cancelAssetAcquisition = () => {
    this.resetAssetAcquisition()

    this.sync.flush()
  }

  sendAssetAcquisitionPrice = (
    { price }: { price: number },
    session: Session
  ) => {
    const acquisitionEvent = this.sync.pool.acquisitionEvent
    if (acquisitionEvent.acquirerPlayerId === session.uuid) {
      this.sync.pool.acquisitionEvent.acquisitionPrice = price
    }

    this.sync.flush()
  }

  judgeAssetAcquisition = ({ result }: { result: Result }) => {
    const acquisitionEvent = this.sync.pool.acquisitionEvent
    if (result === 'accept') {
      this.sync.pool.panelList.forEach((panel) => {
        if (
          panel.type === 'asset' &&
          panel.playerId &&
          acquisitionEvent.targetAssetId === panel.assetId
        ) {
          const previousOwnerId = panel.playerId
          this.handlePayment(
            previousOwnerId,
            +acquisitionEvent.acquisitionPrice
          )
          const newOwnerId = acquisitionEvent.acquirerPlayerId
          if (newOwnerId) {
            panel.playerId = newOwnerId
            this.handlePayment(newOwnerId, -acquisitionEvent.acquisitionPrice)
          }
        }
      })
    }

    this.resetAssetAcquisition()

    this.sync.flush()
  }

  resetAssetAcquisition = () => {
    this.sync.pool.acquisitionEvent = {
      isInTheMiddle: false,
      targetAssetId: null,
      ownerPlayerId: null,
      acquirerPlayerId: null,
      acquisitionPrice: 0,
    }
  }

  startAssetSale = ({ assetId }: { assetId: AssetId }, session: Session) => {
    this.sync.pool.saleEvent.isInTheMiddle = true
    this.sync.pool.saleEvent.targetAssetId = assetId
    const targetPanel = this.sync.pool.panelList.find((panel) => {
      return panel.type === 'asset' && panel.assetId === assetId
    })
    if (
      targetPanel?.type === 'asset' &&
      targetPanel.playerId === session.uuid
    ) {
      this.sync.pool.saleEvent.ownerPlayerId = session.uuid
    } else {
      // TODO: should throw error
      console.log('売却の申請者と持ち主が一致しません。')
    }

    this.sync.flush()
  }

  cancelAssetSale = () => {
    this.resetAssetSale()

    this.sync.flush()
  }

  sendAssetSalePrice = (
    { price, targetBuyer }: { price: number; targetBuyer: string },
    session: Session
  ) => {
    const saleEvent = this.sync.pool.saleEvent
    if (saleEvent.ownerPlayerId === session.uuid) {
      this.sync.pool.saleEvent.salePrice = price
      this.sync.pool.saleEvent.targetBuyerId = targetBuyer
    } else {
      console.log('売却金額の入力主と所有者が一致しません。')
    }

    this.sync.flush()
  }

  judgeAssetSale = ({ result }: { result: Result }, session: Session) => {
    this.sync.pool.saleEvent.answeredPlayerIdList.push(session.uuid)
    const saleEvent = this.sync.pool.saleEvent
    if (result === 'accept') {
      this.sync.pool.panelList.forEach((panel) => {
        if (
          panel.type === 'asset' &&
          panel.playerId &&
          saleEvent.targetAssetId === panel.assetId
        ) {
          const previousOwnerId = panel.playerId
          this.handlePayment(previousOwnerId, +saleEvent.salePrice)
          const newOwnerId = session.uuid
          panel.playerId = newOwnerId
          this.handlePayment(newOwnerId, -saleEvent.salePrice)
        }
      })

      this.resetAssetSale()
    } else if (this.poolModel.isAllPlayerAnswered) {
      this.resetAssetSale()
    }

    this.sync.flush()
  }

  resetAssetSale = () => {
    this.sync.pool.saleEvent = {
      isInTheMiddle: false,
      targetAssetId: null,
      ownerPlayerId: null,
      targetBuyerId: null,
      buyerPlayerId: null,
      salePrice: 0,
      answeredPlayerIdList: [],
    }
  }

  mortgageAsset = ({ assetId }: { assetId: AssetId }, session: Session) => {
    this.sync.pool.panelList.forEach((panel) => {
      if (
        panel.type === 'asset' &&
        panel.assetId === assetId &&
        panel.playerId === session.uuid
      ) {
        panel.isMortgaged = true
        this.handlePayment(session.uuid, assetList[panel.assetId].mortgagePrice)
      }
    })

    this.sync.flush()
  }

  releaseMortgageAsset = (
    { assetId }: { assetId: AssetId },
    session: Session
  ) => {
    this.sync.pool.panelList.forEach((panel) => {
      if (
        panel.type === 'asset' &&
        panel.assetId === assetId &&
        panel.playerId === session.uuid
      ) {
        panel.isMortgaged = false
        this.handlePayment(
          session.uuid,
          -(
            assetList[panel.assetId].mortgagePrice +
            assetList[panel.assetId].interestPrice
          )
        )
      }
    })

    this.sync.flush()
  }

  doPanelAction = (session: Session, position: number) => {
    const panel = this.sync.pool.panelList[position]

    if (panel.type === 'asset') {
      if (
        panel.playerId &&
        panel.playerId !== session.uuid &&
        !panel.isMortgaged
      ) {
        this.sync.pool.players[
          panel.playerId
        ].moneyAmount += this.poolModel.calculateAssetToll(
          panel.playerId,
          panel.assetId
        ) as number

        this.sync.pool.players[
          session.uuid
        ].moneyAmount -= this.poolModel.calculateAssetToll(
          panel.playerId,
          panel.assetId
        ) as number
      }
    } else {
      switch (panel.actionType) {
        case 'challenge':
          this.sync.pool.challengeCard = this.getEventCard('challenge')
          break
        case 'chance':
          this.sync.pool.chanceCard = this.getEventCard('chance')
          break
        case 'tax':
          this.sync.pool.players[session.uuid].moneyAmount -= taxAmount
          break
        case 'go_to_jail':
          this.goToJailAction(session)
          break
        case 'commodity_tax':
          this.sync.pool.players[session.uuid].moneyAmount -= commodityTaxAmount
          break
      }
    }
  }

  doEventAction = (session: Session) => {
    const event = this.poolModel.eventAction
    if (event) {
      switch (event.type) {
        case 'move':
          this.doMoveEventAction(session, event)
          break
        case 'pay':
          if (event.target === 'everyone') {
            this.forEach((sess) => {
              this.handlePayment(sess.uuid, event.amount)
            })
            this.handlePayment(
              session.uuid,
              -event.amount * this.poolModel.playerCount
            )
          } else {
            this.handlePayment(session.uuid, -event.amount)
          }
          break
        case 'receive':
          if (event.target === 'everyone') {
            this.forEach((sess) => {
              this.handlePayment(sess.uuid, -event.amount)
            })
            this.handlePayment(
              session.uuid,
              event.amount * this.poolModel.playerCount
            )
          } else {
            this.handlePayment(session.uuid, event.amount)
          }
          break
        case 'repair':
          this.poolModel.panelList.forEach((panel) => {
            if (panel.type === 'asset' && panel.playerId === session.uuid) {
              this.handlePayment(
                session.uuid,
                -(
                  panel.shopCount * event.shopCost +
                  panel.hotelCount * event.hotelCost
                )
              )
            }
          })
          break
        case 'go_to_jail':
          this.goToJailAction(session)
          break
      }
    }

    this.sync.flush()
  }

  doMoveEventAction = (session: Session, event: Event) => {
    const currentPosition = this.poolModel.players[session.uuid].position
    let moveCount = 0
    switch (event.destination) {
      case 'start':
        this.doMoveAction(session, panelCount - currentPosition)
        break
      case 'three':
        this.doMoveAction(session, -3)
        break
      case 'station':
        moveCount = this.findClosestStation(currentPosition)
        break
      default:
        moveCount = this.calculateDestinationAsset(
          currentPosition,
          event.destination
        )
        break
    }

    this.doMoveAction(session, moveCount)
  }

  findClosestStation = (currentPosition: number) => {
    const deckPanelList = this.poolModel.panelList.concat(
      this.poolModel.panelList
    )

    const moveCount = deckPanelList
      .slice(currentPosition, deckPanelList.length)
      .findIndex(
        (panel) =>
          panel.type === 'asset' && stationAssetIdList.includes(panel.assetId)
      )
    return moveCount
  }

  goToJailAction = (session: Session) => {
    this.sync.pool.players[session.uuid].isInJail = true
    this.sync.pool.players[session.uuid].position = jailPanelPosition
    this.sync.pool.players[session.uuid].releaseJailTryCount = 0
  }

  goToJailActionIfThreeConsecutive = (session: Session) => {
    this.goToJailAction(session)

    this.sync.flush()
  }

  releaseJailTryAction = (session: Session) => {
    this.sync.pool.isDoneReleaseJailRequest = true
    const tryCount =
      this.poolModel.players[session.uuid].releaseJailTryCount + 1
    this.sync.pool.players[session.uuid].releaseJailTryCount = tryCount
    if (this.poolModel.isLastDiceEyeDoubled) {
      this.releaseJail(session)
    } else if (tryCount >= 3) {
      this.releaseJail(session)
      this.handlePayment(session.uuid, -releaseJailCost)
    }

    this.sync.flush()
  }

  releaseJail = (session: Session) => {
    this.sync.pool.players[session.uuid].isInJail = false
    this.sync.pool.players[session.uuid].position = jailPanelPosition
    this.sync.pool.players[session.uuid].releaseJailTryCount = 0
    this.sync.pool.isDoneReleaseJailRequest = false
    this.resetDiceResults()
  }

  releaseJailWithMoney = (session: Session) => {
    this.handlePayment(session.uuid, -releaseJailCost)
    this.releaseJail(session)

    this.sync.flush()
  }

  calculateDestinationAsset = (
    currentPosition: number,
    destinationAssetId: AssetId
  ) => {
    const deckPanelList = this.poolModel.panelList.concat(
      this.poolModel.panelList
    )

    const moveCount = deckPanelList
      .slice(currentPosition, deckPanelList.length)
      .findIndex(
        (panel) =>
          panel.type === 'asset' && panel.assetId === destinationAssetId
      )
    return moveCount
  }

  handlePayment = (playerId: string, diff: number) => {
    this.sync.pool.players[playerId].moneyAmount += diff
  }

  resetDiceResults = () => {
    this.sync.pool.diceResults.splice(0)
  }

  resetReleaseJailRequest = () => {
    this.sync.pool.isDoneReleaseJailRequest = false
  }

  setNextTurnPlayer = () => {
    this.sync.pool.currentTurnPlayerId = this.findNextTurnPlayerId()
  }

  onEndTurn = () => {
    this.isGameFinished()
    this.resetDiceResults()
    this.resetReleaseJailRequest()
    this.setNextTurnPlayer()
    this.resetEvent()

    this.sync.flush()
  }

  isGameFinished = () => {
    const loser = this.poolModel.playerListArray.find((player) => {
      return player.moneyAmount <= 0
    })

    if (loser) {
      this.sync.pool.isGameFinished = true
    }
  }

  findNextTurnPlayerId = () => {
    if (this.poolModel.currentTurnPlayer) {
      let nuxtTurnIndex = this.poolModel.currentTurnPlayer.turnIndex + 1
      if (nuxtTurnIndex > this.poolModel.playerCount)
        nuxtTurnIndex = nuxtTurnIndex % this.poolModel.playerCount
      const nuxtPlayer = this.poolModel.playerListArray.find(
        (player) => player.turnIndex === nuxtTurnIndex
      )
      return nuxtPlayer?.id || ''
    } else {
      const nuxtPlayer = this.poolModel.playerListArray.find(
        (player) => player.turnIndex === 1
      )
      return nuxtPlayer?.id || ''
    }
  }

  getEventCard = (eventType: 'chance' | 'challenge') => {
    if (eventType === 'chance') {
      const min = 0
      const max = instanceChanceList.length - 1
      const cardIndex = Math.floor(Math.random() * (max + 1 - min)) + min
      return instanceChanceList[cardIndex]
    } else {
      const min = 0
      const max = instanceChallengeList.length - 1
      const cardIndex = Math.floor(Math.random() * (max + 1 - min)) + min
      return instanceChallengeList[cardIndex]
    }
  }

  startChangeFacility = ({
    targetAssetGroupId,
  }: {
    targetAssetGroupId: AssetGroupId
  }) => {
    const targetAssetGroup = assetGroupList.find((assetGroup) => {
      return assetGroup.groupId === targetAssetGroupId
    })

    if (targetAssetGroup) {
      this.sync.pool.changeFacilityEvent.isInTheMiddle = true
      this.sync.pool.changeFacilityEvent.assetGroupId = targetAssetGroupId
    }

    this.sync.flush()
  }

  endChangeFacility = ({
    targetAssetList,
  }: {
    targetAssetList: {
      id: AssetId
      shopCount: number
      hotelCount: number
    }[]
  }) => {
    this.updateFacility(targetAssetList)

    this.resetChangeFacility()

    this.sync.flush()
  }

  cancelChangeFacility = () => {
    this.resetChangeFacility()

    this.sync.flush()
  }

  updateFacility = (
    targetAssetList: {
      id: AssetId
      shopCount: number
      hotelCount: number
    }[]
  ) => {
    targetAssetList.forEach((targetAsset) => {
      this.sync.pool.panelList.forEach((panel) => {
        if (
          panel.type === 'asset' &&
          panel.assetId === targetAsset.id &&
          panel.playerId
        ) {
          this.handlePayment(
            panel.playerId,
            -this.poolModel.calculateTotalConstructionCost(
              targetAsset.id,
              targetAsset.shopCount,
              targetAsset.hotelCount
            )
          )

          panel.shopCount = targetAsset.shopCount
          panel.hotelCount = targetAsset.hotelCount
        }
      })
    })
  }

  resetChangeFacility = () => {
    this.sync.pool.changeFacilityEvent.isInTheMiddle = false
    this.sync.pool.changeFacilityEvent.assetGroupId = null
  }

  getPlayerColorCode = () => {
    return this.playerColorCodeList.shift() as number
  }

  playerColorCodeList = [
    0xf50057, // 赤
    0x651fff, // 紫
    0x3d5afe, // 青
    0xfb8c00, // オレンジ
    0xfdd835, // 黄色
    0x29b6f6, // 水色
  ]
}

const turnShuffle = (turnIndices: number[]) => {
  let m = turnIndices.length
  while (m) {
    const i = Math.floor(Math.random() * m--)
    ;[turnIndices[m], turnIndices[i]] = [turnIndices[i], turnIndices[m]]
  }
  return turnIndices
}
const initialPlayerMoneyAmount = 1500
const initialPlayerPosition = 0
const panelCount = initialPanelList.length
const goBonusMoneyAmount = 200
const taxAmount = 200
const commodityTaxAmount = 75
const instanceChanceList = chanceList
const instanceChallengeList = challengeList
const jailPanelPosition = 10
const releaseJailCost = 50
