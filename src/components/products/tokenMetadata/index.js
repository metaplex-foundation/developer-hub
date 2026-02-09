import {
  documentationSection,
  guidesSection,
} from '@/shared/sections';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';

export const tokenMetadata = {
  name: 'Token Metadata',
  headline: 'Digital ownership standard',
  description: 'Create tokens and NFTs with the SPL Token Program',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/token-metadata',
  icon: <EllipsisHorizontalCircleIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-token-metadata',
  className: 'accent-green',
  protocolFees: {
    create: {
      solana: '0.01 SOL',
      payer: 'Collector',
      notes: 'Paid by the minter, which is typically individual collectors minting new drops. Alternatively creators may consider using Core (next gen NFTs) for maximum composability and lower mint costs, or Bubblegum (compressed NFTs). Includes all instructions that "create" an NFT including ones that create print editions.',
    },
  },
  sections: [
    {
      ...documentationSection('smart-contracts/token-metadata'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/smart-contracts/token-metadata' },
            {
              title: 'Token Standards',
              href: '/smart-contracts/token-metadata/token-standard',
            },
            { title: 'FAQ', href: '/smart-contracts/token-metadata/faq' },
          ],
        },
        {
          title: 'SDK',
          links: [
            {
              title: 'JavaScript (Umi)',
              href: '/smart-contracts/token-metadata/sdk/umi',
            },
            {
              title: 'JavaScript (Kit)',
              href: '/smart-contracts/token-metadata/sdk/kit',
            },
            {
              title: 'Rust',
              href: '/smart-contracts/token-metadata/sdk/rust',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Creating & Minting', href: '/smart-contracts/token-metadata/mint' },
            { title: 'Fetching Metadata', href: '/smart-contracts/token-metadata/fetch' },
            { title: 'Updating Metadata', href: '/smart-contracts/token-metadata/update' },
            { title: 'Transferring NFTs', href: '/smart-contracts/token-metadata/transfer' },
            { title: 'Burning NFTs', href: '/smart-contracts/token-metadata/burn' },
            { title: 'Printed Editions', href: '/smart-contracts/token-metadata/print' },
            {
              title: 'Verified Collections',
              href: '/smart-contracts/token-metadata/collections',
            },
            { title: 'Verified Creators', href: '/smart-contracts/token-metadata/creators' },
            {
              title: 'Delegated Authorities',
              href: '/smart-contracts/token-metadata/delegates',
            },
            { title: 'Locking NFTs', href: '/smart-contracts/token-metadata/lock' },
            { title: 'Programmable NFTs (pNFTs)', href: '/smart-contracts/token-metadata/pnfts' },
            { title: 'NFT Escrow', href: '/smart-contracts/token-metadata/escrow' },
            { title: 'SPL Token-2022', href: '/smart-contracts/token-metadata/token-2022' },
          ],
        },
      ],
    },
    {
      ...guidesSection('smart-contracts/token-metadata'),
      navigation: [
        {
          title: 'Guides',
          links: [
            { title: 'Overview', href: '/smart-contracts/token-metadata/guides' },
            {
              title: 'Account Size Reduction',
              href: '/smart-contracts/token-metadata/guides/account-size-reduction',
            },
            {
              title: 'Get Mints by Collection',
              href: '/smart-contracts/token-metadata/guides/get-by-collection',
            },
          ],
        },
        {
          title: 'Javascript',
          links: [
            {
              title: 'Create an NFT',
              href: '/smart-contracts/token-metadata/guides/javascript/create-an-nft',
            },
          ],
        },
        {
          title: 'Anchor',
          links: [
            {
              title: 'Token Claimer (Airdrop) Smart Contract',
              href: '/smart-contracts/token-metadata/guides/anchor/token-claimer-smart-contract',
            },
          ],
        },
      ],
    }
  ],
  localizedNavigation: {
    en: {
      headline: 'Digital ownership standard',
      description: 'Create tokens and NFTs with the SPL Token Program',
      sections: {
        'Introduction': 'Introduction',
        'SDK': 'SDK',
        'Features': 'Features',
        'Guides': 'Guides',
        'Javascript': 'Javascript',
        'Anchor': 'Anchor',
      },
      links: {
        'Overview': 'Overview',
        'Token Standards': 'Token Standards',
        'FAQ': 'FAQ',
        'JavaScript (Umi)': 'JavaScript (Umi)',
        'JavaScript (Kit)': 'JavaScript (Kit)',
        'Rust': 'Rust',
        'Creating & Minting': 'Creating & Minting',
        'Fetching Metadata': 'Fetching Metadata',
        'Updating Metadata': 'Updating Metadata',
        'Transferring NFTs': 'Transferring NFTs',
        'Burning NFTs': 'Burning NFTs',
        'Printed Editions': 'Printed Editions',
        'Verified Collections': 'Verified Collections',
        'Verified Creators': 'Verified Creators',
        'Delegated Authorities': 'Delegated Authorities',
        'Locking NFTs': 'Locking NFTs',
        'Programmable NFTs (pNFTs)': 'Programmable NFTs (pNFTs)',
        'NFT Escrow': 'NFT Escrow',
        'SPL Token-2022': 'SPL Token-2022',
        'Account Size Reduction': 'Account Size Reduction',
        'Get Mints by Collection': 'Get Mints by Collection',
        'Create an NFT': 'Create an NFT',
        'Token Claimer (Airdrop) Smart Contract': 'Token Claimer (Airdrop) Smart Contract',
      }
    },
  }
}
