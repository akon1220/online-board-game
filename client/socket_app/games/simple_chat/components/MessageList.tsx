import React, { useState } from 'react'
import { Comment } from 'semantic-ui-react'
import dayjs from 'dayjs'
import { SimpleChatApp } from '../index'

export const MessageList = () => {
  const [messageList, setMessageList] = useState<
    {
      user: string | undefined
      body: string
      createdAt: Date
    }[]
  >([])
  const context = SimpleChatApp.useInstance()
  if (context) {
    context.updateMessage = (messages) => {
      setMessageList(messages)
    }
  }
  const formatMessageCreatedAt = (createdAt: Date) => {
    return dayjs(createdAt).locale('ja').format('YYYY/MM/DD HH:mm:ss')
  }
  return (
    <Comment.Group minimal>
      {messageList.map((message, idx) => (
        <Comment key={message.user + message.body + idx}>
          {/* <Comment.Avatar as="a" src="/images/avatar/small/matt.jpg" /> */}
          <Comment.Content>
            <Comment.Author as="a">{message.user}</Comment.Author>
            <Comment.Metadata>
              <span>{formatMessageCreatedAt(message.createdAt)}</span>
            </Comment.Metadata>
            <Comment.Text>{message.body}</Comment.Text>
          </Comment.Content>
        </Comment>
      ))}
    </Comment.Group>
  )
}
