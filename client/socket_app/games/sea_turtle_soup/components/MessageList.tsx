import React, { FC, useState, useEffect } from 'react'
import { Comment, Popup, Button } from 'semantic-ui-react'
import dayjs from 'dayjs'
import { SeaTurtleSoupApp } from '../index'
import answererAvatar from './images/answerer.jpg'
import questionerAvatar from './images/questioner.jpg'
import { USER_ENTER_MESSAGE } from '@/socket_events/games/sea_turtle_soup'
import { gameStyleTheme } from '../style_theme'

type Props = {
  role: 'answerer' | 'questioner'
}

export const MessageList: FC<Props> = (props) => {
  const [messageList, setMessageList] = useState<
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
  >([])
  const context = SeaTurtleSoupApp.useInstance()
  if (context) {
    context.updateMessage = (messages) => {
      setMessageList(messages)
    }
    context
  }
  const formatMessageCreatedAt = (createdAt: Date) => {
    return dayjs(createdAt).locale('ja').format('YYYY/MM/DD HH:mm:ss')
  }
  const handleReplyMessageClick = (
    body: string,
    createdAt: Date,
    replyBody: string
  ) => {
    context?.replyMessageSentRequest(body, createdAt, replyBody)
  }
  useEffect(() => {
    const element = document.getElementById('commentList')
    if (element) {
      const bottom = element.scrollHeight - element.clientHeight
      element.scrollTop = bottom
    }
  })

  return (
    <Comment.Group minimal>
      {messageList.map((message, idx) => (
        <Comment key={message.user + message.body + idx}>
          <Popup
            content={message.role === 'questioner' ? '出題者' : '回答者'}
            trigger={
              <Comment.Avatar
                as="a"
                src={
                  message.role === 'questioner'
                    ? questionerAvatar
                    : answererAvatar
                }
              />
            }
          />

          <Comment.Content>
            <Comment.Author
              as="a"
              style={{
                color: gameStyleTheme.fontColor,
              }}
            >
              {message.user}
            </Comment.Author>
            <Comment.Metadata
              style={{
                color: gameStyleTheme.fontColor,
              }}
            >
              <span>{formatMessageCreatedAt(message.createdAt)}</span>
            </Comment.Metadata>
            <Comment.Text
              style={{
                color: gameStyleTheme.fontColor,
              }}
            >
              {message.body.split('\n').map((str, index) => (
                <React.Fragment key={index}>
                  {str}
                  <br />
                </React.Fragment>
              ))}
            </Comment.Text>
            {props.role === 'questioner' &&
            message.role !== 'questioner' &&
            message.body !== USER_ENTER_MESSAGE &&
            message.replyMessages.length < 1 ? (
              <Button.Group>
                <Button
                  onClick={() =>
                    handleReplyMessageClick(
                      message.body,
                      message.createdAt,
                      'はい'
                    )
                  }
                  color="green"
                >
                  はい
                </Button>
                <Button.Or />
                <Button
                  onClick={() =>
                    handleReplyMessageClick(
                      message.body,
                      message.createdAt,
                      '関係ない'
                    )
                  }
                  color="blue"
                >
                  関係ない
                </Button>
                <Button.Or />
                <Button
                  onClick={() =>
                    handleReplyMessageClick(
                      message.body,
                      message.createdAt,
                      'いいえ'
                    )
                  }
                  color="red"
                >
                  いいえ
                </Button>
              </Button.Group>
            ) : (
              <></>
            )}
          </Comment.Content>

          {message.replyMessages.length >= 1 ? (
            <Comment.Group>
              {message.replyMessages.map((replyMessage, idx) => (
                <Comment key={replyMessage.user + replyMessage.body + idx}>
                  <Popup
                    content={
                      replyMessage.role === 'questioner' ? '出題者' : '回答者'
                    }
                    trigger={
                      <Comment.Avatar
                        as="a"
                        src={
                          replyMessage.role === 'questioner'
                            ? questionerAvatar
                            : answererAvatar
                        }
                      />
                    }
                  />
                  <Comment.Content>
                    <Comment.Author
                      as="a"
                      style={{
                        color: gameStyleTheme.fontColor,
                      }}
                    >
                      {replyMessage.user}
                    </Comment.Author>
                    <Comment.Metadata
                      style={{
                        color: gameStyleTheme.fontColor,
                      }}
                    >
                      <span>
                        {formatMessageCreatedAt(replyMessage.createdAt)}
                      </span>
                    </Comment.Metadata>
                    <Comment.Text
                      style={{
                        color: gameStyleTheme.fontColor,
                      }}
                    >
                      {replyMessage.body.split('\n').map((str, index) => (
                        <React.Fragment key={index}>
                          {str}
                          <br />
                        </React.Fragment>
                      ))}
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
              ))}
            </Comment.Group>
          ) : (
            <></>
          )}
        </Comment>
      ))}
    </Comment.Group>
  )
}
