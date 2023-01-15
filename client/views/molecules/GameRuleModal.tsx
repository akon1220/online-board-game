import React, { FC } from 'react'
import { Modal } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import { GameListTypes } from '@/state/ducks/game_list'

type Props = {
  triggerButton: React.ReactNode
  game: GameListTypes.Game
}

export const GameRuleModal: FC<Props> = ({ triggerButton, game }) => {
  return (
    <>
      <Modal trigger={triggerButton} size="large">
        <Modal.Header>{game.name}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <ReactMarkdown
              source={game.rule}
              escapeHtml={false}
              renderers={{
                // eslint-disable-next-line react/display-name
                link: (props) => (
                  <a
                    href={props.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {props.children}
                  </a>
                ),
              }}
            />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  )
}
