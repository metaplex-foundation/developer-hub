import { documentationSection, guidesSection, referencesSection } from '@/shared/sections';
import { SparklesIcon } from '@heroicons/react/24/outline';

export const genesis = {
  name: 'Genesis',
  skill: true,
  headline: 'Token launches via bonding curves.',
  description:
    'A smart contract for launching tokens on Solana via launch pools and presales.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/genesis',
  icon: <SparklesIcon />,
  className: 'accent-pink',
  protocolFees: {
    bondingCurve: {
      protocolFee: {
        label: 'Protocol fee',
        solana: '0.50%',
      },
      creatorRevenue: {
        label: 'Creator revenue',
        solana: '0.60%',
      },
    },
    postBondTrading: {
      protocolFee: {
        label: 'Protocol fee',
        solana: '0.40%',
      },
      creatorRevenue: {
        label: 'Creator revenue',
        solana: '0.60%',
      },
      lpFees: {
        label: 'LP fees',
        solana: '0.17%',
      },
      raydiumFee: {
        label: 'Raydium fee',
        solana: '0.08%',
      },
    },
    launchPool: {
      deposit: {
        label: 'User deposit fee',
        solana: '0%',
      },
      withdraw: {
        label: 'User withdraw fee',
        solana: '2%',
      },
      creatorWithdraw: {
        label: 'Creator withdraw fee',
        solana: '5%',
        notes: 'This fee only applies when creators withdraw liquidity',
      },
    },
    launchPoolTrading: {
      liquidityRequirement: {
        label: 'Liquidity requirement',
        solana: '20%',
        notes: '1 year lock with quarterly unlock',
      },
      protocolFee: {
        label: 'Protocol fee',
        solana: '0.50%',
      },
      lpFees: {
        label: 'LP fees',
        solana: '0.42%',
      },
      raydiumFee: {
        label: 'Raydium fee',
        solana: '0.08%',
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
              title: 'Bonding Curve',
              href: '/smart-contracts/genesis/bonding-curve',
              collapsible: true,
              children: [
                {
                  title: 'Overview',
                  href: '/smart-contracts/genesis/bonding-curve',
                },
                {
                  title: 'Theory of Operation',
                  href: '/smart-contracts/genesis/bonding-curve-theory',
                },
                {
                  title: 'Advanced Internals',
                  href: '/smart-contracts/genesis/bonding-curve-internals',
                },
                {
                  title: 'Swap Integration',
                  href: '/smart-contracts/genesis/bonding-curve-swaps',
                },
                {
                  title: 'Indexing & Events',
                  href: '/smart-contracts/genesis/bonding-curve-indexing',
                },
                {
                  title: 'Launch via API',
                  href: '/smart-contracts/genesis/bonding-curve-launch',
                },
                {
                  title: 'Creator Fees',
                  href: '/smart-contracts/genesis/creator-fees',
                },
              ],
            },
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
        'Launch Types': 'Launch Types',
        'Integrations': 'Integrations',
        'CLI': 'CLI',
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API Client',
        'Theory of Operation': 'Theory of Operation',
        'Advanced Internals': 'Advanced Internals',
        'Swap Integration': 'Swap Integration',
        'Indexing & Events': 'Indexing & Events',
        'Launch via API': 'Launch via API',
        'Creator Fees': 'Creator Fees',
        'Bonding Curve': 'Bonding Curve',
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
        'Launch Types': 'ローンチタイプ',
        'Integrations': 'インテグレーション',
        'CLI': 'CLI',
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'APIクライアント',
        'Theory of Operation': '動作の理論',
        'Advanced Internals': '高度な内部構造',
        'Swap Integration': 'スワップインテグレーション',
        'Indexing & Events': 'インデックスとイベント',
        'Launch via API': 'APIでローンチ',
        'Creator Fees': 'クリエイターフィー',
        'Bonding Curve': 'ボンディングカーブ',
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
        'Launch Types': '런치 유형',
        'Integrations': '통합',
        'CLI': 'CLI',
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API 클라이언트',
        'Theory of Operation': '동작 원리',
        'Advanced Internals': '고급 내부 구조',
        'Swap Integration': '스왑 통합',
        'Indexing & Events': '인덱싱 및 이벤트',
        'Launch via API': 'API로 런치',
        'Creator Fees': '크리에이터 수수료',
        'Bonding Curve': '본딩 커브',
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
        'Launch Types': '发行类型',
        'Integrations': '集成',
        'CLI': 'CLI',
      },
      links: {
        'Overview': '概述',
        'Getting Started': '快速入门',
        'JavaScript SDK': 'JavaScript SDK',
        'API Client': 'API客户端',
        'Theory of Operation': '操作原理',
        'Advanced Internals': '高级内部结构',
        'Swap Integration': '交换集成',
        'Indexing & Events': '索引与事件',
        'Launch via API': '通过API发行',
        'Creator Fees': '创作者费用',
        'Bonding Curve': '绑定曲线',
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
