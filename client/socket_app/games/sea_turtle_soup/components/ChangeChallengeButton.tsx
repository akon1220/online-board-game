import React, { useState } from 'react'
import { Button, Icon, Confirm } from 'semantic-ui-react'
import { SeaTurtleSoupApp } from '../'

export const ChangeChallengeButton = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const app = SeaTurtleSoupApp.useInstance()
  const handleConfirm = () => {
    app?.changeChallengeRequest()
    setIsConfirmModalOpen(false)
  }
  return (
    <>
      <Button
        icon
        labelPosition="left"
        primary
        onClick={() => setIsConfirmModalOpen(true)}
      >
        <Icon name="sync alternate" />
        問題と役割を変える
      </Button>
      <Confirm
        open={isConfirmModalOpen}
        content="本当に問題と役割を変更しますか？"
        cancelButton="いいえ"
        confirmButton="はい"
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </>
  )
}
