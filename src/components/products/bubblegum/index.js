import {
  changelogSection,
  documentationSection,
  guidesSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { ArchiveBoxIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const bubblegum = {
  name: 'Bakstag',
  headline: 'P2P DEX',
  description: 'Omnichain OTC Market.',
  path: 'bubblegum',
  navigationMenuCatergory: 'Create',
  icon: <ArchiveBoxIcon />,
  github: 'https://github.com/bakstag-finance',
  className: 'accent-blue',
  heroes: [{ path: '/bubblegum', component: Hero }],
  sections: [
    {
      ...documentationSection('bubblegum'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/bubblegum' },
            { title: 'Getting started', href: '/bubblegum/getting-started' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Offer',
              href: '/bubblegum/offer',
            },
            {
              title: 'Token Precision',
              href: '/bubblegum/token-precision',
            },
            {
              title: 'Creating Bubblegum Trees',
              href: '/bubblegum/create-trees',
            },
            {
              title: 'Minting Compressed NFTs (cNFTs)',
              href: '/bubblegum/mint-cnfts',
            },
            { title: 'Fetching cNFTs', href: '/bubblegum/fetch-cnfts' },
            { title: 'Transferring cNFTs', href: '/bubblegum/transfer-cnfts' },
            { title: 'Updating cNFTs', href: '/bubblegum/update-cnfts' },
            { title: 'Burning cNFTs', href: '/bubblegum/burn-cnfts' },
            {
              title: 'Decompressing cNFTs',
              href: '/bubblegum/decompress-cnfts',
            },
            { title: 'Delegating cNFTs', href: '/bubblegum/delegate-cnfts' },
            { title: 'Delegating Trees', href: '/bubblegum/delegate-trees' },
            {
              title: 'Verifying Collections',
              href: '/bubblegum/verify-collections',
            },
            { title: 'Verifying Creators', href: '/bubblegum/verify-creators' },
          ],
        },
        {
          title: 'Advanced',
          links: [
            {
              title: 'Concurrent Merkle Trees',
              href: '/bubblegum/concurrent-merkle-trees',
            },
            {
              title: 'Storing and Indexing NFT Data',
              href: '/bubblegum/stored-nft-data',
            },
            { title: 'Hashing NFT Data', href: '/bubblegum/hashed-nft-data' },
            {
              title: 'Merkle Tree Canopy',
              href: '/bubblegum/merkle-tree-canopy',
            },
          ],
        },
      ],
    },
    {
      ...guidesSection('bubblegum'),
      navigation: [
        {
          title: 'Javascript',
          links: [
            {
              title: 'How to Create a 1,000,000 NFT Collection on Solana',
              href: 'guides/javascript/how-to-create-1000000-nfts-on-solana',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('bubblegum'),
      href: 'https://mpl-bubblegum.typedoc.metaplex.com/',
      target: '_blank'
    },
  ],
}
