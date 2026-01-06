import Script from 'next/script'

import { DialectProvider } from '@/components/DialectContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { Layout } from '@/components/Layout'
import { SEOHead } from '@/components/SEOHead'
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
  return (
    <LocaleProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </LocaleProvider>
  )
}

function AppContent({ Component, pageProps }) {
  const page = usePage(pageProps)

  return (
    <>
      <SEOHead
        title={page.title}
        description={page.description}
        metaTitle={page.metaTitle}
        locale={page.locale}
        product={page.product?.path}
      />

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
