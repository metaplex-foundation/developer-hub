import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const tokenMetadata = {
  name: 'Token Metadata',
  headline: 'Digital ownership standard',
  description: 'The NFT standard on Solana.',
  path: 'token-metadata',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-token-metadata',
  className: 'accent-green',
  heroes: [{ path: '/token-metadata', component: Hero }],
  sections: [
    {
      ...documentationSection('token-metadata'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/token-metadata' },
            {
              title: 'Getting Started',
              href: '/token-metadata/getting-started',
              // Subpages: /js /rust, etc.
            },
            { title: 'Token Standard', href: '/token-metadata/todo' },
            { title: 'Definitions', href: '/token-metadata/todo' },
            { title: 'FAQ', href: '/token-metadata/todo' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Certified Collections', href: '/token-metadata/todo' },
            { title: 'Delegated Authorities', href: '/token-metadata/todo' },
            { title: 'Printed Editions', href: '/token-metadata/todo' },
            { title: 'Programmable NFTs', href: '/token-metadata/todo' },
            { title: 'NFT Escrow', href: '/token-metadata/todo' },
            { title: 'Using NFTs (deprecated)', href: '/token-metadata/todo' },
          ],
        },
      ],
    },
    { ...referencesSection('token-metadata') },
    { ...recipesSection('token-metadata') },
    { ...changelogSection('token-metadata') },
  ],
}
