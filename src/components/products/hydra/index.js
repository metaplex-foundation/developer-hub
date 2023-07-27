import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const hydra = {
  name: 'Hydra',
  headline: 'Fanout wallets',
  description: 'Create shared wallets, split between multiple shareholders.',
  path: 'hydra',
  logo: Logo,
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
            { title: 'Getting started', href: '/hydra' },
            { title: 'Installation', href: '/hydra/installation' },
          ],
        },
      ],
    },
    {
      ...referencesSection('hydra'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/hydra/references' },
            { title: 'Installation', href: '/hydra/references/installation' },
          ],
        },
      ],
    },
    { ...recipesSection('hydra') },
    { ...changelogSection('hydra') },
  ],
}
