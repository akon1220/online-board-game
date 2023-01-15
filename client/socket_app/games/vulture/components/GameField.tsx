import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { VultureCard } from './VultureCard'
import { OpenCardField } from './OpenCardField'
import { PoolContext } from '.'

type Props = {
  className?: string
}

export const GameField: FC<Props> = (props) => {
  const classes = useStyles()
  const pool = useContext(PoolContext)
  return (
    <div className={props.className}>
      <div className={classes.bg}></div>
      <div className={classes.vultureCardField}>
        {typeof pool?.vultureCard === 'number' ? (
          <VultureCard
            number={pool.vultureCard}
            className={classes.vultureCard}
          />
        ) : null}
      </div>
      <OpenCardField className={classes.openCardField} />
    </div>
  )
}

const useStyles = createUseStyles({
  bg: {
    position: 'absolute',
    backgroundImage: 'url("/assets/vulture/night-city.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
    filter: 'blur(8px)',
  },
  vultureCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 130,
    height: 200,
    boxShadow: '3px 3px 5px black',
  },
  openCardField: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
  },
  vultureCardField: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 180,
    height: 250,
    backgroundColor: 'rgba(256, 256, 256, 0.1)',
    borderBottomRightRadius: 30,
  },
})
