import { Hero as BaseHero } from '@/components/Hero'
import { HeroCode } from '@/components/HeroCode'

const codeProps = {
  tabs: [
    { name: 'captureV1.js', isActive: true },
  ],
  language: 'javascript',
  code: `const captureTx = await captureV1(umi, {
    owner: umi.identity,
    escrow: escrowAddress,
    asset: escrowAssets[0].publicKey,
    collection: COLLECTION,
    feeProjectAccount: FEE_WALLET,
    token: TOKEN,
  }).sendAndConfirm(umi);`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}

