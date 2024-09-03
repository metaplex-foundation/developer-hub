import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/solid'

export const hydra = {
  name: 'Hydra',
  headline: 'Fanout wallets',
  description: 'Create shared wallets, split between multiple shareholders.',
  navigationMenuCatergory: 'Hydra',
  path: 'hydra',
  navigationMenuCatergory: 'Utility',
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
}
