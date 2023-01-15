import { assetList } from './assetList.data'
import { initialPanelList } from './panelList.data'

export type Pool = {
  panelList: Panel[]
  players: {
    [playerId: string]: {
      userName: string
      position: number
      isInJail: boolean
      releaseJailTryCount: number
      moneyAmount: number
      colorCode: number
      turnIndex: number
      auctionPrice: number | null
    }
  }
  roomMembers: { userName: string; uuid: string; accepted: boolean }[]
  diceResults: {
    firstDiceEye: number
    secondDiceEye: number
    hasMoved: boolean
  }[]
  changeFacilityEvent: {
    isInTheMiddle: boolean
    assetGroupId: AssetGroupId | null
  }
  isDoneReleaseJailRequest: boolean
  isInTheMiddleOfBuying: boolean
  chanceCard: Event | null
  challengeCard: Event | null
  currentTurnPlayerId: string | null
  auctionTargetAssetId: AssetId | null
  isAuctionStarted: boolean
  isAuctionDone: boolean
  isGameStarted: boolean
  acquisitionEvent: {
    isInTheMiddle: boolean
    targetAssetId: AssetId | null
    ownerPlayerId: string | null
    acquirerPlayerId: string | null
    acquisitionPrice: number
  }
  saleEvent: {
    isInTheMiddle: boolean
    targetAssetId: AssetId | null
    ownerPlayerId: string | null
    targetBuyerId: string | null
    buyerPlayerId: string | null
    salePrice: number
    answeredPlayerIdList: string[]
  }
  isGameFinished: boolean
  myId: string
}

export const initialPool: Pool = {
  currentTurnPlayerId: '',
  panelList: JSON.parse(JSON.stringify(initialPanelList)), // Deep Copy
  roomMembers: [],
  players: {},
  diceResults: [],
  changeFacilityEvent: {
    isInTheMiddle: false,
    assetGroupId: null,
  },
  isDoneReleaseJailRequest: false,
  isInTheMiddleOfBuying: false,
  chanceCard: null,
  challengeCard: null,
  auctionTargetAssetId: null,
  isAuctionStarted: false,
  isAuctionDone: false,
  isGameStarted: false,
  acquisitionEvent: {
    isInTheMiddle: false,
    targetAssetId: null,
    ownerPlayerId: null,
    acquirerPlayerId: null,
    acquisitionPrice: 0,
  },
  saleEvent: {
    isInTheMiddle: false,
    targetAssetId: null,
    ownerPlayerId: null,
    targetBuyerId: null,
    buyerPlayerId: null,
    salePrice: 0,
    answeredPlayerIdList: [],
  },
  isGameFinished: false,
  myId: '',
}

export class PoolModel implements Pool {
  panelList!: Panel[]
  players!: {
    [playerId: string]: {
      userName: string
      position: number
      isInJail: boolean
      releaseJailTryCount: number
      moneyAmount: number
      colorCode: number
      turnIndex: number
      auctionPrice: number | null
    }
  }

  roomMembers!: { userName: string; uuid: string; accepted: boolean }[]

  diceResults!: {
    firstDiceEye: number
    secondDiceEye: number
    hasMoved: boolean
  }[]

  changeFacilityEvent!: {
    isInTheMiddle: boolean
    assetGroupId: AssetGroupId | null
  }

  isInTheMiddleOfBuying!: boolean
  isDoneReleaseJailRequest!: boolean
  chanceCard!: Event | null
  challengeCard!: Event | null
  currentTurnPlayerId!: string
  auctionTargetAssetId!: AssetId | null
  isAuctionStarted!: boolean
  isAuctionDone!: boolean
  isGameStarted!: boolean
  acquisitionEvent!: {
    isInTheMiddle: boolean
    targetAssetId: AssetId | null
    ownerPlayerId: string | null
    acquirerPlayerId: string | null
    acquisitionPrice: number
  }

  saleEvent!: {
    isInTheMiddle: boolean
    targetAssetId: AssetId | null
    ownerPlayerId: string | null
    targetBuyerId: string | null
    buyerPlayerId: string | null
    salePrice: number
    answeredPlayerIdList: string[]
  }

  isGameFinished!: boolean

  myId!: string

  constructor(init: Partial<Pool>) {
    Object.assign(this, init)
  }

  get currentTurnPlayer() {
    if (this.players[this.currentTurnPlayerId])
      return this.players[this.currentTurnPlayerId]
  }

  get myPlayer() {
    return this.players[this.myId]
  }

  get isMyTurn() {
    return this.currentTurnPlayerId === this.myId
  }

  get eventActionExists() {
    return this.chanceCard !== null || this.challengeCard !== null
  }

  get eventAction() {
    return this.chanceCard || this.challengeCard
  }

  get beforeDiceEyeResults() {
    if (this.lastDiceEyeResultExists) {
      return this.diceResults.slice(0, this.diceResults.length - 1)
    } else {
      return []
    }
  }

  get isFirstDiceResultExists() {
    return this.diceResults.length === 1
  }

  get isFirstDiceRolling() {
    return this.diceResults.length === 0
  }

  get lastDiceEyeResultExists() {
    return this.diceResults.length > 0
  }

  get lastDiceEyeResult() {
    if (this.lastDiceEyeResultExists) {
      return this.diceResults[this.diceResults.length - 1]
    }
  }

  get isLastDiceEyeDoubled() {
    return (
      this.lastDiceEyeResultExists &&
      this.lastDiceEyeResult?.firstDiceEye ===
        this.lastDiceEyeResult?.secondDiceEye
    )
  }

  get lastDiceEyeResultSum() {
    if (this.lastDiceEyeResult) {
      return (
        this.lastDiceEyeResult.firstDiceEye +
        this.lastDiceEyeResult.secondDiceEye
      )
    } else {
      return 0
    }
  }

  get isUpdatedDiceEyeResult() {
    return this.lastDiceEyeResult && !this.lastDiceEyeResult?.hasMoved
  }

  get isDoubledDiceEyeThreeConsecutive() {
    return (
      this.diceResults.filter((diceResult) => {
        return diceResult.firstDiceEye === diceResult.secondDiceEye
      }).length === this.diceResults.length && this.isMaxDiceEyeResult
    )
  }

  get playerListArray() {
    return Object.keys(this.players)
      .map((playerId) => {
        return {
          id: playerId,
          ...this.players[playerId],
          isAuctionJoined: this.players[playerId].auctionPrice !== null,
        }
      })
      .sort((a, b) => {
        return a.turnIndex - b.turnIndex
      })
  }

  get myAssetList() {
    return this.panelList.filter((panel) => {
      return panel.type === 'asset' && panel.playerId === this.myId
    })
  }

  get isSentAuctionPrice() {
    return (
      this.isAuctionStarted &&
      this.myPlayer.auctionPrice &&
      this.myPlayer.auctionPrice > 0
    )
  }

  get auctionTargetAsset() {
    if (this.auctionTargetAssetId) {
      return assetList[this.auctionTargetAssetId]
    }
  }

  get hasAuctionResult() {
    return !this.isAuctionStarted && this.isAuctionDone
  }

  get myName() {
    return this.players[this.myId].userName
  }

  get myPosition() {
    return this.players[this.myId].position
  }

  get myCurrentPanel() {
    return this.panelList[this.myPosition]
  }

  get currentPanelAsset() {
    if (this.myCurrentPanel.type === 'asset') {
      return assetList[this.myCurrentPanel.assetId]
    }
  }

  get myCurrentPanelOwnerNotExists() {
    return (
      this.myCurrentPanel.type === 'asset' &&
      this.myCurrentPanel.playerId === null
    )
  }

  get auctionResult() {
    return this.playerListArray
      .filter((player) => {
        return player.isAuctionJoined
      })
      .sort(
        (playerA, playerB) =>
          (playerB.auctionPrice as number) - (playerA.auctionPrice as number)
      )
      .map((player, idx) => ({
        rank: idx + 1,
        ...player,
      }))
  }

  get playerCount() {
    return Object.keys(this.players).length
  }

  get acquirerPlayer() {
    if (this.acquisitionEvent.acquirerPlayerId) {
      return this.players[this.acquisitionEvent.acquirerPlayerId]
    }
  }

  get acquisitionTargetAsset() {
    if (this.acquisitionEvent.targetAssetId) {
      return assetList[this.acquisitionEvent.targetAssetId]
    }
  }

  get acquisitionTargetAssetOwner() {
    if (this.acquisitionEvent.ownerPlayerId) {
      return this.players[this.acquisitionEvent.ownerPlayerId]
    }
  }

  get saleTargetAssetOwnerPlayer() {
    if (this.saleEvent.ownerPlayerId) {
      return this.players[this.saleEvent.ownerPlayerId]
    }
  }

  get saleTargetAsset() {
    if (this.saleEvent.targetAssetId) {
      return assetList[this.saleEvent.targetAssetId]
    }
  }

  get saleTargetBuyerList() {
    const saleTargetPlayerList = this.playerListArray
      .filter((player) => {
        return player.id !== this.currentTurnPlayerId
      })
      .map((player) => {
        return {
          key: player.id,
          value: player.id,
          text: player.userName,
        }
      })

    saleTargetPlayerList.push(this.saleTargetEveryone)

    return saleTargetPlayerList
  }

  get saleTargetEveryone() {
    return {
      key: 'everyone',
      value: 'everyone',
      text: '全員',
    }
  }

  get buyerPlayer() {
    if (this.saleEvent.buyerPlayerId) {
      return this.players[this.saleEvent.buyerPlayerId]
    }
  }

  get assetPanelList() {
    const result: { [key: string]: AssetPanel } = {}
    this.panelList.forEach((panel) => {
      if (panel.type === 'asset') {
        result[panel.assetId] = {
          ...panel,
        }
      }
    })

    return result
  }

  get canTurnFinish() {
    return (
      this.isGameStarted &&
      !this.isGameFinished &&
      this.isMyTurn &&
      !this.isInTheMiddleOfBuying &&
      this.isRolledDiceMoreThanZero &&
      (!this.isLastDiceEyeDoubled ||
        this.isMaxDiceEyeResult ||
        this.myPlayer.isInJail) &&
      !this.isAuctionStarted &&
      !this.acquisitionEvent.isInTheMiddle &&
      !this.saleEvent.isInTheMiddle
    )
  }

  get canRollDice() {
    return (
      this.isGameStarted &&
      !this.isGameFinished &&
      this.isMyTurn &&
      !this.isInTheMiddleOfBuying &&
      !this.isMaxDiceEyeResult &&
      !this.isDiceRollingInJail &&
      !this.myPlayer.isInJail &&
      (this.isFirstDiceRolling || this.isLastDiceEyeDoubled) &&
      !this.isAuctionStarted &&
      !this.acquisitionEvent.isInTheMiddle &&
      !this.saleEvent.isInTheMiddle
    )
  }

  get canReleaseJailTryActionRequest() {
    return (
      this.isMyTurn &&
      this.myPlayer.isInJail &&
      this.isFirstDiceResultExists &&
      !this.isDoneReleaseJailRequest
    )
  }

  get canGoToJailRequest() {
    return (
      this.isMyTurn &&
      this.isDoubledDiceEyeThreeConsecutive &&
      !this.myPlayer.isInJail
    )
  }

  get canDoMoveActionRequest() {
    return (
      this.isMyTurn && !this.myPlayer.isInJail && this.isUpdatedDiceEyeResult
    )
  }

  get isRolledDiceMoreThanZero() {
    return this.diceResults.length > 0
  }

  get isDiceRollingInJail() {
    return (
      this.currentTurnPlayer &&
      this.currentTurnPlayer.isInJail &&
      this.diceResults.length === 1
    )
  }

  get isMaxDiceEyeResult() {
    return this.diceResults.length >= 3
  }

  get isSentAcquisitionPrice() {
    return (
      this.acquisitionEvent.isInTheMiddle &&
      this.acquisitionEvent.acquisitionPrice > 0
    )
  }

  get isAcquisitionTargetPanelMortgaged() {
    const targetPanel = this.panelList.find((panel) => {
      return (
        panel.type === 'asset' &&
        panel.assetId === this.acquisitionEvent.targetAssetId
      )
    })
    return targetPanel?.type === 'asset' && targetPanel.isMortgaged
  }

  get isSaleTargetPanelMortgaged() {
    const targetPanel = this.panelList.find((panel) => {
      return (
        panel.type === 'asset' && panel.assetId === this.saleEvent.targetAssetId
      )
    })
    return targetPanel?.type === 'asset' && targetPanel.isMortgaged
  }

  get isSentSalePrice() {
    return this.saleEvent.isInTheMiddle && this.saleEvent.salePrice > 0
  }

  get isSaleTarget() {
    return (
      this.saleEvent.targetBuyerId === this.saleTargetEveryone.value ||
      this.saleEvent.targetBuyerId === this.myId
    )
  }

  get saleTargetBuyer() {
    if (this.saleEvent.targetBuyerId) {
      return this.players[this.saleEvent.targetBuyerId]
    }
  }

  get isAllPlayerAnswered() {
    return this.saleEvent.answeredPlayerIdList.length === this.playerCount - 1
  }

  get playerAssetList() {
    return this.playerListArray.map((player) => {
      return {
        ...player,
        assetList: this.panelList.filter((panel) => {
          return panel.type === 'asset' && panel.playerId === player.id
        }),
      }
    })
  }

  get playerAssets() {
    const assets: { [key: string]: Panel[] } = {}
    this.playerListArray.forEach((player) => {
      assets[player.id] = this.panelList.filter((panel) => {
        return panel.type === 'asset' && panel.playerId === player.id
      })
    })

    return assets
  }

  get calculateGameResultList() {
    return this.playerAssetList
      .map((player) => {
        return {
          player: player,
          totalAssetAmount: player.assetList.reduce(
            (accumulator, currentPanel) => {
              if (currentPanel.type === 'asset') {
                if (!currentPanel.isMortgaged) {
                  accumulator += assetList[currentPanel.assetId].price
                } else if (currentPanel.isMortgaged) {
                  accumulator += assetList[currentPanel.assetId].mortgagePrice
                }

                const constructionCost =
                  assetList[currentPanel.assetId].constructionCost

                if (constructionCost) {
                  if (currentPanel.hotelCount >= 1) {
                    accumulator += 5 * constructionCost
                  } else {
                    accumulator += currentPanel.shopCount * constructionCost
                  }
                }
              }

              return accumulator
            },
            player.moneyAmount
          ),
        }
      })
      .sort(
        (playerInfoA, playerInfoB) =>
          (playerInfoB.totalAssetAmount as number) -
          (playerInfoA.totalAssetAmount as number)
      )
      .map((playerInfo, idx) => {
        return {
          rank: idx + 1,
          ...playerInfo,
        }
      })
  }

  public isMyPositionChanged = (oldPosition: number | undefined) => {
    return oldPosition !== this.myPosition
  }

  public isMyAsset = (panel: Panel | undefined) => {
    return (
      panel?.type === 'asset' &&
      panel.playerId !== null &&
      panel.playerId === this.myId
    )
  }

  public isOtherPlayerAsset = (panel: Panel | undefined) => {
    return (
      panel?.type === 'asset' &&
      panel.playerId !== null &&
      panel.playerId !== this.myId
    )
  }

  public isMortgaged = (panel: Panel | undefined) => {
    return panel?.type === 'asset' && panel.isMortgaged
  }

  public getAssetGroupWithAsset = (groupId: AssetGroupId) => {
    return assetGroupList
      .find((assetGroup) => assetGroup.groupId === groupId)
      ?.assetList.map((assetId) => {
        return {
          id: assetId,
          ...assetList[assetId],
        }
      })
  }

  public getAssetGroupBy = (assetId: AssetId) => {
    return assetGroupList.find((assetGroup) => {
      return assetGroup.assetList.includes(assetId)
    })
  }

  public isAssetGroupCompleted = (
    ownerPlayerId: string,
    panel: Panel | undefined
  ) => {
    if (panel?.type !== 'asset') return false

    const assetGroup = this.getAssetGroupBy(panel.assetId)
    return (
      assetGroup?.assetList.filter((assetId) => {
        return (
          this.assetPanelList[assetId].playerId === ownerPlayerId &&
          !this.assetPanelList[assetId].isMortgaged
        )
      }).length === assetGroup?.assetList.length
    )
  }

  public isPrivateAsset = (assetId: AssetId) => {
    return (
      !stationAssetIdList.includes(assetId) &&
      assetId !== 'water' &&
      assetId !== 'electricity'
    )
  }

  public isEnergyCompanyCompleted = (ownerPlayerId: string) => {
    return (
      this.panelList.filter((panel) => {
        return (
          panel.type === 'asset' &&
          (panel.assetId === 'water' || panel.assetId === 'electricity') &&
          panel.playerId === ownerPlayerId
        )
      }).length > 1
    )
  }

  public countOwnedStation = (ownerPlayerId: string) => {
    return this.panelList.filter((panel) => {
      return (
        panel.type === 'asset' &&
        stationAssetIdList.includes(panel.assetId) &&
        panel.playerId === ownerPlayerId
      )
    }).length
  }

  public calculatePrivateAssetTollAfterConstruction = (
    assetId: AssetId,
    shopCount: number,
    hotelCount: number
  ) => {
    const asset = assetList[assetId]
    if (asset.type === 'private') {
      if (hotelCount > 0) {
        return asset.hotelToll
      } else if (shopCount > 0) {
        switch (shopCount) {
          case 1:
            return asset.oneShopToll
          case 2:
            return asset.twoShopToll
          case 3:
            return asset.threeShopToll
          case 4:
            return asset.fourShopToll
        }
      } else {
        return 2 * (asset.defaultToll as number)
      }
    }
  }

  public calculateAssetToll = (ownerPlayerId: string, assetId: AssetId) => {
    const asset = assetList[assetId]
    const panel = this.assetPanelList[assetId]
    if (asset.type === 'private') {
      if (panel.hotelCount > 0) {
        return asset.hotelToll
      } else if (panel.shopCount > 0) {
        switch (panel.shopCount) {
          case 1:
            return asset.oneShopToll
          case 2:
            return asset.twoShopToll
          case 3:
            return asset.threeShopToll
          case 4:
            return asset.fourShopToll
        }
      } else {
        if (this.isAssetGroupCompleted(ownerPlayerId, panel)) {
          return 2 * (asset.defaultToll as number)
        } else {
          return asset.defaultToll
        }
      }
    } else if (asset.type === 'station') {
      switch (this.countOwnedStation(ownerPlayerId)) {
        case 1:
          return asset.oneCompleteToll
        case 2:
          return asset.twoCompleteToll
        case 3:
          return asset.threeCompleteToll
        case 4:
          return asset.fourCompleteToll
      }
    } else if (asset.type === 'energy') {
      if (this.isEnergyCompanyCompleted(ownerPlayerId)) {
        return (
          this.getRandomNumberFromOneToSix() *
          (asset.multiDiceCoefficient as number)
        )
      } else {
        return (
          this.getRandomNumberFromOneToSix() *
          (asset.singleDiceCoefficient as number)
        )
      }
    } else {
      return 0
    }
  }

  public getRandomNumberFromOneToSix = () => {
    const min = 1
    const max = 6
    return Math.floor(Math.random() * (max + 1 - min)) + min
  }

  public calculateTotalConstructionCost = (
    assetId: AssetId,
    newShopCount: number,
    newHotelCount: number
  ) => {
    let oldShopCount = this.assetPanelList[assetId].shopCount
    const oldHotelCount = this.assetPanelList[assetId].hotelCount
    const constructionCost = assetList[assetId].constructionCost as number
    if (newHotelCount > 0) {
      newShopCount = 5
    }
    if (oldHotelCount > 0) {
      oldShopCount = 5
    }

    return (newShopCount - oldShopCount) * constructionCost
  }

  public canChangeFacility = (
    targetAssetId: AssetId,
    targetAssetList: {
      id: AssetId
      shopCount: number
      hotelCount: number
    }[],
    diff: number
  ) => {
    let assetListForCalc = targetAssetList.map((asset) => {
      return asset.hotelCount > 0
        ? {
            id: asset.id,
            shopCount: 5,
          }
        : {
            id: asset.id,
            shopCount: asset.shopCount,
          }
    })
    assetListForCalc = assetListForCalc.map((asset) => {
      if (asset.id === targetAssetId) {
        return { id: asset.id, shopCount: asset.shopCount + diff }
      } else {
        return asset
      }
    })
    return (
      assetListForCalc.filter((asset) => {
        return (
          assetListForCalc.filter((comparedAsset) => {
            return Math.abs(asset.shopCount - comparedAsset.shopCount) < 2
          }).length === assetListForCalc.length
        )
      }).length === assetListForCalc.length
    )
  }

  public getAssetColor = (assetId: AssetId): number | undefined => {
    const assetGroup = assetGroupList.find((assetGroup) => {
      return assetGroup.assetList.includes(assetId)
    })
    return assetGroup?.colorCode
  }
}

export type Result = 'accept' | 'refuse'

export type Event = {
  type: 'move' | 'pay' | 'receive' | 'repair' | 'go_to_jail'
  description: string
  target: 'everyone' | 'bank'
  amount: number
  shopCost: number
  hotelCost: number
  destination: AssetId | 'three' | 'station' | 'start'
  leverage: 1 | 2
}

export type Panel = AssetPanel | ActionPanel

export type AssetPanel = {
  type: 'asset'
  position: number
  assetId: AssetId
  playerId: string | null
  shopCount: number
  hotelCount: number
  isMortgaged: boolean
}

export type ActionPanel = {
  type: 'action'
  position: number
  name: string
  actionType: ActionType
}

export type ActionType =
  | 'start'
  | 'asset'
  | 'tax'
  | 'challenge'
  | 'chance'
  | 'tax'
  | 'jail'
  | 'free_parking'
  | 'go_to_jail'
  | 'commodity_tax'

export type Asset = {
  type: 'private' | 'station' | 'energy'
  name: string
  price: number
  defaultToll: number | undefined
  constructionCost: number | undefined
  oneShopToll: number | undefined
  twoShopToll: number | undefined
  threeShopToll: number | undefined
  fourShopToll: number | undefined
  hotelToll: number | undefined
  singleDiceCoefficient: number | undefined
  multiDiceCoefficient: number | undefined
  oneCompleteToll: number | undefined
  twoCompleteToll: number | undefined
  threeCompleteToll: number | undefined
  fourCompleteToll: number | undefined
  mortgagePrice: number
  interestPrice: number
}

export const assetGroupList: {
  groupId: AssetGroupId
  assetList: AssetId[]
  colorCode: number
}[] = [
  {
    groupId: 'vacation_sports',
    assetList: ['scuba', 'ski'],
    colorCode: 0x975436,
  },
  {
    groupId: 'food',
    assetList: ['crape', 'takoyaki', 'ramen'],
    colorCode: 0xacdffb,
  },
  {
    groupId: 'outdoors',
    assetList: ['fishing', 'camp', 'beach'],
    colorCode: 0xd83b97,
  },
  {
    groupId: 'sports_stadium',
    assetList: ['soccer_stadium', 'baseball_stadium', 'skate_stadium'],
    colorCode: 0xf6941d,
  },
  {
    groupId: 'amusement',
    assetList: ['theater', 'bowling', 'game_center'],
    colorCode: 0xec1d23,
  },
  {
    groupId: 'literacy',
    assetList: ['gallery', 'library', 'museum'],
    colorCode: 0xfff300,
  },
  {
    groupId: 'family',
    assetList: ['zoo', 'amusement_park', 'aquarium'],
    colorCode: 0x21b15a,
  },
  {
    groupId: 'sightseeing',
    assetList: ['tokyo_tower', 'fujiyama'],
    colorCode: 0x0073bd,
  },
]

export type AssetGroupId =
  | 'vacation_sports'
  | 'food'
  | 'outdoors'
  | 'sports_stadium'
  | 'amusement'
  | 'literacy'
  | 'family'
  | 'sightseeing'

export const stationAssetIdList: AssetId[] = [
  'east_station',
  'west_station',
  'south_station',
  'north_station',
]

export type AssetId =
  | 'scuba'
  | 'ski'
  | 'crape'
  | 'takoyaki'
  | 'ramen'
  | 'fishing'
  | 'camp'
  | 'beach'
  | 'soccer_stadium'
  | 'baseball_stadium'
  | 'skate_stadium'
  | 'theater'
  | 'bowling'
  | 'game_center'
  | 'gallery'
  | 'library'
  | 'museum'
  | 'zoo'
  | 'amusement_park'
  | 'aquarium'
  | 'tokyo_tower'
  | 'fujiyama'
  | 'electricity'
  | 'water'
  | 'east_station'
  | 'west_station'
  | 'south_station'
  | 'north_station'
