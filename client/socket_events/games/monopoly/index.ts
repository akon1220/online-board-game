import { eventCreator } from '../..'
import { Result, AssetId, AssetGroupId } from './pool'

export const rollDiceRequestEvent = eventCreator('monopoly/roll-dice-request')

export const diceRolledEvent = eventCreator<{
  firstDiceEyeResult: number
  secondDiceEyeResult: number
}>('monopoly/dice-rolled')

export const releaseJailWithMoneyRequestEvent = eventCreator(
  'monopoly/release-jail-with-money-request'
)

export const goToJailRequestEvent = eventCreator('monopoly/go-to-jail-request')

export const startBuyingJudgementRequestEvent = eventCreator(
  'monopoly/start-buying-judgement-request'
)

export const startChangeFacilityRequestEvent = eventCreator<{
  targetAssetGroupId: AssetGroupId
}>('monopoly/start-change-facility-request')

export const endChangeFacilityRequestEvent = eventCreator<{
  targetAssetList: {
    id: AssetId
    shopCount: number
    hotelCount: number
  }[]
}>('monopoly/end-change-facility-request')

export const cancelChangeFacilityRequestEvent = eventCreator(
  'monopoly/cancel-change-facility-request'
)

export const doMoveActionRequestEvent = eventCreator<{
  movePanelCount: number
}>('monopoly/do-move-action-request')

export const doEventActionRequestEvent = eventCreator(
  'monopoly/do-event-action-request'
)

export const endMyTurnRequestEvent = eventCreator(
  'monopoly/end-my-turn-request'
)

export const releaseJailTryActionRequestEvent = eventCreator(
  'monopoly/release-jail-try-action-request'
)

export const buyAssetRequestEvent = eventCreator<{ position: number }>(
  'monopoly/buy-asset-request'
)

export const startAuctionRequestEvent = eventCreator<{ position: number }>(
  'monopoly/start-auction-request'
)

export const sendAuctionPriceRequestEvent = eventCreator<{
  moneyAmount: number
}>('monopoly/send-auction-money-amount-request')

export const startAssetAcquisitionRequestEvent = eventCreator<{
  assetId: AssetId
}>('monopoly/start-asset-acquisition-request')

export const cancelAssetAcquisitionRequestEvent = eventCreator(
  'monopoly/cancel-asset-acquisition-request'
)

export const sendAssetAcquisitionPriceRequestEvent = eventCreator<{
  price: number
}>('monopoly/send-asset-acquisition-request')

export const judgeAssetAcquisitionRequestEvent = eventCreator<{
  result: Result
}>('monopoly/judge-asset-acquisition-request')

export const startAssetSaleRequestEvent = eventCreator<{ assetId: AssetId }>(
  'monopoly/start-asset-sale-request'
)

export const cancelAssetSaleRequestEvent = eventCreator(
  'monopoly/cancel-asset-sale-request'
)

export const sendAssetSalePriceRequestEvent = eventCreator<{
  price: number
  targetBuyer: string
}>('monopoly/send-asset-sale-request')

export const judgeAssetSaleRequestEvent = eventCreator<{
  result: Result
}>('monopoly/judge-asset-sale-request')

export const mortgageAssetRequestEvent = eventCreator<{ assetId: AssetId }>(
  'monopoly/mortgage-asset-request'
)

export const releaseMortgageAssetRequestEvent = eventCreator<{
  assetId: AssetId
}>('monopoly/release-mortgage-asset-request')
