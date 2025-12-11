import { documentationSection, guidesSection, referencesSection } from '@/shared/sections';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Hero } from './Hero';

export const genesis = {
  name: 'Genesis',
  headline: 'Token Launch Platform',
  description:
    'A smart contract for launching tokens on Solana via launch pools and priced sales.',
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
          title: 'SDK',
          links: [
            {
              title: 'JavaScript SDK',
              href: '/smart-contracts/genesis/sdk/javascript',
            },
          ],
        },
        {
          title: 'Launch Types',
          links: [
            {
              title: 'Launch Pool',
              href: '/smart-contracts/genesis/launch-pool',
            },
            {
              title: 'Priced Sale',
              href: '/smart-contracts/genesis/priced-sale',
            },
            {
              title: 'Uniform Price Auction',
              href: '/smart-contracts/genesis/uniform-price-auction',
            },
          ],
        },
        {
          title: 'Integrations',
          links: [
            {
              title: 'Aggregation API',
              href: '/smart-contracts/genesis/aggregation',
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
      description: 'A smart contract for launching tokens on Solana via launch pools and priced sales.',
      sections: {
        'Introduction': 'Introduction',
        'SDK': 'SDK',
        'Launch Types': 'Launch Types',
        'Integrations': 'Integrations',
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'JavaScript SDK': 'JavaScript SDK',
        'Launch Pool': 'Launch Pool',
        'Priced Sale': 'Priced Sale',
        'Uniform Price Auction': 'Uniform Price Auction',
        'Aggregation API': 'Aggregation API',
      },
    },
    ja: {
      headline: 'トークンローンチプラットフォーム',
      description: 'ローンチプールとプライスドセールを通じてSolana上でトークンをローンチするためのスマートコントラクト',
      sections: {
        'Introduction': '紹介',
        'SDK': 'SDK',
        'Launch Types': 'ローンチタイプ',
        'Integrations': 'インテグレーション',
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'JavaScript SDK': 'JavaScript SDK',
        'Launch Pool': 'ローンチプール',
        'Priced Sale': 'プライスドセール',
        'Uniform Price Auction': 'ユニフォームプライスオークション',
        'Aggregation API': 'アグリゲーションAPI',
      },
    },
    ko: {
      headline: '토큰 런치 플랫폼',
      description: '런치 풀과 프라이스드 세일을 통해 Solana에서 토큰을 런치하기 위한 스마트 컨트랙트',
      sections: {
        'Introduction': '소개',
        'SDK': 'SDK',
        'Launch Types': '런치 유형',
        'Integrations': '통합',
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'JavaScript SDK': 'JavaScript SDK',
        'Launch Pool': '런치 풀',
        'Priced Sale': '프라이스드 세일',
        'Uniform Price Auction': '균일가 경매',
        'Aggregation API': '애그리게이션 API',
      },
    },
  },
};
