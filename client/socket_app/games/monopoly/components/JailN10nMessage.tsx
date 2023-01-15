import React, { FC } from 'react'
import { Message, Button } from 'semantic-ui-react'
import { PoolModel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '..'

type Props = {
  poolModel: PoolModel
}

export const JailN10nMessage: FC<Props> = (props) => {
  const poolModel = props.poolModel

  const app = MonopolyApp.useInstance()
  return (
    <>
      {poolModel.isMyTurn &&
      poolModel.myPlayer.isInJail &&
      poolModel.isFirstDiceRolling ? (
        <Message info>
          <Message.Header>
            あなたは刑務所にいます。行動を選んでください。
          </Message.Header>
          <Message.Content>
            <Button.Group>
              <Button color="blue" onClick={() => app.rollDiceRequest()}>
                {poolModel.myPlayer.releaseJailTryCount + 1}回目のサイコロを回す
              </Button>
              <Button.Or />
              <Button
                color="blue"
                onClick={() => app.releaseJailWithMoneyRequest()}
              >
                50万円支払って刑務所から出る
              </Button>
            </Button.Group>
          </Message.Content>
        </Message>
      ) : null}
    </>
  )
}
