import React, { FC, useState } from 'react'
import { Segment, Card, Header, Icon, Button, Table } from 'semantic-ui-react'

import { EndGameButton } from './EndGameButton'
import { DiceDisplayPanel } from './DiceDisplayPanel'
import { PoolModel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '..'
import { assetList } from '@/socket_events/games/monopoly/assetList.data'
import { styleTheme } from '../style_theme'
import { ShowGameRuleButton } from './ShowGameRuleButton'
import { GameResultModal } from './GameResultModal'

type Props = {
  poolModel: PoolModel
}

export const ControlPanel: FC<Props> = (props) => {
  const [isDiceRollingButtonEnabled, setIsDiceRollingButtonEnabled] = useState(
    true
  )

  const poolModel = props.poolModel

  const app = MonopolyApp.useInstance()

  const handleDiceButtonClick = () => {
    app.rollDiceRequest()
    setIsDiceRollingButtonEnabled(false)
    setTimeout(() => setIsDiceRollingButtonEnabled(true), 2500)
  }
  return (
    <>
      <Segment
        style={{
          backgroundColor: poolModel.isMyTurn
            ? `#${styleTheme.backgroundColor.toString(16)}`
            : `#${styleTheme.subBackgroundColor.toString(16)}`,
        }}
      >
        <Card>
          <Card.Content>
            <Header>
              {poolModel.isMyTurn ? (
                <>
                  <Icon
                    name="car"
                    style={{
                      color: `#${poolModel.currentTurnPlayer?.colorCode.toString(
                        16
                      )}`,
                    }}
                  />
                  あなたのターン
                </>
              ) : (
                <>
                  <Icon
                    name="car"
                    style={{
                      color: `#${poolModel.currentTurnPlayer?.colorCode.toString(
                        16
                      )}`,
                    }}
                  />
                  {`${poolModel.currentTurnPlayer?.userName}のターン`}
                </>
              )}
            </Header>
          </Card.Content>
          {poolModel.isMyTurn && !poolModel.canTurnFinish ? (
            <Card.Content>
              <p>必要なアクションを終えるまでターン終了できません。</p>
              <Button color="blue" disabled>
                ターンを終える
              </Button>
            </Card.Content>
          ) : null}
          {poolModel.canTurnFinish ? (
            <Card.Content>
              {isDiceRollingButtonEnabled ? (
                <Button color="blue" onClick={() => app.endMyTurn()}>
                  ターンを終える
                </Button>
              ) : null}
            </Card.Content>
          ) : null}
          {!poolModel.isMyTurn ? (
            <Card.Content>
              <Button color="blue" disabled>
                ターンを終える
              </Button>
            </Card.Content>
          ) : null}
          <Card.Content>
            <Header>サイコロの結果</Header>
          </Card.Content>
          {poolModel.canRollDice ? (
            <Card.Content>
              {isDiceRollingButtonEnabled ? (
                <Button color="blue" onClick={handleDiceButtonClick}>
                  サイコロを回す
                </Button>
              ) : (
                <Card.Content>
                  <Button color="blue" disabled>
                    サイコロを回す
                  </Button>
                </Card.Content>
              )}
            </Card.Content>
          ) : null}
          {!poolModel.canRollDice ? (
            <Card.Content>
              <Button color="blue" disabled>
                サイコロを回す
              </Button>
            </Card.Content>
          ) : null}
          <Card.Content>
            <DiceDisplayPanel poolModel={poolModel} />
          </Card.Content>
        </Card>
      </Segment>
      <Segment>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>資産色</Table.HeaderCell>
              <Table.HeaderCell>資産名</Table.HeaderCell>
              <Table.HeaderCell>定価</Table.HeaderCell>
              <Table.HeaderCell>通行料</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {poolModel.myAssetList.map((myAsset, idx) => {
              if (myAsset.type === 'asset') {
                return (
                  <Table.Row key={myAsset.assetId + idx}>
                    <Table.Cell
                      style={{
                        backgroundColor: `#${poolModel
                          .getAssetColor(myAsset.assetId)
                          ?.toString(16)}`,
                      }}
                    >{`  `}</Table.Cell>
                    <Table.Cell>{assetList[myAsset.assetId].name}</Table.Cell>
                    <Table.Cell>{assetList[myAsset.assetId].price}</Table.Cell>
                    <Table.Cell>
                      {poolModel.calculateAssetToll(
                        poolModel.myId,
                        myAsset.assetId
                      )}
                    </Table.Cell>
                  </Table.Row>
                )
              }
            })}
          </Table.Body>
        </Table>
      </Segment>
      <Segment>
        <GameResultModal poolModel={poolModel} />
        <ShowGameRuleButton />
        <EndGameButton />
      </Segment>
    </>
  )
}
