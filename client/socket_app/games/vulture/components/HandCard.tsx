import React, { FC } from 'react'
import { createUseStyles } from 'react-jss'
import Logo from '../images/logo.png'

type Props = {
  number?: number
  className?: string
  isSelected?: boolean
  onClick?: (number: number) => void
}

export const HandCard: FC<Props> = (props) => {
  const classes = useStyles(props)
  return (
    <div
      className={[props.className, classes.card].join(' ')}
      onClick={() => {
        if (props.onClick && props.number !== undefined)
          props.onClick(props.number)
      }}
    >
      {props.number === undefined ? (
        <img src={Logo} className={classes.logo} />
      ) : (
        <div className={classes.digitWrapper}>
          <p className={classes.digit}>{props.number}</p>
        </div>
      )}
    </div>
  )
}

const useStyles = createUseStyles({
  card: (props: Props) => ({
    backgroundColor:
      props.number === undefined
        ? '#002071'
        : props.isSelected === true
        ? '#FF6090'
        : 'white',
    cursor: props.onClick ? 'pointer' : 'default',
    display: 'table',
    border: '2px solid black',
  }),
  digitWrapper: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  digit: {
    fontFamily: 'Abril Fatface',
    textAlign: 'center',
    fontSize: 'xxx-large',
  },
  logo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: 'auto',
    width: 40,
  },
})
