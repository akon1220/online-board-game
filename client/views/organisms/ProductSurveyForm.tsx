import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { systemSelectors, systemOperations } from '@/state/ducks/system'
import axios from 'axios'
import { Button, Form, Modal } from 'semantic-ui-react'
import { SocketApp } from '@/socket_app/socket_app'
import { styleTheme } from '../style_theme'

type Props = {
  app: SocketApp | undefined
  gameName: string | undefined
}

const useInput = (initialValue: string) => {
  const [input, setInput] = useState<string>(initialValue)
  const reset = () => {
    setInput(initialValue)
  }
  const bind = {
    input,
    onChange: (
      e:
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLInputElement>
    ) => {
      setInput(e.target.value)
    },
  }
  return [input, bind, reset] as const
}
export const ProductSurveyForm: FC<Props> = (props) => {
  const dispatch = useDispatch()
  const isFormShown = useSelector(systemSelectors.isFormShown)
  console.log(isFormShown)
  const classes = useStyles()
  const [genreInput, bindGenreInput, resetGenreInput] = useInput('')
  const [gameInput, bindGameInput, resetGameInput] = useInput('')
  const [priceInput, bindPriceInput, resetPriceInput] = useInput('')
  const [msgInput, bindMsgInput, resetMsgInput] = useInput('')

  const GOOGLE_FORM_API_ENDPOINT = '/api/googleform'

  const { app, gameName } = props

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const data = {
      genreInput: gameName,
      gameInput,
      priceInput,
      msgInput,
    }
    axios.post(GOOGLE_FORM_API_ENDPOINT, data)
    handleCloseForm()
    resetGenreInput()
    resetGameInput()
    resetPriceInput()
    resetMsgInput()
    e.preventDefault()
  }
  const handleCloseForm = () => {
    app?.endGameRequest()
    dispatch(systemOperations.closeForm())
  }
  return (
    <Modal open={isFormShown}>
      <Modal.Header>
        この製品の改善のためにアンケート調査のご協力をお願いします。
      </Modal.Header>
      <Modal.Content>
        <Form action={GOOGLE_FORM_API_ENDPOINT} onSubmit={handleSubmit}>
          <Form.Field>
            <input id="genre" {...bindGenreInput} type="hidden" />
          </Form.Field>
          <Form.Field>
            <label htmlFor="game">他にプレイしたいゲームはありますか？</label>
            <input
              id="game"
              {...bindGameInput}
              placeholder="ポーカー、人狼、人生ゲーム・・・"
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="price">
              今遊んだゲームに買い切りでいくら払いますか？（10円単位でお願いします。）
            </label>
            <input
              id="price"
              type="number"
              name="entry.1184266257"
              placeholder="5000"
              min="0"
              step="10"
              {...bindPriceInput}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="request">
              その他、何かご要望やご意見があればお願いします。
            </label>
            <textarea
              id="request"
              name="entry.656434793"
              {...bindMsgInput}
            ></textarea>
          </Form.Field>
          <Button
            basic
            onClick={() => {
              handleCloseForm()
            }}
          >
            閉じる
          </Button>
          <Button
            type="submit"
            content="送信"
            className={classes.submitButton}
          ></Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}
const useStyles = createUseStyles({
  submitButton: {
    backgroundColor: `${styleTheme.primaryColor} !important`,
    color: 'white !important',
  },
})
export default ProductSurveyForm
