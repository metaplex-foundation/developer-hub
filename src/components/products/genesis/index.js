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
          title: 'Bonding Curve V2',
          links: [
            {
              title: 'Overview',
              href: '/smart-contracts/genesis/bonding-curve-v2',
            },
            {
              title: 'Swap Integration',
              href: '/smart-contracts/genesis/bonding-curve-v2-swaps',
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
              title: 'List Launches',
              href: '/smart-contracts/genesis/integration-apis/list-launches',
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
        'Bonding Curve V2': 'Bonding Curve V2',
        'Launch Types': 'Launch Types',
        'Integrations': 'Integrations',
        'CLI': 'CLI',
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API Client',
        'Overview': 'Overview',
        'Swap Integration': 'Swap Integration',
        'Bonding Curve V2': 'Bonding Curve V2',
        'Launch Pool': 'Launch Pool',
        'Presale': 'Presale',
        'Uniform Price Auction': 'Uniform Price Auction',
        'Get Launch': 'Get Launch',
        'Get Launches by Token': 'Get Launches by Token',
        'List Launches': 'List Launches',
        'Get Spotlight': 'Get Spotlight',
        'Create Launch': 'Create Launch',
        'Register Launch': 'Register Launch',
        'Fetch Bucket State': 'Fetch Bucket State',
        'Fetch Deposit State': 'Fetch Deposit State',
        'Genesis CLI Commands': 'Genesis CLI Commands',
      },
    },
    ja: {
      headline: 'トークンローンチプラットフォーム',
      description: 'ローンチプールとプレセールを通じてSolana上でトークンをローンチするためのスマートコントラクト',
      sections: {
        'Introduction': '紹介',
        'SDK': 'SDK',
        'Bonding Curve V2': 'ボンディングカーブV2',
        'Launch Types': 'ローンチタイプ',
        'Integrations': 'インテグレーション',
        'CLI': 'CLI',
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'APIクライアント',
        'Overview': '概要',
        'Swap Integration': 'スワップインテグレーション',
        'Bonding Curve V2': 'ボンディングカーブV2',
        'Launch Pool': 'ローンチプール',
        'Presale': 'プレセール',
        'Uniform Price Auction': 'ユニフォームプライスオークション',
        'Get Launch': 'ローンチ取得',
        'Get Launches by Token': 'トークンによるローンチ取得',
        'List Launches': 'ローンチ一覧',
        'Get Spotlight': 'スポットライト取得',
        'Create Launch': 'ローンチ作成',
        'Register Launch': 'ローンチ登録',
        'Fetch Bucket State': 'バケット状態の取得',
        'Fetch Deposit State': 'デポジット状態の取得',
        'Genesis CLI Commands': 'Genesis CLIコマンド',
      },
    },
    ko: {
      headline: '토큰 런치 플랫폼',
      description: '런치 풀과 프리세일을 통해 Solana에서 토큰을 런치하기 위한 스마트 컨트랙트',
      sections: {
        'Introduction': '소개',
        'SDK': 'SDK',
        'Bonding Curve V2': '본딩 커브 V2',
        'Launch Types': '런치 유형',
        'Integrations': '통합',
        'CLI': 'CLI',
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API 클라이언트',
        'Overview': '개요',
        'Swap Integration': '스왑 통합',
        'Bonding Curve V2': '본딩 커브 V2',
        'Launch Pool': '런치 풀',
        'Presale': '프리세일',
        'Uniform Price Auction': '균일가 경매',
        'Get Launch': '런치 조회',
        'Get Launches by Token': '토큰별 런치 조회',
        'List Launches': '런치 목록',
        'Get Spotlight': '스포트라이트 조회',
        'Create Launch': '런치 생성',
        'Register Launch': '런치 등록',
        'Fetch Bucket State': '버킷 상태 조회',
        'Fetch Deposit State': '예치 상태 조회',
        'Genesis CLI Commands': 'Genesis CLI 명령어',
      },
    },
    zh: {
      headline: '代币发行平台',
      description: '用于通过发行池和定价销售在Solana上发行代币的智能合约',
      sections: {
        'Introduction': '简介',
        'SDK': 'SDK',
        'Bonding Curve V2': '绑定曲线 V2',
        'Launch Types': '发行类型',
        'Integrations': '集成',
        'CLI': 'CLI',
      },
      links: {
        'Overview': '概述',
        'Getting Started': '快速入门',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API客户端',
        'Overview': '概述',
        'Swap Integration': '交换集成',
        'Bonding Curve V2': '绑定曲线 V2',
        'Launch Pool': '发行池',
        'Presale': '预售',
        'Uniform Price Auction': '统一价格拍卖',
        'Get Launch': '获取发行',
        'Get Launches by Token': '按代币获取发行',
        'List Launches': '发行列表',
        'Get Spotlight': '获取精选',
        'Create Launch': '创建发行',
        'Register Launch': '注册发行',
        'Fetch Bucket State': '获取桶状态',
        'Fetch Deposit State': '获取存款状态',
        'Genesis CLI Commands': 'Genesis CLI命令',
      },
    },
  },
};
