import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { PoolContext } from '.'

type Props = {
  className?: string
}
// Item を５つくらい置くところ
export const OpenItemField: FC<Props> = (props) => {
  const classes = useStyles()
  const pool = useContext(PoolContext)
  return <div></div>
}

const useStyles = createUseStyles({})
