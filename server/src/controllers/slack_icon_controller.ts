import { Router } from 'express'

const slackIconRouter = Router()

slackIconRouter.get('/', (req, res) => {
  const icons = ['hirose.jpg', 'yoshioka.jpeg', 'hashimoto.png']
  const image = icons[Math.floor(Math.random() * icons.length)]
  const imageUrl = `/assets/slack-icons/${image}`
  res.header('Content-Type', 'text/plain;charset=utf-8')
  res.end(imageUrl)
})

export default slackIconRouter
