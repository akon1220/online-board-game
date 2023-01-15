import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { systemOperations, systemSelectors } from '@/state/ducks/system'
import { UserNameInputModal } from '@/views/organisms/UserNameInputModal'
import { Loading } from '@/views/organisms/Loading'
import { gameListSelectors } from '@/state/ducks/game_list'
import { RootState } from '@/state'
import { MetaPageInfo } from '../atoms/MetaPageInfo'
import { pageBasicInfo } from '@/page_info'

export const Game: FC = () => {
  const isLoading = useSelector(systemSelectors.isLoadingShown)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(systemOperations.execClientApplication())
  }, [])

  const game = useSelector((store: RootState) =>
    gameListSelectors.getGameInfo(store, getGameId())
  )

  return (
    <>
      <MetaPageInfo
        siteTitle={`${game?.name || 'ゲーム'}をプレイ中 | ${
          pageBasicInfo.title
        }`}
      />
      {isLoading ? <Loading /> : null}
      <div id="playground-field" />
      <UserNameInputModal />
    </>
  )
}

const getGameId = (): string | undefined => {
  const paths = location.pathname.split('/')
  for (const name of paths) {
    if (name && name !== 'game') return name
  }
} // FIXME: DRY, Reduxに上手くのせる
