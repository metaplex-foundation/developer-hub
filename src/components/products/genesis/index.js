import { documentationSection, guidesSection, referencesSection } from '@/shared/sections';
import { SparklesIcon } from '@heroicons/react/24/outline';

export const genesis = {
  name: 'Genesis',
  headline: 'Token Launch Platform',
  description:
    'A smart contract for launching tokens on Solana via launch pools and presales.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/genesis',
  icon: <SparklesIcon />,
  className: 'accent-pink',
  protocolFees: {
    launchPool: {
      deposit: {
        solana: '2%',
        payer: 'User',
        notes: null,
      },
      withdraw: {
        solana: '2%',
        payer: 'User',
        notes: null,
      },
      graduation: {
        solana: '5%',
        payer: 'Launch Pool',
        notes: null,
      },
    },
    presale: {
      deposit: {
        solana: '2%',
        payer: 'User',
        notes: null,
      },
      graduation: {
        solana: '5%',
        payer: 'Presale',
        notes: null,
      },
    },
  },
  sections: [
    {
      ...documentationSection('smart-contracts/genesis'),
      title: '',
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
            {
              title: 'API Client',
              href: '/smart-contracts/genesis/sdk/api-client',
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
          title: 'Integration APIs',
          links: [
            {
              title: 'Overview',
              href: '/smart-contracts/genesis/integration-apis',
            },
            {
              title: 'Get Launch',
              href: '/smart-contracts/genesis/integration-apis/get-launch',
              method: 'get',
            },
            {
              title: 'Get Launches by Token',
              href: '/smart-contracts/genesis/integration-apis/get-launches-by-token',
              method: 'get',
            },
            {
              title: 'Get Listings',
              href: '/smart-contracts/genesis/integration-apis/get-listings',
              method: 'get',
            },
            {
              title: 'Get Spotlight',
              href: '/smart-contracts/genesis/integration-apis/get-spotlight',
              method: 'get',
            },
            {
              title: 'Create Launch',
              href: '/smart-contracts/genesis/integration-apis/create-launch',
              method: 'post',
            },
            {
              title: 'Register Launch',
              href: '/smart-contracts/genesis/integration-apis/register',
              method: 'post',
            },
            {
              title: 'Fetch Bucket State',
              href: '/smart-contracts/genesis/integration-apis/fetch-bucket-state',
              method: 'chain',
            },
            {
              title: 'Fetch Deposit State',
              href: '/smart-contracts/genesis/integration-apis/fetch-deposit-state',
              method: 'chain',
            },
          ],
        },
        {
          title: 'CLI',
          links: [
            {
              title: 'Genesis CLI Commands',
              href: '/dev-tools/cli/genesis',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('smart-contracts/genesis'),
      href: `https://mpl-genesis.typedoc.metaplex.com/`,
      target: '_blank',
    }, 
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
        'CLI': 'CLI',
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API Client',
        'Launch Pool': 'Launch Pool',
        'Presale': 'Presale',
        'Uniform Price Auction': 'Uniform Price Auction',
        'Genesis CLI Commands': 'Genesis CLI Commands',
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
        'CLI': 'CLI',
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'APIクライアント',
        'Launch Pool': 'ローンチプール',
        'Presale': 'プレセール',
        'Uniform Price Auction': 'ユニフォームプライスオークション',
        'Genesis CLI Commands': 'Genesis CLIコマンド',
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
        'CLI': 'CLI',
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API 클라이언트',
        'Launch Pool': '런치 풀',
        'Presale': '프리세일',
        'Uniform Price Auction': '균일가 경매',
        'Genesis CLI Commands': 'Genesis CLI 명령어',
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
        'CLI': 'CLI',
      },
      links: {
        'Overview': '概述',
        'Getting Started': '快速入门',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API客户端',
        'Launch Pool': '发行池',
        'Presale': '预售',
        'Uniform Price Auction': '统一价格拍卖',
        'Genesis CLI Commands': 'Genesis CLI命令',
      },
    },
  },
};
