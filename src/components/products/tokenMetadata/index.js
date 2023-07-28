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
            { title: 'FAQ', href: '/token-metadata/todo' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Token Standards (Assets)', href: '/token-metadata/todo' }, // Include "Non-fungible tokens" definition.
            { title: 'Minting Assets', href: '/token-metadata/todo' }, // Uploading off-chain data section + Create + Mint.
            { title: 'Updating Assets', href: '/token-metadata/todo' },
            { title: 'Transferring Assets', href: '/token-metadata/todo' },
            { title: 'Burning Assets', href: '/token-metadata/todo' },
            { title: 'Printed Editions', href: '/token-metadata/todo' }, // Include "Definitions" content.
            { title: 'Verified Collections', href: '/token-metadata/todo' },
            { title: 'Verified Creators', href: '/token-metadata/todo' },
            { title: 'Delegated Authorities', href: '/token-metadata/todo' }, // Delegate + Revoke + Delegated transfer and burn.
            { title: 'Locking Assets', href: '/token-metadata/todo' },
            { title: 'Programmable NFTs', href: '/token-metadata/todo' },
            { title: 'NFT Escrow', href: '/token-metadata/todo' },
            { title: 'Asset usage (deprecated)', href: '/token-metadata/todo' },
          ],
        },
      ],
    },
    { ...referencesSection('token-metadata') },
    { ...recipesSection('token-metadata') },
    { ...changelogSection('token-metadata') },
  ],
}
