import { documentationSection } from '@/shared/sections';
import { CommandLineIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Hero } from './Hero';

export const cli = {
  name: 'CLI',
  headline: 'MPLX CLI',
  description:
    'A CLI for the MPLX ecosystem',
  navigationMenuCatergory: 'Dev Tools',
  path: 'cli',
  icon: <CommandLineIcon />,
  github: 'https://github.com/metaplex-foundation/cli/',
  className: 'accent-green',
  primaryCta: {
    disabled: false,
  },
  heroes: [{ path: '/cli', component: Hero }],
  sections: [
    {
      ...documentationSection('cli'),
      navigation: [
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Introduction',
              href: '/cli',
            },
            {
              title: 'Installation',
              href: '/cli/installation',
            },
          ],
        },
        {
          title: 'Configuration',
          links: [
            {
              title: 'Wallets',
              href: '/cli/config/wallets',
            },
            {
              title: 'RPCs',
              href: '/cli/config/rpcs',
            },
            {
              title: 'Explorer',
              href: '/cli/config/explorer',
            },
          ],
        },
        {
          title: 'Core Commands',
          links: [
            {
              title: 'Create Asset',
              href: '/cli/core/create-asset',
            },
            {
              title: 'Create Collection',
              href: '/cli/core/create-collection',
            },
            {
              title: 'Update Asset',
              href: '/cli/core/update-asset',
            },
            {
              title: 'Fetch Asset or Collection',
              href: '/cli/core/fetch',
            },
          ],
        },
        {
          title: 'Candy Machine Commands',
          links: [
            {
              title: 'Overview',
              href: '/cli/cm',
            },
            {
              title: 'Create Candy Machine',
              href: '/cli/cm/create',
            },
            {
              title: 'Upload Assets',
              href: '/cli/cm/upload',
            },
            {
              title: 'Insert Items',
              href: '/cli/cm/insert',
            },
            {
              title: 'Validate Cache',
              href: '/cli/cm/validate',
            },
            {
              title: 'Fetch Information',
              href: '/cli/cm/fetch',
            },
            {
              title: 'Withdraw',
              href: '/cli/cm/withdraw',
            },
          ],
        },
        {
          title: 'Toolbox',
          links: [
            {
              title: 'Token Creation',
              href: '/cli/toolbox/token-create',
            },
            {
              title: 'Token Transfer',
              href: '/cli/toolbox/token-transfer',
            },
            {
              title: 'SOL Airdrop',
              href: '/cli/toolbox/sol-airdrop',
            },
            {
              title: 'SOL Balance',
              href: '/cli/toolbox/sol-balance',
            },
            {
              title: 'SOL Transfer',
              href: '/cli/toolbox/sol-transfer',
            },
            
            
          ],
        },
      ],
    },
  ],
}
