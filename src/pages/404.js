import { useLocale } from '@/contexts/LocaleContext'
import { MarkdocGrid } from '@/components/products/GridAllProducts'

export default function Custom404() {
  const { t } = useLocale()

  return (
    <>
      <p>{t('404.message')}</p>
      <p>{t('404.callToAction')}</p>
      <MarkdocGrid />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      markdoc: {
        frontmatter: {
          title: 'Page Not Found',
          metaTitle: 'Page Not Found | Metaplex Developer Hub',
          description: 'We couldn\'t find this page in the Metaplex Developer Hub.'
        }
      }
    }
  }
}