import {
  documentationSection,
  referencesSection
} from '@/shared/sections'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const hydra = {
  name: 'Hydra',
  headline: 'Fanout wallets',
  description: 'Create shared wallets, split between multiple shareholders.',
  path: 'hydra',
  navigationMenuCatergory: 'MPL',
  icon: <ArrowsPointingOutIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-hydra',
  className: 'accent-amber',
  heroes: [{ path: '/hydra', component: Hero }],
  sections: [
    {
      ...documentationSection('hydra'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/hydra' },
            { title: 'Quick Start', href: '/hydra/quick-start' },
          ],
        },
      ],
    },
    {
      ...referencesSection('hydra'),
      href: `https://mpl-hydra.typedoc.metaplex.com/`,
      target: '_blank',
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Fanout wallets',
      description: 'Create shared wallets, split between multiple shareholders.',
      sections: {
        'Introduction': 'Introduction'
      },
      links: {
        'Overview': 'Overview',
        'Quick Start': 'Quick Start'
      }
    },
    ja: {
      headline: 'ファンアウトウォレット',
      description: '複数の株主間で分割された共有ウォレットを作成。',
      sections: {
        'Introduction': '紹介'
      },
      links: {
        'Overview': '概要',
        'Quick Start': 'クイックスタート'
      }
    },
    ko: {
      headline: '팬아웃 지갑',
      description: '여러 주주 간에 분할된 공유 지갑을 만드세요.',
      sections: {
        'Introduction': '소개'
      },
      links: {
        'Overview': '개요',
        'Quick Start': '퀵 스타트'
      }
    }
  }
}
