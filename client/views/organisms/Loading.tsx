import React, { FC } from 'react'
import { createUseStyles } from 'react-jss'

export const Loading: FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.loaderContainer}>
      <img src="/assets/loader.gif" alt="ローディング中です" />
      <div className={classes.txt}>Loading...</div>
    </div>
  )
}

const useStyles = createUseStyles({
  loaderContainer: {
    textAlign: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  txt: {
    fontWeight: 'bold',
    fontSize: '30px',
  },
})
