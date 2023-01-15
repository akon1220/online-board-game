import Cookies from 'js-cookie'
import React from 'react'
import ReactDOM from 'react-dom'
import { ApplicationReturnStatus, SocketApp } from '@/socket_app/socket_app'
import {
  SyncDataPoolGameController,
  SyncDataPoolInterface,
} from '@/socket_app/mixin/sync_data_pool_game'
import {
  Pool,
  startGameEvent,
  selectCardEvent,
} from '@/socket_events/games/vulture'
import { GameView } from './components'

export class VultureApp extends SocketApp
  implements SyncDataPoolInterface<Pool> {
  sync: SyncDataPoolGameController<Pool>
  userName: string

  constructor() {
    super()
    this.userName = Cookies.get('user') || 'Guest'
    this.sync = new SyncDataPoolGameController(this)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static Context = React.createContext<VultureApp>(null as any)

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    await this.join('vulture')

    ReactDOM.render(
      <VultureApp.Context.Provider value={this}>
        <GameView />
      </VultureApp.Context.Provider>,
      document.getElementById('playground-field')
    )

    this.sync.subscribe()

    const nextURL = await this.waitUntilGameEnded()
    this.sock.removeAllListeners()
    this.sock.close()
    return { nextURL }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPoolInitialized = (pool: Pool) => {
    // be empty
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPoolUpdated = (pool: Pool) => {
    // be empty
  }

  startGame = () => {
    startGameEvent(this.sock).emit('')
  }

  selectCard = (num: number) => {
    selectCardEvent(this.sock).emit(num)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).__PlaygroundAppClass = VultureApp
