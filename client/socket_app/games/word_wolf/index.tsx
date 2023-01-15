import Cookies from 'js-cookie'
import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { ApplicationReturnStatus, SocketApp } from '@/socket_app/socket_app'
import { App } from './components/App'
import {
  startGameEvent,
  finishDiscussionEvent,
  finishVoteEvent,
} from '@/socket_events/games/word_wolf/event'
import {
  SyncDataPoolInterface,
  SyncDataPoolGameController,
} from '@/socket_app/mixin/sync_data_pool_game'
import { Pool } from '@/socket_events/games/word_wolf/pool'

export class WordWolfApp extends SocketApp
  implements SyncDataPoolInterface<Pool> {
  private static Context = React.createContext<WordWolfApp>(null as any)
  static Provider = WordWolfApp.Context.Provider
  static useInstance = () => useContext(WordWolfApp.Context)

  sync: SyncDataPoolGameController<Pool>
  userName: string

  constructor() {
    super()
    this.userName = Cookies.get('user') || 'Guest'
    this.sync = new SyncDataPoolGameController(this)
  }

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    await this.join('word_wolf')
    this.sync.subscribe()

    ReactDOM.render(
      <WordWolfApp.Provider value={this}>
        <App />
      </WordWolfApp.Provider>,
      document.getElementById('playground-field')
    )

    const nextURL = await this.waitUntilGameEnded()
    this.sock.removeAllListeners()
    this.sock.close()
    return { nextURL }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPoolInitialized = (pool: Pool) => {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPoolUpdated = (pool: Pool) => {
    // be empty
  }

  startGameRequest = () => {
    startGameEvent(this.sock).emit('')
  }

  finishDiscussionRequest = () => {
    finishDiscussionEvent(this.sock).emit('')
  }

  finishVoteRequest = (votedUuid: string) => {
    finishVoteEvent(this.sock).emit({ votedUuid })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).__PlaygroundAppClass = WordWolfApp
