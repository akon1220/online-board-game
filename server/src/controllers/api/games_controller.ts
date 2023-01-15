import { Router } from 'express'
import { gameList, GameListItem } from './gameList'

const gamesRouter = Router()

gamesRouter.get('/', (req, res) => {
  const gameListCopy: GameListItem[] = JSON.parse(JSON.stringify(gameList))

  const body: {
    games: GameListItem[]
    preReleaseGames: GameListItem[]
  } = {
    games: gameListCopy
      .filter(
        (game) =>
          process.env.NODE_ENV !== 'production' || game.status === 'release'
      )
      .map((game) => {
        if (process.env.NODE_ENV !== 'production')
          game.acceptableMemberCount.unshift(1)
        return game
      }),
    preReleaseGames: gameList.filter(
      (game) => game.status === 'before release'
    ),
  }
  res.send(body)
})

export default gamesRouter
