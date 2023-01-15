import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { roomSelectors } from '@/state/ducks/room'
import { Game } from '@/state/ducks/game_list/types'
import { styleTheme } from '../style_theme'

type Props = {
  game: Game | undefined
}

export const RoomMemberList: FC<Props> = ({ game }) => {
  const classes = useStyles()
  const members = useSelector(roomSelectors.getMembers)
  const maxMemberCount =
    game?.acceptableMemberCount[game.acceptableMemberCount.length - 1] || 1
  const restAcceptableMemberCount = maxMemberCount - members.length
  return (
    <div>
      {members.map((member, index) => (
        <div key={member + index} className={classes.currentMemberItem}>
          {member}
        </div>
      ))}
      {Array(restAcceptableMemberCount)
        .fill(0)
        .map((empty, index) => (
          <div key={empty + index} className={classes.restMemberItem}>
            募集中...
          </div>
        ))}
    </div>
  )
}

const memberItem = {
  height: '50px',
  fontSize: '20px',
  fontWeight: 'bold',
  lineHeight: '50px',
  borderRadius: '25px',
  marginTop: '25px',
  textAlign: 'left',
  paddingLeft: '25px',
  maxWidth: '350px',
  margin: 'auto',
}

const useStyles = createUseStyles({
  currentMemberItem: {
    ...memberItem,
    backgroundColor: styleTheme.primaryColor,
    color: styleTheme.secondaryFontColor,
  },
  restMemberItem: {
    ...memberItem,
    backgroundColor: styleTheme.gray,
    color: styleTheme.secondaryFontColor,
  },
})
