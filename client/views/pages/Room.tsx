import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { Navbar } from '@/views/organisms/Navbar'
import { RoomLeft } from '@/views/organisms/RoomLeft'
import { RoomRight } from '@/views/organisms/RoomRight'
import { systemOperations, systemSelectors } from '@/state/ducks/system'
import { gameListOperations, gameListSelectors } from '@/state/ducks/game_list'
import { roomSelectors } from '@/state/ducks/room'
import { UserNameInputModal } from '@/views/organisms/UserNameInputModal'
import { MetaPageInfo } from '../atoms/MetaPageInfo'
import { pageBasicInfo } from '@/page_info'
import { RootState } from '@/state'
import { spSize } from '@/views/style_theme'
import { WindowSmallWarning } from '../organisms/WindowSmallWarning'
import { Game } from '@/state/ducks/game_list/types'
import ProductSurveyForm from '../organisms/ProductSurveyForm'

export const Room: FC = () => {
  const gameId = useSelector(roomSelectors.getGameInfo)
  const game = useSelector((store: RootState) =>
    gameListSelectors.getGameInfo(store, gameId)
  )
  const isFormShown = useSelector(systemSelectors.isFormShown)
  const app = useSelector(systemSelectors.getAppInfo)
  console.log(app)
  const windowSize = useWindowSize()
  const classes = useStyles({ windowSize, game })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(gameListOperations.fetchGameList())
    dispatch(systemOperations.execClientApplication())
  }, [])

  const { isSmartPhoneSize } = useIsSmartPhoneSize()
  const metaInfoList = createMetaInfoList(game)
  return (
    <>
      {isSmartPhoneSize ? (
        <WindowSmallWarning />
      ) : (
        <div className={classes.pageRoot}>
          <MetaPageInfo
            metaInfoList={metaInfoList}
            siteTitle={`${game?.name}の待機部屋 | ${pageBasicInfo.name} -- ${pageBasicInfo.summary}`}
          />
          <Navbar />
          <div>
            {isFormShown ? (
              <ProductSurveyForm gameName={game?.name} app={app} />
            ) : null}
            <RoomLeft game={game} className={classes.roomLeft} />
            <RoomRight game={game} className={classes.roomRight} />
          </div>
          <UserNameInputModal />
        </div>
      )}
    </>
  )
}

const useStyles = createUseStyles({
  pageRoot: ({ windowSize }: { windowSize: Size }) => ({
    position: 'absolute',
    ...windowSize,
  }),
  roomRight: {
    position: 'absolute',
    width: '40%',
    top: 80,
    right: 0,
    height: 'calc(100% - 80px)',
    textAlign: 'center',
    paddingTop: '40px',
    paddingBottom: '40px',
    overflowY: 'scroll',
  },
  roomLeft: ({ game }: { game: Game | undefined }) => ({
    position: 'absolute',
    width: '60%',
    top: 80,
    height: 'calc(100% - 80px)',
    backgroundImage: `url(${game?.image})`,
    backgroundSize: 'cover',
    textAlign: 'center',
    overflow: 'hidden',
  }),
})

const useIsSmartPhoneSize = () => {
  const [isSmartPhoneSize, setIsSmartPhoneSize] = useState(
    window.innerWidth < spSize.width || window.innerHeight < spSize.height
  )
  const windowSize = useWindowSize()
  useEffect(() => {
    setIsSmartPhoneSize(
      windowSize.width < spSize.width || windowSize.height < spSize.height
    )
  }, [windowSize.height, windowSize.width])
  return { isSmartPhoneSize }
}

type Size = {
  width: number
  height: number
}

const useWindowSize = (): Size => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const updateSize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }
  useEffect(() => {
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])
  return { width, height }
}

const createMetaInfoList = (game?: Game) => [
  {
    name: 'description',
    content: `${game?.name}の待機部屋です。リンクをブラウザで開いて参加してください！`,
  },
  {
    property: 'og:type',
    content: pageBasicInfo.type,
  },
  {
    property: 'og:title',
    content: `${game?.name} | ${pageBasicInfo.title}`,
  },
  {
    property: 'og:url',
    content: location.href,
  },
  {
    property: 'og:description',
    content: `${game?.name}の待機部屋です。リンクをブラウザで開いて参加してください！`,
  },
  {
    property: 'og:image',
    content: game?.image,
  },
  {
    property: 'og:image:width',
    content: '580',
  },
  {
    property: 'og:image:height',
    content: '400',
  },
  {
    property: 'og:image:alt',
    content: `${game?.id} game image`,
  },
]
