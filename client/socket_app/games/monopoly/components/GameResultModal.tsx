import React, { FC, useState } from 'react'
import { PoolModel } from '@/socket_events/games/monopoly/pool'
import { Modal, Table, Icon, Button } from 'semantic-ui-react'
import { EndGameButton } from './EndGameButton'

type Props = {
  poolModel: PoolModel
}

export const GameResultModal: FC<Props> = (props) => {
  const [isOpenModal, setIsOpenModal] = useState(true)

  const poolModel = props.poolModel

  const handleCloseModalClick = () => {
    setIsOpenModal(false)
  }
  return (
    <>
      {poolModel.isGameFinished && poolModel.isGameStarted ? (
        <Button color="green" onClick={() => setIsOpenModal(true)}>
          ゲームの結果を表示する
        </Button>
      ) : null}
      <Modal
        open={
          poolModel.isGameFinished && poolModel.isGameStarted && isOpenModal
        }
      >
        <Modal.Header>ゲーム結果</Modal.Header>
        <Modal.Content>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#Rank</Table.HeaderCell>
                <Table.HeaderCell>プレイヤー</Table.HeaderCell>
                <Table.HeaderCell>資産総額</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {poolModel.calculateGameResultList.map((gameResult) => {
                return (
                  <Table.Row key={gameResult.rank + gameResult.player.id}>
                    <Table.Cell>{gameResult.rank}位</Table.Cell>
                    <Table.Cell>
                      <Icon
                        name="car"
                        style={{
                          color: `#${gameResult.player.colorCode.toString(16)}`,
                        }}
                      />
                      {gameResult.player.userName}
                    </Table.Cell>
                    <Table.Cell>{gameResult.totalAssetAmount}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Content>
          もう一度プレイしたい場合も一度ゲームを終了して、部屋に戻ってからゲームをスタートしてください。
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCloseModalClick}>閉じる</Button>
          <EndGameButton />
        </Modal.Actions>
      </Modal>
    </>
  )
}
