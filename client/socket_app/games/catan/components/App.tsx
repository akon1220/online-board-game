import React, { FC, useState, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import { Pool } from '@/socket_events/games/catan/pool'
import { endMemberWaitingPhaseEvent } from '@/socket_events/games/catan/events'
import { CatanApp } from '..'

export const App: FC = () => {
  const app = CatanApp.useInstance()
  const [pool, setPool] = useState<Pool | undefined>(undefined)
  useEffect(() => {
    app.onPoolInitialized = (pool: Pool) => setPool(pool)
    app.onPoolUpdated = (pool: Pool) => setPool(pool)
    app.sync.refreshRequest()
  }, [])

  return (
    <Container>
      <h1>Hello, Catan!</h1>
      <button className="ui red button" onClick={app.endGameRequest}>
        ゲームを終了
      </button>
      <button
        className="ui blue button"
        onClick={() => endMemberWaitingPhaseEvent(app.sock).emit('')}
      >
        メンバーを確定
      </button>
      <h2>{pool?.phase}</h2>
      {pool?.members.map((member) => (
        <ul key={member.uuid}>
          <li>
            {member.uuid}
            <ul>
              <li>name: {member.name}</li>
              <li>type: {member.type}</li>
              <li>online: {member.isOnline ? 'yes' : 'false'}</li>
            </ul>
          </li>
        </ul>
      ))}
    </Container>
  )
}
