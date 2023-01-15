import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { HandCard } from './HandCard'
import { PoolContext } from '.'

type Props = {
  className?: string
}

export const OpenCardField: FC<Props> = (props) => {
  const pool = useContext(PoolContext)
  const classes = useStyles()
  return (
    <div className={[props.className, classes.container].join(' ')}>
      <div className={classes.field}>
        {pool?.members === undefined
          ? null
          : Object.keys(pool.members).map((sessionUUID) => (
              <div key={sessionUUID} className={classes.playerFieldContainer}>
                <div className={classes.playerField}>
                  <div className={classes.playerName}>
                    {pool.members[sessionUUID].userName}
                  </div>
                  <div className={classes.playerCard}>
                    {pool.field[sessionUUID] ? (
                      <HandCard
                        number={pool.field[sessionUUID]}
                        className={classes.handCard}
                      />
                    ) : pool.selectedCards[sessionUUID] ? (
                      <HandCard className={classes.handCard} />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  container: {
    width: '70%',
    maxWidth: 'calc(100% - 360px)',
    height: 250,
    borderRadius: 30,
    backgroundColor: 'rgba(256, 256, 256, 0.1)',
  },
  field: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  playerFieldContainer: {
    display: 'flex',
    width: 100,
    height: 200,
  },
  playerField: {
    position: 'absolute',
    width: 100,
    height: 200,
    top: 0,
    bottom: 0,
    margin: 'auto',
  },
  playerName: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 'large',
    color: 'black',
    top: 10,
    backgroundColor: 'rgba(256,256,256,0.7)',
    height: 25,
    lineHeight: '25px',
    borderRadius: 3,
  },
  playerCard: {
    position: 'absolute',
    bottom: 15,
    right: 0,
    left: 0,
    margin: 'auto',
    width: 80,
    height: 130,
  },
  handCard: {
    width: 80,
    height: 130,
  },
})
