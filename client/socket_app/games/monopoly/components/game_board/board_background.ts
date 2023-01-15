import * as PIXI from 'pixi.js'
import { PoolModel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '../..'
import { GameBoardComponent } from './game_board_component'

export class BoardBackground extends GameBoardComponent {
  rect = new PIXI.Rectangle()
  loader: PIXI.Loader
  background: PIXI.Graphics

  constructor(public app: MonopolyApp) {
    super()
    this.view = new PIXI.Container()
    this.loader = PIXI.Loader.shared
    this.background = new PIXI.Graphics()
  }

  render = (rect: PIXI.Rectangle, poolModel: PoolModel | undefined) => {
    this.rect = rect
    this.poolModel = poolModel
    this.resetView()

    this.view.x = this.rect.x
    this.view.y = this.rect.y
    this.view.width = this.rect.width
    this.view.height = this.rect.height

    this.draw()
  }

  private draw = () => {
    this.drawBackground()
  }

  private drawBackground = () => {
    this.background = new PIXI.Graphics()

    const lineWidth = 1
    const lineColor = 0x000000
    const lineAlpha = 1
    this.background.lineStyle(lineWidth, lineColor, lineAlpha)

    const baseBoardPanelList: {
      x: number
      y: number
      width: number
      height: number
    }[] = [
      {
        x: this.rect.width / 8,
        y: this.rect.height / 8,
        width: this.rect.width * (3 / 4),
        height: this.rect.height * (3 / 4),
      },
      { x: 0, y: 0, width: this.rect.width, height: this.rect.height },
    ]

    baseBoardPanelList.forEach((panel) => {
      this.background.drawRect(
        panel.x + 1,
        panel.y,
        panel.width - lineWidth,
        panel.height - lineWidth
      )
    })
    this.background.endFill()

    this.view.addChild(this.background)
  }
}
