import React, { FC, useState } from 'react'
import { Message, Button, Input } from 'semantic-ui-react'
import { PoolModel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '..'

const ENTER_KEY_CODE = 13

type Props = {
  poolModel: PoolModel
}

export const AuctionN10nMessage: FC<Props> = (props) => {
  const [isAuctionMoneySent, setIsAuctionMoneySent] = useState(false)
  const [inputAuctionPrice, setInputAuctionPrice] = useState<number>(0)

  const app = MonopolyApp.useInstance()

  const poolModel = props.poolModel

  const handleBuyButtonClick = (position: number | undefined) => {
    if (position) app.buyAssetRequest(position)
  }

  const handleNotBuyButtonClick = (position: number | undefined) => {
    if (position) app.startAuctionRequest(position)
  }

  const handleAuctionButtonClick = () => {
    if (inputAuctionPrice > 0) {
      setIsAuctionMoneySent(true)
      app.sendAuctionMoneyRequest(inputAuctionPrice)
    }
  }

  const handleAuctionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ENTER_KEY_CODE) handleAuctionButtonClick()
  }

  app.updateAuctionResult = (poolModel: PoolModel) => {
    if (poolModel.isAuctionDone) {
      setIsAuctionMoneySent(false)
      setInputAuctionPrice(0)
    }
  }

  return (
    <>
      {poolModel.isMyTurn && poolModel.isInTheMiddleOfBuying ? (
        <Message info>
          <Message.Header>
            {`${poolModel.currentPanelAsset?.name}は保有者がいません。${poolModel.currentPanelAsset?.price}万円で買いますか？`}
          </Message.Header>
          <p>
            <Button.Group>
              <Button
                color="green"
                onClick={() =>
                  handleBuyButtonClick(poolModel.myCurrentPanel.position)
                }
              >
                買う
              </Button>
              <Button
                color="red"
                onClick={() =>
                  handleNotBuyButtonClick(poolModel.myCurrentPanel.position)
                }
              >
                買わない
              </Button>
            </Button.Group>
          </p>
        </Message>
      ) : null}
      {poolModel.auctionTargetAsset &&
      poolModel.isAuctionStarted &&
      !poolModel.isMyTurn ? (
        <Message info>
          <Message.Header>
            {`${poolModel.auctionTargetAsset.name}のオークションを行います。`}
          </Message.Header>
          <Message.Content>
            {`定価は${poolModel.auctionTargetAsset.price}万円です。`}
            <p>オークションの金額(単位は万円)を入力</p>
          </Message.Content>
          {isAuctionMoneySent ? (
            <Message.Content>
              {`${inputAuctionPrice}万円でオークションに参加しました。他のプレイヤーの入力を待っています。`}
            </Message.Content>
          ) : (
            <>
              <Input
                focus
                type="number"
                placeholder="競売の金額(単位は万円)を入力"
                value={inputAuctionPrice}
                onChange={(e) => {
                  setInputAuctionPrice(parseInt(e.target.value, 10))
                }}
                onKeyDown={handleAuctionKeyDown}
              />
              <Button color="blue" onClick={handleAuctionButtonClick}>
                決定
              </Button>
            </>
          )}
        </Message>
      ) : null}
      {poolModel.auctionTargetAsset &&
      poolModel.isAuctionStarted &&
      poolModel.isMyTurn ? (
        <Message info>
          <Message.Header>
            他のプレイヤーがオークションに参加中です。全てのユーザがオークション金額を入力するまでお待ちください。
          </Message.Header>
        </Message>
      ) : null}
    </>
  )
}
