import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { HandCard } from './HandCard'
import { PoolContext } from '.'
import { VultureApp } from '..'

type Props = {
  className?: string
}

export const HandCardField: FC<Props> = (props) => {
  const classes = useStyles()
  const app = useContext(VultureApp.Context)
  const pool = useContext(PoolContext)
  const me = pool?.myId
  const handCards = me === undefined ? undefined : pool?.handCards[me]
  const selectedCard = me === undefined ? undefined : pool?.selectedCards[me]
  return (
    <div className={props.className}>
      <div className={classes.bg}>
        <div className={classes.bgChip}></div>
        <div className={classes.chip}>手札</div>
      </div>
      <div className={classes.cardListContainer}>
        <div className={classes.cardList}>
          {handCards?.map((c) => (
            <HandCard
              className={classes.card}
              number={c}
              key={c}
              onClick={app.selectCard}
              isSelected={selectedCard === c}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  '@global': {
    body: {
      overscrollBehavior: 'contain', // Chromeで右スクロールでブラウザバックが暴発しないために必要
    },
  },
  bg: {
    position: 'absolute',
    backgroundColor: '#002071',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  chip: {
    top: -28,
    left: 40,
    position: 'absolute',
    fontSize: 25,
    color: 'white',
  },
  bgChip: {
    position: 'absolute',
    top: -40,
    borderRight: '40px solid transparent',
    borderBottom: '40px solid #002071',
    width: 160,
  },
  cardListContainer: {
    position: 'absolute',
    width: 'calc(100% - 20px)',
    height: 'calc(100% - 20px)',
    overflowX: 'scroll',
    top: 15,
    left: 10,
  },
  cardList: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
  },
  card: {
    position: 'relative',
    height: '100%',
    width: 80,
    margin: '0 10px',
  },
})
