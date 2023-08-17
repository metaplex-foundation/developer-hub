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
            },
            { title: 'FAQ', href: '/token-metadata/faq' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Token Standards (Assets)',
              href: '/token-metadata/token-standard',
            },
            { title: 'Minting Assets', href: '/token-metadata/mint' }, // Uploading off-chain data section + Create + Mint.
            { title: 'Updating Assets', href: '/token-metadata/update' },
            { title: 'Transferring Assets', href: '/token-metadata/transfer' },
            { title: 'Burning Assets', href: '/token-metadata/burn' },
            { title: 'Printed Editions', href: '/token-metadata/print' }, // Include "Definitions" content.
            {
              title: 'Verified Collections',
              href: '/token-metadata/collections',
            },
            { title: 'Verified Creators', href: '/token-metadata/creators' },
            {
              title: 'Delegated Authorities',
              href: '/token-metadata/delegates',
            }, // Delegate + Revoke + Delegated transfer and burn.
            { title: 'Locking Assets', href: '/token-metadata/lock' },
            { title: 'Programmable NFTs', href: '/token-metadata/pnfts' },
            { title: 'NFT Escrow', href: '/token-metadata/escrow' },
            {
              title: 'Asset Usage (Deprecated)',
              href: '/token-metadata/usage',
            },
          ],
        },
      ],
    },
    { ...referencesSection('token-metadata') },
    { ...recipesSection('token-metadata') },
    { ...changelogSection('token-metadata') },
  ],
}
