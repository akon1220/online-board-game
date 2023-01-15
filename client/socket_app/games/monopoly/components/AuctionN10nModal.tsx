import React, { FC } from 'react'
import { Modal, List, Button } from 'semantic-ui-react'
import { PoolModel } from '@/socket_events/games/monopoly/pool'

type Props = {
  poolModel: PoolModel
  isAuctionResultMessageOpen: boolean
  setIsAuctionResultMessageOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuctionN10nModal: FC<Props> = (props) => {
  const poolModel = props.poolModel

  return (
    <>
      <Modal
        open={props.isAuctionResultMessageOpen && poolModel.hasAuctionResult}
        size="small"
      >
        <Modal.Header>
          {poolModel.auctionTargetAsset?.name + 'のオークション結果'}
        </Modal.Header>
        <Modal.Content>
          <List ordered>
            {poolModel.auctionResult.map((player) => (
              <List.Item key={player.userName + player.rank}>
                {player.userName + ': ' + player.auctionPrice + '万円 '}
                {player.rank === 1 ? <>勝者</> : null}
              </List.Item>
            ))}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            icon="checkmark"
            labelPosition="right"
            content="閉じる"
            onClick={() => {
              props.setIsAuctionResultMessageOpen(false)
            }}
          />
        </Modal.Actions>
      </Modal>
    </>
  )
}
