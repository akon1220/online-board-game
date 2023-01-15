import React, { FC } from 'react'
import { createUseStyles } from 'react-jss'
import { Card, Image, Label, Icon } from 'semantic-ui-react'
import { GameListTypes } from '@/state/ducks/game_list'

type Props = {
  game: GameListTypes.Game
  type: 'release' | 'before release'
  footer: React.ReactNode
}

export const GameCard: FC<Props> = ({ game, type, footer }) => {
  const classes = useStyles()

  const memberCountList = game.acceptableMemberCount
  return (
    <Card className={classes.cardContainer}>
      <div className={classes.imgBox}>
        <div className={classes.gameInfoLabelContainer}>
          {type === 'release' ? (
            <>
              <Label size="large">
                <Icon name="users" />
                {memberCountList.length > 1
                  ? memberCountList[0] +
                    '~' +
                    memberCountList[memberCountList.length - 1]
                  : memberCountList[0]}
                人
              </Label>
              <Label size="large">
                <Icon name="clock outline" />
                {game.minDuration + '~' + game.maxDuration}分
              </Label>
            </>
          ) : null}
        </div>
        {type === 'release' ? (
          <Image src={game.image} className={classes.img} />
        ) : (
          <div
            className={classes.img}
            style={{
              backgroundImage: `url(${game.image})`,
              backgroundSize: 'cover',
            }}
          >
            <div className={classes.imgBeforeCover}>
              <div className={classes.beforeTextWrapper}>
                <div className={classes.beforeText}>Coming Soon...</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Card.Content>
        <Card.Header>{game.name}</Card.Header>
        <Card.Description>{game.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>{footer}</Card.Content>
    </Card>
  )
}

const useStyles = createUseStyles({
  cardContainer: {
    width: 'calc(33% - 20px) !important',
    margin: '10px !important',
    '@media (max-width: 1000px)': {
      width: '290px !important',
      margin: '0px 0px 20px 0px !important',
    },
  },
  gameInfoLabelContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
    left: 10,
  },
  imgBox: {
    width: '100%',
    height: '200px',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgBeforeCover: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  beforeTextWrapper: {
    textAlign: 'center',
    paddingTop: 90,
    color: 'white',
  },
  beforeText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
})
