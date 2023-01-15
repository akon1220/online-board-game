import React, { FC } from 'react'
import { NoopApp } from '../index'
import { Container } from 'semantic-ui-react'

export const App: FC = () => {
  const context = NoopApp.useInstance()
  return (
    <Container>
      <h1>Hello, Noop</h1>
      <button className="ui red button" onClick={context?.endGameRequest}>
        ゲームを終了
      </button>
    </Container>
  )
}
