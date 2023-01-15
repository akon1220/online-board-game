import React, { FC } from 'react'
import { createUseStyles } from 'react-jss'
import { RoomMemberList } from '@/views/molecules/RoomMemberList'
import { LinkShareField } from '../molecules/LinkShareField'
import { Game } from '@/state/ducks/game_list/types'

type Props = {
  game: Game | undefined
  className?: string
}

export const RoomRight: FC<Props> = ({ game, className }) => {
  const classes = useStyles()

  return (
    <div className={className}>
      <div className={classes.roomRightWrapper}>
        <LinkShareField />
        <RoomMemberList game={game} />
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  roomRightWrapper: {
    margin: 'auto',
  },
})
