import { GiftIcon } from '@heroicons/react/24/solid'

export const gumdrop = {
  name: 'Gumdrop',
  headline: 'Token and NFT airdrop claims',
  description: 'A program for whitelisted token and NFT airdrop claims using Merkle trees. Deprecated.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/gumdrop',
  icon: <GiftIcon />,
  github: 'https://github.com/metaplex-foundation/gumdrop',
  className: 'accent-green',
  deprecated: true,
  sections: [],
  localizedNavigation: {
    ja: {
      headline: 'トークンとNFTのエアドロップ請求',
      description: 'Merkleツリーを使用したホワイトリスト形式のトークン・NFTエアドロップ請求プログラム。非推奨。',
    },
    ko: {
      headline: '토큰 및 NFT 에어드롭 청구',
      description: 'Merkle 트리를 사용한 화이트리스트 토큰 및 NFT 에어드롭 청구 프로그램입니다. 지원 중단됨.',
    },
    zh: {
      headline: '代币和NFT空投领取',
      description: '使用Merkle树进行白名单代币和NFT空投领取的程序。已弃用。',
    },
  },
}
