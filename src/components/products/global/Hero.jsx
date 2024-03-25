import { Hero as BaseHero } from '@/components/Hero'
import CoreBanner from '@/images/core-banner.jpg'
import Link from 'next/link'

export function Hero({ page }) {
  return (
    <BaseHero
      page={page}
      title="Developer Hub"
      primaryCta={{ title: 'Browse our Products', href: '/programs-and-tools' }}
      light2Off
      light3Off
    >
      <Link href="/core">
        <img src={CoreBanner.src} alt="Developer Hub" className="no-lightense" />
      </Link>
      .
    </BaseHero>
  )
}
