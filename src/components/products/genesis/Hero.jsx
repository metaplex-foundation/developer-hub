import { Hero as BaseHero } from '@/components/Hero';
import { HeroCode } from '@/components/HeroCode';

const codeProps = {
  tabs: [
    { name: 'createLaunch.ts', isActive: true },
  ],
  language: 'typescript',
  code: `import { createLaunch } from '@metaplex-foundation/mpl-genesis';

const launch = await createLaunch(umi, {
  name: 'My Token Launch',
  symbol: 'MTL',
  launchType: 'bondingCurve',
  initialPrice: sol(0.001),
  maxSupply: 1_000_000_000,
});
`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page} primaryCta={{title: "View on Github", href: page.product.github }} secondaryCta={{disabled: true}}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
