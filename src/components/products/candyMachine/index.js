import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const candyMachine = {
  name: 'Candy Machine',
  headline: 'NFT launchpad',
  description: 'Launch your next NFT collection on Solana.',
  path: 'candy-machine',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-candy-machine',
  className: 'accent-pink',
  heroes: [{ path: '/candy-machine', component: Hero }],
  sections: [
    {
      ...documentationSection('candy-machine'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/candy-machine' },
            { title: 'Installation', href: '/candy-machine/installation' },
          ],
        },
      ],
    },
    {
      ...referencesSection('candy-machine'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/candy-machine/references' },
            {
              title: 'Installation',
              href: '/candy-machine/references/installation',
            },
          ],
        },
      ],
    },
    { ...recipesSection('candy-machine') },
    { ...changelogSection('candy-machine') },
  ],
}
