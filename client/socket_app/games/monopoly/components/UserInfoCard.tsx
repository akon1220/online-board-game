import React, { FC, useState } from 'react'
import { Card, Header, Icon, Accordion, Table } from 'semantic-ui-react'
import { styleTheme } from '../style_theme'
import { assetList } from '@/socket_events/games/monopoly/assetList.data'
import { PoolModel } from '@/socket_events/games/monopoly/pool'

type Props = {
  idx: number
  player: {
    isAuctionJoined: boolean
    userName: string
    position: number
    isInJail: boolean
    releaseJailTryCount: number
    moneyAmount: number
    colorCode: number
    turnIndex: number
    auctionPrice: number | null
    id: string
  }
  poolModel: PoolModel
  diffMoneyAmountList: {
    [playerId: string]: number
  }
}

export const UserInfoCard: FC<Props> = ({
  idx,
  player,
  poolModel,
  diffMoneyAmountList,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  return (
    <Card
      fluid
      key={player.userName + player.turnIndex}
      style={{
        backgroundColor:
          poolModel.currentTurnPlayerId === player.id
            ? `#${styleTheme.backgroundColor.toString(16)}`
            : `#${styleTheme.subBackgroundColor.toString(16)}`,
      }}
    >
      <Card.Content>
        <Header>
          {player.turnIndex}
          <Icon
            name="car"
            style={{
              color: `#${player.colorCode.toString(16)}`,
            }}
          />
          {player.userName}
        </Header>
      </Card.Content>
      <Card.Content>
        <Header as="h4">
          <Icon name="money bill alternate" />
          {diffMoneyAmountList[player.id]
            ? `${player.moneyAmount - diffMoneyAmountList[player.id]} ${
                diffMoneyAmountList[player.id] > 0
                  ? '+' + diffMoneyAmountList[player.id]
                  : diffMoneyAmountList[player.id]
              }`
            : `${player.moneyAmount}`}
          万円
        </Header>
      </Card.Content>
      <Accordion
        styled
        style={{
          backgroundColor:
            poolModel.currentTurnPlayerId === player.id
              ? `#${styleTheme.backgroundColor.toString(16)}`
              : `#${styleTheme.subBackgroundColor.toString(16)}`,
        }}
      >
        <Accordion.Title
          active={activeIndex === idx}
          index={idx}
          onClick={() =>
            activeIndex === idx
              ? setActiveIndex(undefined)
              : setActiveIndex(idx)
          }
        >
          <Icon name="dropdown" />
          資産一覧
        </Accordion.Title>
        <Accordion.Content active={activeIndex === idx}>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>資産色</Table.HeaderCell>
                <Table.HeaderCell>資産名</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {poolModel.playerAssets[player.id].map((asset, idx) => {
                if (asset.type === 'asset') {
                  return (
                    <Table.Row key={asset.assetId + idx}>
                      <Table.Cell
                        style={{
                          backgroundColor: `#${poolModel
                            .getAssetColor(asset.assetId)
                            ?.toString(16)}`,
                        }}
                      >{`  `}</Table.Cell>
                      <Table.Cell>{assetList[asset.assetId].name}</Table.Cell>
                    </Table.Row>
                  )
                }
              })}
            </Table.Body>
          </Table>
        </Accordion.Content>
      </Accordion>
    </Card>
  )
}
