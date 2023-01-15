import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { PoolContext } from '.'

// カードが見えてくるところ
export const GhostRevealedCard: FC = () => {
  const classes = useStyles()
  const pool = useContext(PoolContext)
  return <div></div>
}

const useStyles = createUseStyles({})
