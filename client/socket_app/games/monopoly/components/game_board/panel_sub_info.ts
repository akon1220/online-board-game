import * as PIXI from 'pixi.js'
import { PoolModel, Panel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '../..'
import { assetList } from '@/socket_events/games/monopoly/assetList.data'
import { BuyButton } from './buy_button'
import { SellButton } from './sell_button'
import { ChangeFacilityButton } from './change_facility_button'
import { MortgageButton } from './mortgage_button'
import { ReleaseMortgageButton } from './release_mortgage_button'
import { GameBoardComponent } from './game_board_component'

export class PanelSubInfo extends GameBoardComponent {
  rect = new PIXI.Rectangle()

  loader: PIXI.Loader
  background: PIXI.Graphics
  position: number | undefined
  title: PIXI.Text
  description: PIXI.Text

  panel: Panel | undefined

  changeFacilityButton: ChangeFacilityButton
  buyButton: BuyButton
  sellButton: SellButton
  mortgageButton: MortgageButton
  releaseMortgageButton: ReleaseMortgageButton

  constructor(public app: MonopolyApp) {
    super()
    this.view = new PIXI.Container()
    this.loader = PIXI.Loader.shared
    this.background = new PIXI.Graphics()
    this.title = new PIXI.Text('')
    this.description = new PIXI.Text('')

    this.changeFacilityButton = new ChangeFacilityButton(this.app)
    this.buyButton = new BuyButton(this.app)
    this.sellButton = new SellButton(this.app)
    this.mortgageButton = new MortgageButton(this.app)
    this.releaseMortgageButton = new ReleaseMortgageButton(this.app)
  }

  render = (
    rect: PIXI.Rectangle,
    position: number | undefined,
    poolModel: PoolModel | undefined
  ) => {
    this.rect = rect

    this.view.x = this.rect.x
    this.view.y = this.rect.y
    this.view.width = this.rect.width
    this.view.height = this.rect.height

    this.position = position
    this.poolModel = poolModel
    if (this.position) this.panel = this.poolModel?.panelList[this.position]

    this.resetView()

    this.draw()

    if (this.panel?.type === 'action') {
      this.resetView()
    }
  }

  private draw = () => {
    this.drawBackground()
    this.drawTitle()
    this.drawDescription()
    this.drawButtons()
  }

  private drawBackground = () => {
    this.background = new PIXI.Graphics()

    if (this.position && this.panel?.type === 'asset') {
      const lineWidth = 2
      const lineColor = 0x000000
      const lineAlpha = 1
      this.background.lineStyle(lineWidth, lineColor, lineAlpha)
      this.background.beginFill(0xfffffff)
      this.background.drawRect(0, 0, this.rect.width, this.rect.height)
      this.background.endFill()

      this.view.addChild(this.background)
    } else {
      // render empty
      const lineWidth = 0
      const lineColor = 0x000000
      const lineAlpha = 1
      this.background.lineStyle(lineWidth, lineColor, lineAlpha)
      this.background.drawRect(0, 0, this.rect.width, this.rect.height)
      this.background.endFill()

      this.view.addChild(this.background)
    }
  }

  private drawTitle = () => {
    if (this.position && this.panel?.type === 'asset') {
      const titleTextStyle = {
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold',
        fill: 0x000000,
      }
      if (this.panel?.type === 'asset' && !this.panel.isMortgaged) {
        this.title = new PIXI.Text(
          `${assetList[this.panel.assetId].name}`,
          titleTextStyle
        )
      } else if (this.panel?.type === 'asset' && this.panel.isMortgaged) {
        this.title = new PIXI.Text(
          `${assetList[this.panel.assetId].name}(抵当)`,
          titleTextStyle
        )
      } else {
        this.title = new PIXI.Text(`${''}`, titleTextStyle)
      }
      this.title.x = 5
      this.title.y = 5
      this.view.addChild(this.title)
    }
  }

  private drawDescription = () => {
    if (this.position && this.panel?.type === 'asset') {
      const descriptionTextStyle = {
        fontFamily: 'Arial',
        fontSize: 15,
        fontWeight: 'bold',
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: this.rect.width - 10,
        breakWords: true,
      }
      const asset = assetList[this.panel.assetId]
      this.description = new PIXI.Text(
        `
抵当価格: ${asset.mortgagePrice}万円
利息価格: ${asset.interestPrice}万円

所有者: ${
          this.panel.playerId
            ? this.poolModel?.players[this.panel.playerId].userName
            : 'なし'
        }
            `,
        descriptionTextStyle
      )
      this.description.x = 5
      this.description.y = 30
      this.view.addChild(this.description)
    }
  }

  private drawButtons = () => {
    this.drawChangeFacilityButton()

    this.drawBuyButton()

    this.drawSellButton()

    this.drawMortgageButton()

    this.drawReleaseMortgageButton()
  }

  private drawChangeFacilityButton = () => {
    if (this.position && this.poolModel?.isMyAsset(this.panel)) {
      const margin = 10
      const changeFacilityButtonY =
        this.title.y + this.description.height + margin
      this.changeFacilityButton = new ChangeFacilityButton(this.app)
      this.changeFacilityButton.render(
        new PIXI.Rectangle(5, changeFacilityButtonY, 90, 25),
        this.poolModel,
        this.panel
      )

      this.view.addChild(this.changeFacilityButton.view)
    }
  }

  private drawBuyButton = () => {
    if (this.position && this.poolModel?.isOtherPlayerAsset(this.panel)) {
      const margin = 10
      const buyButtonY = this.title.y + this.description.height + margin
      this.buyButton = new BuyButton(this.app)
      this.buyButton.render(
        new PIXI.Rectangle(5, buyButtonY, 80, 25),
        this.poolModel,
        this.panel
      )
      this.view.addChild(this.buyButton.view)
    }
  }

  private drawSellButton = () => {
    if (this.position && this.poolModel?.isMyAsset(this.panel)) {
      const margin = 40
      const sellButtonY = this.title.y + this.description.height + margin
      this.sellButton = new SellButton(this.app)
      this.sellButton.render(
        new PIXI.Rectangle(5, sellButtonY, 80, 25),
        this.poolModel,
        this.panel
      )

      this.view.addChild(this.sellButton.view)
    }
  }

  private drawMortgageButton = () => {
    if (
      this.position &&
      this.poolModel?.isMyAsset(this.panel) &&
      !this.poolModel?.isMortgaged(this.panel)
    ) {
      const margin = 70
      const mortgageButtonY = this.title.y + this.description.height + margin
      this.mortgageButton = new MortgageButton(this.app)
      this.mortgageButton.render(
        new PIXI.Rectangle(5, mortgageButtonY, 80, 25),
        this.poolModel,
        this.panel
      )
      this.view.addChild(this.mortgageButton.view)
    }
  }

  private drawReleaseMortgageButton = () => {
    if (
      this.position &&
      this.poolModel?.isMyAsset(this.panel) &&
      this.poolModel?.isMortgaged(this.panel)
    ) {
      const margin = 70
      const releaseMortgageButtonY =
        this.title.y + this.description.height + margin
      this.releaseMortgageButton = new ReleaseMortgageButton(this.app)
      this.releaseMortgageButton.render(
        new PIXI.Rectangle(5, releaseMortgageButtonY, 80, 25),
        this.poolModel,
        this.panel
      )
      this.view.addChild(this.releaseMortgageButton.view)
    }
  }
}
