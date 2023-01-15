import ReactDOM from 'react-dom'
import React, { useContext } from 'react'
import { ApplicationReturnStatus, SocketApp } from '@/socket_app/socket_app'
import {
  roleSetEvent,
  challengeFetchRequestEvent,
  messageSentRequestEvent,
  messageChangeEvent,
  replyMessageSentRequestEvent,
  USER_ENTER_MESSAGE,
  changeChallengeRequestEvent,
  showAnswerRequestEvent,
  hideAnswerRequestEvent,
} from '@/socket_events/games/sea_turtle_soup'
import { App } from './components/App'

export class SeaTurtleSoupApp extends SocketApp {
  private static Context = React.createContext<SeaTurtleSoupApp | undefined>(
    undefined
  )

  static Provider = SeaTurtleSoupApp.Context.Provider

  static useInstance = () => useContext(SeaTurtleSoupApp.Context)

  exec = async (): Promise<ApplicationReturnStatus> => {
    await this.openSock()

    ReactDOM.render(
      <SeaTurtleSoupApp.Provider value={this}>
        <App />
      </SeaTurtleSoupApp.Provider>,
      document.getElementById('playground-field')
    )

    roleSetEvent(this.sock).handle(this.updateRole)
    messageChangeEvent(this.sock).handle(this.updateMessage)
    challengeFetchRequestEvent(this.sock).handle(this.updateChallenge)
    showAnswerRequestEvent(this.sock).handle(() =>
      this.updateAnswerDisplay(true)
    )
    hideAnswerRequestEvent(this.sock).handle(() =>
      this.updateAnswerDisplay(false)
    )

    await this.join('sea_turtle_soup')

    this.messageSentRequest(USER_ENTER_MESSAGE)

    const nextURL = await this.waitUntilGameEnded()
    this.sock.removeAllListeners()
    this.sock.close()
    return { nextURL }
  }

  messageSentRequest = (body: string) => {
    const createdAt = new Date()
    messageSentRequestEvent(this.sock).emit({ body, createdAt })
  }

  replyMessageSentRequest = (
    body: string,
    createdAt: Date,
    replyMessageBody: string
  ) => {
    const replyMessageCreatedAt = new Date()
    replyMessageSentRequestEvent(this.sock).emit({
      body,
      createdAt,
      replyMessage: {
        body: replyMessageBody,
        createdAt: replyMessageCreatedAt,
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateRole = (role: 'questioner' | 'answerer') => {
    // be empty
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateChallenge = (challenge: {
    title: string
    question: string
    answer: string
    imageUrl: string
    questionExamples: string[]
    hintExamples: string[]
  }) => {
    // be empty
  }

  updateMessage = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageList: {
      user: string | undefined
      role: 'answerer' | 'questioner'
      body: string
      createdAt: Date
      replyMessages: {
        user: string | undefined
        role: 'answerer' | 'questioner'
        body: string
        createdAt: Date
      }[]
    }[]
  ) => {
    // be empty
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAnswerDisplay = (isDisplayed: boolean) => {
    // be empty
  }

  changeChallengeRequest = () => {
    changeChallengeRequestEvent(this.sock).emit('')
  }

  showAnswerRequest = () => {
    showAnswerRequestEvent(this.sock).emit('')
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).__PlaygroundAppClass = SeaTurtleSoupApp
