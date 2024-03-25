import { Hero as BaseHero } from '@/components/Hero'
import { HeroCode } from '@/components/HeroCode'

const codeProps = {
  tabs: [
    { name: 'metadata.rs', isActive: true },
    { name: 'offchain-metadata.json', isActive: false },
  ],
  language: 'rust',
  code: `pub struct Asset {
    pub key: Key,
    pub owner: Pubkey,
    pub update_authority: UpdateAuthority,
    pub name: String,
    pub uri: String,
}`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page} subDescription="Create small digital assets on chain.">
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
