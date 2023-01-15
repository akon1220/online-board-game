import React, { FC, useState } from 'react'
import { Message, Input, Button } from 'semantic-ui-react'
import { PoolModel, Result } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '..'

const ENTER_KEY_CODE = 13

type Props = {
  poolModel: PoolModel
}

export const AcquisitionN10nMessage: FC<Props> = (props) => {
  const [inputAcquisitionPrice, setInputAcquisitionPrice] = useState<number>(0)

  const poolModel = props.poolModel
  const acquisitionEvent = poolModel.acquisitionEvent

  const app = MonopolyApp.useInstance()

  const handleAcquisitionButtonClick = () => {
    if (inputAcquisitionPrice > 0) {
      app.sendAssetAcquisitionPriceRequest(inputAcquisitionPrice)
    }
    setInputAcquisitionPrice(0)
  }

  const handleAcquisitionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.keyCode === ENTER_KEY_CODE) handleAcquisitionButtonClick()
  }

  const handleAcquisitionJudgeButtonClick = (result: Result) => {
    app.judgeAssetAcquisitionRequest(result)
  }

  return (
    <>
      {acquisitionEvent.isInTheMiddle ? (
        <Message info>
          {acquisitionEvent.acquirerPlayerId === poolModel.myId ? (
            <>
              <Message.Header>
                {poolModel.acquisitionTargetAsset?.name}を買収交渉中
              </Message.Header>
              <Message.Content>
                いくらで{poolModel.acquisitionTargetAsset?.name}
                の買収を希望しますか？(1万円から買収可能です。)
              </Message.Content>

              {poolModel.isAcquisitionTargetPanelMortgaged ? (
                <Message.Content>
                  抵当に入っているので、抵当に入ったままで買い取ります。
                </Message.Content>
              ) : null}

              <Message.Content>
                {poolModel.isSentAcquisitionPrice ? (
                  <>
                    {poolModel.acquisitionEvent.acquisitionPrice}
                    万円で買収を交渉しました。
                    {poolModel.acquisitionTargetAssetOwner?.userName}
                    の回答を待っています。
                  </>
                ) : (
                  <>
                    <Input
                      focus
                      type="number"
                      placeholder="買収の金額(単位は万円)を入力"
                      value={inputAcquisitionPrice}
                      onChange={(e) => {
                        setInputAcquisitionPrice(parseInt(e.target.value, 10))
                      }}
                      onKeyDown={handleAcquisitionKeyDown}
                    />
                    <Button color="blue" onClick={handleAcquisitionButtonClick}>
                      決定
                    </Button>
                    <Button onClick={() => app.cancelAssetAcquisitionRequest()}>
                      キャンセル
                    </Button>
                  </>
                )}
              </Message.Content>
            </>
          ) : null}
          {acquisitionEvent.ownerPlayerId === poolModel.myId ? (
            <>
              <Message.Header>
                {poolModel.acquirerPlayer?.userName}が
                {poolModel.acquisitionTargetAsset?.name}
                の買収を持ちかけてきました。
              </Message.Header>

              {poolModel.isAcquisitionTargetPanelMortgaged ? (
                <Message.Content>
                  抵当に入っているのでは、抵当に入ったままで売り渡されます。
                </Message.Content>
              ) : null}

              {poolModel.isSentAcquisitionPrice ? (
                <>
                  <Message.Header>
                    {acquisitionEvent.acquisitionPrice}万円
                    での買収を受け入れますか？
                  </Message.Header>
                  <Message.Content>
                    <Button.Group>
                      <Button
                        color="green"
                        onClick={() =>
                          handleAcquisitionJudgeButtonClick('accept')
                        }
                      >
                        承認
                      </Button>
                      <Button
                        color="red"
                        onClick={() => {
                          handleAcquisitionJudgeButtonClick('refuse')
                        }}
                      >
                        拒否
                      </Button>
                    </Button.Group>
                  </Message.Content>
                </>
              ) : (
                <Message.Content>
                  {poolModel.acquirerPlayer?.userName}
                  の買収金額の入力を待っています。
                </Message.Content>
              )}
            </>
          ) : null}
          {acquisitionEvent.acquirerPlayerId !== poolModel.myId &&
          acquisitionEvent.ownerPlayerId !== poolModel.myId ? (
            <Message.Header>
              {`${poolModel.acquirerPlayer?.userName}が${poolModel.acquisitionTargetAsset?.name}を`}
              買収交渉中
            </Message.Header>
          ) : null}
        </Message>
      ) : null}
    </>
  )
}
