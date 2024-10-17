import Head from 'next/head'
import Script from 'next/script'

import { DialectProvider } from '@/components/DialectContext'
import { Layout } from '@/components/Layout'
import { usePage } from '@/shared/usePage'

import '@/styles/extra.css'
import '@/styles/tailwind.css'
import 'focus-visible'
import 'reactflow/dist/base.css'

// Add Prism components.
import { Prism } from 'prism-react-renderer'
(typeof global !== 'undefined' ? global : window).Prism = Prism
require('prismjs/components/prism-rust')

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
          content="https://developers.metaplex.com/assets/social/dev-hub-preview.png"
        />
        <meta
          name="twitter:image"
          content="https://developers.metaplex.com/assets/social/dev-hub-preview.png"
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
    </>
  )
}
