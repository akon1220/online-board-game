import React, { FC, useState } from 'react'
import {
  Message,
  Input,
  Button,
  Dropdown,
  DropdownProps,
} from 'semantic-ui-react'
import { PoolModel, Result } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '..'

const ENTER_KEY_CODE = 13

type Props = {
  poolModel: PoolModel
}

export const SaleN10nMessage: FC<Props> = ({ poolModel }) => {
  const [inputSalePrice, setInputSalePrice] = useState<number>(0)
  const [inputSaleTargetBuyer, setInputSaleTargetBuyer] = useState(
    poolModel.saleTargetEveryone.value
  )

  const saleEvent = poolModel.saleEvent

  const app = MonopolyApp.useInstance()

  const handleSaleButtonClick = () => {
    if (inputSalePrice > 0) {
      app.sendAssetSalePriceRequest(inputSalePrice, inputSaleTargetBuyer)
    }
    setInputSalePrice(0)
  }

  const handleSaleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ENTER_KEY_CODE) handleSaleButtonClick()
  }

  const handleSaleJudgeButtonClick = (result: Result) => {
    app.judgeAssetSaleRequest(result)
  }

  const handleSelectChange = (
    e: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    if (data.value) {
      setInputSaleTargetBuyer(data?.value as string)
    }
  }

  return (
    <>
      {saleEvent.isInTheMiddle ? (
        <Message info>
          {saleEvent.ownerPlayerId === poolModel.myId ? (
            <>
              <Message.Header>
                {poolModel.saleTargetAsset?.name}を売却交渉中
              </Message.Header>
              <Message.Content>
                <p>
                  いくらで{poolModel.saleTargetAsset?.name}
                  の売却を希望しますか？(1万円から売却可能です。)
                </p>
                {<p></p>}
              </Message.Content>
              {poolModel.isSaleTargetPanelMortgaged ? (
                <Message.Content>
                  抵当に入っているので、抵当に入ったままで売り渡します。
                </Message.Content>
              ) : null}
              <Message.Content>
                {poolModel.isSentSalePrice ? (
                  <p>
                    {poolModel.saleEvent.salePrice}
                    万円で売却を交渉しました。
                    {poolModel.saleEvent.targetBuyerId ===
                    poolModel.saleTargetEveryone.value
                      ? '他プレイヤー'
                      : poolModel.saleTargetBuyer?.userName}
                    の回答を待っています。
                  </p>
                ) : (
                  <>
                    <Dropdown
                      search
                      selection
                      options={poolModel.saleTargetBuyerList}
                      defaultValue={poolModel.saleTargetEveryone.value}
                      text={
                        inputSaleTargetBuyer ===
                        poolModel.saleTargetEveryone.value
                          ? poolModel.saleTargetEveryone.text
                          : poolModel.players[inputSaleTargetBuyer].userName
                      }
                      onChange={handleSelectChange}
                    />
                    に対して
                    <Input
                      focus
                      type="number"
                      placeholder="売却の金額(単位は万円)を入力"
                      value={inputSalePrice}
                      onChange={(e) => {
                        setInputSalePrice(parseInt(e.target.value, 10))
                      }}
                      onKeyDown={handleSaleKeyDown}
                    />
                    <Button color="blue" onClick={handleSaleButtonClick}>
                      決定
                    </Button>
                    <Button onClick={() => app.cancelAssetSaleRequest()}>
                      キャンセル
                    </Button>
                  </>
                )}
              </Message.Content>
            </>
          ) : null}
          {saleEvent.ownerPlayerId !== poolModel.myId ? (
            <>
              <Message.Header>
                {poolModel.saleTargetAssetOwnerPlayer?.userName}が
                {poolModel.saleTargetAsset?.name}
                の売却を交渉中
              </Message.Header>

              {poolModel.isSaleTargetPanelMortgaged ? (
                <Message.Content>
                  抵当に入っているので、抵当に入ったままで売り渡します。
                </Message.Content>
              ) : null}

              {poolModel.isSentSalePrice && poolModel.isSaleTarget ? (
                <>
                  <Message.Content>
                    {saleEvent.targetBuyerId ===
                    poolModel.saleTargetEveryone.value ? (
                      <>先に承認した人が売却を受け入れることができます。</>
                    ) : (
                      <>売却をあなたに持ちかけています。</>
                    )}
                    {saleEvent.salePrice}万円 での売却を受け入れますか？
                  </Message.Content>
                  <Message.Content>
                    <Button.Group>
                      <Button
                        color="green"
                        onClick={() => handleSaleJudgeButtonClick('accept')}
                      >
                        承認
                      </Button>
                      <Button
                        color="red"
                        onClick={() => {
                          handleSaleJudgeButtonClick('refuse')
                        }}
                      >
                        拒否
                      </Button>
                    </Button.Group>
                  </Message.Content>
                </>
              ) : null}
              {poolModel.isSentSalePrice && !poolModel.isSaleTarget ? (
                <Message.Content>
                  {poolModel.saleTargetAssetOwnerPlayer?.userName}は
                  {poolModel.saleTargetBuyer?.userName}
                  に売却を持ちかけています。
                </Message.Content>
              ) : null}
              {!poolModel.isSentSalePrice && (
                <Message.Content>
                  {poolModel.saleTargetAssetOwnerPlayer?.userName}
                  の入力を待っています。
                </Message.Content>
              )}
            </>
          ) : null}
        </Message>
      ) : null}
    </>
  )
}
