import { Head, Html, Main, NextScript } from 'next/document'
import Document from 'next/document'

// Hard-coded dark mode
const themeScript = `
  document.documentElement.classList.add('dark')
  document.documentElement.setAttribute('data-theme', 'dark')
`

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    // Extract locale from the URL path
    let locale = 'en'
    const path = ctx.asPath || ctx.req?.url || ''

    if (path.startsWith('/ja')) {
      locale = 'ja'
    } else if (path.startsWith('/ko')) {
      locale = 'ko'
    }

    return { ...initialProps, locale }
  }

  render() {
    const { locale = 'en' } = this.props

    return (
      <Html className="antialiased [font-feature-settings:'ss01'] scrollbar overflow-y-scroll" lang={locale}>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/docs/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/docs/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/docs/favicon-16x16.png"
        />
        <link rel="manifest" href="/docs/site.webmanifest" />
        <link rel="mask-icon" href="/docs/safari-pinned-tab.svg" color="#30383b" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className="bg-background text-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
    )
  }
}

export default MyDocument
