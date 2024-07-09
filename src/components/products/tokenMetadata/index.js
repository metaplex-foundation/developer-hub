import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid'

export const tokenMetadata = {
  name: 'Token Metadata',
  headline: 'Digital ownership standard',
  description: 'The NFT standard on Solana.',
  navigationMenuCatergory: 'Create',
  path: 'token-metadata',
  icon: <EllipsisHorizontalCircleIcon />,
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
            { title: 'Minting NFTs', href: '/token-metadata/mint' },
            { title: 'Fetching NFTs', href: '/token-metadata/fetch' },
            { title: 'Updating NFTs', href: '/token-metadata/update' },
            { title: 'Transferring NFTs', href: '/token-metadata/transfer' },
            { title: 'Burning NFTs', href: '/token-metadata/burn' },
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
            { title: 'SPL Token-2022', href: '/token-metadata/token-2022' },
          ],
        },
      ],
    },
    {
      ...referencesSection('token-metadata'),
      href: `https://mpl-token-metadata.typedoc.metaplex.com/`,
      target: '_blank',
    },
    {
      ...recipesSection('token-metadata'),
      navigation: [
        {
          title: 'Recipes',
          links: [
            { title: 'Overview', href: '/token-metadata/recipes' },
            {
              title: 'Get Mints by Collection',
              href: '/token-metadata/recipes/get-by-collection',
            },
          ],
        },
      ],
    },
    { ...changelogSection('token-metadata') },
  ],
}
