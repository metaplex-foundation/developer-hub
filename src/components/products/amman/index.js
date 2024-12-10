import {
  documentationSection
} from '@/shared/sections';
import { ServerIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const amman = {
  name: 'Amman',
  headline: 'Local Validator Toolkit',
  description:
    'A local validator toolkit for testing Solana programs and applications.',
  path: 'amman',
  navigationMenuCatergory: 'Dev Tools',
  icon: <ServerIcon />,
  github: 'https://github.com/metaplex-foundation/amman',
  className: 'accent-sky',
  heroes: [{ path: '/amman', component: Hero }],
  sections: [
    {
      ...documentationSection('amman'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/amman' },
            { title: 'Getting Started', href: '/amman/getting-started' },
            { title: 'CLI Commands', href: '/amman/cli-commands' },
            { title: 'Configuration', href: '/amman/configuration' },
            { title: 'Pre-made Configs', href: '/amman/pre-made-configs' },
          ],
        },
      ],
    },
  ],
}
