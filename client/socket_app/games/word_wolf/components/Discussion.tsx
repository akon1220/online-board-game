import React, { FC } from 'react'
import { Container, Button } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import { Pool } from '@/socket_events/games/word_wolf/pool'
import { WordWolfApp } from '..'

type Props = {
  pool: Pool
}

export const Chat: FC<Props> = ({ pool }) => {
  const classes = useStyles()
  const app = WordWolfApp.useInstance()
  const myself = pool?.members.find((member) => member.uuid === pool.myId)
  return (
    <>
      <Container>
        <div className={classes.discussionWrapper}>
          <h2 className={classes.showYourWord}>あなたのワードは</h2>
          {myself?.type === 'wolf' ? (
            <h1 className={classes.yourWord}>「{pool?.wolfWord}」</h1>
          ) : (
            <h1 className={classes.yourWord}>「{pool?.citizenWord}」</h1>
          )}
          <h2 className={classes.desu}>です！</h2>
          <div className={classes.voteStartButtonWrapper}>
            <h2 className={classes.letsDiscuss}>
              話し合って少数派を見つけましょう！
            </h2>
            <Button
              color="green"
              onClick={app.finishDiscussionRequest}
              className={classes.startVoteButton}
            >
              投票を開始する
            </Button>
          </div>
        </div>
      </Container>
    </>
  )
}

const useStyles = createUseStyles({
  discussionWrapper: {
    marginTop: '10vh',
  },
  showYourWord: {
    fontSize: '32px',
  },
  yourWord: {
    textAlign: 'center',
    fontSize: '6vh',
  },
  desu: {
    fontSize: '32px',
    textAlign: 'right',
  },
  voteStartButtonWrapper: {
    textAlign: 'center',
  },
  letsDiscuss: {
    fontSize: '32px',
    margin: '40px 0 !important',
  },
  startVoteButton: {
    fontSize: '24px !important',
  },
})
