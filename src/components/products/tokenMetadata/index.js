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
    {
      ...referencesSection('token-metadata'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/token-metadata/references' },
            {
              title: 'Installation',
              href: '/token-metadata/references/installation',
            },
          ],
        },
        {
          title: 'Core concepts',
          links: [
            {
              title: 'Understanding caching',
              href: '/token-metadata/references/understanding-caching',
            },
            {
              title: 'Predicting user behavior',
              href: '/token-metadata/references/predicting-user-behavior',
            },
            {
              title: 'Basics of time-travel',
              href: '/token-metadata/references/basics-of-time-travel',
            },
            {
              title: 'Introduction to string theory',
              href: '/token-metadata/references/introduction-to-string-theory',
            },
            {
              title: 'The butterfly effect',
              href: '/token-metadata/references/the-butterfly-effect',
            },
          ],
        },
      ],
    },
    { ...recipesSection('token-metadata') },
    { ...changelogSection('token-metadata') },
  ],
}
