import { Router } from 'express'
import gamesRouter from './games_controller'
import googleFormRouter from './google_form_feedback'

const apiRouter = Router()

apiRouter.use('/games', gamesRouter)
apiRouter.use('/googleform', googleFormRouter)
export default apiRouter
