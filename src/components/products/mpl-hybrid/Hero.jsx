import { Hero as BaseHero } from '@/components/Hero'
import Link from 'next/link'

export function Hero({ page }) {
  return (
    <BaseHero
      page={page}
      light2Off
      light3Off
      primaryCta={{
        title: 'SDKs',
        href: `/${page.product.path}/sdk`,
      }}
    >
      <Link href="/mpl-hybrid">
        <img
          src="https://pbs.twimg.com/media/GOsXQI-bQAAecgo?format=png&name=large"
          alt="Introducing MPL-404"
          className="no-lightense rounded rounded-xl"
        />
      </Link>
    </BaseHero>
  )
}
