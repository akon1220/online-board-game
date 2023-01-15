import React, { useState } from 'react'
import { SimpleChatApp } from '../index'
import { Container, Segment, Header, Confirm } from 'semantic-ui-react'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'

const style = {
  h3: {
    marginTop: '2em',
    padding: '2em 0em',
  },
}

export const App = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const context = SimpleChatApp.useInstance()
  const handleConfirm = () => {
    context?.endGameRequest()
    setIsConfirmModalOpen(false)
  }
  return (
    <Container>
      <Segment.Group>
        <Segment>
          <Header
            as="h3"
            textAlign="center"
            style={style.h3}
            content="ただのチャット"
          />
          <MessageList />
        </Segment>
        <div>
          <MessageInput />
          <button
            className="ui red button"
            style={{ marginTop: 10 }}
            onClick={() => setIsConfirmModalOpen(true)}
          >
            チャットを終了
          </button>
          <Confirm
            open={isConfirmModalOpen}
            content="本当にチャットを終了しますか？"
            cancelButton="いいえ"
            confirmButton="はい"
            onConfirm={handleConfirm}
            onCancel={() => setIsConfirmModalOpen(false)}
          />
        </div>
      </Segment.Group>
    </Container>
  )
}
