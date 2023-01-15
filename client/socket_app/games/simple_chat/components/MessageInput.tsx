import React, { useState, ChangeEvent } from 'react'
import { SimpleChatApp } from '../index'

const ENTER_KEY_CODE = 13

export const MessageInput = () => {
  const [message, setMessage] = useState<string>('')
  const context = SimpleChatApp.useInstance()
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
  return (
    <div className="ui action input" style={{ marginTop: 10 }}>
      <input
        type="text"
        placeholder="メッセージ..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button className="ui blue icon button" onClick={handleClick}>
        <i aria-hidden="true" className="paper plane icon"></i>
      </button>
    </div>
  )
}
