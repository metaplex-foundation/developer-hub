import { documentationSection } from '@/shared/sections';
import { CommandLineIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Hero } from './Hero';

export const cli = {
  name: 'CLI',
  headline: 'MPLX CLI',
  description:
    'A CLI for the MPLX ecosystem',
  navigationMenuCatergory: 'Dev Tools',
  path: 'dev-tools/cli',
  icon: <CommandLineIcon />,
  github: 'https://github.com/metaplex-foundation/cli/',
  className: 'accent-green',
  primaryCta: {
    disabled: false,
  },
  heroes: [{ path: '/dev-tools/cli', component: Hero }],
  sections: [
    {
      ...documentationSection('dev-tools/cli'),
      navigation: [
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Introduction',
              href: '/dev-tools/cli',
            },
            {
              title: 'Installation',
              href: '/dev-tools/cli/installation',
            },
          ],
        },
        {
          title: 'Configuration',
          links: [
            {
              title: 'Wallets',
              href: '/dev-tools/cli/config/wallets',
            },
            {
              title: 'RPCs',
              href: '/dev-tools/cli/config/rpcs',
            },
            {
              title: 'Explorer',
              href: '/dev-tools/cli/config/explorer',
            },
          ],
        },
        {
          title: 'Core Commands',
          links: [
            {
              title: 'Create Asset',
              href: '/dev-tools/cli/core/create-asset',
            },
            {
              title: 'Create Collection',
              href: '/dev-tools/cli/core/create-collection',
            },
            {
              title: 'Update Asset',
              href: '/dev-tools/cli/core/update-asset',
            },
            {
              title: 'Burn Asset',
              href: '/dev-tools/cli/core/burn-asset',
            },
            {
              title: 'Fetch Asset or Collection',
              href: '/dev-tools/cli/core/fetch',
            },
            {
              title: 'Add and Update Plugins',
              href: '/dev-tools/cli/core/plugins',
            },
          ],
        },
        {
          title: 'Toolbox',
          links: [
            {
              title: 'Token Creation',
              href: '/dev-tools/cli/toolbox/token-create',
            },
            {
              title: 'Token Transfer',
              href: '/dev-tools/cli/toolbox/token-transfer',
            },
            {
              title: 'SOL Airdrop',
              href: '/dev-tools/cli/toolbox/sol-airdrop',
            },
            {
              title: 'SOL Balance',
              href: '/dev-tools/cli/toolbox/sol-balance',
            },
            {
              title: 'SOL Transfer',
              href: '/dev-tools/cli/toolbox/sol-transfer',
            },
            
            
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'MPLX CLI',
      description: 'A CLI for the MPLX ecosystem',
      sections: {
        'Introduction': 'Introduction',
        'Configuration': 'Configuration',
        'Core Commands': 'Core Commands',
        'Toolbox': 'Toolbox'
      },
      links: {
        'Overview': 'Overview',
        'Installation': 'Installation',
        'Wallets': 'Wallets',
        'RPCs': 'RPCs',
        'Explorer': 'Explorer'
      }
    },
    ja: {
      headline: 'MPLX CLI',
      description: 'MPLXエコシステム用のCLI',
      sections: {
        'Introduction': '紹介',
        'Configuration': '設定',
        'Core Commands': 'Coreコマンド',
        'Toolbox': 'ツールボックス'
      },
      links: {
        'Overview': '概要',
        'Installation': 'インストール',
        'Wallets': 'ウォレット',
        'RPCs': 'RPC',
        'Explorer': 'エクスプローラー'
      }
    },
    ko: {
      headline: 'MPLX CLI',
      description: 'MPLX 에코시스템을 위한 CLI',
      sections: {
        'Introduction': '소개',
        'Configuration': '구성',
        'Core Commands': 'Core 명령어',
        'Toolbox': '툴박스'
      },
      links: {
        'Overview': '개요',
        'Installation': '설치',
        'Wallets': '지갑',
        'RPCs': 'RPC',
        'Explorer': '익스플로러'
      }
    }
  }
}
