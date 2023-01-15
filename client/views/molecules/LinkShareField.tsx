import React from 'react'
import copy from 'copy-to-clipboard'
import { Popup } from 'semantic-ui-react'
import { styleTheme } from '../style_theme'
import { createUseStyles } from 'react-jss'

export const LinkShareField = () => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.linkShareFieldWrapper}>
        <div className="ui action input">
          <input type="text" defaultValue={location.href} />
          <Popup
            trigger={
              <button
                className="ui icon left labeled button"
                style={{
                  backgroundColor: styleTheme.secondaryColor,
                  color: styleTheme.secondaryFontColor,
                }}
                onClick={() => copy(location.href)}
              >
                <i aria-hidden="true" className="copy icon"></i>
                コピーして招待
              </button>
            }
            content="リンクがコピーされました！"
            on="click"
            position="top center"
          />
        </div>
        <p className={classes.linkShareFieldHelp}>
          リンク共有で友達をかんたんに部屋に招待できます。
        </p>
      </div>
    </>
  )
}

const useStyles = createUseStyles({
  linkShareFieldWrapper: {
    marginBottom: '30px',
  },
  linkShareFieldHelp: {
    marginTop: '5px',
  },
})
