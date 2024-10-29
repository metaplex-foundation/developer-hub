import {
  changelogSection,
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

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
          title: 'Breaking Change!',
          links: [
            {
              title: 'Account Size Reduction',
              href: '/token-metadata/guides/account-size-reduction',
            },
          ],
        },
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
            { title: 'Programmable NFTs (pNFTs)', href: '/token-metadata/pnfts' },
            { title: 'NFT Escrow', href: '/token-metadata/escrow' },
            { title: 'SPL Token-2022', href: '/token-metadata/token-2022' },
          ],
        },
      ],
    },
    {
      ...guidesSection('token-metadata'),
      navigation: [
        {
          title: 'Guides',
          links: [
            { title: 'Overview', href: '/token-metadata/guides' },
            {
              title: 'Get Mints by Collection',
              href: '/token-metadata/guides/get-by-collection',
            },
            {
              title: 'Account Size Reduction',
              href: '/token-metadata/guides/account-size-reduction',
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
    {
      ...referencesSection('token-metadata'),
      href: `https://mpl-token-metadata-js-docs.vercel.app/`,
      target: '_blank',
    },

  ],
}
