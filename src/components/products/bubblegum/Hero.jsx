import { Hero as BaseHero } from '@/components/Hero'
import { HeroCode } from '@/components/HeroCode'

const codeProps = {
  tabs: [
    { name: 'metadata.rs', isActive: true },
    { name: 'offchain-metadata.json', isActive: false },
  ],
  language: 'rust',
  code: `pub struct Metadata {
    pub key: Key,
    pub update_authority: Pubkey,
    pub mint: Pubkey,
    pub data: Data,
    pub primary_sale_happened: bool,
    pub is_mutable: bool,
    // ...
  }`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
