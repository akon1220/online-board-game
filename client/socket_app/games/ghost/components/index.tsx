import React, { FC, useState, useEffect, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { Pool } from '@/socket_events/games/ghost'
import { GhostApp } from '..'
import { SideMenu } from './SideMenu'
import { GameField } from './GameField'

export const PoolContext = React.createContext<Pool | undefined>(undefined)

export const GameView: FC = () => {
  const app = useContext(GhostApp.Context)
  const [pool, setPool] = useState<Pool | undefined>()
  const [acceptRate, setAcceptRate] = useState<number>(0)
  const classes = useStyles()

  useEffect(() => {
    app.onPoolInitialized = (pool: Pool) => {
      setPool(pool)
    }
    app.onPoolUpdated = (pool: Pool) => {
      setPool(pool)
    }
  }, [])
  useEffect(() => {
    const acceptCount =
      pool?.waitingMembers.filter((member) => member.isAccepted).length || 0
    const waitingCount = pool?.waitingMembers.length || 1
    setAcceptRate((acceptCount / waitingCount) * 100)
  }, [pool])

  return (
    <PoolContext.Provider value={pool}>
      <div>
        <GameField />
        <SideMenu />
      </div>
    </PoolContext.Provider>
  )
}

const useStyles = createUseStyles({})
