import Cookies from 'js-cookie'
import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { ApplicationReturnStatus, SocketApp } from '@/socket_app/socket_app'
import { App } from './components/App'
import {
  SyncDataPoolInterface,
  SyncDataPoolGameController,
} from '@/socket_app/mixin/sync_data_pool_game'
import { Pool } from '@/socket_events/games/catan/pool'

export class CatanApp extends SocketApp implements SyncDataPoolInterface<Pool> {
  private static Context = React.createContext<CatanApp>(null as any)
  static Provider = CatanApp.Context.Provider
  static useInstance = () => useContext(CatanApp.Context)

  sync: SyncDataPoolGameController<Pool>
  userName: string

  constructor() {
    super()
    this.userName = Cookies.get('user') || 'Guest'
    this.sync = new SyncDataPoolGameController(this)
  }

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    await this.join('catan')
    this.sync.subscribe()

    ReactDOM.render(
      <CatanApp.Provider value={this}>
        <App />
      </CatanApp.Provider>,
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).__PlaygroundAppClass = CatanApp
