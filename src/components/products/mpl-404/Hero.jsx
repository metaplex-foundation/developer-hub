import { Hero as BaseHero } from '@/components/Hero';
import Link from 'next/link'

export function Hero({ page }) {
  return <BaseHero
    page={page}
    light2Off
    light3Off
  >
    <Link href="/core">
      <img src="https://pbs.twimg.com/media/GOsXQI-bQAAecgo?format=png&name=large" alt="Introducing MPL-404" className="no-lightense" />
    </Link>
    .
  </BaseHero>;
}
