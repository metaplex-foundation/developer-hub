import { documentationSection } from '@/shared/sections';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';
import { buildProductTranslations } from '@/config/navigation-translations';

export const nfts = {
  name: 'NFTs',
  headline: 'Non-Fungible Tokens',
  description: 'Create and manage NFTs on Solana using Metaplex Core.',
  navigationMenuCatergory: undefined,
  path: 'nfts',
  icon: <PhotoIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: [{ path: '/nfts', component: Hero }],
  sections: [
    {
      ...documentationSection('nfts'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/nfts',
            },
          ],
        },
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Create an NFT',
              href: '/nfts/create-nft',
            },
            {
              title: 'Fetch an NFT',
              href: '/nfts/fetch-nft',
            },
            {
              title: 'Update an NFT',
              href: '/nfts/update-nft',
            },
            {
              title: 'Transfer an NFT',
              href: '/nfts/transfer-nft',
            },
            {
              title: 'Burn an NFT',
              href: '/nfts/burn-nft',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: buildProductTranslations({
    headlineTranslations: {
      ja: '非代替性トークン',
      ko: '대체 불가능 토큰',
      zh: '非同质化代币'
    },
    descriptionTranslations: {
      ja: 'Metaplex Coreを使用してSolana上でNFTを作成・管理します。',
      ko: 'Metaplex Core를 사용하여 Solana에서 NFT를 생성하고 관리합니다.',
      zh: '使用Metaplex Core在Solana上创建和管理NFT。'
    },
    sectionKeys: {
      'Introduction': 'sections.introduction',
      'Getting Started': { ja: 'はじめに', ko: '시작하기', zh: '快速入门' }
    },
    linkKeys: {
      'Overview': 'links.overview',
      'Create an NFT': { ja: 'NFTの作成', ko: 'NFT 생성', zh: '创建NFT' },
      'Fetch an NFT': { ja: 'NFTの取得', ko: 'NFT 가져오기', zh: '获取NFT' },
      'Update an NFT': { ja: 'NFTの更新', ko: 'NFT 업데이트', zh: '更新NFT' },
      'Transfer an NFT': { ja: 'NFTの転送', ko: 'NFT 전송', zh: '转移NFT' },
      'Burn an NFT': { ja: 'NFTのバーン', ko: 'NFT 소각', zh: '销毁NFT' }
    }
  })
}
