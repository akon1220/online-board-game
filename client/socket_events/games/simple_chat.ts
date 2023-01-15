import { eventCreator } from '../index'

export const messageSentRequestEvent = eventCreator<{
  body: string
  createdAt: Date
}>('simple-chat/message-sent-request')

export const messageChangeEvent = eventCreator<
  { user: string | undefined; body: string; createdAt: Date }[]
>('simple-chat/message-change-request')
