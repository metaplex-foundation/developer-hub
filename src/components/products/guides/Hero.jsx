import { Hero as BaseHero } from '@/components/Hero'
import { HeroCode } from '@/components/HeroCode'
import HoloCode from "../../../images/holo-code.jpg"

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
    <BaseHero page={page}>
      <img src={HoloCode.src} className='rounded-xl dropShadowLight' />
      {/* <HeroCode {...codeProps}></HeroCode> */}
    </BaseHero>
  )
}
