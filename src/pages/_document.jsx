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
    } else if (path.startsWith('/zh')) {
      locale = 'zh'
    }

    return { ...initialProps, locale }
  }

  render() {
    const { locale = 'en' } = this.props

    return (
      <Html className="antialiased [font-feature-settings:'ss01'] scrollbar overflow-y-scroll" lang={locale}>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" href="/docs/favicon.png" />
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
