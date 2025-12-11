import { documentationSection } from '@/shared/sections';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const nfts = {
  name: 'NFTs',
  headline: 'Non-Fungible Tokens',
  description: 'Create and manage NFTs on Solana using Metaplex Core.',
  navigationMenuCatergory: undefined,
  path: 'nfts',
  icon: <PhotoIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: [{ path: '/nfts', component: Hero }],
  sections: [
    {
      ...documentationSection('nfts'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/nfts',
            },
          ],
        },
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Create an NFT',
              href: '/nfts/create-nft',
            },
            {
              title: 'Fetch an NFT',
              href: '/nfts/fetch-nft',
            },
            {
              title: 'Update an NFT',
              href: '/nfts/update-nft',
            },
            {
              title: 'Transfer an NFT',
              href: '/nfts/transfer-nft',
            },
            {
              title: 'Burn an NFT',
              href: '/nfts/burn-nft',
            },
          ],
        },
      ],
    },
  ],
}
