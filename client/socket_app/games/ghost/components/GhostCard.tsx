import React, { FC } from 'react'
import { createUseStyles } from 'react-jss'

type Props = {
  className?: string
}
// ゴーストのカードが重なっているところ
export const GhostCard: FC<Props> = (props) => {
  const classes = useStyles()
  return <div className="{props.className}"></div>
}

const useStyles = createUseStyles({})
