import { Hero as BaseHero } from '@/components/Hero'
import { HeroCode } from '@/components/HeroCode'

const codeProps = {
  tabs: [
    { name: 'create-token.js', isActive: true },
  ],
  language: 'javascript',
  code: `import { createAndMint, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

await createAndMint(umi, {
  mint,
  name: 'My Fungible Token',
  symbol: 'MFT',
  uri: 'https://arweave.net/...',
  decimals: 9,
  amount: 1000,
  tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi)`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
