import Head from 'next/head'
import Script from 'next/script'

import { Layout } from '@/components/Layout'
import { DialectProvider } from '@/components/DialectContext'
import { usePage } from '@/shared/usePage'

import '@/styles/tailwind.css'
import 'focus-visible'
import 'reactflow/dist/base.css'
import '@/styles/extra.css'

// Add Prism components.
import { Prism } from 'prism-react-renderer'
;(typeof global !== 'undefined' ? global : window).Prism = Prism
require('prismjs/components/prism-rust')

// Ask Cookbook (AI Assistant) integration.
import AskCookbook from '../components/AskCookbook'

export default function App({ Component, pageProps }) {
  const page = usePage(pageProps)
  console.log({ page })

  return (
    <>
      <Head>
        <title>{page.metaTitle}</title>
        <meta property="og:title" content={page.metaTitle} />
        <meta name="twitter:title" content={page.metaTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="developers.metaplex.com" />
        <meta
          property="og:image"
          content="https://developers.metaplex.com/assets/social/dev-hub-preview.jpg"
        />
        <meta
          name="twitter:image"
          content="https://developers.metaplex.com/assets/social/dev-hub-preview.jpg"
        />

        {page.description && (
          <>
            <meta name="description" content={page.description} />
            <meta property="og:description" content={page.description} />
            <meta name="twitter:description" content={page.description} />
          </>
        )}
      </Head>

      <DialectProvider>
        <Layout page={page}>
          <Component {...pageProps} />
        </Layout>
      </DialectProvider>

      {/* Google Analytics. */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-PJMQZF1F4X" />
      <Script id="google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PJMQZF1F4X');
          `}
      </Script>
      <AskCookbook />
    </>
  )
}
