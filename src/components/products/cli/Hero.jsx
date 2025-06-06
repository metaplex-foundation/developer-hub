import { Hero as BaseHero } from '@/components/Hero';
import { HeroCode } from '@/components/HeroCode';

const codeProps = {
  tabs: [
    { name: 'MPLX CLI', isActive: true },
  ],
  language: 'shell',
  code: `
  mplx toolbox token create --wizard
`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page} primaryCta={{title: "View on NPM", href: page.product.github }} secondaryCta={{disabled: true}}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
