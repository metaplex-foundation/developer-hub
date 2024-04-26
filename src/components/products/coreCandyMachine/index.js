import { documentationSection, referencesSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const coreCandyMachine = {
  name: 'Core Candy Machine',
  headline: 'Core Asset launchpad',
  description: 'Launch your next MPL Core Asset collection on Solana.',
  navigationMenuCatergory: 'Commerce',
  path: 'core-candy-machine',
  logo: Logo,
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
          ],
        },
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
            {
              title: 'Updating a Candy Machine and Guards',
              href: '/core-candy-machine/update',
            },
            { title: 'Inserting Items', href: '/core-candy-machine/insert-items' },
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

            // {
            //   title: '----old----',
            //   href: '/core-candy-machine/settings',
            // },
            // {
            //   title: 'Candy Machine Settings',
            //   href: '/core-candy-machine/settings',
            // },
            // { title: 'Managing Candy Machines', href: '/core-candy-machine/manage' },
            // { title: 'Inserting Items', href: '/core-candy-machine/insert-items' },
            // { title: 'Candy Guards', href: '/core-candy-machine/guards' },
            // { title: 'Guard Groups', href: '/core-candy-machine/guard-groups' },
            
            // { title: 'Minting', href: '/core-candy-machine/mint' },
            // { title: 'Programmable NFTs', href: '/core-candy-machine/pnfts' },
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
            { title: 'Bot Tax', href: '/core-candy-machine/guards/bot-tax' },
            { title: 'End Date', href: '/core-candy-machine/guards/end-date' },
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
              title: 'Writing a Custom Guard',
              href: '/core-candy-machine/custom-guards/writing-custom-guards',
            },
            {
              title: 'Generating Client',
              href: '/core-candy-machine/custom-guards/generating-client',
            },
          ],
        },
      ],
    },
    // {
    //   id: 'sugar',
    //   title: 'Sugar',
    //   icon: 'SolidCake',
    //   href: `/core-candy-machine/sugar`,
    //   navigation: [
    //     {
    //       title: 'Introduction',
    //       links: [
    //         { title: 'Overview', href: '/core-candy-machine/sugar' },
    //         {
    //           title: 'Installation',
    //           href: '/core-candy-machine/sugar/installation',
    //         },
    //         {
    //           title: 'Getting Started',
    //           href: '/core-candy-machine/sugar/getting-started',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Working with Sugar',
    //       links: [
    //         {
    //           title: 'Configuration File',
    //           href: '/core-candy-machine/sugar/configuration',
    //         },
    //         {
    //           title: 'Cache file',
    //           href: '/core-candy-machine/sugar/cache',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Commands',
    //       links: [
    //         {
    //           title: 'airdrop',
    //           href: '/core-candy-machine/sugar/commands/airdrop',
    //         },
    //         { title: 'bundlr', href: '/core-candy-machine/sugar/commands/bundlr' },
    //         {
    //           title: 'collection',
    //           href: '/core-candy-machine/sugar/commands/collection',
    //         },
    //         { title: 'config', href: '/core-candy-machine/sugar/commands/config' },
    //         { title: 'deploy', href: '/core-candy-machine/sugar/commands/deploy' },
    //         { title: 'freeze', href: '/core-candy-machine/sugar/commands/freeze' },
    //         { title: 'guard', href: '/core-candy-machine/sugar/commands/guard' },
    //         { title: 'hash', href: '/core-candy-machine/sugar/commands/hash' },
    //         { title: 'launch', href: '/core-candy-machine/sugar/commands/launch' },
    //         { title: 'mint', href: '/core-candy-machine/sugar/commands/mint' },
    //         { title: 'reveal', href: '/core-candy-machine/sugar/commands/reveal' },
    //         { title: 'show', href: '/core-candy-machine/sugar/commands/show' },
    //         { title: 'sign', href: '/core-candy-machine/sugar/commands/sign' },
    //         { title: 'update', href: '/core-candy-machine/sugar/commands/update' },
    //         { title: 'upload', href: '/core-candy-machine/sugar/commands/upload' },
    //         {
    //           title: 'validate',
    //           href: '/core-candy-machine/sugar/commands/validate',
    //         },
    //         { title: 'verify', href: '/core-candy-machine/sugar/commands/verify' },
    //         {
    //           title: 'withdraw',
    //           href: '/core-candy-machine/sugar/commands/withdraw',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'References',
    //       links: [
    //         {
    //           title: 'Bring Your Own Uploader',
    //           href: '/core-candy-machine/sugar/bring-your-own-uploader',
    //         },
    //       ],
    //     },
    //   ],
    // },
    
    
    {
      ...referencesSection('core-candy-machine'),
      href: `https://mpl-core-candy-machine-js-docs.vercel.app/`,
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
    
    /*
    {
      ...recipesSection('candy-machine'),
      navigation: [
        {
          title: 'How to create a Candy Machine',
          links: [
            { title: 'Part 1 (Sugar)', href: '/candy-machine/recipes/todo' },
            { title: 'Part 2 (Umi)', href: '/candy-machine/recipes/todo' },
            { title: 'Part 2 (JS SDK)', href: '/candy-machine/recipes/todo' },
          ],
        },
      ],
    },
    { ...changelogSection('candy-machine') },
    */
  ],
}
