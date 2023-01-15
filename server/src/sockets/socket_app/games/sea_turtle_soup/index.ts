import socket from 'socket.io'
import Session from '../../../session'
import {
  roleSetEvent,
  challengeFetchRequestEvent,
  messageSentRequestEvent,
  messageChangeEvent,
  replyMessageSentRequestEvent,
  showAnswerRequestEvent,
  hideAnswerRequestEvent,
  changeChallengeRequestEvent,
} from '../../../socket_events/games/sea_turtle_soup'
import { SocketApp } from '../socket_app'
import { challengeList } from './challenge_list'

export class SeaTurtleSoupGameApp extends SocketApp {
  static id = 'sea_turtle_soup'

  private static instances: { [key: string]: SeaTurtleSoupGameApp } = {}

  static push = (app: SeaTurtleSoupGameApp) => {
    SeaTurtleSoupGameApp.instances[app.uuid] = app
  }

  static search = (uuid: string): SeaTurtleSoupGameApp | undefined => {
    return SeaTurtleSoupGameApp.instances[uuid]
  }

  static delegate = (sock: socket.Socket, uuid: string) => {
    const game = SeaTurtleSoupGameApp.search(uuid)
    game?.accept(sock)
  }

  messages: {
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
  }[] = []

  challenge: {
    title: string
    question: string
    answer: string
    imageUrl: string
    questionExamples: string[]
    hintExamples: string[]
  } = {
    title: '',
    question: '',
    answer: '',
    imageUrl: '',
    questionExamples: [],
    hintExamples: [],
  }

  isGameEnded = false

  questionerUser: { userName: string | undefined } = { userName: undefined }

  constructor(backRoomId: string) {
    super(backRoomId)
    SeaTurtleSoupGameApp.push(this)
  }

  onConnect = (session: Session) => {
    if (session.sock === undefined) return
    if (this.isChallengeEmpty()) {
      this.setChallenge()
    }
    if (this.questionerUser.userName === undefined) {
      this.setQuestionerUser(session.userName)
    }
    roleSetEvent(session.sock).emit(this.setRole(session))
    challengeFetchRequestEvent(session.sock).emit(this.challenge)
    messageSentRequestEvent(session.sock).handle((payload) =>
      this.updateMessage({
        ...payload,
        user: session.userName,
        role: this.setRole(session),
        replyMessages: [],
      })
    )
    replyMessageSentRequestEvent(session.sock).handle((payload) =>
      this.updateReplyMessage({
        ...payload,
        replyUser: session.userName,
        replyUserRole: this.setRole(session),
      })
    )
    messageChangeEvent(session.sock).emit(this.messages)
    showAnswerRequestEvent(session.sock).handle(() =>
      this.updateAnswerDisplay(true)
    )
    changeChallengeRequestEvent(session.sock).handle(this.changeChallenge)
  }

  onReconnect = this.onConnect

  onEndGame = () => {
    this.back2Room(SeaTurtleSoupGameApp.id)
    delete SeaTurtleSoupGameApp.instances[this.uuid]
  }

  onDisconnect = (session: Session) => {
    this.remove(session)
    this.ifEmptyForAWhileDo(() => {
      delete SeaTurtleSoupGameApp.instances[this.uuid]
    })
  }

  private setRole = (session: Session) => {
    if (session.userName === this.questionerUser.userName) {
      return 'questioner'
    } else {
      return 'answerer'
    }
  }

  private isChallengeEmpty = () => {
    return (
      this.challenge.title === '' &&
      this.challenge.question === '' &&
      this.challenge.answer === ''
    )
  }

  private setQuestionerUser = (userName: string) => {
    this.questionerUser.userName = userName
  }

  private setChallenge = () => {
    this.challenge =
      challengeList[Math.floor(Math.random() * challengeList.length)]
  }

  private updateReplyMessage = ({
    body,
    createdAt,
    replyUser,
    replyUserRole,
    replyMessage,
  }: {
    body: string
    createdAt: Date
    replyUser: string
    replyUserRole: 'questioner' | 'answerer'
    replyMessage: {
      body: string
      createdAt: Date
    }
  }) => {
    this.messages.some((message) => {
      if (message.createdAt === createdAt && message.body === body) {
        message.replyMessages.push({
          user: replyUser,
          role: replyUserRole,
          body: replyMessage.body,
          createdAt: replyMessage.createdAt,
        })
        return 0
      }
    })
    // this.messages.push({ user, role, body, createdAt, replyMessages })
    this.forEach((sess) => {
      if (sess.sock) messageChangeEvent(sess.sock).emit(this.messages)
    })
  }

  private updateMessage = ({
    user,
    role,
    body,
    createdAt,
    replyMessages,
  }: {
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
  }) => {
    this.messages.push({ user, role, body, createdAt, replyMessages })
    this.forEach((sess) => {
      if (sess.sock) messageChangeEvent(sess.sock).emit(this.messages)
    })
  }

  private updateAnswerDisplay = (isDisplayed: boolean) => {
    this.forEach((sess) => {
      if (sess.sock)
        isDisplayed
          ? showAnswerRequestEvent(sess.sock).emit('')
          : hideAnswerRequestEvent(sess.sock).emit('')
    })
  }

  private changeChallenge = () => {
    this.setChallenge()

    const sessionList = Object.keys(this.sessions).map(
      (key) => this.sessions[key]
    )
    const newQuestionerSession =
      sessionList[Math.floor(Math.random() * sessionList.length)]
    this.setQuestionerUser(newQuestionerSession.userName)

    this.updateAnswerDisplay(false)

    this.forEach((sess) => {
      if (sess.sock) {
        challengeFetchRequestEvent(sess.sock).emit(this.challenge)
        roleSetEvent(sess.sock).emit(this.setRole(sess))
        messageChangeEvent(sess.sock).emit([])
      }
    })
  }
}
