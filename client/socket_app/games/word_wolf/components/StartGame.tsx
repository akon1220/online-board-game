import React from 'react'
import { Button, Container } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import { WordWolfApp } from '..'

export const StartGame = () => {
  const classes = useStyles()
  const app = WordWolfApp.useInstance()
  return (
    <>
      <Container>
        <div className={classes.startButtonWrapper}>
          <h1 className={classes.memberConfirmation}>
            メンバーは揃いましたか？
          </h1>
          <Button
            color="green"
            onClick={app.startGameRequest}
            className={classes.startGameButton}
          >
            お題を振り分ける
          </Button>
          <p className={classes.annotation}>
            ※少数派（狼ワード）に割り振られる人は一人です。
          </p>
        </div>
      </Container>
    </>
  )
}

const useStyles = createUseStyles({
  startButtonWrapper: {
    marginTop: '30vh',
    textAlign: 'center',
  },
  memberConfirmation: {
    fontSize: '40px',
    paddingBottom: '24px',
  },
  startGameButton: {
    fontSize: '24px !important',
  },
  annotation: {
    marginTop: '40px',
  },
})
