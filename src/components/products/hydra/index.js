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
  path: 'smart-contracts/hydra',
  navigationMenuCatergory: 'Smart Contracts',
  icon: <ArrowsPointingOutIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-hydra',
  className: 'accent-amber',
  heroes: [{ path: '/smart-contracts/hydra', component: Hero }],
  deprecated: true,
  sections: [
    {
      ...documentationSection('smart-contracts/hydra'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/smart-contracts/hydra' },
            { title: 'Quick Start', href: '/smart-contracts/hydra/quick-start' },
          ],
        },
      ],
    },
    {
      ...referencesSection('smart-contracts/hydra'),
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
    },
    zh: {
      headline: '扇出钱包',
      description: '创建在多个股东之间分割的共享钱包。',
      sections: {
        'Introduction': '简介'
      },
      links: {
        'Overview': '概述',
        'Quick Start': '快速开始'
      }
    }
  }
}
