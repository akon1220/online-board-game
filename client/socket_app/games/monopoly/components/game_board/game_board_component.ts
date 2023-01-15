import * as PIXI from 'pixi.js'
import { PoolModel } from '@/socket_events/games/monopoly/pool'

export class GameBoardComponent {
  view: PIXI.Container
  poolModel: PoolModel | undefined

  constructor() {
    this.view = new PIXI.Container()
  }

  public resetView = () => {
    while (this.view.children.length > 0) {
      this.view.children.forEach((child) => {
        this.view.removeChild(child)
        child.destroy()
      })
    }
  }
}
