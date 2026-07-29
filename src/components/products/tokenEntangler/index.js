import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'

export const tokenEntangler = {
  name: 'Token Entangler',
  headline: 'Swap between paired NFTs',
  description: 'A program for entangling pairs of NFTs so holders can swap between them. Deprecated.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/token-entangler',
  icon: <ArrowsRightLeftIcon />,
  github: 'https://github.com/metaplex-foundation/metaplex-program-library/tree/master/token-entangler',
  className: 'accent-green',
  deprecated: true,
  sections: [],
  localizedNavigation: {
    ja: {
      headline: 'ペアNFT間のスワップ',
      description: 'NFTのペアをエンタングルし、保有者が相互にスワップできるようにするプログラム。非推奨。',
    },
    ko: {
      headline: '페어링된 NFT 간 스왑',
      description: 'NFT 쌍을 연결하여 보유자가 서로 교환할 수 있게 하는 프로그램입니다. 지원 중단됨.',
    },
    zh: {
      headline: '在配对NFT之间交换',
      description: '用于将NFT配对绑定、让持有者在两者之间交换的程序。已弃用。',
    },
  },
}
