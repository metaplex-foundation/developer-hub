import {
  documentationSection,
  guidesSection,
  referencesSection,
} from '@/shared/sections';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const mplHybrid = {
  name: 'MPL-Hybrid',
  headline: 'Hybrid Assets',
  description: 'Framework and on-chain protocol for hybrid assets.',
  navigationMenuCatergory: 'MPL',
  path: 'mpl-hybrid',
  icon: <ArrowsRightLeftIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-hybrid',
  className: 'accent-green',
  heroes: [{ path: '/mpl-hybrid', component: Hero }],
  sections: [
    {
      ...documentationSection('mpl-hybrid'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/mpl-hybrid' },
            { title: 'Preparation', href: '/mpl-hybrid/preparation' },
            { title: 'FAQ', href: '/mpl-hybrid/faq' },
          ],
        },
        {
          title: 'SDK',
          links: [
            { title: 'Javascript SDK', href: '/mpl-hybrid/sdk/javascript' },
          ],
        },
        {
          title: 'UI Templates',
          links: [
            { title: 'MPL-404 Hybrid UI', href: '/mpl-hybrid/guides/mpl-404-hybrid-ui-template', created: '2024-12-16' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Create Escrow Configuration',
              href: '/mpl-hybrid/create-escrow',
            },
            {
              title: 'Fetch Escrow Configuration',
              href: '/mpl-hybrid/fetch-escrow',
            },
            { title: 'Funding Escrow', href: '/mpl-hybrid/funding-escrow' },
            {
              title: 'Updating Escrow Configuration',
              href: '/mpl-hybrid/update-escrow',
            },
            {
              title: 'Swapping NFTs to Tokens',
              href: '/mpl-hybrid/swapping-nfts-to-tokens',
            },
            {
              title: 'Swapping Tokens to NFTs',
              href: '/mpl-hybrid/swapping-tokens-to-nfts',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('mpl-hybrid'),
      href: 'https://mpl-hybrid.typedoc.metaplex.com/',
      target: '_blank',
    },
    {
      ...guidesSection('mpl-hybrid'),
      navigation: [
        {
          title: 'General',
          links: [
            {
              title: 'Overview',
              href: '/mpl-hybrid/guides',
            },
            {
              title: 'Create your first Hybrid Collection',
              href: '/mpl-hybrid/guides/create-your-first-hybrid-collection',
            },
            {
              title: 'MPL-404 Hybrid UI Template',
              href: '/mpl-hybrid/guides/mpl-404-hybrid-ui-template',
              created: '2024-12-16',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Hybrid Assets',
      description: 'Framework and on-chain protocol for hybrid assets.',
      sections: {
        'Introduction': 'Introduction',
        'SDK': 'SDK',
        'UI Templates': 'UI Templates',
        'Features': 'Features',
        'General': 'General'
      },
      links: {
        'Overview': 'Overview',
        'Preparation': 'Preparation',
        'FAQ': 'FAQ',
        'Javascript SDK': 'Javascript SDK',
        'MPL-404 Hybrid UI': 'MPL-404 Hybrid UI',
        'Create Escrow Configuration': 'Create Escrow Configuration',
        'Fetch Escrow Configuration': 'Fetch Escrow Configuration',
        'Funding Escrow': 'Funding Escrow',
        'Updating Escrow Configuration': 'Updating Escrow Configuration',
        'Swapping NFTs to Tokens': 'Swapping NFTs to Tokens',
        'Swapping Tokens to NFTs': 'Swapping Tokens to NFTs',
        'Create your first Hybrid Collection': 'Create your first Hybrid Collection',
        'MPL-404 Hybrid UI Template': 'MPL-404 Hybrid UI Template'
      }
    },
    jp: {
      headline: 'ハイブリッドアセット',
      description: 'ハイブリッドアセット用のフレームワークとオンチェーンプロトコル。',
      sections: {
        'Introduction': '紹介',
        'SDK': 'SDK',
        'UI Templates': 'UIテンプレート',
        'Features': '機能',
        'General': '一般'
      },
      links: {
        'Overview': '概要',
        'Preparation': '準備',
        'FAQ': 'よくある質問',
        'Javascript SDK': 'JavaScript SDK',
        'MPL-404 Hybrid UI': 'MPL-404ハイブリッドUI',
        'Create Escrow Configuration': 'エスクロー設定の作成',
        'Fetch Escrow Configuration': 'エスクロー設定の取得',
        'Funding Escrow': 'エスクローの資金調達',
        'Updating Escrow Configuration': 'エスクロー設定の更新',
        'Swapping NFTs to Tokens': 'NFTからトークンへのスワップ',
        'Swapping Tokens to NFTs': 'トークンからNFTへのスワップ',
        'Create your first Hybrid Collection': '最初のハイブリッドコレクションを作成',
        'MPL-404 Hybrid UI Template': 'MPL-404ハイブリッドUIテンプレート'
      }
    },
    kr: {
      headline: '하이브리드 에셋',
      description: '하이브리드 에셋을 위한 프레임워크 및 온체인 프로토콜입니다.',
      sections: {
        'Introduction': '소개',
        'SDK': 'SDK',
        'UI Templates': 'UI 템플릿',
        'Features': '기능',
        'General': '일반'
      },
      links: {
        'Overview': '개요',
        'Preparation': '준비',
        'FAQ': '자주 묻는 질문',
        'Javascript SDK': 'JavaScript SDK',
        'MPL-404 Hybrid UI': 'MPL-404 하이브리드 UI',
        'Create Escrow Configuration': '에스크로 구성 생성',
        'Fetch Escrow Configuration': '에스크로 구성 가져오기',
        'Funding Escrow': '에스크로 자금 조달',
        'Updating Escrow Configuration': '에스크로 구성 업데이트',
        'Swapping NFTs to Tokens': 'NFT를 토큰으로 스와핑',
        'Swapping Tokens to NFTs': '토큰을 NFT로 스와핑',
        'Create your first Hybrid Collection': '첫 번째 하이브리드 컬렉션 만들기',
        'MPL-404 Hybrid UI Template': 'MPL-404 하이브리드 UI 템플릿'
      }
    }
  }
}
