import React from 'react'
import { Container, Item } from 'semantic-ui-react'
import { Navbar } from '../organisms/Navbar'
import { Footer } from '../organisms/Footer'
import { createUseStyles } from 'react-jss'
import { MetaPageInfo } from '../atoms/MetaPageInfo'
import { pageBasicInfo } from '@/page_info'

export const Webmaster = () => {
  const classes = useStyles()
  return (
    <>
      <MetaPageInfo />
      <Navbar />
      <div className={classes.webmasterWrapper}>
        <Container>
          <Item.Content className={classes.webmasterContainer}>
            <Item.Header as="h2">運営者情報</Item.Header>
            <p>運営者: {pageBasicInfo.masterList.join(', ')}</p>
            <p>メールアドレス: {pageBasicInfo.contactEmail}</p>
          </Item.Content>
        </Container>
      </div>
      <Footer />
    </>
  )
}

const useStyles = createUseStyles({
  webmasterWrapper: {
    height: 'calc(100vh - 300px)',
  },
  webmasterContainer: {
    paddingTop: 40,
  },
})
