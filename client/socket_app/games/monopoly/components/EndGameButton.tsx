import React, { useState } from 'react'
import { Confirm } from 'semantic-ui-react'
import { MonopolyApp } from '../'

export const EndGameButton = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const app = MonopolyApp.useInstance()
  const handleConfirm = () => {
    app?.endGameRequest()
    setIsConfirmModalOpen(false)
  }
  return (
    <>
      <button
        className="ui red button"
        style={{ marginTop: 10 }}
        onClick={() => setIsConfirmModalOpen(true)}
      >
        ゲームを終了
      </button>
      <Confirm
        open={isConfirmModalOpen}
        content="本当にゲームを終了しますか？"
        cancelButton="いいえ"
        confirmButton="はい"
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </>
  )
}
