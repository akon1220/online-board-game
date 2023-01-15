import React, { useState, useEffect } from 'react'
import { Grid, Message } from 'semantic-ui-react'
import { MonopolyApp } from '..'
import { Pool, PoolModel } from '@/socket_events/games/monopoly/pool'
import { AuctionN10nMessage } from './AuctionN10nMessage'
import { AcquisitionN10nMessage } from './AcquisitionN10nMessage'
import { SaleN10nMessage } from './SaleN10nMessage'
import { AuctionN10nModal } from './AuctionN10nModal'
import { UserList } from './UserList'
import { BoardField } from './BoardField'
import { ControlPanel } from './ControlPanel'
import { ChangeFacilityModal } from './ChangeFacilityModal'
import { JailN10nMessage } from './JailN10nMessage'
import { useDispatch } from 'react-redux'
import { gameListOperations } from '@/state/ducks/game_list'

export const App = () => {
  const [clientPoolModel, setClientPoolModel] = useState<
    PoolModel | undefined
  >()
  const [isAuctionResultMessageOpen, setIsAuctionResultMessageOpen] = useState(
    false
  )
  const [diffMoneyAmount, setDiffMoneyAmount] = useState<{
    [playerId: string]: number
  }>({})

  const app = MonopolyApp.useInstance()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(gameListOperations.fetchGameList())
  }, [])

  app.onPoolUpdated = (pool: Pool) => {
    const poolModel = new PoolModel(pool)
    app.viewController.updatePool(poolModel)

    if (poolModel.isUpdatedDiceEyeResult) {
      app.updateDiceEye(poolModel)
    }

    app.updateChangeFacilityEvent(poolModel)

    app.updateAuctionResult(poolModel)

    if (
      clientPoolModel &&
      poolModel.isMyPositionChanged(clientPoolModel.myPosition as number) &&
      poolModel.myCurrentPanelOwnerNotExists
    ) {
      setTimeout(() => app.startBuyingJudgementRequest(), 500)
    }

    if (clientPoolModel) {
      const buffDiffMoneyAmount: { [playerId: string]: number } = {}
      Object.keys(clientPoolModel.players).forEach((key) => {
        buffDiffMoneyAmount[key] =
          poolModel.players[key].moneyAmount -
          clientPoolModel.players[key].moneyAmount
        setTimeout(() => setDiffMoneyAmount({}), 2000)
      })
      setDiffMoneyAmount(buffDiffMoneyAmount)

      if (
        clientPoolModel.isAuctionDone === false &&
        poolModel.isAuctionDone === true
      ) {
        setIsAuctionResultMessageOpen(true)
      }
    }

    if (
      !clientPoolModel?.eventActionExists &&
      poolModel.eventActionExists &&
      poolModel.isMyTurn
    ) {
      setTimeout(() => {
        app.doEventActionRequest()
      }, 2000)
    }

    setClientPoolModel(poolModel)
  }

  return (
    <>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={3}>
            {clientPoolModel ? (
              <UserList
                poolModel={clientPoolModel}
                diffMoneyAmountList={diffMoneyAmount}
              />
            ) : null}
          </Grid.Column>
          <Grid.Column width={10}>
            {clientPoolModel ? null : (
              <Message>
                <h4>他のメンバーの読み込みを待っています。</h4>
              </Message>
            )}
            {clientPoolModel && clientPoolModel.myCurrentPanel ? (
              <AuctionN10nMessage poolModel={clientPoolModel} />
            ) : null}
            {clientPoolModel ? (
              <AcquisitionN10nMessage poolModel={clientPoolModel} />
            ) : null}
            {clientPoolModel ? (
              <SaleN10nMessage poolModel={clientPoolModel} />
            ) : null}
            {clientPoolModel ? (
              <JailN10nMessage poolModel={clientPoolModel} />
            ) : null}
            <BoardField poolModel={clientPoolModel} />
          </Grid.Column>
          <Grid.Column width={3}>
            {clientPoolModel ? (
              <ControlPanel poolModel={clientPoolModel} />
            ) : null}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {clientPoolModel && isAuctionResultMessageOpen ? (
        <AuctionN10nModal
          poolModel={clientPoolModel}
          isAuctionResultMessageOpen={isAuctionResultMessageOpen}
          setIsAuctionResultMessageOpen={setIsAuctionResultMessageOpen}
        />
      ) : null}
      {clientPoolModel ? (
        <ChangeFacilityModal poolModel={clientPoolModel} />
      ) : null}
    </>
  )
}
