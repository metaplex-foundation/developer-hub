import { Hero as BaseHero } from '@/components/Hero'

export function Hero({ page }) {
  return (
    <BaseHero
      page={page}
      title="Developer Hub"
      primaryCta={{ title: 'Browse our Products', href: '/products' }}
      light2Off
      light3Off
    ></BaseHero>
  )
}
