/* eslint-disable @typescript-eslint/camelcase */
import * as PIXI from 'pixi.js'
import { PoolModel, Panel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '@/socket_app/games/monopoly'
import { assetList } from '@/socket_events/games/monopoly/assetList.data'
import { GameBoardComponent } from './game_board_component'

export class PanelView extends GameBoardComponent {
  rect = new PIXI.Rectangle()
  panel: Panel | undefined

  loader: PIXI.Loader
  background: PIXI.Graphics
  panelText: PIXI.Text
  panelImage: PIXI.Sprite
  playerIconList: PIXI.Sprite[]
  wrapper: PIXI.Graphics
  shopIcon: PIXI.Sprite
  shopCountText: PIXI.Text
  hotelIcon: PIXI.Sprite

  constructor(public app: MonopolyApp) {
    super()
    this.view = new PIXI.Container()
    this.loader = PIXI.Loader.shared
    this.background = new PIXI.Graphics()
    this.panelText = new PIXI.Text('nan')
    this.panelImage = new PIXI.Sprite()
    this.playerIconList = []
    this.wrapper = new PIXI.Graphics()
    this.shopIcon = new PIXI.Sprite()
    this.shopCountText = new PIXI.Text('nan')
    this.hotelIcon = new PIXI.Sprite()

    this.view.on('pointerdown', () => {
      this.onClick()
    })
  }

  private makeRange = (min: number, max: number) => {
    const resultList = []
    for (let i = min; i <= max; i++) {
      resultList.push(i)
    }
    return resultList
  }

  render = (
    rect: PIXI.Rectangle,
    panel: Panel,
    poolModel: PoolModel | undefined
  ) => {
    this.rect = rect
    this.panel = panel
    this.poolModel = poolModel

    this.resetView()

    this.view.x = this.rect.x
    this.view.y = this.rect.y
    this.view.width = this.rect.width
    this.view.height = this.rect.height
    this.view.interactive = true
    this.view.buttonMode = true

    this.draw()
  }

  onClick = () => {
    this.app.setShownPanelDetail(this.panel?.position as number)
  }

  private getPositionDirection = () => {
    const position = this.panel?.position as number
    if (this.makeRange(1, 9).includes(position)) return 'down'
    if (this.makeRange(11, 19).includes(position)) return 'left'
    if (this.makeRange(21, 29).includes(position)) return 'up'
    if (this.makeRange(31, 39).includes(position)) return 'right'
  }

  get assetColorPanelSizeRate() {
    return 2 / 7
  }

  private draw = () => {
    if (this.panel?.position !== 30) {
      // FIXME: なぜかstartのPanelだけdrawWrapperするとPanelが消えてしまう。
      this.drawWrapper()
    }
    this.drawBackground()
    this.drawText()
    this.drawPanelImage()
    this.drawPlayerIconList()
    this.drawFacility()
  }

  private drawWrapper = () => {
    this.wrapper = new PIXI.Graphics()

    let backgroundColor
    if (this.panel?.type === 'asset' && this.panel.isMortgaged) {
      backgroundColor = 0xc4c4c4
    } else {
      backgroundColor = 0xd4ebd1
    }
    this.wrapper.beginFill(backgroundColor)
    this.wrapper.drawRect(0, 0, this.rect.width - 1, this.rect.height - 1)
    this.wrapper.endFill()

    this.view.addChild(this.wrapper)
  }

  private drawBackground = () => {
    this.background = new PIXI.Graphics()

    let lineWidth = 1
    let lineColor = 0x000000
    const lineAlpha = 1

    if (this.panel?.type === 'asset' && this.panel.playerId) {
      if (this.poolModel?.players[this.panel.playerId].colorCode) {
        lineWidth = 4
        lineColor = this.poolModel?.players[this.panel.playerId].colorCode
      }
    }

    this.background.lineStyle(lineWidth, lineColor, lineAlpha)
    this.background.drawRect(0, 0, this.rect.width - 1, this.rect.height - 1)

    if (
      this.panel?.type === 'asset' &&
      assetList[this.panel.assetId].type === 'private'
    ) {
      if (this.panel.assetId) {
        const panelColor = this.poolModel?.getAssetColor(this.panel.assetId)
        this.background.beginFill(panelColor)
      }
      if (
        this.getPositionDirection() === 'down' ||
        this.getPositionDirection() === 'up'
      ) {
        this.background.drawRect(
          0,
          0,
          this.rect.width - 1,
          this.rect.height * this.assetColorPanelSizeRate - 1
        )
      } else if (this.getPositionDirection() === 'left') {
        this.background.drawRect(
          this.rect.width * (1 - this.assetColorPanelSizeRate),
          0,
          this.rect.width * this.assetColorPanelSizeRate - 1,
          this.rect.height - 1
        )
      } else if (this.getPositionDirection() === 'right') {
        this.background.drawRect(
          0,
          0,
          this.rect.width * this.assetColorPanelSizeRate - 1,
          this.rect.height - 1
        )
      }
    }

    this.background.endFill()

    this.view.addChild(this.background)
  }

  private drawText = () => {
    const basicTextStyle = {
      fontFamily: 'Arial',
      fontSize: 10,
      fontWeight: 'bold',
      fill: 0x000000,
    }

    if (this.panel?.type === 'asset') {
      this.panelText = new PIXI.Text(`${assetList[this.panel.assetId].name}`, {
        ...basicTextStyle,
      })
    } else if (this.panel?.type === 'action') {
      this.panelText = new PIXI.Text(`${this.panel?.name}`, {
        ...basicTextStyle,
      })
    }

    this.panelText.x = 5
    this.panelText.y = 5

    if (this.panel?.type === 'asset' && this.panel.assetId === 'game_center') {
      this.panelText = new PIXI.Text(`${assetList[this.panel.assetId].name}`, {
        ...basicTextStyle,
        fontSize: 8,
      })
    }

    if (
      this.panel?.type === 'asset' &&
      assetList[this.panel.assetId].type === 'private'
    ) {
      if (
        this.getPositionDirection() === 'down' ||
        this.getPositionDirection() === 'up'
      ) {
        this.panelText.x = 5
        this.panelText.y = this.rect.height - 15
      } else if (this.getPositionDirection() === 'right') {
        this.panelText.x = this.rect.width * this.assetColorPanelSizeRate + 5
        this.panelText.y = this.rect.height - 15
      }
    } else if (this.panel?.type === 'action') {
      switch (this.panel.actionType) {
        case 'jail':
          this.panelText.x = 65
          this.panelText.y = this.rect.height - 15
          break
        case 'start':
          this.panelText = new PIXI.Text(`${this.panel.name}`, {
            ...basicTextStyle,
            fontSize: 48,
          })
          this.panelText.x = 15
          this.panelText.y = 10
      }
    }

    this.view.addChild(this.panelText)
  }

  private drawPanelImage = () => {
    if (
      this.panel?.type === 'action' &&
      imageParamList[this.panel.actionType]
    ) {
      const imageParam = imageParamList[this.panel.actionType]
      this.panelImage = PIXI.Sprite.from(
        assetBasePath + imageParam.imageFileName
      )
      this.panelImage.x = imageParam.x
      this.panelImage.y = imageParam.y
      this.panelImage.scale.x = imageParam.scaleX
      this.panelImage.scale.y = imageParam.scaleY

      switch (this.panel.actionType) {
        case 'challenge':
          if (this.getPositionDirection() === 'down') {
            this.panelImage.x = 0
            this.panelImage.y = 25
          } else if (this.getPositionDirection() === 'left') {
            this.panelImage.x = 30
            this.panelImage.y = 0
          } else if (this.getPositionDirection() === 'right') {
            this.panelImage.x = 30
            this.panelImage.y = 0
          }
          break
        case 'chance':
          if (
            this.getPositionDirection() === 'down' ||
            this.getPositionDirection() === 'up'
          ) {
            this.panelImage.x = 0
            this.panelImage.y = 15
          } else if (this.getPositionDirection() === 'right') {
            this.panelImage.x = 40
            this.panelImage.y = 0
            this.panelImage.scale.x = 0.2
            this.panelImage.scale.y = 0.2
          }
          break
      }

      this.view.addChild(this.panelImage)
    } else if (
      this.panel?.type === 'asset' &&
      imageParamList[this.panel.assetId]
    ) {
      const imageParam = imageParamList[this.panel.assetId]
      this.panelImage = PIXI.Sprite.from(
        assetBasePath + imageParam.imageFileName
      )
      this.panelImage.x = imageParam.x
      this.panelImage.y = imageParam.y
      this.panelImage.scale.x = imageParam.scaleX
      this.panelImage.scale.y = imageParam.scaleY

      this.view.addChild(this.panelImage)
    }
  }

  private drawPlayerIconList = () => {
    this.playerIconList = []

    if (this.poolModel !== undefined) {
      let playerInFieldCount = 0
      let playerInJailCount = 0
      this.poolModel.playerListArray.forEach((player) => {
        if (this.panel && player.position === this.panel.position) {
          const playerIcon = PIXI.Sprite.from(assetBasePath + 'car.svg')
          playerIcon.tint = player.colorCode
          playerIcon.scale.x = 0.05
          playerIcon.scale.y = 0.05
          const playerIconHeight = 30

          if (
            this.panel?.type === 'action' &&
            this.panel.actionType === 'jail' &&
            player.isInJail
          ) {
            playerIcon.x = 30
            playerIcon.y = playerIconHeight * playerInJailCount
            this.playerIconList.push(playerIcon)
            playerInJailCount++
          } else {
            playerIcon.x = 5 + Math.floor(playerInFieldCount / 2) * 30
            playerIcon.y =
              playerIconHeight * (playerInFieldCount % 2) +
              this.rect.height * this.assetColorPanelSizeRate
            this.playerIconList.push(playerIcon)
            playerInFieldCount++
          }
        }
      })
    }

    this.playerIconList.forEach((playerIcon) => {
      this.view.addChild(playerIcon)
    })
  }

  private drawFacility = () => {
    if (this.panel?.type === 'asset') {
      if (this.panel.hotelCount > 0) {
        this.hotelIcon = PIXI.Sprite.from(assetBasePath + 'hotel.svg')
        this.hotelIcon.scale.x = 0.1
        this.hotelIcon.scale.y = 0.1

        if (
          this.getPositionDirection() === 'down' ||
          this.getPositionDirection() === 'up'
        ) {
          this.hotelIcon.x = 5
          this.hotelIcon.y = 5
        } else if (this.getPositionDirection() === 'left') {
          this.hotelIcon.x = 77
          this.hotelIcon.y = 5
        } else if (this.getPositionDirection() === 'right') {
          this.hotelIcon.x = 5
          this.hotelIcon.y = 5
        }

        this.view.addChild(this.hotelIcon)
      } else if (this.panel.shopCount > 0) {
        this.shopIcon = PIXI.Sprite.from(assetBasePath + 'shop.svg')
        this.shopIcon.scale.x = 0.1
        this.shopIcon.scale.y = 0.1

        const shopCountTextStyle = {
          fontFamily: 'Arial',
          fontSize: 15,
          fontWeight: 'bold',
          fill: 0x000000,
        }
        this.shopCountText = new PIXI.Text(
          `${this.panel.shopCount}`,
          shopCountTextStyle
        )

        if (
          this.getPositionDirection() === 'down' ||
          this.getPositionDirection() === 'up'
        ) {
          this.shopIcon.x = 5
          this.shopIcon.y = 5
          this.shopCountText.x = 25
          this.shopCountText.y = 5
        } else if (this.getPositionDirection() === 'left') {
          this.shopIcon.x = 77
          this.shopIcon.y = 5
          this.shopCountText.x = 81
          this.shopCountText.y = 20
        } else if (this.getPositionDirection() === 'right') {
          this.shopIcon.x = 5
          this.shopIcon.y = 5
          this.shopCountText.x = 9
          this.shopCountText.y = 20
        }

        this.view.addChild(this.shopIcon)
        this.view.addChild(this.shopCountText)
      }
    }
  }
}

const assetBasePath = '/assets/monopoly/'

const imageParamList: {
  [key: string]: {
    imageFileName: string
    x: number
    y: number
    scaleX: number
    scaleY: number
  }
} = {
  start: {
    imageFileName: 'initial.jpg',
    x: 15,
    y: 60,
    scaleX: 0.1,
    scaleY: 0.1,
  },
  challenge: {
    imageFileName: 'challenge.jpg',
    x: 0,
    y: 25,
    scaleX: 0.09,
    scaleY: 0.09,
  },
  tax: {
    imageFileName: 'tax.jpg',
    x: 2,
    y: 25,
    scaleX: 0.1,
    scaleY: 0.1,
  },
  free_parking: {
    imageFileName: 'free_parking.jpg',
    x: 0,
    y: 20,
    scaleX: 0.125,
    scaleY: 0.125,
  },
  chance: {
    imageFileName: 'chance.jpg',
    x: 0,
    y: 15,
    scaleX: 0.25,
    scaleY: 0.25,
  },
  jail: {
    imageFileName: 'jail.jpg',
    x: 30,
    y: 0,
    scaleX: 0.1,
    scaleY: 0.1,
  },
  go_to_jail: {
    imageFileName: 'go_to_jail.jpg',
    x: 15,
    y: 20,
    scaleX: 0.09,
    scaleY: 0.09,
  },
  commodity_tax: {
    imageFileName: 'commodity_tax.jpg',
    x: 40,
    y: 0,
    scaleX: 0.1,
    scaleY: 0.1,
  },
  south_station: {
    imageFileName: 'station.jpg',
    x: 0,
    y: 25,
    scaleX: 0.08,
    scaleY: 0.08,
  },
  electricity: {
    imageFileName: 'electricity.jpg',
    x: 50,
    y: 5,
    scaleX: 0.12,
    scaleY: 0.12,
  },
  west_station: {
    imageFileName: 'station.jpg',
    x: 30,
    y: 0,
    scaleX: 0.08,
    scaleY: 0.08,
  },
  north_station: {
    imageFileName: 'station.jpg',
    x: 0,
    y: 30,
    scaleX: 0.08,
    scaleY: 0.08,
  },
  water: {
    imageFileName: 'water.jpg',
    x: 0,
    y: 20,
    scaleX: 0.09,
    scaleY: 0.09,
  },
  east_station: {
    imageFileName: 'station.jpg',
    x: 30,
    y: 0,
    scaleX: 0.08,
    scaleY: 0.08,
  },
}
