import {
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections';
import { FolderIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const bubblegumv2 = {
  name: 'Bubblegum v2',
  headline: 'Improved Compressed NFTs',
  description: 'NFTs that scale to new orders of magnitude.',
  path: 'bubblegum-v2',
  navigationMenuCatergory: 'MPL',
  icon: <FolderIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-bubblegum',
  className: 'accent-green',
  heroes: [{ path: '/bubblegum-v2', component: Hero }],
  sections: [
    {
      ...documentationSection('bubblegum'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/bubblegum-v2' },
            { title: 'Metaplex DAS API RPCs', href: '/rpc-providers' },
            { title: 'FAQ', href: '/bubblegum-v2/faq' },
          ],
        },
        {
          title: 'SDK',
          links: [
            { title: 'Javascript', href: '/bubblegum-v2/sdk/javascript' },
            { title: 'Rust', href: '/bubblegum-v2/sdk/rust' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Creating Bubblegum Trees',
              href: '/bubblegum-v2/create-trees',
            },
            {
              title: 'Minting Compressed NFTs (cNFTs)',
              href: '/bubblegum-v2/mint-cnfts',
            },
            { title: 'Fetching cNFTs', href: '/bubblegum-v2/fetch-cnfts' },
            { title: 'Transferring cNFTs', href: '/bubblegum-v2/transfer-cnfts' },
            { title: 'Updating cNFTs', href: '/bubblegum-v2/update-cnfts' },
            { title: 'Burning cNFTs', href: '/bubblegum-v2/burn-cnfts' },
            {
              title: 'Decompressing cNFTs',
              href: '/bubblegum-v2/decompress-cnfts',
            },
            { title: 'Delegating cNFTs', href: '/bubblegum-v2/delegate-cnfts' },
            { title: 'Delegating Trees', href: '/bubblegum-v2/delegate-trees' },
            {
              title: 'Verifying Collections',
              href: '/bubblegum-v2/verify-collections',
            },
            { title: 'Verifying Creators', href: '/bubblegum-v2/verify-creators' },
          ],
        },
        {
          title: 'Advanced',
          links: [
            {
              title: 'Concurrent Merkle Trees',
              href: '/bubblegum-v2/concurrent-merkle-trees',
            },
            {
              title: 'Storing and Indexing NFT Data',
              href: '/bubblegum-v2/stored-nft-data',
            },
            { title: 'Hashing NFT Data', href: '/bubblegum-v2/hashed-nft-data' },
            {
              title: 'Merkle Tree Canopy',
              href: '/bubblegum-v2/merkle-tree-canopy',
            },
          ],
        },
      ],
    },
    {
      ...guidesSection('bubblegum-v2'),
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
      ...referencesSection('bubblegum-v2'),
      href: 'https://mpl-bubblegum.typedoc.metaplex.com/',
      target: '_blank'
    },
  ],
}
