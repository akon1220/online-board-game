import * as PIXI from 'pixi.js'
import { PoolModel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '../..'
import { GameBoardComponent } from './game_board_component'

export class EventCard extends GameBoardComponent {
  rect = new PIXI.Rectangle()
  loader: PIXI.Loader
  background: PIXI.Graphics
  title: PIXI.Text
  description: PIXI.Text

  constructor(public app: MonopolyApp) {
    super()
    this.loader = PIXI.Loader.shared
    this.background = new PIXI.Graphics()
    this.title = new PIXI.Text('')
    this.description = new PIXI.Text('')
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
    this.drawTitle()
    this.drawDescription()
  }

  private drawBackground = () => {
    this.background = new PIXI.Graphics()

    const lineWidth = 1
    const lineColor = 0x000000
    const lineAlpha = 1
    const backgroundColor = 0xffffff
    if (
      this.poolModel &&
      (this.poolModel.chanceCard !== null ||
        this.poolModel.challengeCard !== null)
    ) {
      this.background.beginFill(backgroundColor)
      this.background.lineStyle(lineWidth, lineColor, lineAlpha)
      this.background.drawRect(0, 0, this.rect.width, this.rect.height)
      this.background.endFill()
      this.view.addChild(this.background)
    }
  }

  private drawTitle = () => {
    const titleTextStyle = {
      fontFamily: 'Arial',
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: this.rect.width - 10,
      breakWords: true,
      fill: 0x000000,
    }

    if (this.poolModel && this.poolModel.chanceCard !== null) {
      this.title = new PIXI.Text(`チャンス`, {
        ...titleTextStyle,
        fontSize: 24,
      })
      this.title.x = 5
      this.title.y = 5

      this.view.addChild(this.title)
    } else if (this.poolModel && this.poolModel.challengeCard !== null) {
      this.title = new PIXI.Text(`チャレンジ`, {
        ...titleTextStyle,
        fontSize: 24,
      })
      this.title.x = 5
      this.title.y = 5

      this.view.addChild(this.title)
    }
  }

  private drawDescription = () => {
    const descriptionTextStyle = {
      fontFamily: 'Arial',
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: this.rect.width - 10,
      breakWords: true,
      fill: 0x000000,
    }

    if (this.poolModel && this.poolModel.chanceCard !== null) {
      this.description = new PIXI.Text(
        `${this.poolModel.chanceCard.description}`,
        {
          ...descriptionTextStyle,
          fontSize: 15,
        }
      )
      this.description.x = 5
      this.description.y = 60
      this.view.addChild(this.description)
    } else if (this.poolModel && this.poolModel.challengeCard !== null) {
      this.description = new PIXI.Text(
        `${this.poolModel.challengeCard.description}`,
        { ...descriptionTextStyle, fontSize: 15 }
      )
      this.description.x = 5
      this.description.y = 60
      this.view.addChild(this.description)
    }
  }
}
