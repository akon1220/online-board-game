import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import { Menu, Container } from 'semantic-ui-react'
import { PATH } from '@/constants'
import { styleTheme } from '@/views/style_theme'
import { pageBasicInfo } from '@/page_info'

export const Navbar: FC = () => {
  const history = useHistory()
  const classes = useStyles()
  return (
    <div className={classes.navbarStyle}>
      <Menu inverted pointing secondary className={classes.navbarMenu}>
        <Container>
          <div className={classes.navbarContainer}>
            <img className={classes.navbarLogo} src="/assets/logo.svg" />
            <Menu.Item className={classes.item}>{pageBasicInfo.name}</Menu.Item>
            <Menu.Item
              active={PATH.HOME === location.pathname}
              as="a"
              onClick={() => history.push(PATH.HOME)}
              className={classes.activeItem}
            >
              ゲーム一覧
            </Menu.Item>
          </div>
          <div className={classes.versionBeta}>
            <p>テスト版</p>
          </div>
        </Container>
      </Menu>
    </div>
  )
}

const useStyles = createUseStyles({
  navbarStyle: {
    borderRadius: 0,
    backgroundColor: `${styleTheme.primaryColor}`,
    paddingTop: '0.5vh',
    height: '80px',
  },
  navbarLogo: {
    display: 'block !important',
    width: '45px',
    paddingTop: '10px',
    paddingBottom: '15px',
  },
  navbarContainer: {
    display: 'flex !important',
    alignItems: 'center !important',
  },
  navbarMenu: {
    color: 'white',
    border: `2px solid ${styleTheme.primaryColor} !important`,
  },
  item: {
    display: 'block !important',
    border: `0 solid ${styleTheme.primaryColor} !important`,
    height: '45px',
    fontSize: '20px',
    padding: '10px 10px 15px 10px !important',
    margin: '0px 0px 8px 0px !important',
    color: 'white !important',
  },
  activeItem: {
    display: 'block !important',
    border: `0 solid ${styleTheme.primaryColor} !important`,
    padding: '10px 10px 15px 10px !important',
    margin: '0px 0px 8px 0px !important',
    fontSize: '20px',
  },
  versionBeta: {
    fontSize: '20px',
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
})
