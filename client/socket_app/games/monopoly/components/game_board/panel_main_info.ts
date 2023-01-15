import * as PIXI from 'pixi.js'
import { PoolModel, Panel } from '@/socket_events/games/monopoly/pool'
import { MonopolyApp } from '../..'
import { assetList } from '@/socket_events/games/monopoly/assetList.data'
import { GameBoardComponent } from './game_board_component'

export class PanelMainInfo extends GameBoardComponent {
  rect = new PIXI.Rectangle()

  loader: PIXI.Loader
  background: PIXI.Graphics
  position: number | undefined
  title: PIXI.Text
  description: PIXI.Text
  currentTollText: PIXI.Text

  panel: Panel | undefined

  constructor(public app: MonopolyApp) {
    super()
    this.view = new PIXI.Container()
    this.loader = PIXI.Loader.shared
    this.background = new PIXI.Graphics()
    this.title = new PIXI.Text('')
    this.description = new PIXI.Text('')
    this.currentTollText = new PIXI.Text('')
  }

  render = (
    rect: PIXI.Rectangle,
    position: number | undefined,
    poolModel: PoolModel | undefined
  ) => {
    this.rect = rect

    this.position = position
    this.poolModel = poolModel
    if (this.position) this.panel = this.poolModel?.panelList[this.position]

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
    this.drawCurrentTollText()
  }

  private drawBackground = () => {
    this.background = new PIXI.Graphics()

    if (this.position) {
      const lineWidth = 2
      const lineColor = 0x000000
      const lineAlpha = 1
      this.background.lineStyle(lineWidth, lineColor, lineAlpha)
      this.background.beginFill(0xfffffff)
      this.background.drawRect(0, 0, this.rect.width, this.rect.height)
      this.background.endFill()
      this.view.addChild(this.background)
    }
  }

  private drawTitle = () => {
    if (this.position) {
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
      } else if (this.panel?.type === 'action') {
        this.title = new PIXI.Text(`${this.panel.name}`, titleTextStyle)
      }

      this.title.x = 5
      this.title.y = 5
      this.view.addChild(this.title)
    }
  }

  private drawDescription = () => {
    if (this.position) {
      const descriptionTextStyle = {
        fontFamily: 'Arial',
        fontSize: 11,
        fontWeight: 'bold',
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: this.rect.width - 10,
        breakWords: true,
      }
      if (this.panel?.type === 'asset') {
        const asset = assetList[this.panel.assetId]

        switch (asset.type) {
          case 'private':
            this.description = new PIXI.Text(
              `
購入価格: ${asset.price}万円
通行料: ${asset.defaultToll}万円
同色資産を独占: ${2 * (asset.defaultToll as number)}万円
店1軒: ${asset.oneShopToll}万円
店2軒: ${asset.twoShopToll}万円
店3軒: ${asset.threeShopToll}万円
店4軒: ${asset.fourShopToll}万円
ホテル: ${asset.hotelToll}万円
店・ホテルの建設費: ${asset.constructionCost}万円
          `,
              descriptionTextStyle
            )
            break
          case 'station':
            this.description = new PIXI.Text(
              `
購入価格: ${asset.price}万円
利用料
1つ鉄道を所有: ${asset.oneCompleteToll}万円
2つ鉄道を所有: ${asset.twoCompleteToll}万円
3つ鉄道を所有: ${asset.threeCompleteToll}万円
4つ鉄道を所有: ${asset.fourCompleteToll}万円
          `,
              descriptionTextStyle
            )
            break
          case 'energy':
            this.description = new PIXI.Text(
              `
購入価格: ${asset.price}万円
利用料
電力会社か水道会社片方のみ所有: サイコロの目の${asset.singleDiceCoefficient}倍(万円)
電力会社と水道会社両方所有: サイコロの目の${asset.multiDiceCoefficient}倍(万円)
          `,
              descriptionTextStyle
            )
            break
        }
      } else if (this.panel?.type === 'action') {
        switch (this.panel.actionType) {
          case 'start':
            this.description = new PIXI.Text(
              `
このマスを通過したら200万円受け取る
          `,
              descriptionTextStyle
            )
            break
          case 'challenge':
            this.description = new PIXI.Text(
              `
このマスを通過したらチャレンジカードをランダムで引く
          `,
              descriptionTextStyle
            )
            break
          case 'chance':
            this.description = new PIXI.Text(
              `
このマスに止まったらチャンスカードをランダムで引く
          `,
              descriptionTextStyle
            )
            break
          case 'commodity_tax':
            this.description = new PIXI.Text(
              `
このマスに止まったら75万円の税金が徴収される。
            `,
              descriptionTextStyle
            )
            break
          case 'tax':
            this.description = new PIXI.Text(
              `
このマスに止まったら200万円の税金が徴収される。
            `,
              descriptionTextStyle
            )
            break
          case 'free_parking':
            this.description = new PIXI.Text(
              `
特に何も起こらない。
            `,
              descriptionTextStyle
            )
            break
          case 'go_to_jail':
            this.description = new PIXI.Text(
              `
このマスに止まったら刑務所に入る。
              `,
              descriptionTextStyle
            )
            break
          case 'jail':
            this.description = new PIXI.Text(
              `
マスに止まっても何も起こらない。
刑務所に入った場合このマスで拘留される。
                `,
              descriptionTextStyle
            )
            break
        }
      }
      this.description.x = 5
      this.description.y = 20
      this.view.addChild(this.description)
    }
  }

  private drawCurrentTollText = () => {
    if (this.position && this.panel?.type === 'asset' && this.panel.playerId) {
      const currentTollTextStyle = {
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 'bold',
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: this.rect.width - 10,
        breakWords: true,
      }

      this.currentTollText = new PIXI.Text(
        `現在の通行料: ${this.poolModel?.calculateAssetToll(
          this.panel.playerId,
          this.panel.assetId
        )}万円`,
        currentTollTextStyle
      )

      this.currentTollText.x = 5
      this.currentTollText.y = this.description.y + this.description.height

      this.view.addChild(this.currentTollText)
    }
  }
}
