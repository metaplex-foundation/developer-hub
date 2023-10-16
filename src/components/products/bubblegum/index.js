import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const bubblegum = {
  name: 'Bubblegum',
  headline: 'Compressed NFTs',
  description: 'NFTs that scale to new orders of magnitude.',
  path: 'bubblegum',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-bubblegum',
  className: 'accent-green',
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
            { title: 'Metaplex DAS API RPCs', href: '/bubblegum/rpcs' },
            { title: 'FAQ', href: '/bubblegum/faq' },
          ],
        },
        {
          title: 'Features',
          links: [
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
    { ...referencesSection('bubblegum') },
    { ...recipesSection('bubblegum') },
    { ...changelogSection('bubblegum') },
  ],
}
