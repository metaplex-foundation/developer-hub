import { Hero as BaseHero } from '@/components/Hero';

export function Hero({ page }) {
  return <BaseHero page={page} primaryCta={{title: "View on Github", href: page.product.github }} secondaryCta={{disabled: true}}></BaseHero>
}
