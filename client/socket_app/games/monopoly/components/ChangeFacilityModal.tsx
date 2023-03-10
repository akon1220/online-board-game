import React, { FC, useState } from 'react'
import { Modal, Table, Button, Header } from 'semantic-ui-react'
import { PoolModel, AssetId } from '@/socket_events/games/monopoly/pool'
import { assetList } from '@/socket_events/games/monopoly/assetList.data'
import { MonopolyApp } from '..'

type Props = {
  poolModel: PoolModel
}

export const ChangeFacilityModal: FC<Props> = (props) => {
  const [facilityDiffList, setFacilityDiffList] = useState<
    { id: AssetId; shopCount: number; hotelCount: number }[]
  >([])

  const app = MonopolyApp.useInstance()

  const poolModel = props.poolModel

  const handleButtonClick = (
    idx: number,
    sign: 'plus' | 'minus',
    facilityType: 'shop' | 'hotel'
  ) => {
    const newFacility = JSON.parse(JSON.stringify(facilityDiffList))
    if (facilityType === 'shop') {
      newFacility[idx].shopCount += sign === 'plus' ? +1 : -1
    } else if (facilityType === 'hotel') {
      if (sign === 'plus') {
        newFacility[idx].shopCount = 0
        newFacility[idx].hotelCount = 1
      } else {
        newFacility[idx].shopCount = 4
        newFacility[idx].hotelCount = 0
      }
    }

    setFacilityDiffList(newFacility)
  }

  const handleEndFacilityChangeButtonClick = () => {
    app.endChangeFacilityRequest(facilityDiffList)
  }

  const handleCancelFacilityChangeButtonClick = () => {
    app.cancelChangeFacilityRequest()
  }

  app.updateChangeFacilityEvent = (poolModel: PoolModel) => {
    if (
      poolModel.changeFacilityEvent.isInTheMiddle &&
      poolModel.changeFacilityEvent.assetGroupId
    ) {
      const targetGroupAssetList = poolModel
        .getAssetGroupWithAsset(poolModel.changeFacilityEvent.assetGroupId)
        ?.map((targetAsset) => {
          return {
            id: targetAsset.id,
            shopCount: poolModel.assetPanelList[targetAsset.id].shopCount,
            hotelCount: poolModel.assetPanelList[targetAsset.id].hotelCount,
          }
        })
      const newFacility = JSON.parse(JSON.stringify(targetGroupAssetList))
      setFacilityDiffList(newFacility)
    } else {
      const newFacility = JSON.parse(JSON.stringify([]))
      setFacilityDiffList(newFacility)
    }
  }

  const totalConstructionCost = facilityDiffList.reduce(
    (accumulator, currentAsset) => {
      return (
        accumulator +
        poolModel.calculateTotalConstructionCost(
          currentAsset.id,
          currentAsset.shopCount,
          currentAsset.hotelCount
        )
      )
    },
    0
  )

  return (
    <>
      {poolModel.isMyTurn ? (
        <Modal open={poolModel.changeFacilityEvent.isInTheMiddle}>
          <Modal.Header>????????????????????????</Modal.Header>
          <Modal.Content>
            <p>????????????????????????????????????????????????????????????????????????????????????</p>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>?????????</Table.HeaderCell>
                  <Table.HeaderCell>?????????</Table.HeaderCell>
                  <Table.HeaderCell>???????????????</Table.HeaderCell>
                  <Table.HeaderCell>
                    ?????????(?????????????????????????????????????????????)
                  </Table.HeaderCell>
                  <Table.HeaderCell>?????????</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {facilityDiffList.map((targetAsset, idx) => (
                  <Table.Row key={targetAsset.id + idx}>
                    <Table.Cell>{assetList[targetAsset.id].name}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button
                          disabled={
                            targetAsset.shopCount <= 0 ||
                            !poolModel.canChangeFacility(
                              targetAsset.id,
                              facilityDiffList,
                              -1
                            )
                          }
                          icon="minus"
                          onClick={() => {
                            handleButtonClick(idx, 'minus', 'shop')
                          }}
                        />
                        <Button
                          disabled={
                            targetAsset.shopCount >= 4 ||
                            targetAsset.hotelCount >= 1 ||
                            !poolModel.canChangeFacility(
                              targetAsset.id,
                              facilityDiffList,
                              +1
                            )
                          }
                          icon="plus"
                          onClick={() => {
                            handleButtonClick(idx, 'plus', 'shop')
                          }}
                        />
                      </Button.Group>
                      <Header as="h2" content={targetAsset.shopCount} />
                    </Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button
                          disabled={
                            targetAsset.hotelCount <= 0 ||
                            !poolModel.canChangeFacility(
                              targetAsset.id,
                              facilityDiffList,
                              -1
                            )
                          }
                          icon="minus"
                          onClick={() => {
                            handleButtonClick(idx, 'minus', 'hotel')
                          }}
                        />
                        <Button
                          disabled={
                            targetAsset.hotelCount >= 1 ||
                            targetAsset.shopCount < 4 ||
                            !poolModel.canChangeFacility(
                              targetAsset.id,
                              facilityDiffList,
                              +1
                            )
                          }
                          icon="plus"
                          onClick={() => {
                            handleButtonClick(idx, 'plus', 'hotel')
                          }}
                        />
                      </Button.Group>
                      <Header as="h2" content={targetAsset.hotelCount} />
                    </Table.Cell>
                    <Table.Cell>
                      <Header
                        as="h2"
                        content={
                          poolModel.calculateTotalConstructionCost(
                            targetAsset.id,
                            targetAsset.shopCount,
                            targetAsset.hotelCount
                          ) + '??????'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Header
                        as="h2"
                        content={
                          poolModel.calculatePrivateAssetTollAfterConstruction(
                            targetAsset.id,
                            targetAsset.shopCount,
                            targetAsset.hotelCount
                          ) + '??????'
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Modal.Content>
          <Modal.Content>
            <Header
              as="h2"
              content={`
                ???????????????: ${totalConstructionCost}?????? ??????????????????????????????: ${
                poolModel.myPlayer.moneyAmount - totalConstructionCost
              }?????????`}
            ></Header>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleCancelFacilityChangeButtonClick}>
              ???????????????
            </Button>
            <Button color="blue" onClick={handleEndFacilityChangeButtonClick}>
              ????????????
            </Button>
          </Modal.Actions>
        </Modal>
      ) : null}
    </>
  )
}
