import React, { FC, useEffect } from 'react'
import { Switch, Route, useLocation, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PATH } from '@client/constants'
import { routerOperations, routerSelectors } from '@client/state/ducks/router'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { Room } from './pages/Room'
import { Webmaster } from './pages/WebmasterInfo'
import { Contact } from './pages/Contact'

const App: FC = () => {
  useSyncReduxPath()
  return (
    <Switch>
      <Route path={PATH.HOME} exact component={Home} />
      <Route path={`${PATH.ROOM}:id`} component={Room} />
      <Route path={PATH.GAME} component={Game} />
      <Route path={PATH.WEBMASTER} component={Webmaster} />
      <Route path={PATH.CONTACT} component={Contact} />
    </Switch>
  )
}

const useSyncReduxPath = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const reduxPath = useSelector(routerSelectors.getPath)
  useEffect(() => {
    const path = location.pathname
    if (path === reduxPath) return
    dispatch(routerOperations.pageTransition(path))
  }, [location.pathname])
  useEffect(() => {
    const path = location.pathname
    if (path === reduxPath) return
    history.push(reduxPath)
  }, [reduxPath])
}

export default App
