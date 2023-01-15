import React, { useState } from 'react'
import { WordWolfApp } from '..'
import { StartGame } from './StartGame'
import { Chat } from './Discussion'
import { Vote } from './Vote'
import { Result } from './Result'
import { Pool, Phase, initialPool } from '@/socket_events/games/word_wolf/pool'

export const App = () => {
  const [pool, setPool] = useState<Pool>(initialPool)
  const app = WordWolfApp.useInstance()

  app.onPoolUpdated = (newPool: Pool) => {
    setPool(newPool)
  }

  const func = (pool: Pool, phase: Phase) => {
    switch (phase) {
      case 'start':
        return <StartGame />
      case 'discussion':
        return <Chat pool={pool} />
      case 'vote':
        return <Vote pool={pool} />
      case 'result':
        return <Result pool={pool} />
    }
  }
  return <>{pool.phase ? func(pool, pool.phase) : null}</>
}
