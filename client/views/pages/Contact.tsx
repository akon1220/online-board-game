import React from 'react'
import { Container, Item } from 'semantic-ui-react'
import { Navbar } from '../organisms/Navbar'
import { Footer } from '../organisms/Footer'
import { createUseStyles } from 'react-jss'
import { MetaPageInfo } from '../atoms/MetaPageInfo'
import { pageBasicInfo } from '@/page_info'

export const Contact = () => {
  const classes = useStyles()

  return (
    <>
      <MetaPageInfo />
      <Navbar />
      <div className={classes.contactWrapper}>
        <Container>
          <Item.Content className={classes.contactContainer}>
            <Item.Header as="h2">問い合わせ</Item.Header>
            <p>
              {pageBasicInfo.contactEmail}のメールアドレスにご連絡ください。
            </p>
          </Item.Content>
        </Container>
      </div>
      <Footer />
    </>
  )
}

const useStyles = createUseStyles({
  contactWrapper: {
    height: 'calc(100vh - 300px)',
  },
  contactContainer: {
    paddingTop: 40,
  },
})
