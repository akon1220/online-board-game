/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie'
import { ApplicationReturnStatus, SocketApp } from '@/socket_app/socket_app'
import {
  SyncDataPoolGameController,
  SyncDataPoolInterface,
} from '@/socket_app/mixin/sync_data_pool_game'
import {
  rollDiceRequestEvent,
  endMyTurnRequestEvent,
  buyAssetRequestEvent,
  startAuctionRequestEvent,
  sendAuctionPriceRequestEvent,
  startAssetAcquisitionRequestEvent,
  startAssetSaleRequestEvent,
  sendAssetAcquisitionPriceRequestEvent,
  judgeAssetAcquisitionRequestEvent,
  mortgageAssetRequestEvent,
  releaseMortgageAssetRequestEvent,
  sendAssetSalePriceRequestEvent,
  judgeAssetSaleRequestEvent,
  doMoveActionRequestEvent,
  doEventActionRequestEvent,
  releaseJailTryActionRequestEvent,
  goToJailRequestEvent,
  startBuyingJudgementRequestEvent,
  startChangeFacilityRequestEvent,
  endChangeFacilityRequestEvent,
  cancelChangeFacilityRequestEvent,
  releaseJailWithMoneyRequestEvent,
  cancelAssetAcquisitionRequestEvent,
  cancelAssetSaleRequestEvent,
} from '@/socket_events/games/monopoly'
import {
  Pool,
  PoolModel,
  Result,
  AssetId,
  AssetGroupId,
} from '@/socket_events/games/monopoly/pool'
import { App } from './components/App'
import { Provider as ReduxProvider } from 'react-redux'
import { ViewController } from './components/game_board/index'
import { configureStore } from '@/state'

export class MonopolyApp extends SocketApp
  implements SyncDataPoolInterface<Pool> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static Context = React.createContext<MonopolyApp>(null as any)

  static Provider = MonopolyApp.Context.Provider
  static useInstance = () => useContext(MonopolyApp.Context)

  sync: SyncDataPoolGameController<Pool>
  userName: string
  viewController: ViewController
  shownPanelDetail: number | undefined
  gameId = 'monopoly'

  constructor() {
    super()
    this.userName = Cookies.get('user') || 'Guest'
    this.sync = new SyncDataPoolGameController(this)

    ReactDOM.render(
      <ReduxProvider store={configureStore()}>
        <MonopolyApp.Provider value={this}>
          <App />
        </MonopolyApp.Provider>
      </ReduxProvider>,
      document.getElementById('playground-field')
    )

    this.viewController = new ViewController(
      document.getElementById('board-field') as HTMLElement,
      this
    )
  }

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    await this.join(this.gameId)

    this.viewController.start()

    this.sync.subscribe()

    const nextURL = await this.waitUntilGameEnded()
    this.sock.removeAllListeners()
    this.sock.close()
    return { nextURL }
  }

  onPoolInitialized = (pool: Pool) => {
    //
  }

  onPoolUpdated = (pool: Pool) => {
    //
  }

  setShownPanelDetail = (position: number | undefined) => {
    this.shownPanelDetail = position
    this.viewController.render()
  }

  endMyTurn = () => {
    this.endMyTurnRequest()
    this.onMyTurnEnd()
  }

  rollDiceRequest = () => {
    rollDiceRequestEvent(this.sock).emit('')
  }

  startChangeFacilityRequest = (targetAssetGroupId: AssetGroupId) => {
    startChangeFacilityRequestEvent(this.sock).emit({ targetAssetGroupId })
  }

  endChangeFacilityRequest = (
    targetAssetList: {
      id: AssetId
      shopCount: number
      hotelCount: number
    }[]
  ) => {
    endChangeFacilityRequestEvent(this.sock).emit({ targetAssetList })
  }

  cancelChangeFacilityRequest = () => {
    cancelChangeFacilityRequestEvent(this.sock).emit('')
  }

  goToJailRequest = () => {
    goToJailRequestEvent(this.sock).emit('')
  }

  doMoveActionRequest = (movePanelCount: number) => {
    doMoveActionRequestEvent(this.sock).emit({ movePanelCount })
  }

  doEventActionRequest = () => {
    doEventActionRequestEvent(this.sock).emit('')
  }

  releaseJailWithMoneyRequest = () => {
    releaseJailWithMoneyRequestEvent(this.sock).emit('')
  }

  releaseJailTryActionRequest = () => {
    releaseJailTryActionRequestEvent(this.sock).emit('')
  }

  startBuyingJudgementRequest = () => {
    startBuyingJudgementRequestEvent(this.sock).emit('')
  }

  buyAssetRequest = (position: number) => {
    buyAssetRequestEvent(this.sock).emit({ position })
  }

  startAuctionRequest = (position: number) => {
    startAuctionRequestEvent(this.sock).emit({ position })
  }

  sendAuctionMoneyRequest = (moneyAmount: number) => {
    sendAuctionPriceRequestEvent(this.sock).emit({ moneyAmount })
  }

  endMyTurnRequest = () => {
    endMyTurnRequestEvent(this.sock).emit('')
  }

  onMyTurnStart = () => {
    //
  }

  onMyTurnEnd = () => {
    //
  }

  startAssetAcquisitionRequest = (assetId: AssetId) => {
    startAssetAcquisitionRequestEvent(this.sock).emit({ assetId })
  }

  cancelAssetAcquisitionRequest = () => {
    cancelAssetAcquisitionRequestEvent(this.sock).emit('')
  }

  sendAssetAcquisitionPriceRequest = (price: number) => {
    sendAssetAcquisitionPriceRequestEvent(this.sock).emit({ price })
  }

  judgeAssetAcquisitionRequest = (result: Result) => {
    judgeAssetAcquisitionRequestEvent(this.sock).emit({ result })
  }

  startAssetSaleRequest = (assetId: AssetId) => {
    startAssetSaleRequestEvent(this.sock).emit({ assetId })
  }

  cancelAssetSaleRequest = () => {
    cancelAssetSaleRequestEvent(this.sock).emit('')
  }

  sendAssetSalePriceRequest = (price: number, targetBuyer: string) => {
    sendAssetSalePriceRequestEvent(this.sock).emit({ price, targetBuyer })
  }

  judgeAssetSaleRequest = (result: Result) => {
    judgeAssetSaleRequestEvent(this.sock).emit({ result })
  }

  mortgageAssetRequest = (assetId: AssetId) => {
    mortgageAssetRequestEvent(this.sock).emit({ assetId })
  }

  releaseMortgageAssetRequest = (assetId: AssetId) => {
    releaseMortgageAssetRequestEvent(this.sock).emit({ assetId })
  }

  updateDiceEye = (poolModel: PoolModel) => {
    // be empty
  }

  updateAuctionResult = (poolModel: PoolModel) => {
    // be empty
  }

  updateChangeFacilityEvent = (PoolModel: PoolModel) => {
    // be empty
  }

  updatePool = (pool: Pool) => {
    // be empty
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).__PlaygroundAppClass = MonopolyApp
