import * as PIXI from 'pixi.js'
import { PoolModel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '@/socket_app/games/monopoly'
import { BoardBackground } from './board_background'
import { PanelView } from './panel'
import { EventCard } from './event_card'
import { PanelMainInfo } from './panel_main_info'
import { PanelSubInfo } from './panel_sub_info'
import { styleTheme } from '../../style_theme'

export class ViewController {
  pixiApp!: PIXI.Application
  width: number
  height: number
  boardBackground: BoardBackground
  eventCard: EventCard
  panelMainInfo: PanelMainInfo
  panelSubInfo: PanelSubInfo
  panelList: PanelView[]
  private poolModel: PoolModel | undefined

  constructor(public root: HTMLElement, public app: MonopolyApp) {
    this.boardBackground = new BoardBackground(this.app)
    this.eventCard = new EventCard(this.app)
    this.panelMainInfo = new PanelMainInfo(this.app)
    this.panelSubInfo = new PanelSubInfo(this.app)
    this.panelList = this.boardPanelParamList().map(
      () => new PanelView(this.app)
    )

    this.width = 800
    this.height = 800

    this.updatePixiApp()
    window.addEventListener('resize', () => {
      this.root.removeChild(this.pixiApp.view)
      this.updatePixiApp()
    })
  }

  updatePixiApp = () => {
    this.pixiApp = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: styleTheme.backgroundColor,
      resolution:
        window.innerWidth > 1500 ? 1.0 : window.innerWidth / 5000 + 0.6,
    })

    this.root.appendChild(this.pixiApp.view)
    this.pixiApp.stage.addChild(this.boardBackground.view)
    this.pixiApp.stage.addChild(this.eventCard.view)
    this.pixiApp.stage.addChild(this.panelMainInfo.view)
    this.pixiApp.stage.addChild(this.panelSubInfo.view)
    this.panelList.forEach((panel) => {
      this.pixiApp.stage.addChild(panel.view)
    })
  }

  updatePool = (poolModel: PoolModel) => {
    this.poolModel = poolModel
    this.render()
  }

  render = () => {
    const eventCardWidth = 240
    const eventCardHeight = 160
    this.eventCard.render(
      new PIXI.Rectangle(
        (this.width - eventCardWidth) / 2,
        ((this.height * 3) / 5 - eventCardHeight) / 2,
        eventCardWidth,
        eventCardHeight
      ),
      this.poolModel
    )

    const panelInfoWidth = 160
    const panelInfoHeight = 240

    this.panelMainInfo.render(
      new PIXI.Rectangle(
        ((this.width * 3) / 5 - panelInfoWidth) / 2,
        ((this.height * 7) / 5 - panelInfoHeight) / 2,
        panelInfoWidth,
        panelInfoHeight
      ),
      this.app.shownPanelDetail,
      this.poolModel
    )

    this.panelSubInfo.render(
      new PIXI.Rectangle(
        ((this.width * 7) / 5 - panelInfoWidth) / 2,
        ((this.height * 7) / 5 - panelInfoHeight) / 2,
        panelInfoWidth,
        panelInfoHeight
      ),
      this.app.shownPanelDetail,
      this.poolModel
    )

    this.boardBackground.render(
      new PIXI.Rectangle(0, 0, this.width, this.height),
      this.poolModel
    )

    this.boardPanelParamList().forEach((panel, idx) => {
      if (this.poolModel) {
        this.panelList[idx].render(
          new PIXI.Rectangle(panel.x + 1, panel.y, panel.width, panel.height),
          this.poolModel.panelList[idx],
          this.poolModel
        )
      }
    })
  }

  start = () => {
    this.render()
  }

  boardPanelParamList = () => {
    const boardPanelList: {
      x: number
      y: number
      width: number
      height: number
    }[] = []
    boardPanelList.push({
      x: this.width * (7 / 8),
      y: this.height * (7 / 8),
      width: this.width / 8,
      height: this.height / 8,
    })
    for (let i = 8; i >= 0; i--) {
      boardPanelList.push({
        x: i * (this.width / 12) + this.width / 8,
        y: this.height * (7 / 8),
        width: this.width / 12,
        height: this.height / 8,
      })
    }

    boardPanelList.push({
      x: 0,
      y: this.height * (7 / 8),
      width: this.width / 8,
      height: this.height / 8,
    })
    for (let i = 8; i >= 0; i--) {
      boardPanelList.push({
        x: 0,
        y: i * (this.height / 12) + this.height / 8,
        width: this.width / 8,
        height: this.height / 12,
      })
    }

    boardPanelList.push({
      x: 0,
      y: 0,
      width: this.width / 8,
      height: this.height / 8,
    })
    for (let i = 0; i <= 8; i++) {
      boardPanelList.push({
        x: i * (this.width / 12) + this.width / 8,
        y: 0,
        width: this.width / 12,
        height: this.height / 8,
      })
    }

    boardPanelList.push({
      x: this.width * (7 / 8),
      y: 0,
      width: this.width / 8,
      height: this.height,
    })
    for (let i = 0; i <= 8; i++) {
      boardPanelList.push({
        x: this.width * (7 / 8),
        y: i * (this.height / 12) + this.height / 8,
        width: this.width / 8,
        height: this.height / 12,
      })
    }

    return boardPanelList
  }
}
