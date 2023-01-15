import React, { FC } from 'react'
import { Card } from 'semantic-ui-react'
import { PoolModel } from '@/socket_events/games/monopoly/pool'
import { UserInfoCard } from './UserInfoCard'

export type Props = {
  poolModel: PoolModel
  diffMoneyAmountList: {
    [playerId: string]: number
  }
}

export const UserList: FC<Props> = ({ poolModel, diffMoneyAmountList }) => {
  return (
    <>
      <Card>
        <Card.Content>
          {poolModel.playerListArray.map((player, idx) => (
            <UserInfoCard
              key={player.id}
              idx={idx}
              player={player}
              poolModel={poolModel}
              diffMoneyAmountList={diffMoneyAmountList}
            />
          ))}
        </Card.Content>
      </Card>
    </>
  )
}
