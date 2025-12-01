import {
  documentationSection,
  referencesSection
} from '@/shared/sections'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const inscription = {
  name: 'Inscription',
  headline: 'NFT inscribed on Solana',
  description: 'Inscribe Data to Solana state.',
  path: 'inscription',
  icon: <PencilSquareIcon />,
  navigationMenuCatergory: 'Programs',
  github: 'https://github.com/metaplex-foundation/mpl-inscription',
  className: 'accent-green',
  heroes: [{ path: '/inscription', component: Hero }],
  sections: [
    {
      ...documentationSection('inscription'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/inscription' },
            {
              title: 'Getting Started',
              href: '/inscription/getting-started',
              // Subpages: /js /rust, etc.
            },
            { title: 'FAQ', href: '/inscription/faq' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Initialize',
              href: '/inscription/initialize',
            },
            { title: 'Write Data', href: '/inscription/write' },
            { title: 'Fetch', href: '/inscription/fetch' },
            { title: 'Clear Data', href: '/inscription/clear' },
            { title: 'Close', href: '/inscription/close' },
            { title: 'Authority', href: '/inscription/authority' },
          ],
        },
        {
          title: 'Advanced',
          links: [
            {
              title: 'Inscription Sharding',
              href: '/inscription/sharding',
            },
            // {
            //   title: 'Parallel Writes',
            //   href: '/inscription/parallel-writes',
            // },
          ],
        },
      ],
    },
    {
      ...referencesSection('inscription'),
      href: `https://mpl-inscription.typedoc.metaplex.com/`,
      target: '_blank',
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'NFT inscribed on Solana',
      description: 'Inscribe Data to Solana state.',
      sections: {
        'Introduction': 'Introduction',
        'Features': 'Features',
        'Advanced': 'Advanced'
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'FAQ': 'FAQ',
        'Initialize': 'Initialize',
        'Write Data': 'Write Data',
        'Fetch': 'Fetch',
        'Clear Data': 'Clear Data',
        'Close': 'Close',
        'Authority': 'Authority',
        'Inscription Sharding': 'Inscription Sharding'
      }
    },
    ja: {
      headline: 'Solanaに刻印されたNFT',
      description: 'Solanaステートにデータを刻印。',
      sections: {
        'Introduction': '紹介',
        'Features': '機能',
        'Advanced': '高度な機能'
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'FAQ': 'よくある質問',
        'Initialize': '初期化',
        'Write Data': 'データの書き込み',
        'Fetch': '取得',
        'Clear Data': 'データのクリア',
        'Close': 'クローズ',
        'Authority': '権限',
        'Inscription Sharding': 'Inscriptionシャーディング'
      }
    },
    ko: {
      headline: 'Solana에 새겨진 NFT',
      description: 'Solana 상태에 데이터를 새기세요.',
      sections: {
        'Introduction': '소개',
        'Features': '기능',
        'Advanced': '고급 기능'
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'FAQ': '자주 묻는 질문',
        'Initialize': '초기화',
        'Write Data': '데이터 쓰기',
        'Fetch': '가져오기',
        'Clear Data': '데이터 지우기',
        'Close': '닫기',
        'Authority': '권한',
        'Inscription Sharding': 'Inscription 샤딩'
      }
    }
  }
}
