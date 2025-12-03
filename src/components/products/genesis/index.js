import { documentationSection, guidesSection, referencesSection } from '@/shared/sections';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Hero } from './Hero';

export const genesis = {
  name: 'Genesis',
  headline: 'Token Launch Platform',
  description:
    'A smart contract for launching tokens on Solana via presale launches, launch pools, and bonding curves.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/genesis',
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-genesis',
  className: 'accent-pink',
  heroes: [{ path: '/smart-contracts/genesis', component: Hero }],
  sections: [
    {
      ...documentationSection('smart-contracts/genesis'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/smart-contracts/genesis',
            },
            {
              title: 'Getting Started',
              href: '/smart-contracts/genesis/getting-started',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Vault Deposits',
              href: '/smart-contracts/genesis/vault-deposits',
            },
            {
              title: 'Bonding Curves',
              href: '/smart-contracts/genesis/bonding-curves',
            },
            {
              title: 'Raydium Graduation',
              href: '/smart-contracts/genesis/raydium-graduation',
            },
          ],
        },
      ],
    },
    {
      ...guidesSection('smart-contracts/genesis'),
      navigation: [],
    },
    {
      ...referencesSection('smart-contracts/genesis'),
      navigation: [],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Token Launch Platform',
      description: 'A smart contract for launching tokens on Solana via presale launches, launch pools, and bonding curves.',
      sections: {
        'Introduction': 'Introduction',
        'Features': 'Features',
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'Vault Deposits': 'Vault Deposits',
        'Bonding Curves': 'Bonding Curves',
        'Raydium Graduation': 'Raydium Graduation',
      },
    },
    ja: {
      headline: 'トークンローンチプラットフォーム',
      description: 'プレセールローンチ、ローンチプール、ボンディングカーブを通じてSolana上でトークンをローンチするためのスマートコントラクト',
      sections: {
        'Introduction': '紹介',
        'Features': '機能',
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'Vault Deposits': 'ボールト入金',
        'Bonding Curves': 'ボンディングカーブ',
        'Raydium Graduation': 'Raydium卒業',
      },
    },
    ko: {
      headline: '토큰 런치 플랫폼',
      description: '프리세일 런치, 런치 풀, 본딩 커브를 통해 Solana에서 토큰을 런치하기 위한 스마트 컨트랙트',
      sections: {
        'Introduction': '소개',
        'Features': '기능',
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'Vault Deposits': '볼트 입금',
        'Bonding Curves': '본딩 커브',
        'Raydium Graduation': 'Raydium 졸업',
      },
    },
  },
};
