import { documentationSection, guidesSection, referencesSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Square3Stack3DIcon } from '@heroicons/react/24/solid'

export const coreCandyMachine = {
  name: 'Core Candy Machine',
  headline: 'Core Asset launchpad',
  description: 'Launch your next MPL Core Asset collection on Solana.',
  navigationMenuCatergory: 'Commerce',
  path: 'core-candy-machine',
  icon: <Square3Stack3DIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-core-candy-machine',
  className: 'accent-pink',
  heroes: [{ path: '/core-candy-machine', component: Hero }],
  sections: [
    {
      ...documentationSection('core-candy-machine'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/core-candy-machine' },
            {
              title: 'Getting Started',
              href: '/core-candy-machine/getting-started',
              // Subpages: /js /rust, etc.
            },
            {
              title: 'Sugar Commands',
              href: '/core-candy-machine/sugar',
              // Subpages: /js /rust, etc.
            },
          ],
        },
        // {
        //   title: 'Sugar',
        //   links: [
        //     { title: 'Sugar w/ Candy Machine', href: '/core-candy-machine/sugar' },
        //   ],
        // },
        {
          title: 'Core Candy Machine',

          links: [
            {
              title: 'Overview',
              href: '/core-candy-machine/overview',
            },
            { title: 'Candy Guards', href: '/core-candy-machine/guards' },
            {
              title: 'Preparing Assets',
              href: '/core-candy-machine/preparing-assets',
            },
            {
              title: 'Creating a Candy Machine',
              href: '/core-candy-machine/create',
            },
            { title: 'Inserting Items', href: '/core-candy-machine/insert-items' },
            {
              title: 'Updating a Candy Machine and Guards',
              href: '/core-candy-machine/update',
            },
            {
              title: 'Guard Groups and Phases',
              href: '/core-candy-machine/guard-groups',
            },
            {
              title: 'Special Guard Instructions',
              href: '/core-candy-machine/guard-route',
            },
            {
              title: 'Fetching a Candy Machine',
              href: '/core-candy-machine/fetching-a-candy-machine',
            },
            {
              title: 'Minting from a Candy Machine',
              href: '/core-candy-machine/mint',
            },
            {
              title: 'Withdrawing a Candy Machine',
              href: '/core-candy-machine/withdrawing-a-candy-machine',
            },
          ],
        },
        {
          title: 'Available Guards',
          links: [
            {
              title: 'Address Gate',
              href: '/core-candy-machine/guards/address-gate',
            },
            { title: 'Allocation', href: '/core-candy-machine/guards/allocation' },
            { title: 'Allow List', href: '/core-candy-machine/guards/allow-list' },
            {
              title: 'Asset Burn',
              href: '/core-candy-machine/guards/asset-burn',
            },
            {
              title: 'Asset Burn Multi',
              href: '/core-candy-machine/guards/asset-burn-multi',
            },
            {
              title: 'Asset Payment',
              href: '/core-candy-machine/guards/asset-payment',
            },
            {
              title: 'Asset Payment Multi',
              href: '/core-candy-machine/guards/asset-payment-multi',
            },
            { title: 'Asset Mint Limit', href: '/core-candy-machine/guards/asset-mint-limit' },
            { title: 'Bot Tax', href: '/core-candy-machine/guards/bot-tax' },
            { title: 'End Date', href: '/core-candy-machine/guards/end-date' },
            { title: 'Edition', href: '/core-candy-machine/guards/edition' },
            {
              title: 'Freeze Sol Payment',
              href: '/core-candy-machine/guards/freeze-sol-payment',
            },
            {
              title: 'Freeze Token Payment',
              href: '/core-candy-machine/guards/freeze-token-payment',
            },
            { title: 'Gatekeeper', href: '/core-candy-machine/guards/gatekeeper' },
            { title: 'Mint Limit', href: '/core-candy-machine/guards/mint-limit' },
            { title: 'NFT Burn', href: '/core-candy-machine/guards/nft-burn' },
            { title: 'NFT Gate', href: '/core-candy-machine/guards/nft-gate' },
            { title: 'NFT Mint Limit', href: '/core-candy-machine/guards/nft-mint-limit' },
            {
              title: 'NFT Payment',
              href: '/core-candy-machine/guards/nft-payment',
            },
            {
              title: 'Program Gate',
              href: '/core-candy-machine/guards/program-gate',
            },
            {
              title: 'Redeemed Amount',
              href: '/core-candy-machine/guards/redeemed-amount',
            },
            {
              title: 'Sol Fixed Fee',
              href: '/core-candy-machine/guards/sol-fixed-fee',
            },
            {
              title: 'Sol Payment',
              href: '/core-candy-machine/guards/sol-payment',
            },
            { title: 'Start Date', href: '/core-candy-machine/guards/start-date' },
            {
              title: 'Third Party Signer',
              href: '/core-candy-machine/guards/third-party-signer',
            },
            { title: 'Token Burn', href: '/core-candy-machine/guards/token-burn' },
            { title: 'Token Gate', href: '/core-candy-machine/guards/token-gate' },
            {
              title: 'Token Payment',
              href: '/core-candy-machine/guards/token-payment',
            },
            {
              title: 'Token2022 Payment',
              href: '/core-candy-machine/guards/token2022-payment',
            },
          ],
        },
        {
          title: 'Custom Guards',
          links: [
            {
              title: 'Generating Client',
              href: '/core-candy-machine/custom-guards/generating-client',
            },
          ],
        },
      ],
    },
    
    {
      ...guidesSection('core-candy-machine'),
      title: 'Guides',
      navigation: [
        {
          title: 'Candy Machine Guides',
          links: [
            { title: 'Create an NFT Collection On Solana', href: '/core-candy-machine/guides/create-a-core-nft-collection-on-solana-with-candy-machine' },
          ],
        },
      ]
    },


    {
      ...referencesSection('core-candy-machine'),
      href: `https://mpl-core-candy-machine.typedoc.metaplex.com/`,
      title: 'Javascript API References',
      icon: "JavaScript",
      target: '_blank',
    },
    {
      ...referencesSection('core-candy-machine'),
      title: 'Rust API References',
      icon: 'Rust',
      href: `https://docs.rs/mpl-core-candy-machine-core/`,
      target: '_blank',
    },
  
  ],
}
