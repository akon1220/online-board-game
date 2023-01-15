/* eslint-disable @typescript-eslint/camelcase */
import { NoopGameApp } from './noop'
import { SimpleChatGameApp } from './simple_chat'
import { ShiritoriGameApp } from './shiritori'
import { SeaTurtleSoupGameApp } from './sea_turtle_soup'
import { VultureGameApp } from './vulture'
import { MonopolyGameApp } from './monopoly'
import { CatanGameApp } from './catan'
import { GhostGameApp } from './ghost'
import { WordWolfGameApp } from './word_wolf'

export const GamePool = {
  noop: NoopGameApp,
  simple_chat: SimpleChatGameApp,
  shiritori: ShiritoriGameApp,
  sea_turtle_soup: SeaTurtleSoupGameApp,
  vulture: VultureGameApp,
  monopoly: MonopolyGameApp,
  catan: CatanGameApp,
  ghost: GhostGameApp,
  word_wolf: WordWolfGameApp,
}

export type GameId = keyof typeof GamePool
