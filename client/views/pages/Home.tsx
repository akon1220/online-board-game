import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { gameListOperations } from '@/state/ducks/game_list'
import { BetaMessage } from '@/views/organisms/BetaMessage'
import { GameCardGroup } from '@/views/organisms/GameCardGroup'
import { Navbar } from '@/views/organisms/Navbar'
import { Footer } from '@/views/organisms/Footer'
import { systemOperations } from '@/state/ducks/system'
import { UserNameInputModal } from '@/views/organisms/UserNameInputModal'
import { MetaPageInfo } from '../atoms/MetaPageInfo'
import { pageBasicInfo } from '@/page_info'

export const Home: FC = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  useEffect(() => {
    dispatch(gameListOperations.fetchGameList())
    dispatch(systemOperations.execClientApplication({ skipAskUserName: true }))
  }, [])
  return (
    <>
      <MetaPageInfo />
      <Navbar />
      <div className={classes.backgroundImageStyle}>
        <div className={classes.backgroundImageFilter}>
          <div className={classes.titleWrapper}>
            <h2 className={classes.title}>{pageBasicInfo.name}</h2>
            <p className={classes.subtitle}>{pageBasicInfo.summary}</p>
          </div>
        </div>
      </div>
      <div className={classes.container}>
        <BetaMessage />
        <GameCardGroup />
      </div>
      <UserNameInputModal />
      <Footer />
    </>
  )
}

const useStyles = createUseStyles({
  backgroundImageFilter: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backgroundImageStyle: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    backgroundImage: `url(/assets/home/header.jpg)`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  titleWrapper: {
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    color: 'white',
  },
  title: {
    fontSize: 48,
    '@media (max-width: 768px)': {
      fontSize: 32,
    },
  },
  subtitle: {
    fontSize: 15,
    '@media (max-width: 768px)': {
      fontSize: 12,
    },
  },
  gameTitleStyle: {
    fontSize: 30,
    color: '#0D46A0',
    textAlign: 'center',
    borderTop: 'solid thin #0D46A0',
    borderBottom: 'solid thin #0D46A0',
    marginBottom: 40,
    width: 300,
    margin: '0 auto',
  },
  container: {
    maxWidth: 950,
    width: '100%',
    margin: '0 auto',
    '@media (max-width: 999px) and (min-width: 768px)': {
      maxWidth: 600,
    },
    '@media (max-width: 768px)': {
      maxWidth: 400,
    },
    paddingBottom: 160,
  },
})
