import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Popup, Modal, Label, Icon, Card } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import { systemOperations } from '@/state/ducks/system'
import { Game } from '@/state/ducks/game_list/types'
import { styleTheme } from '../style_theme'
import { roomSelectors } from '@/state/ducks/room'
import { GameRuleModal } from '@/views/molecules/GameRuleModal'
import { gameListSelectors } from '@/state/ducks/game_list'
import { GameCard } from '../molecules/GameCard'

type Props = {
  game: Game | undefined
  className?: string
}

export const RoomLeft: FC<Props> = ({ game, className }) => {
  const [isGameSelectModalOpen, setIsGameSelectModalOpen] = useState(false)
  const dispatch = useDispatch()
  const classes = useStyles()
  const members = useSelector(roomSelectors.getMembers)
  const minMemberCount = game?.acceptableMemberCount[0] || 1000
  const isEnoughMemberCount = members.length >= minMemberCount
  const memberCountList = game?.acceptableMemberCount || []

  const gameList = useSelector(gameListSelectors.getGameList)

  const handleChangeGame = (newGameId: string) => {
    dispatch(systemOperations.changeGameApp(newGameId))
    setIsGameSelectModalOpen(false)
  }

  return (
    <div className={className}>
      <div className={classes.roomLeftWrapper}>
        <div className={classes.gameInfoWrapper}>
          <Label size="large" className={classes.gameInfoLabel}>
            <Icon name="users" />
            プレイ人数
            <Label.Detail>
              {memberCountList.length > 1
                ? memberCountList[0] +
                  '~' +
                  memberCountList[memberCountList.length - 1]
                : memberCountList[0]}
              人
            </Label.Detail>
          </Label>
          <Label size="large" className={classes.gameInfoLabel}>
            <Icon name="clock outline" />
            プレイ時間
            <Label.Detail>
              {game?.minDuration + '~' + game?.maxDuration}分
            </Label.Detail>
          </Label>
          {game ? (
            <GameRuleModal
              triggerButton={
                <Label size="large" className={classes.ruleInfoButton}>
                  <Icon name="info circle" />
                  ゲームのルールを見る
                </Label>
              }
              game={game}
            />
          ) : null}
          {
            <Label
              size="large"
              className={classes.deleteRoomButton}
              onClick={() => {
                if (window.confirm('本当に部屋を閉じますか？')) {
                  dispatch(systemOperations.back2Home())
                }
              }}
            >
              <Icon name="trash alternate" />
              部屋を閉じる
            </Label>
          }
        </div>
        <h2 className={classes.gameName}>{game?.name}</h2>

        <div className={classes.buttonWrapper}>
          {isEnoughMemberCount ? (
            <Button
              onClick={() => dispatch(systemOperations.launchGameApp())}
              className={classes.startGameButton}
            >
              ゲームをはじめる
            </Button>
          ) : (
            <Popup
              trigger={
                <Button className={classes.disabledStartGameButton}>
                  ゲームをはじめられません
                </Button>
              }
              content={`ゲームを始めるのに${
                minMemberCount - members.length
              }人参加者が足りません。`}
              on="click"
              position="top center"
            />
          )}
          <Modal
            trigger={
              <Button className={classes.changeGameButton}>
                ゲームを変える
              </Button>
            }
            open={isGameSelectModalOpen}
            onClose={() => setIsGameSelectModalOpen(false)}
            onOpen={() => setIsGameSelectModalOpen(true)}
          >
            <Modal.Header>ゲームを選択</Modal.Header>
            <Modal.Content>
              <Card.Group className={classes.contentStyle}>
                {gameList.map((game, index) => (
                  <GameCard
                    game={game}
                    type={'release'}
                    key={game.name + index}
                    footer={
                      <Button
                        key={game.id}
                        onClick={() => handleChangeGame(game.id)}
                        className={classes.selectGameButton}
                        fluid
                      >
                        ゲームを選択
                      </Button>
                    }
                  />
                ))}
              </Card.Group>
            </Modal.Content>
          </Modal>
        </div>
      </div>
    </div>
  )
}

const startGameButton = {
  color: 'white !important',
  width: 336,
  height: 60,
  fontSize: '24px !important',
  marginTop: '2vh !important',
  marginBottom: '5vh !important',
  marginLeft: 'auto !important',
  marginRight: 'auto !important',
  display: 'block !important',
}

const useStyles = createUseStyles({
  roomLeftWrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    overflow: 'hidden',
    height: '100%',
  },
  contentStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    '@media (max-width: 1000px)': {
      justifyContent: 'space-between',
    },
    '@media (max-width: 768px)': {
      justifyContent: 'center',
    },
  },
  gameInfoWrapper: {
    textAlign: 'left',
  },
  gameInfoLabel: {
    marginTop: '2vh !important',
    marginLeft: '2vh !important',
  },
  ruleInfoButton: {
    marginRight: '1vh !important',
    marginTop: '2vh !important',
    marginLeft: '2vh !important',
    backgroundColor: `${styleTheme.primaryColor} !important`,
    color: `${styleTheme.secondaryFontColor} !important`,
    cursor: 'pointer',
  },
  deleteRoomButton: {
    marginTop: '2vh !important',
    marginLeft: '2vh !important',
    marginRight: '1vh !important',
    backgroundColor: `${styleTheme.gray} !important`,
    color: `${styleTheme.secondaryFontColor} !important`,
    cursor: 'pointer',
  },
  gameName: {
    color: 'white',
    fontSize: '56px !important',
    marginTop: '20vh !important',
  },
  buttonWrapper: {
    marginTop: '15vh !important',
  },
  gameSetting: {
    backgroundColor: 'white !important',
    color: '#0D46A0 !important',
    width: 336,
    height: 60,
    border: 'thin solid #0D46A0 !important',
    fontSize: '24px !important',
    margin: '0 2vh !important',
  },
  checkRule: {
    backgroundColor: 'white !important',
    color: '#0D46A0 !important',
    width: 336,
    height: 60,
    border: 'thin solid #0D46A0 !important',
    fontSize: '24px !important',
    margin: '0 2vh !important',
  },
  startGameButton: {
    ...startGameButton,
    backgroundColor: `${styleTheme.secondaryColor} !important`,
    padding: '.78em 1em !important',
  },
  changeGameButton: {
    ...startGameButton,
    backgroundColor: `${styleTheme.primaryColor} !important`,
  },
  selectGameButton: {
    color: 'white !important',
    backgroundColor: `${styleTheme.primaryColor} !important`,
  },
  disabledStartGameButton: {
    ...startGameButton,
    width: 400,
    backgroundColor: `${styleTheme.gray} !important`,
    padding: '.78em 1em !important',
  },
  closeGameButton: {
    backgroundColor: `${styleTheme.gray} !important`,
    color: 'white !important',
    width: 336,
    height: 60,
    fontSize: '24px !important',
    margin: '0 10vh 30vh!important',
  },
})
