import React, { useState } from 'react'
import { Grid, Label } from 'semantic-ui-react'
import Cookies from 'js-cookie'
import { SeaTurtleSoupApp } from '../'
import { ChallengeCard } from './ChallengeCard'
import { EndGameButton } from './EndGameButton'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'
import answererAvatar from './images/answerer.jpg'
import questionerAvatar from './images/questioner.jpg'
import { gameStyleTheme } from '../style_theme'
import { ChangeChallengeButton } from './ChangeChallengeButton'

export const App = () => {
  const [role, setRole] = useState<'answerer' | 'questioner'>('answerer')
  const [challenge, setChallenge] = useState<{
    title: string
    question: string
    answer: string
    imageUrl: string
    questionExamples: string[]
    hintExamples: string[]
  }>({
    title: '',
    question: '',
    answer: '',
    imageUrl: '',
    questionExamples: [],
    hintExamples: [],
  })
  const context = SeaTurtleSoupApp.useInstance()
  if (context) {
    context.updateRole = (fetchedRole) => {
      setRole(fetchedRole)
    }
    context.updateChallenge = (fetchedChallenge) => {
      setChallenge(fetchedChallenge)
    }
  }
  return (
    <>
      <Grid
        celled
        style={{
          backgroundColor: gameStyleTheme.backgroundColor,
          color: gameStyleTheme.fontColor,
          margin: 0,
          minHeight: window.innerHeight,
        }}
      >
        <Grid.Row>
          <Grid.Column width={12}>
            <ChallengeCard challenge={challenge} role={role} />
          </Grid.Column>
          <Grid.Column
            width={4}
            style={{ height: '75vh', overflowY: 'scroll' }}
            id="commentList"
          >
            <MessageList role={role} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <p style={{ fontWeight: 'bold' }}>
              {Cookies.get('user')}さんの役割
            </p>
            <Label size="massive" image>
              {role === 'questioner' ? (
                <>
                  <img src={questionerAvatar} />
                  出題者
                </>
              ) : (
                <>
                  <img src={answererAvatar} />
                  回答者
                </>
              )}
            </Label>
          </Grid.Column>
          <Grid.Column width={4}>
            <p style={{ fontWeight: 'bold' }}>操作パネル</p>
            <div>
              <ChangeChallengeButton />
            </div>
            <div>
              <EndGameButton />
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <MessageInput challenge={challenge} role={role} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}
