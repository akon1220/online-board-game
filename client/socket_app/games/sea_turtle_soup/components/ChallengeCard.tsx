import React, { FC, useState } from 'react'
import { Segment } from 'semantic-ui-react'
import { gameStyleTheme } from '../style_theme'
import { SeaTurtleSoupApp } from '..'

type Props = {
  role: 'answerer' | 'questioner'
  challenge: {
    title: string
    question: string
    answer: string
    imageUrl: string
  }
}

export const ChallengeCard: FC<Props> = ({ role, challenge }) => {
  const [isAnswerDisplayed, setIsAnswerDisplayed] = useState(false)
  const app = SeaTurtleSoupApp.useInstance()

  if (app) {
    app.updateAnswerDisplay = (isDisplayed: boolean) => {
      setIsAnswerDisplayed(isDisplayed)
    }
  }
  return (
    <>
      <Segment
        style={{
          backgroundColor: gameStyleTheme.backgroundColor,
          color: gameStyleTheme.fontColor,
          border: '2px solid ' + gameStyleTheme.fontColor,
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          <div>
            <h1>{challenge.title}</h1>
            <img
              src={challenge.imageUrl}
              style={{ height: 240, width: 360, objectFit: 'cover' }}
            />
          </div>
          <div
            style={{
              margin: '80px 0 0 40px',
            }}
          >
            <h2>問題</h2>
            <h3>{challenge.question}</h3>
          </div>
        </div>
      </Segment>
      <Segment
        style={{
          backgroundColor: gameStyleTheme.backgroundColor,
          color: gameStyleTheme.fontColor,
          border: '2px solid ' + gameStyleTheme.fontColor,
        }}
      >
        <h2>解答</h2>
        {role === 'questioner' || isAnswerDisplayed ? (
          <h3>{challenge.answer}</h3>
        ) : (
          <h3>解答はゲーム終了時まで回答者には表示されません。</h3>
        )}
      </Segment>
    </>
  )
}
