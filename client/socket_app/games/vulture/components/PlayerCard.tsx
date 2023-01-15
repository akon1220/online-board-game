import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { PoolContext } from '.'

type Props = {
  className?: string
  sessionUUId: string
}

export const PlayerCard: FC<Props> = (props) => {
  const classes = useStyles()
  const pool = useContext(PoolContext)
  return (
    <div
      className={[props.className, classes.card].join(' ')}
      data-selected={pool?.selectedCards[props.sessionUUId] !== undefined}
    >
      <div className={classes.name}>
        {pool?.members[props.sessionUUId].userName}
      </div>
      <div className={classes.score}>
        {pool?.members[props.sessionUUId].point}pt
      </div>
      <div className={classes.status}>
        {pool?.selectedCards[props.sessionUUId] === undefined
          ? '選択中'
          : '選択完了'}
      </div>
    </div>
  )
}
const useStyles = createUseStyles({
  '@global': {
    '@keyframes Selecting': {
      '0%': { backgroundColor: '#FFF29E' },
      '50%': { backgroundColor: '#FFE228' },
      '100%': { backgroundColor: '#FFF29E' },
    },
  },
  card: {
    border: '3px solid black',
    '&[data-selected=true]': {
      backgroundColor: '#E5FFE5',
    },
    '&[data-selected=false]': {
      animation: 'Selecting 1s ease infinite',
    },
  },
  name: {
    width: '100%',
    textAlign: 'center',
    fontSize: 'large',
    paddingTop: 6,
  },
  score: {
    width: '100%',
    fontFamily: 'Abril Fatface',
    textAlign: 'center',
    fontSize: 40,
    height: 50,
    lineHeight: '40px',
  },
  status: {
    fontSize: 'small',
    textAlign: 'center',
  },
})
