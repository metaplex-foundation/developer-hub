import Head from 'next/head'

import { Layout } from '@/components/Layout'
import { DialectProvider } from '@/components/DialectContext'
import { usePage } from '@/shared/usePage'

import '@/styles/tailwind.css'
import 'focus-visible'
import 'reactflow/dist/base.css'

// Add Prism components.
import { Prism } from 'prism-react-renderer'
import { useEffect } from 'react'
;(typeof global !== 'undefined' ? global : window).Prism = Prism
require('prismjs/components/prism-rust')

export default function App({ Component, pageProps }) {
  const page = usePage(pageProps)
  console.log({ page })

  return (
    <>
      <Head>
        <title>{page.metaTitle}</title>
        {page.description && (
          <meta name="description" content={page.description} />
        )}
      </Head>
      <DialectProvider>
        <Layout page={page}>
          <Component {...pageProps} />
        </Layout>
      </DialectProvider>
    </>
  )
}
