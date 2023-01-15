import React, { FC, useState, useEffect, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import { Modal, Header, ModalContent, Progress } from 'semantic-ui-react'
import { Pool } from '@/socket_events/games/vulture'
import { HandCardField } from './HandCardField'
import { SideMenu } from './SideMenu'
import { GameField } from './GameField'
import { VultureApp } from '..'

export const PoolContext = React.createContext<Pool | undefined>(undefined)

export const GameView: FC = () => {
  const app = useContext(VultureApp.Context)
  const [pool, setPool] = useState<Pool | undefined>()
  const [acceptRate, setAcceptRate] = useState<number>(0)
  const windowSize = useWindowSize()
  const classes = useStyles(windowSize)
  useEffect(() => {
    app.onPoolInitialized = (pool: Pool) => {
      setPool(pool)
    }
    app.onPoolUpdated = (pool: Pool) => {
      setPool(pool)
    }
  }, [])
  useEffect(() => {
    const acceptCount =
      pool?.roomMembers.filter((member) => member.accepted).length || 0
    const waitingCount = pool?.roomMembers.length || 1
    setAcceptRate((acceptCount / waitingCount) * 100)
  }, [pool])
  return (
    <PoolContext.Provider value={pool}>
      <div className={classes.root}>
        <GameField className={classes.gameField} />
        <SideMenu className={classes.sideMenu} />
        <HandCardField className={classes.handCard} />
      </div>
      <Modal size="small" open={pool?.gameStarted !== true}>
        <ModalContent>
          <Header content="メンバーを待機しています" dividing={false} />
          <Progress percent={acceptRate} size="tiny" indicating />
          <h4>以下のメンバーが読み込み中です。</h4>
          {pool?.roomMembers
            .filter((member) => !member.accepted)
            .map((waitingMember, index) => (
              <li key={`${waitingMember}-${index}`}>
                {waitingMember.userName}
              </li>
            ))}
        </ModalContent>
      </Modal>
    </PoolContext.Provider>
  )
}

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const updateSize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }
  useEffect(() => {
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return { width, height }
}

const useStyles = createUseStyles({
  '@global': {
    '@font-face': {
      fontFamily: 'Abril Fatface',
      src: "url('/fonts/abril_fatface/regular.ttf')",
    },
  },
  root: ({ width, height }: { width: number; height: number }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'black',
  }),
  gameField: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 'calc(100% - 200px)',
    height: 'calc(100% - 160px)',
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 'calc(100% - 200px)',
    width: 200,
    height: 'calc(100% - 160px)',
  },
  handCard: {
    position: 'absolute',
    top: 'calc(100%  - 160px)',
    left: 0,
    width: '100%',
    height: 160,
  },
})
