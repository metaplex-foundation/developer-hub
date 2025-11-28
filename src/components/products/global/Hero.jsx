import { Hero as BaseHero } from '@/components/Hero'
import { HeroCode } from '@/components/HeroCode'

const codeProps = {
  tabs: [
    { name: 'create-token.js', isActive: true },
  ],
  language: 'javascript',
  code: `import { createFungible } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'

const mint = generateSigner(umi)

await createFungible(umi, {
  mint,
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
  sellerFeeBasisPoints: percentAmount(0),
}).sendAndConfirm(umi)`,
}

export function Hero({ page }) {
  return (
    <BaseHero
      page={page}
      title="Developer Hub"
      primaryCta={{ title: 'Browse our Products', href: '/programs-and-tools' }}
    >
      <HeroCode {...codeProps} />
    </BaseHero>
  )
}
