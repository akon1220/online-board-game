import React, { useState } from 'react'
import { Confirm, Button } from 'semantic-ui-react'
import { SeaTurtleSoupApp } from '../'
import { gameList } from '@/../server/src/controllers/api/gameList' // FIXME: serverのファイルを読み込まない。
import { GameRuleModal } from '@/views/molecules/GameRuleModal'

const game = gameList.find((game) => game.id === 'sea_turtle_soup')
export const EndGameButton = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const app = SeaTurtleSoupApp.useInstance()
  const handleConfirm = () => {
    app?.endGameRequest()
    setIsConfirmModalOpen(false)
  }
  return (
    <>
      {game ? (
        <GameRuleModal
          triggerButton={
            <Button className="ui blue button" style={{ marginTop: 10 }}>
              ゲームのルールを見る
            </Button>
          }
          game={game}
        />
      ) : null}
      <button
        className="ui red button"
        style={{ marginTop: 10 }}
        onClick={() => setIsConfirmModalOpen(true)}
      >
        ゲームをやめる
      </button>
      <Confirm
        open={isConfirmModalOpen}
        content="本当にゲームをやめますか？"
        cancelButton="いいえ"
        confirmButton="はい"
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </>
  )
}
