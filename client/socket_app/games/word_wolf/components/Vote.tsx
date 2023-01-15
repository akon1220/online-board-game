import React, { FC, useState } from 'react'
import {
  Button,
  Container,
  Select,
  Form,
  DropdownProps,
  Message,
} from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import { WordWolfApp } from '..'
import { Pool } from '@/socket_events/games/word_wolf/pool'

type Props = {
  pool: Pool
}

export const Vote: FC<Props> = ({ pool }) => {
  const classes = useStyles()
  const app = WordWolfApp.useInstance()
  const [isVoteFinished, setIsVoteFinished] = useState<boolean>(false)
  const [votedUuiD, setVotedUuiD] = useState<string | undefined>(undefined)
  const myself = pool?.members.find((member) => member.uuid === pool.myId)
  const memberExceptMyself = pool?.members.filter((member) => {
    return myself !== member
  })
  const memberOptions = memberExceptMyself.map((member) => {
    return {
      key: member.uuid,
      value: member.uuid,
      text: member.name,
    }
  })
  const voteUnfinishUsers = pool?.members.filter((member) => {
    return member.isVoteFinished === false
  })
  const handleClick = () => {
    if (votedUuiD) {
      app.finishVoteRequest(votedUuiD)
      setIsVoteFinished(true)
    }
  }

  const handleSelectChange = (
    e: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    setVotedUuiD(data.value as string)
  }

  return (
    <>
      <Container>
        <div className={classes.voteWrapper}>
          <h1 className={classes.voteTitle}>■ 投票</h1>
          <h2 className={classes.selectWolf}>
            怪しい人（少数派と思われる人）に投票する。
          </h2>
          <Form>
            <Select
              placeholder="怪しい人を選ぶ"
              options={memberOptions}
              onChange={handleSelectChange}
              className={classes.selectBox}
            />
            {isVoteFinished || myself?.isVoteFinished ? (
              <Button type="submit" className={classes.voteButton}>
                投票完了
              </Button>
            ) : (
              <Button
                type="submit"
                color="red"
                onClick={handleClick}
                className={classes.voteButton}
              >
                投票する
              </Button>
            )}
          </Form>
          <Message info>
            <Message.Header>
              <p>以下のメンバーの投票が完了していません。</p>
              {voteUnfinishUsers.map((member) => {
                return (
                  <>
                    <p>{member.name}</p>
                  </>
                )
              })}
            </Message.Header>
          </Message>
        </div>
      </Container>
    </>
  )
}

const useStyles = createUseStyles({
  voteWrapper: {
    marginTop: '10vh',
  },
  voteTitle: {
    fontSize: '40px',
  },
  selectWolf: {
    margin: '40px 0 20px !important',
    fontSize: '24px',
  },
  selectBox: {
    fontSize: '14px',
  },
  voteButton: {
    marginLeft: '5px !important',
  },
})
