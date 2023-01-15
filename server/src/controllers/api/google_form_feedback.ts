import { Router } from 'express'
import axios from 'axios'
import FormData from 'form-data'
const googleFormRouter = Router()
const GOOGLE_FORM_ENDPOINT =
  'https://docs.google.com/forms/u/4/d/e/1FAIpQLScxH1AEC4LQ6_yo9tC4xNKubo7In2_MIifzlEHJ-KhF8aXmRw/formResponse'
const GENRE_ENTRY = 'entry.556749088'
const GAME_ENTRY = 'entry.1294001289'
const PRICE_ENTRY = 'entry.1184266257'
const MSG_ENTRY = 'entry.656434793'

googleFormRouter.post('/', (req, res) => {
  res.send('ok')
  const formData = new FormData()
  formData.append(GAME_ENTRY, req.body.gameInput)
  formData.append(PRICE_ENTRY, req.body.priceInput)
  formData.append(MSG_ENTRY, req.body.msgInput)
  formData.append(GENRE_ENTRY, req.body.genreInput)
  axios.post(GOOGLE_FORM_ENDPOINT, formData, {
    headers: formData.getHeaders(),
  })
})

export default googleFormRouter
