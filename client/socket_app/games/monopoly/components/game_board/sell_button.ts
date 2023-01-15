import * as PIXI from 'pixi.js'
import { PoolModel, Panel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '../..'
import { GameBoardComponent } from './game_board_component'

export class SellButton extends GameBoardComponent {
  rect = new PIXI.Rectangle()
  poolModel: PoolModel | undefined
  view: PIXI.Container
  loader: PIXI.Loader
  background: PIXI.Graphics
  buttonText: PIXI.Text

  panel: Panel | undefined

  constructor(public app: MonopolyApp) {
    super()
    this.view = new PIXI.Container()
    this.loader = PIXI.Loader.shared
    this.background = new PIXI.Graphics()
    this.buttonText = new PIXI.Text('nan')

    this.view.on('pointerdown', () => {
      this.onClick()
    })
  }

  render = (
    rect: PIXI.Rectangle,
    poolModel: PoolModel | undefined,
    panel: Panel | undefined
  ) => {
    this.rect = rect
    this.poolModel = poolModel
    this.panel = panel

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
    if (
      this.poolModel?.isMyTurn &&
      this.panel?.type === 'asset' &&
      this.panel.shopCount === 0 &&
      this.panel.hotelCount === 0
    ) {
      this.app.startAssetSaleRequest(this.panel.assetId)
    }
  }

  private draw = () => {
    this.drawBackground()
    this.drawText()
  }

  private drawBackground = () => {
    this.background = new PIXI.Graphics()

    if (this.panel?.type === 'asset') {
      let backgroundColor
      if (
        this.poolModel?.isMyTurn &&
        this.panel.shopCount === 0 &&
        this.panel.hotelCount === 0
      ) {
        backgroundColor = 0xe91e63
      } else {
        backgroundColor = 0xc4c4c4
      }
      this.background.beginFill(backgroundColor)
      this.background.drawRoundedRect(
        0,
        0,
        this.rect.width,
        this.rect.height,
        5
      )
      this.background.endFill()

      this.view.addChild(this.background)
    } else {
      // empty
      this.background.drawRect(0, 0, this.rect.width, this.rect.height)
      this.background.endFill()
      this.background.interactive = true
      this.background.buttonMode = true

      this.view.addChild(this.background)
    }
  }

  private drawText = () => {
    const buttonTextStyle = {
      fontFamily: 'Arial',
      fontSize: 11,
      fontWeight: 'bold',
      fill: 0xffffff,
    }

    if (this.panel?.type === 'asset') {
      this.buttonText = new PIXI.Text('売却する', buttonTextStyle)
      this.buttonText.x = 5
      this.buttonText.y = 5

      this.view.addChild(this.buttonText)
    } else {
      this.buttonText = new PIXI.Text('')

      this.view.addChild(this.buttonText)
    }
  }
}
