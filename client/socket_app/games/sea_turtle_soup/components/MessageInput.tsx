import React, { FC, useState, ChangeEvent } from 'react'
import { Button, Confirm } from 'semantic-ui-react'
import { SeaTurtleSoupApp } from '../index'

const ENTER_KEY_CODE = 13

type Props = {
  role: 'questioner' | 'answerer'
  challenge: {
    title: string
    question: string
    answer: string
    questionExamples: string[]
    hintExamples: string[]
  }
}

export const MessageInput: FC<Props> = (props) => {
  const [message, setMessage] = useState<string>('')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const context = SeaTurtleSoupApp.useInstance()
  const handleClick = () => {
    context?.messageSentRequest(message)
    setMessage('')
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ENTER_KEY_CODE) handleClick()
  }

  const handleConfirm = () => {
    context?.messageSentRequest('解答を表示しました。')
    context?.showAnswerRequest()
    setIsConfirmModalOpen(false)
  }

  return (
    <>
      {props.role === 'questioner' ? (
        <>
          <div className="ui right action input" style={{ width: '80%' }}>
            <input
              type="text"
              placeholder="回答者に発言"
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ui blue icon right labeled button"
              onClick={handleClick}
            >
              送信
              <i aria-hidden="true" className="paper plane icon"></i>
            </button>
          </div>
          <Button
            style={{ marginTop: 10 }}
            color="yellow"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            解答を表示
          </Button>
          <Confirm
            open={isConfirmModalOpen}
            content="本当に解答を表示しますか？"
            cancelButton="いいえ"
            confirmButton="はい"
            onConfirm={handleConfirm}
            onCancel={() => setIsConfirmModalOpen(false)}
          />
        </>
      ) : (
        <>
          <div className="ui right action input" style={{ width: '90%' }}>
            <input
              type="text"
              placeholder="出題者に質問"
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ui blue icon right labeled button"
              onClick={handleClick}
            >
              送信
              <i aria-hidden="true" className="paper plane icon"></i>
            </button>
          </div>
        </>
      )}
    </>
  )
}
