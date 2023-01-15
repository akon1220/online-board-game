import { Router } from 'express'

const htmlRouter = Router()

htmlRouter.get('/', (req, res) => {
  res.render('index.ejs')
})

export default htmlRouter
