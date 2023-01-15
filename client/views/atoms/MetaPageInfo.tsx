import React, { FC } from 'react'
import { Helmet } from 'react-helmet'
import { pageBasicInfo } from '@/page_info'

type MetaElement = React.DetailedHTMLProps<
  React.MetaHTMLAttributes<HTMLMetaElement>,
  HTMLMetaElement
>

type Props = {
  metaInfoList?: MetaElement[]
  siteTitle?: string
}

export const MetaPageInfo: FC<Props> = ({ metaInfoList, siteTitle }) => {
  return (
    <Helmet meta={metaInfoList || defaultMetaInfoList}>
      <title>{siteTitle || defaultSiteTitle}</title>
      <link rel="canonical" href={pageBasicInfo.host} />
      <link rel="icon" href="/assets/favicon.ico" />
    </Helmet>
  )
}

const defaultSiteTitle = `${pageBasicInfo.name} | ${pageBasicInfo.summary}`

const defaultMetaInfoList: MetaElement[] = [
  {
    name: 'description',
    content: pageBasicInfo.description,
  },
  {
    property: 'og:type',
    content: pageBasicInfo.type,
  },
  {
    property: 'og:title',
    content: pageBasicInfo.title,
  },
  {
    property: 'og:url',
    content: location.href,
  },
  {
    property: 'og:description',
    content: pageBasicInfo.description,
  },
  {
    property: 'og:image',
    content: pageBasicInfo.image.url,
  },
  {
    property: 'og:image:type',
    content: pageBasicInfo.image.type,
  },
  {
    property: 'og:image:width',
    content: `${pageBasicInfo.image.width}`,
  },
  {
    property: 'og:image:height',
    content: `${pageBasicInfo.image.height}`,
  },
  {
    property: 'og:image:alt',
    content: pageBasicInfo.image.alt,
  },
]
