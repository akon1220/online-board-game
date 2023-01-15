import { eventCreator } from '../index'

export const USER_ENTER_MESSAGE = '入室しました。'

export const roleSetEvent = eventCreator<'questioner' | 'answerer'>(
  'sea-turtle-soup/role-set'
)

export const changeChallengeRequestEvent = eventCreator(
  'sea-turtle-soup/change-challenge-request'
)

export const showAnswerRequestEvent = eventCreator(
  'sea-turtle-soup/show-answer-request'
)

export const hideAnswerRequestEvent = eventCreator(
  'sea-turtle-soup/hide-answer-request'
)

export const challengeFetchRequestEvent = eventCreator<{
  title: string
  question: string
  answer: string
  imageUrl: string
  questionExamples: string[]
  hintExamples: string[]
}>('sea-turtle-soup/challenge-fetch-request')

export const messageSentRequestEvent = eventCreator<{
  body: string
  createdAt: Date
}>('sea-turtle-soup/message-sent-request')

export const messageChangeEvent = eventCreator<
  {
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
>('sea-turtle-soup/message-change-request')

export const replyMessageSentRequestEvent = eventCreator<{
  body: string
  createdAt: Date
  replyMessage: {
    body: string
    createdAt: Date
  }
}>('sea-turtle-soup/reply-message-sent-request')
