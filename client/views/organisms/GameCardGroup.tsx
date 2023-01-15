import React, { FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { Card, Button } from 'semantic-ui-react'
import { gameListSelectors } from '@/state/ducks/game_list'
import { systemOperations } from '@/state/ducks/system'
import { GameCard } from '@/views/molecules/GameCard'
import { Game } from '@/state/ducks/game_list/types'
import { GameRuleModal } from '../molecules/GameRuleModal'
import { styleTheme } from '../style_theme'

export const GameCardGroup: FC = () => {
  const classes = useStyles()
  const dispath = useDispatch()
  const releaseGameList = JSON.parse(
    JSON.stringify(useSelector(gameListSelectors.getGameList))
  ).reverse() as Game[]
  const preReleaseGameList = useSelector(
    gameListSelectors.getPreReleaseGameList
  )
  return (
    <>
      <Card.Group className={classes.contentStyle}>
        {releaseGameList.map((game, index) => (
          <GameCard
            key={game.name + index}
            game={game}
            type={'release'}
            footer={
              <div className="ui two buttons">
                <GameRuleModal
                  triggerButton={
                    <Button className={classes.readRuleButton}>
                      ルールを見る
                    </Button>
                  }
                  game={game}
                />
                <Button
                  className={classes.roomCreateButton}
                  onClick={() =>
                    dispath(systemOperations.launchRoomApp(game.id))
                  }
                >
                  部屋を作成
                </Button>
              </div>
            }
          />
        ))}
        {preReleaseGameList.map((game, index) => (
          <GameCard
            game={game}
            type={'before release'}
            key={game.name + index}
            footer={<div>近日公開予定！</div>}
          />
        ))}
      </Card.Group>
    </>
  )
}
const useStyles = createUseStyles({
  contentStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    '@media (max-width: 1000px)': {
      justifyContent: 'space-between',
    },
    '@media (max-width: 768px)': {
      justifyContent: 'center',
    },
    marginTop: '20px !important',
  },
  roomCreateButton: {
    backgroundColor: `${styleTheme.primaryColor} !important`,
    color: 'white !important',
  },
  readRuleButton: {
    backgroundColor: `${styleTheme.secondaryColor} !important`,
    color: 'white !important',
  },
})
