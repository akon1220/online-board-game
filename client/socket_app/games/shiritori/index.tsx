import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { ApplicationReturnStatus, SocketApp } from '@/socket_app/socket_app'
import { startGameEvent, endMyTurnEvent } from '@/socket_events/games/shiritori'
import {
  TurnBaseGameController,
  TurnBaseGameInterface,
} from '@/socket_app/mixin/turn_base_game'
import { App } from './components/App'

export class ShiritoriApp extends SocketApp implements TurnBaseGameInterface {
  private static Context = React.createContext<ShiritoriApp | undefined>(
    undefined
  )

  static Provider = ShiritoriApp.Context.Provider
  static useInstance = () => useContext(ShiritoriApp.Context)

  turn: TurnBaseGameController

  constructor() {
    super()
    this.turn = new TurnBaseGameController(this)
  }

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()
    await this.join('shiritori')

    ReactDOM.render(
      <ShiritoriApp.Provider value={this}>
        <App />
      </ShiritoriApp.Provider>,
      document.getElementById('playground-field')
    )

    const nextURL = await this.waitUntilGameEnded()
    this.sock.removeAllListeners()
    this.sock.close()
    return { nextURL }
  }

  startGame = () => {
    startGameEvent(this.sock).emit('')
  }

  endMyTurn = () => {
    endMyTurnEvent(this.sock).emit('')
  }

  onStartTurnBaseGame = () => {
    //
  }

  onEndTurnBaseGame = () => {
    //
  }

  onMyTurnStart = () => {
    //
  }

  onMyTurnEnd = () => {
    //
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).__PlaygroundAppClass = ShiritoriApp
