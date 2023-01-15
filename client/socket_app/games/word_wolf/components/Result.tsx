import React, { FC } from 'react'
import { Container, Button } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import { Pool } from '@/socket_events/games/word_wolf/pool'
import { WordWolfApp } from '..'
// import { PoolContext } from '.'

type Props = {
  pool: Pool
}

export const Result: FC<Props> = ({ pool }) => {
  const classes = useStyles()
  const app = WordWolfApp.useInstance()
  const wolf = pool?.members.filter((member) => {
    return member.type === 'wolf'
  })
  const citizenList = pool?.members.filter((member) => {
    return member.type === 'citizen'
  })
  const votedRanking = pool?.members.sort(function (a, b) {
    if (a.votedNumber > b.votedNumber) {
      return -1
    } else {
      return 1
    }
  })
  const mostVotedUser = votedRanking[0]

  return (
    <>
      <Container>
        <div className={classes.resultWrapper}>
          <div className={classes.voteResultWrapper}>
            <h1 className={classes.voteResultTitle}>■ 投票結果</h1>
            {votedRanking.map((member) => {
              return (
                <>
                  <h1 className={classes.memberName}>
                    {member.votedNumber}票：
                    {member.name}
                  </h1>
                </>
              )
            })}
          </div>

          <div className={classes.gameResultWrapper}>
            <h1 className={classes.gameResultTitle}>■ 結果発表</h1>
            <p>投票数が同じ場合、市民（多数派）が勝利します。</p>
            {mostVotedUser?.type === 'wolf' &&
            mostVotedUser?.votedNumber >= votedRanking[1].votedNumber ? (
              <>
                <h1 className={classes.winnerTitle}>勝者：</h1>
                {citizenList.map((member) => {
                  return (
                    <>
                      <p className={classes.memberName}>{member.name}</p>
                    </>
                  )
                })}
              </>
            ) : (
              <>
                <h1 className={classes.winnerTitle}>勝者：</h1>
                <p className={classes.memberName}>
                  {wolf.map((member) => member.name).join('\n')}
                </p>
              </>
            )}
            <h1 className={classes.wolfWordTitle}>
              狼ワード（少数派）：
              <br />「{pool?.wolfWord}」
            </h1>
            <p className={classes.memberName}>
              {wolf.map((member) => member.name).join('\n')}
            </p>
            <h1 className={classes.citizenWordTitle}>
              市民ワード（多数派）：
              <br />「{pool?.citizenWord}」
            </h1>
            {citizenList.map((member) => {
              return (
                <>
                  <p className={classes.memberName}>{member.name}</p>
                </>
              )
            })}
            <Button
              type="submit"
              color="red"
              onClick={app.endGameRequest}
              className={classes.finishButton}
            >
              ゲームを終了
            </Button>
          </div>
        </div>
      </Container>
    </>
  )
}

const useStyles = createUseStyles({
  resultWrapper: {
    display: 'flex',
    marginTop: '10vh',
  },
  voteResultWrapper: {
    width: '50vw',
  },
  voteResultTitle: {
    fontSize: '40px',
  },
  gameResultWrapper: {
    width: '50vw',
  },
  gameResultTitle: {
    fontSize: '40px',
  },
  memberName: {
    margin: '20px 0 20px 40px',
    fontSize: '24px',
  },
  winnerTitle: {
    margin: '20px 0 0 !important',
  },
  citizenWordTitle: {
    margin: '20px 0 0 !important',
  },
  wolfWordTitle: {
    margin: '20px 0 0 !important',
  },
  finishButton: {
    marginTop: '20px !important',
    fontSize: '18px !important',
  },
})
