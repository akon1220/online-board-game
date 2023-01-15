import React from 'react'
import { Button } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import { GameRuleModal } from '@/views/molecules/GameRuleModal'
import { styleTheme } from '@/views/style_theme'
import { MonopolyApp } from '..'
import { useSelector } from 'react-redux'
import { gameListSelectors } from '@/state/ducks/game_list'

export const ShowGameRuleButton = () => {
  const app = MonopolyApp.useInstance()
  const game = useSelector(gameListSelectors.getGameList).find(
    (eachGame) => eachGame.id === app.gameId
  )
  const classes = useStyles()
  return (
    <>
      {game ? (
        <GameRuleModal
          triggerButton={
            <Button className={classes.ruleInfoLabel}>
              ゲームのルールを見る
            </Button>
          }
          game={game}
        />
      ) : null}
    </>
  )
}

const useStyles = createUseStyles({
  ruleInfoLabel: {
    marginTop: '10px !important',
    backgroundColor: `${styleTheme.primaryColor} !important`,
    color: `${styleTheme.secondaryFontColor} !important`,
    top: 'calc(100% - 50px)',
    textAlign: 'center',
  },
})
