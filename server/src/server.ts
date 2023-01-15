import express from 'express'
import path from 'path'
import { Server } from 'http'
import socket from 'socket.io'
import apiRouter from './controllers/api'
import htmlRouter from './controllers/html_controller'
import slackIconRouter from './controllers/slack_icon_controller'
import {
  joinHomeAppEvent,
  joinAppEvent,
  noAppFoundEvent,
} from './sockets/socket_events/system'
import { HomeApp } from './sockets/socket_app/home'
import { RoomApp } from './sockets/socket_app/room'
import { GamePool, GameId } from './sockets/socket_app/games'

const PORT = 3000
const app: express.Express = express()
const http = new Server(app)
const io = socket(http)

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, '..', 'views'))
app.use(express.static(path.resolve(__dirname, '..', '..', 'public')))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use('/api', apiRouter)

app.use('/((room|game)/*)?', htmlRouter)
app.use('/webmaster', htmlRouter)
app.use('/contact', htmlRouter)
app.use('/slackicon', slackIconRouter)

io.on('connection', (sock) => {
  const joinHomeAppEv = joinHomeAppEvent(sock).handle(() => {
    joinHomeAppEv.unhandle()
    HomeApp.delegate(sock)
  })
  const joinAppEv = joinAppEvent(sock).handle(({ appId, appUUID }) => {
    joinAppEv.unhandle()
    if (appId === 'room') {
      RoomApp.delegate(sock, appUUID)
      return
    }
    const GameApp = GamePool[appId as GameId]
    if (GameApp === undefined) {
      noAppFoundEvent(sock).emit('')
    }
    GameApp.delegate(sock, appUUID)
  })
})

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
