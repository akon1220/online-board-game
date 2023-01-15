import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { Button } from 'semantic-ui-react'
import { PlayerCard } from './PlayerCard'
import { styleTheme } from '@/views/style_theme'
import { VultureApp } from '..'
import { PoolContext } from '.'
import { GameRuleModal } from '@/views/molecules/GameRuleModal'
import { gameList } from '@/../server/src/controllers/api/gameList'
// FIXME: serverのファイルを読み込まない。
type Props = {
  className?: string
}
const game = gameList.find((game) => game.id === 'vulture')

export const SideMenu: FC<Props> = ({ className }) => {
  const classes = useStyles()
  const pool = useContext(PoolContext)
  const app = useContext(VultureApp.Context)

  const handleEndGame = () => {
    app.endGameRequest()
  }
  return (
    <div className={className}>
      <div className={classes.bg} />
      <div className={classes.playerList}>
        {pool?.members
          ? Object.keys(pool.members).map((sessionUUID) => (
              <PlayerCard
                key={sessionUUID}
                className={classes.playerCard}
                sessionUUId={sessionUUID}
              />
            ))
          : null}
      </div>
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
      {pool?.gameStarted === true ? (
        <Button className={classes.button} onClick={handleEndGame}>
          ゲームを終了
        </Button>
      ) : null}
    </div>
  )
}

const useStyles = createUseStyles({
  ruleInfoLabel: {
    backgroundColor: `${styleTheme.primaryColor} !important`,
    color: `${styleTheme.secondaryFontColor} !important`,
    top: 'calc(100% - 100px)',
    position: 'absolute',
    padding: '.78571429em 1.0em !important',
    marginRight: 'auto !important',
    marginLeft: 'auto !important',
    right: 0,
    left: 0,
    width: '90%',
  },
  bg: {
    position: 'absolute',
    backgroundColor: '#B0003A',
    width: '100%',
    height: '100%',
  },
  playerList: {
    position: 'absolute',
    top: 20,
    left: 0,
    width: '100%',
    height: 'calc(100% - 80px)',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  playerCard: {
    margin: '10px 5%',
    width: '90%',
    height: 100,
  },
  button: {
    top: 'calc(100% - 50px)',
    position: 'absolute',
    marginRight: 'auto !important',
    marginLeft: 'auto !important',
    right: 0,
    left: 0,
    width: '90%',
  },
})
