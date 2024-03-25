import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const candyMachine = {
  name: 'Candy Machine',
  headline: 'NFT launchpad',
  description: 'Launch your next NFT collection on Solana.',
  navigationMenuCatergory: 'Commerce',
  path: 'candy-machine',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-candy-machine',
  className: 'accent-pink',
  heroes: [{ path: '/candy-machine', component: Hero }],
  sections: [
    {
      ...documentationSection('candy-machine'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/candy-machine' },
            {
              title: 'Getting Started',
              href: '/candy-machine/getting-started',
              // Subpages: /js /rust, etc.
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Candy Machine Settings',
              href: '/candy-machine/settings',
            },
            { title: 'Managing Candy Machines', href: '/candy-machine/manage' },
            { title: 'Inserting Items', href: '/candy-machine/insert-items' },
            { title: 'Candy Guards', href: '/candy-machine/guards' },
            { title: 'Guard Groups', href: '/candy-machine/guard-groups' },
            {
              title: 'Special Guard Instructions',
              href: '/candy-machine/guard-route',
            },
            { title: 'Minting', href: '/candy-machine/mint' },
            { title: 'Programmable NFTs', href: '/candy-machine/pnfts' },
          ],
        },
        {
          title: 'Available Guards',
          links: [
            {
              title: 'Address Gate',
              href: '/candy-machine/guards/address-gate',
            },
            { title: 'Allocation', href: '/candy-machine/guards/allocation' },
            { title: 'Allow List', href: '/candy-machine/guards/allow-list' },
            { title: 'Bot Tax', href: '/candy-machine/guards/bot-tax' },
            { title: 'End Date', href: '/candy-machine/guards/end-date' },
            {
              title: 'Freeze Sol Payment',
              href: '/candy-machine/guards/freeze-sol-payment',
            },
            {
              title: 'Freeze Token Payment',
              href: '/candy-machine/guards/freeze-token-payment',
            },
            { title: 'Gatekeeper', href: '/candy-machine/guards/gatekeeper' },
            { title: 'Mint Limit', href: '/candy-machine/guards/mint-limit' },
            { title: 'NFT Burn', href: '/candy-machine/guards/nft-burn' },
            { title: 'NFT Gate', href: '/candy-machine/guards/nft-gate' },
            { title: 'NFT Payment', href: '/candy-machine/guards/nft-payment' },
            {
              title: 'Program Gate',
              href: '/candy-machine/guards/program-gate',
            },
            {
              title: 'Redeemed Amount',
              href: '/candy-machine/guards/redeemed-amount',
            },
            { title: 'Sol Payment', href: '/candy-machine/guards/sol-payment' },
            { title: 'Start Date', href: '/candy-machine/guards/start-date' },
            {
              title: 'Third Party Signer',
              href: '/candy-machine/guards/third-party-signer',
            },
            { title: 'Token Burn', href: '/candy-machine/guards/token-burn' },
            { title: 'Token Gate', href: '/candy-machine/guards/token-gate' },
            {
              title: 'Token Payment',
              href: '/candy-machine/guards/token-payment',
            },
            {
              title: 'Token2022 Payment',
              href: '/candy-machine/guards/token2022-payment',
            },
          ],
        },
        {
          title: 'Custom Guards',
          links: [
            {
              title: 'Writing a Custom Guard',
              href: '/candy-machine/custom-guards/writing-custom-guards',
            },
            {
              title: 'Generating Client',
              href: '/candy-machine/custom-guards/generating-client',
            },
          ],
        },
      ],
    },
    {
      id: 'sugar',
      title: 'Sugar',
      icon: 'SolidCake',
      href: `/candy-machine/sugar`,
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/candy-machine/sugar' },
            {
              title: 'Installation',
              href: '/candy-machine/sugar/installation',
            },
            {
              title: 'Getting Started',
              href: '/candy-machine/sugar/getting-started',
            },
          ],
        },
        {
          title: 'Working with Sugar',
          links: [
            {
              title: 'Configuration File',
              href: '/candy-machine/sugar/configuration',
            },
            {
              title: 'Cache file',
              href: '/candy-machine/sugar/cache',
            },
          ],
        },
        {
          title: 'Commands',
          links: [
            { title: 'airdrop', href: '/candy-machine/sugar/commands/airdrop' },
            { title: 'bundlr', href: '/candy-machine/sugar/commands/bundlr' },
            {
              title: 'collection',
              href: '/candy-machine/sugar/commands/collection',
            },
            { title: 'config', href: '/candy-machine/sugar/commands/config' },
            { title: 'deploy', href: '/candy-machine/sugar/commands/deploy' },
            { title: 'freeze', href: '/candy-machine/sugar/commands/freeze' },
            { title: 'guard', href: '/candy-machine/sugar/commands/guard' },
            { title: 'hash', href: '/candy-machine/sugar/commands/hash' },
            { title: 'launch', href: '/candy-machine/sugar/commands/launch' },
            { title: 'mint', href: '/candy-machine/sugar/commands/mint' },
            { title: 'reveal', href: '/candy-machine/sugar/commands/reveal' },
            { title: 'show', href: '/candy-machine/sugar/commands/show' },
            { title: 'sign', href: '/candy-machine/sugar/commands/sign' },
            { title: 'update', href: '/candy-machine/sugar/commands/update' },
            { title: 'upload', href: '/candy-machine/sugar/commands/upload' },
            {
              title: 'validate',
              href: '/candy-machine/sugar/commands/validate',
            },
            { title: 'verify', href: '/candy-machine/sugar/commands/verify' },
            {
              title: 'withdraw',
              href: '/candy-machine/sugar/commands/withdraw',
            },
          ],
        },
        {
          title: 'References',
          links: [
            {
              title: 'Bring Your Own Uploader',
              href: '/candy-machine/sugar/bring-your-own-uploader',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('candy-machine'),
      href: `https://mpl-candy-machine-js-docs.vercel.app/`,
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
