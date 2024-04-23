import { documentationSection, referencesSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const candyMachine4 = {
  name: 'Candy Machine 4',
  headline: 'Core Asset launchpad',
  description: 'Launch your next MPL Core Asset collection on Solana.',
  navigationMenuCatergory: 'Commerce',
  path: 'candy-machine-4',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-candy-machine',
  className: 'accent-pink',
  heroes: [{ path: '/candy-machine-4', component: Hero }],
  sections: [
    {
      ...documentationSection('candy-machine-4'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/candy-machine-4' },
            {
              title: 'Getting Started',
              href: '/candy-machine-4/getting-started',
              // Subpages: /js /rust, etc.
            },
          ],
        },
        {
          title: 'Candy Machine V4',

          links: [
            {
              title: 'Overview',
              href: '/candy-machine-4/overview',
            },
            { title: 'Candy Guards', href: '/candy-machine-4/guards' },
            {
              title: 'Preparing Assets',
              href: '/candy-machine-4/preparing-assets',
            },

            {
              title: 'Creating a Candy Machine',
              href: '/candy-machine-4/create',
            },
            {
              title: 'Updating a Candy Machine and Guards',
              href: '/candy-machine-4/update',
            },
            { title: 'Inserting Items', href: '/candy-machine-4/insert-items' },
            {
              title: 'Guard Groups and Phases',
              href: '/candy-machine-4/guard-groups',
            },
            {
              title: 'Fetching a Candy Machine',
              href: '/candy-machine-4/fetching-a-candy-machine',
            },
            {
              title: 'Minting from a Candy Machine',
              href: '/candy-machine-4/mint',
            },
            {
              title: 'Withdrawing a Candy Machine',
              href: '/candy-machine-4/withdrawing-a-candy-machine',
            },

            // {
            //   title: '----old----',
            //   href: '/candy-machine-4/settings',
            // },
            // {
            //   title: 'Candy Machine Settings',
            //   href: '/candy-machine-4/settings',
            // },
            // { title: 'Managing Candy Machines', href: '/candy-machine-4/manage' },
            // { title: 'Inserting Items', href: '/candy-machine-4/insert-items' },
            // { title: 'Candy Guards', href: '/candy-machine-4/guards' },
            // { title: 'Guard Groups', href: '/candy-machine-4/guard-groups' },
            // {
            //   title: 'Special Guard Instructions',
            //   href: '/candy-machine-4/guard-route',
            // },
            // { title: 'Minting', href: '/candy-machine-4/mint' },
            // { title: 'Programmable NFTs', href: '/candy-machine-4/pnfts' },
          ],
        },
        {
          title: 'Available Guards',
          links: [
            {
              title: 'Address Gate',
              href: '/candy-machine-4/guards/address-gate',
            },
            { title: 'Allocation', href: '/candy-machine-4/guards/allocation' },
            { title: 'Allow List', href: '/candy-machine-4/guards/allow-list' },
            { title: 'Bot Tax', href: '/candy-machine-4/guards/bot-tax' },
            { title: 'End Date', href: '/candy-machine-4/guards/end-date' },
            {
              title: 'Freeze Sol Payment',
              href: '/candy-machine-4/guards/freeze-sol-payment',
            },
            {
              title: 'Freeze Token Payment',
              href: '/candy-machine-4/guards/freeze-token-payment',
            },
            { title: 'Gatekeeper', href: '/candy-machine-4/guards/gatekeeper' },
            { title: 'Mint Limit', href: '/candy-machine-4/guards/mint-limit' },
            { title: 'NFT Burn', href: '/candy-machine-4/guards/nft-burn' },
            { title: 'NFT Gate', href: '/candy-machine-4/guards/nft-gate' },
            {
              title: 'NFT Payment',
              href: '/candy-machine-4/guards/nft-payment',
            },
            {
              title: 'Program Gate',
              href: '/candy-machine-4/guards/program-gate',
            },
            {
              title: 'Redeemed Amount',
              href: '/candy-machine-4/guards/redeemed-amount',
            },
            {
              title: 'Sol Payment',
              href: '/candy-machine-4/guards/sol-payment',
            },
            { title: 'Start Date', href: '/candy-machine-4/guards/start-date' },
            {
              title: 'Third Party Signer',
              href: '/candy-machine-4/guards/third-party-signer',
            },
            { title: 'Token Burn', href: '/candy-machine-4/guards/token-burn' },
            { title: 'Token Gate', href: '/candy-machine-4/guards/token-gate' },
            {
              title: 'Token Payment',
              href: '/candy-machine-4/guards/token-payment',
            },
            {
              title: 'Token2022 Payment',
              href: '/candy-machine-4/guards/token2022-payment',
            },
          ],
        },
        {
          title: 'Custom Guards',
          links: [
            {
              title: 'Writing a Custom Guard',
              href: '/candy-machine-4/custom-guards/writing-custom-guards',
            },
            {
              title: 'Generating Client',
              href: '/candy-machine-4/custom-guards/generating-client',
            },
          ],
        },
      ],
    },
/*     {
      id: 'sugar',
      title: 'Sugar',
      icon: 'SolidCake',
      href: `/candy-machine-4/sugar`,
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/candy-machine-4/sugar' },
            {
              title: 'Installation',
              href: '/candy-machine-4/sugar/installation',
            },
            {
              title: 'Getting Started',
              href: '/candy-machine-4/sugar/getting-started',
            },
          ],
        },
        {
          title: 'Working with Sugar',
          links: [
            {
              title: 'Configuration File',
              href: '/candy-machine-4/sugar/configuration',
            },
            {
              title: 'Cache file',
              href: '/candy-machine-4/sugar/cache',
            },
          ],
        },
        {
          title: 'Commands',
          links: [
            {
              title: 'airdrop',
              href: '/candy-machine-4/sugar/commands/airdrop',
            },
            { title: 'bundlr', href: '/candy-machine-4/sugar/commands/bundlr' },
            {
              title: 'collection',
              href: '/candy-machine-4/sugar/commands/collection',
            },
            { title: 'config', href: '/candy-machine-4/sugar/commands/config' },
            { title: 'deploy', href: '/candy-machine-4/sugar/commands/deploy' },
            { title: 'freeze', href: '/candy-machine-4/sugar/commands/freeze' },
            { title: 'guard', href: '/candy-machine-4/sugar/commands/guard' },
            { title: 'hash', href: '/candy-machine-4/sugar/commands/hash' },
            { title: 'launch', href: '/candy-machine-4/sugar/commands/launch' },
            { title: 'mint', href: '/candy-machine-4/sugar/commands/mint' },
            { title: 'reveal', href: '/candy-machine-4/sugar/commands/reveal' },
            { title: 'show', href: '/candy-machine-4/sugar/commands/show' },
            { title: 'sign', href: '/candy-machine-4/sugar/commands/sign' },
            { title: 'update', href: '/candy-machine-4/sugar/commands/update' },
            { title: 'upload', href: '/candy-machine-4/sugar/commands/upload' },
            {
              title: 'validate',
              href: '/candy-machine-4/sugar/commands/validate',
            },
            { title: 'verify', href: '/candy-machine-4/sugar/commands/verify' },
            {
              title: 'withdraw',
              href: '/candy-machine-4/sugar/commands/withdraw',
            },
          ],
        },
        {
          title: 'References',
          links: [
            {
              title: 'Bring Your Own Uploader',
              href: '/candy-machine-4/sugar/bring-your-own-uploader',
            },
          ],
        },
      ],
    }, */
    
    {
      ...referencesSection('candy-machine-4'),
      href: `https://mpl-core-candy-machine-js-docs.vercel.app/`,
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
