import React, { FC } from 'react'
import { createUseStyles } from 'react-jss'

type Props = {
  number: number
  className?: string
}

export const VultureCard: FC<Props> = (props) => {
  const classes = useStyles()
  return (
    <div className={[props.className || '', classes.card].join(' ')}>
      <div className={classes.digit}>{props.number}</div>
      <div>
        <img className={classes.vultureImg} src="/assets/vulture/vulture.jpg" />
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  card: {
    backgroundColor: 'black',
  },
  digit: {
    color: 'white',
    fontFamily: 'Abril Fatface',
    textAlign: 'center',
    height: 60,
    lineHeight: '60px',
    fontSize: 'xxx-large',
    marginTop: 25,
  },
  vultureImg: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
})
