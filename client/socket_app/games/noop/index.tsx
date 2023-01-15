import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { ApplicationReturnStatus, SocketApp } from '@/socket_app/socket_app'
import { App } from './components/App'

export class NoopApp extends SocketApp {
  private static Context = React.createContext<NoopApp | undefined>(undefined)
  static Provider = NoopApp.Context.Provider
  static useInstance = () => useContext(NoopApp.Context)

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    await this.join('noop')

    ReactDOM.render(
      <NoopApp.Provider value={this}>
        <App />
      </NoopApp.Provider>,
      document.getElementById('playground-field')
    )

    const nextURL = await this.waitUntilGameEnded()
    this.sock.removeAllListeners()
    this.sock.close()
    return { nextURL }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).__PlaygroundAppClass = NoopApp
