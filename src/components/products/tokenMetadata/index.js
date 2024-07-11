import {
  changelogSection,
  documentationSection,
  guidesSection,
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
            { title: 'Minting Assets', href: '/token-metadata/mint' },
            { title: 'Fetching Assets', href: '/token-metadata/fetch' },
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
            { title: 'SPL Token-2022', href: '/token-metadata/token-2022' },
          ],
        },
      ],
    },
    {
      ...guidesSection('token-metadata'),

      ...referencesSection('token-metadata'),
      href: `https://mpl-token-metadata.typedoc.metaplex.com/`,
      target: '_blank',
    },

      navigation: [
        {
          title: 'Guides',
          links: [
            { title: 'Overview', href: '/token-metadata/guides' },
            {
              title: 'Get Mints by Collection',
              href: '/token-metadata/guides/get-by-collection',
            },
          ],
        },
        {
          title: 'Javascript',
          links: [
            {
              title: 'Create an NFT',
              href: '/token-metadata/guides/javascript/create-an-nft',
            },
          ],
        },
      ],
    },
    { ...changelogSection('token-metadata') },
  ],
}
