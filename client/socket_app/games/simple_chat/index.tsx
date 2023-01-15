import ReactDOM from 'react-dom'
import React, { useContext } from 'react'
import { ApplicationReturnStatus, SocketApp } from '@/socket_app/socket_app'
import {
  messageSentRequestEvent,
  messageChangeEvent,
} from '@/socket_events/games/simple_chat'
import { App } from './components/App'

export class SimpleChatApp extends SocketApp {
  private static Context = React.createContext<SimpleChatApp | undefined>(
    undefined
  )

  static Provider = SimpleChatApp.Context.Provider

  static useInstance = () => useContext(SimpleChatApp.Context)

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    ReactDOM.render(
      <SimpleChatApp.Provider value={this}>
        <App />
      </SimpleChatApp.Provider>,
      document.getElementById('playground-field')
    )

    messageChangeEvent(this.sock).handle(this.updateMessage)

    await this.join('simple_chat')

    const nextURL = await this.waitUntilGameEnded()
    this.sock.removeAllListeners()
    this.sock.close()
    return { nextURL }
  }

  messageSentRequest = (body: string) => {
    const createdAt = new Date()
    messageSentRequestEvent(this.sock).emit({ body, createdAt })
  }

  updateMessage = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageList: { user: string | undefined; body: string; createdAt: Date }[]
  ) => {
    // be empty
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).__PlaygroundAppClass = SimpleChatApp
