import React, { FC, useState, useEffect } from 'react'
import { ShiritoriApp } from '..'

export const App: FC = () => {
  const controller = ShiritoriApp.useInstance()
  const [isMyTurn, setMyTurn] = useState(false)
  useEffect(() => {
    if (controller) {
      controller.onMyTurnStart = () => {
        setMyTurn(true)
      }
      controller.onMyTurnEnd = () => {
        setMyTurn(false)
      }
    }
  }, [])
  return (
    <>
      <h1>しりとり</h1>
      <button onClick={() => controller?.startGame()}>ゲームスタート</button>
      <button onClick={() => controller?.endGameRequest()}>止める</button>
      {isMyTurn === true ? <h2>あなたの番</h2> : <h2>誰かの番</h2>}
      {isMyTurn === true ? (
        <button onClick={() => controller?.endMyTurn()}>パス</button>
      ) : null}
    </>
  )
}
