import {
  documentationSection
} from '@/shared/sections';
import { CircleStackIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const fusion = {
  name: 'Fusion',
  headline: 'NFTs inside NFTs',
  description: 'Create composable NFTs.',
  navigationMenuCatergory: 'MPL',
  path: 'fusion',
  icon: <CircleStackIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-trifle',
  className: 'accent-amber',
  heroes: [{ path: '/fusion', component: Hero }],
  sections: [
    {
      ...documentationSection('fusion'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/fusion' },
            { title: 'Getting Started', href: '/fusion/getting-started' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Constraint Types', href: '/fusion/constraint-types' },
            { title: 'Transfer Effects', href: '/fusion/transfer-effects' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'NFTs inside NFTs',
      description: 'Create composable NFTs.',
      sections: {
        'Introduction': 'Introduction',
        'Features': 'Features'
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'Constraint Types': 'Constraint Types',
        'Transfer Effects': 'Transfer Effects'
      }
    },
    ja: {
      headline: 'NFT内のNFT',
      description: '合成可能なNFTを作成。',
      sections: {
        'Introduction': '紹介',
        'Features': '機能'
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'Constraint Types': '制約タイプ',
        'Transfer Effects': '転送効果'
      }
    },
    ko: {
      headline: 'NFT 안의 NFT',
      description: '구성 가능한 NFT를 만드세요.',
      sections: {
        'Introduction': '소개',
        'Features': '기능'
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'Constraint Types': '제약 유형',
        'Transfer Effects': '전송 효과'
      }
    }
  }
}
