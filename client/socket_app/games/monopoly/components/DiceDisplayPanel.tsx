import React, { useState, FC } from 'react'
import { createUseStyles } from 'react-jss'
import './diceDisplayPanel.css'
import { MonopolyApp } from '..'
import { PoolModel } from '@/socket_events/games/monopoly/pool'

type Props = {
  poolModel: PoolModel
}

export const DiceDisplayPanel: FC<Props> = (props) => {
  const [firstDiceEye, setFirstDiceEye] = useState<number | undefined>()
  const [secondDiceEye, setSecondDiceEye] = useState<number | undefined>()
  const [dummyDiceEye, setDummyDiceEye] = useState<number | undefined>()

  const app = MonopolyApp.useInstance()

  const classes = useStyle()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timer: any
  const startDummyDiceAnimation = () => {
    timer = setInterval(() => {
      setDummyDiceEye(Math.floor(Math.random() * 6) + 1)
    }, 200)
  }
  const endDummyDiceAnimation = () => {
    clearInterval(timer)
    setDummyDiceEye(undefined)
    timer = undefined
  }

  app.updateDiceEye = (poolModel) => {
    if (
      !poolModel.isDoneReleaseJailRequest &&
      (poolModel.canReleaseJailTryActionRequest ||
        poolModel.canDoMoveActionRequest ||
        poolModel.canGoToJailRequest ||
        !poolModel.isMyTurn)
    ) {
      setFirstDiceEye(undefined)
      setSecondDiceEye(undefined)
      startDummyDiceAnimation()
      setTimeout(() => {
        setFirstDiceEye(poolModel.lastDiceEyeResult?.firstDiceEye)
        setSecondDiceEye(poolModel.lastDiceEyeResult?.secondDiceEye)

        endDummyDiceAnimation()

        if (poolModel.canReleaseJailTryActionRequest) {
          setTimeout(() => {
            app.releaseJailTryActionRequest()
          }, 1200)
        } else if (poolModel.canGoToJailRequest) {
          setTimeout(() => {
            app.goToJailRequest()
          }, 1200)
        } else if (poolModel.canDoMoveActionRequest) {
          setTimeout(() => {
            app.doMoveActionRequest(poolModel.lastDiceEyeResultSum)
          }, 1200)
        }
      }, 1200)
    }
  }

  const poolModel = props.poolModel
  return (
    <>
      {poolModel.beforeDiceEyeResults.map((diceResult, idx) => (
        <>
          <div key={idx}>
            <p>{idx + 1}回目</p>
            <img
              key={idx + 'first'}
              style={{ margin: '10px' }}
              src={getDiceEyeSvg(diceResult.firstDiceEye)}
              className={classes.diceStyle}
            />
            <img
              key={idx + 'second'}
              style={{ margin: '10px' }}
              src={getDiceEyeSvg(diceResult.secondDiceEye)}
              className={classes.diceStyle}
            />
          </div>
          <hr />
        </>
      ))}
      <div>
        {firstDiceEye ? (
          <img
            style={{ margin: '10px' }}
            src={getDiceEyeSvg(firstDiceEye)}
            className={classes.diceStyle}
          />
        ) : (
          dummyDiceEye && (
            <img
              style={{ margin: '10px' }}
              src={getDiceEyeSvg(dummyDiceEye)}
              className={classes.diceStyle + ' rotate-anime'}
            />
          )
        )}
        {secondDiceEye ? (
          <img
            style={{ margin: '10px' }}
            src={getDiceEyeSvg(secondDiceEye)}
            className={classes.diceStyle}
          />
        ) : (
          dummyDiceEye && (
            <img
              style={{ margin: '10px' }}
              src={getDiceEyeSvg(dummyDiceEye)}
              className={classes.diceStyle + ' rotate-anime'}
            />
          )
        )}
      </div>
    </>
  )
}

const getDiceEyeSvg = (diceEye: number) => {
  const assetBasePath = '/assets/monopoly/'
  switch (diceEye) {
    case 1:
      return assetBasePath + 'oneDiceEye.svg'
    case 2:
      return assetBasePath + 'twoDiceEye.svg'
    case 3:
      return assetBasePath + 'threeDiceEye.svg'
    case 4:
      return assetBasePath + 'fourDiceEye.svg'
    case 5:
      return assetBasePath + 'fiveDiceEye.svg'
    case 6:
      return assetBasePath + 'sixDiceEye.svg'
  }
}

const useStyle = createUseStyles({
  diceStyle: {
    width: '50px',
  },
})
