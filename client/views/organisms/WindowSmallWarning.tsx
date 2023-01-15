import React, { FC } from 'react'
import { Card } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'

const MESSAGE =
  'お使いになっているデバイスにはまだ対応しておりません。大変申し訳ないのですが、もう少し大きい画面にて遊んでみてください。'

export const WindowSmallWarning: FC = () => {
  const classes = useStyles()
  return (
    <Card fluid className={classes.alert}>
      <Card.Content>
        <Card.Header className={classes.title}>注意</Card.Header>
      </Card.Content>
      <Card.Content description={MESSAGE} />
    </Card>
  )
}

const useStyles = createUseStyles({
  title: {
    color: 'red !important',
  },
  alert: {
    transform: 'translateY(50%)',
  },
})
