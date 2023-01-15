import React, { FC } from 'react'
import { PoolModel } from '@/socket_events/games/monopoly/pool'

type Props = {
  poolModel: PoolModel | undefined
}

export const BoardField: FC<Props> = ({ poolModel }) => {
  const isShownGameBoard = poolModel?.isGameStarted
  return (
    <>
      <div
        style={{
          textAlign: 'center',
          display: isShownGameBoard ? 'block' : 'none',
        }}
      >
        <div id="board-field"></div>
      </div>
    </>
  )
}
