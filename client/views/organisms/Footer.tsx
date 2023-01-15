import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import { Container, List } from 'semantic-ui-react'
import { PATH } from '@/constants'
import { styleTheme } from '@/views/style_theme'
import { pageBasicInfo } from '@/page_info'

export const Footer: FC = () => {
  const history = useHistory()
  const classes = useStyles()
  return (
    <div className={classes.footerStyle}>
      <Container>
        <div className={classes.footerTitleWrapper}>
          <img src="/assets/logo.svg" alt="" className={classes.footerImage} />
          <h3 className={classes.footerTitle}>{pageBasicInfo.name}</h3>
        </div>
        <List
          celled
          horizontal
          size="large"
          className={classes.footerInformation}
        >
          <List.Item
            as="a"
            onClick={() => history.push(PATH.WEBMASTER)}
            className={classes.footerLink}
          >
            運営者情報
          </List.Item>
          <List.Item
            as="a"
            onClick={() => history.push(PATH.CONTACT)}
            className={classes.footerLink}
          >
            お問い合わせ
          </List.Item>
        </List>
        <p className={classes.copyright}>
          © 2020 {pageBasicInfo.name} All rights reserved.
        </p>
      </Container>
    </div>
  )
}

const useStyles = createUseStyles({
  footerStyle: {
    backgroundColor: styleTheme.primaryColor,
    padding: '30px 0px 50px 0px',
    color: 'white',
    textAlign: 'center',
  },
  footerTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  footerImage: {
    width: 50,
    margin: '20px 10px 5px 0',
  },
  footerTitle: {
    fontSize: 30,
  },
  footerLink: {
    color: 'white !important',
  },
  footerInformation: {
    marginTop: 30,
    fontSize: 14,
  },
  copyright: {
    fontSize: 14,
    marginTop: 10,
  },
})
