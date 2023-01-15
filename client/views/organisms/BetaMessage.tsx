import React, { useState } from 'react'
import { Message, Icon } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'

export const BetaMessage = () => {
  const classes = useStyles()
  const [isBetaMessageOpen, setIsBetaMessageOpen] = useState(true)
  return (
    <>
      {isBetaMessageOpen ? (
        <Message info className={classes.BetaMessage}>
          <Icon
            name="close"
            size="big"
            onClick={() => setIsBetaMessageOpen(false)}
            className={classes.closeButton}
          />
          <Message.Header>Playground.wikiテスト版へようこそ！</Message.Header>
          <p>テスト版では全て無料でお楽しみいただけます！</p>
        </Message>
      ) : null}
    </>
  )
}

const useStyles = createUseStyles({
  BetaMessage: {
    margin: '32px 0px 0px !important',
  },
  closeButton: {
    zIndex: 1,
  },
})
