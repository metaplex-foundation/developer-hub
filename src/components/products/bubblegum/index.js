import {
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections';
import { ArchiveBoxIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const bubblegum = {
  name: 'Legacy Bubblegum',
  headline: 'Compressed NFTs',
  description: 'NFTs that scale.',
  path: 'bubblegum',
  navigationMenuCatergory: 'MPL',
  icon: <ArchiveBoxIcon />,
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
            { title: 'Metaplex DAS API RPCs', href: '/rpc-providers' },
            { title: 'FAQ', href: '/bubblegum/faq' },
          ],
        },
        {
          title: 'SDK',
          links: [
            { title: 'Javascript', href: '/bubblegum/sdk/javascript' },
            { title: 'Rust', href: '/bubblegum/sdk/rust' },
          ],
        },
        {
          title: 'General Features',
          links: [
            {
              title: 'Creating Bubblegum Trees',
              href: '/bubblegum/create-trees',
            },
            { title: 'Fetching cNFTs', href: '/bubblegum/fetch-cnfts' },
            { title: 'Delegating Trees', href: '/bubblegum/delegate-trees' },
          ],
        },
        {
          title: 'Bubblegum v2',
          links: [
            {
              title: 'Minting Compressed NFTs (cNFTs)',
              href: '/bubblegum/mint-cnfts',
            },
            { title: 'Transferring cNFTs', href: '/bubblegum/transfer-cnfts' },
            { title: 'Updating cNFTs', href: '/bubblegum/update-cnfts' },
            { title: 'Burning cNFTs', href: '/bubblegum/burn-cnfts' },
            { title: 'Delegating cNFTs', href: '/bubblegum/delegate-cnfts' },
            {
              title: 'Verifying Collections',
              href: '/bubblegum/verify-collections',
            },
            { title: 'Verifying Creators', href: '/bubblegum/verify-creators' },
          ],
        },
        {
          title: 'Bubblegum v1 (legacy)',
          links: [
            {
              title: 'Minting Compressed NFTs (cNFTs)',
              href: '/bubblegum/mint-cnfts',
            },
            { title: 'Transferring cNFTs', href: '/bubblegum/transfer-cnfts' },
            { title: 'Updating cNFTs', href: '/bubblegum/update-cnfts' },
            { title: 'Burning cNFTs', href: '/bubblegum/burn-cnfts' },
            {
              title: 'Decompressing cNFTs',
              href: '/bubblegum/decompress-cnfts',
            },
            { title: 'Delegating cNFTs', href: '/bubblegum/delegate-cnfts' },
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
              href: '/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana',
            },
            {
              title: 'How to Interact with cNFTs on Other SVMs',
              href: '/bubblegum/guides/javascript/how-to-interact-with-cnfts-on-other-svms',
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
