import { eventCreator } from '../..'

export const startGameEvent = eventCreator('word-wolf/start-game')

export const finishDiscussionEvent = eventCreator('word-wolf/finish-chat')

export const finishVoteEvent = eventCreator<{ votedUuid: string }>(
  'word-wolf/finish-vote'
)
