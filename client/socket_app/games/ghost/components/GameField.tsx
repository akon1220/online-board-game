import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { PoolContext } from '.'
import { OpenItemField } from './OpenItemField'
import { GhostCard } from './GhostCard'
import { GhostRevealedCard } from './GhostRevealedCard'

type Props = {
  className?: string
}
// フィールド画面全般
export const GameField: FC<Props> = (props) => {
  const classes = useStyles()
  const pool = useContext(PoolContext)

  return (
    <div className="{props.className}">
      <GhostCard />
      <GhostRevealedCard />
      <OpenItemField />
    </div>
  )
}
const useStyles = createUseStyles({})
