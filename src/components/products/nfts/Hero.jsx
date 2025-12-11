import { Hero as BaseHero } from '@/components/Hero'
import { HeroCode } from '@/components/HeroCode'

const codeProps = {
  tabs: [
    { name: 'create-nft.js', isActive: true },
  ],
  language: 'javascript',
  code: `import { create } from '@metaplex-foundation/mpl-core'

await create(umi, {
  asset,
  name: 'My NFT',
  uri: 'https://arweave.net/...',
}).sendAndConfirm(umi)`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
