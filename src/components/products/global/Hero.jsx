import { Hero as BaseHero } from '@/components/Hero'
import { HeroCode } from '@/components/HeroCode'
import { useTranslations } from '@/contexts/LocaleContext'

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
  const t = useTranslations('homepage')

  return (
    <BaseHero
      page={page}
      title={t('title', 'Developer Hub')}
      description={t('description', 'One place for all Metaplex developer resources.')}
      primaryCta={{ title: t('browseProducts', 'Browse our Products'), href: '/programs-and-tools' }}
    >
      <HeroCode {...codeProps} />
    </BaseHero>
  )
}
