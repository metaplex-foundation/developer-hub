import { documentationSection, guidesSection, referencesSection } from '@/shared/sections';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Hero } from './Hero';

export const genesis = {
  name: 'Genesis',
  headline: 'Token Launch Platform',
  description:
    'A smart contract for launching tokens on Solana via launch pools and presales.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/genesis',
  icon: <SparklesIcon />,
  className: 'accent-pink',
  heroes: [{ path: '/smart-contracts/genesis', component: Hero }],
  protocolFees: {
    launchPool: {
      deposit: {
        solana: '2%',
        payer: 'User',
        notes: 'Fee applied to deposits into Launch Pools.',
      },
      withdraw: {
        solana: '2%',
        payer: 'User',
        notes: 'Fee applied to withdrawals from Launch Pools during the deposit period.',
      },
      graduation: {
        solana: '5%',
        payer: 'Launch Pool',
        notes: 'Fee applied to total deposits at the end of the Deposit Period.',
      },
    },
    presale: {
      deposit: {
        solana: '2%',
        payer: 'User',
        notes: 'Fee applied to deposits into Presales.',
      },
      graduation: {
        solana: '5%',
        payer: 'Presale',
        notes: 'Fee applied to total deposits at the end of the Deposit Period.',
      },
    },
  },
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
              title: 'Presale',
              href: '/smart-contracts/genesis/presale',
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
   /* {
      ...guidesSection('smart-contracts/genesis'),
      navigation: [],
    },
    {
      ...referencesSection('smart-contracts/genesis'),
      navigation: [],
    },*/ 
  ],
  localizedNavigation: {
    en: {
      headline: 'Token Launch Platform',
      description: 'A smart contract for launching tokens on Solana via launch pools and presales.',
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
        'Presale': 'Presale',
        'Uniform Price Auction': 'Uniform Price Auction',
        'Aggregation API': 'Aggregation API',
      },
    },
    ja: {
      headline: 'トークンローンチプラットフォーム',
      description: 'ローンチプールとプレセールを通じてSolana上でトークンをローンチするためのスマートコントラクト',
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
        'Presale': 'プレセール',
        'Uniform Price Auction': 'ユニフォームプライスオークション',
        'Aggregation API': 'アグリゲーションAPI',
      },
    },
    ko: {
      headline: '토큰 런치 플랫폼',
      description: '런치 풀과 프리세일을 통해 Solana에서 토큰을 런치하기 위한 스마트 컨트랙트',
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
        'Presale': '프리세일',
        'Uniform Price Auction': '균일가 경매',
        'Aggregation API': '애그리게이션 API',
      },
    },
    zh: {
      headline: '代币发行平台',
      description: '用于通过发行池和定价销售在Solana上发行代币的智能合约',
      sections: {
        'Introduction': '简介',
        'SDK': 'SDK',
        'Launch Types': '发行类型',
        'Integrations': '集成',
      },
      links: {
        'Overview': '概述',
        'Getting Started': '快速入门',
        'JavaScript SDK': 'JavaScript SDK',
        'Launch Pool': '发行池',
        'Priced Sale': '定价销售',
        'Uniform Price Auction': '统一价格拍卖',
        'Aggregation API': '聚合API',
      },
    },
  },
};
