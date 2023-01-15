import React, { FC, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { Button } from 'semantic-ui-react'
import { PoolContext } from '.'
import { GhostApp } from '..'

type Props = {
  className?: string
}

// 参加者が獲得したカード数
export const SideMenu: FC<Props> = (props) => {
  const classes = useStyles()
  const pool = useContext(PoolContext)
  const app = useContext(GhostApp.Context)
  return (
    <div>
      {pool?.gameStarted === true ? (
        <Button onClick={app.endGameRequest}>ゲームを終了</Button>
      ) : (
        <Button className={classes.button} onClick={app.startGame}>
          ゲームを開始
        </Button>
      )}
    </div>
  )
}

const useStyles = createUseStyles({
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
