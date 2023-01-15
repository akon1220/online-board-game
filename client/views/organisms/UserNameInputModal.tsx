import React, { useState } from 'react'
import { Input, Modal, Button } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { systemSelectors } from '@/state/ducks/system'

const ENTER_KEY_CODE = 13

export const UserNameInputModal = () => {
  const [userName, setUserName] = useState('')
  const cookieUserName = useSelector(systemSelectors.getUserName)
  const onSetUserName = useSelector(systemSelectors.getOnSetUserName)
  const handleClick = () => {
    if (userName !== '' && onSetUserName) onSetUserName(userName)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ENTER_KEY_CODE) handleClick()
  }
  return (
    <Modal open={cookieUserName === undefined}>
      <Modal.Header>ユーザ名を入力してください。</Modal.Header>
      <Modal.Content image>
        <Input
          focus
          placeholder="Your Name..."
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value)
          }}
          onKeyDown={handleKeyDown}
        />
        <Button color="blue" onClick={handleClick}>
          決定
        </Button>
      </Modal.Content>
    </Modal>
  )
}
