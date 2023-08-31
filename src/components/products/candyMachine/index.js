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
            { title: 'Address Gate', href: '/candy-machine/todo' },
            { title: 'Allow List', href: '/candy-machine/todo' },
            { title: 'Bot Tax', href: '/candy-machine/todo' },
            { title: 'End Date', href: '/candy-machine/todo' },
            { title: 'Freeze Sol Payment', href: '/candy-machine/todo' },
            { title: 'Freeze Token Payment', href: '/candy-machine/todo' },
            { title: 'Gatekeeper', href: '/candy-machine/todo' },
            { title: 'Mint Limit', href: '/candy-machine/todo' },
            { title: 'NFT Burn', href: '/candy-machine/todo' },
            { title: 'NFT Gate', href: '/candy-machine/todo' },
            { title: 'NFT Payment', href: '/candy-machine/todo' },
            { title: 'Redeemed Amount', href: '/candy-machine/todo' },
            { title: 'Sol Payment', href: '/candy-machine/todo' },
            { title: 'Start Date', href: '/candy-machine/todo' },
            { title: 'Third Party Signer', href: '/candy-machine/todo' },
            { title: 'Token Burn', href: '/candy-machine/todo' },
            { title: 'Token Gate', href: '/candy-machine/todo' },
            { title: 'Token Payment', href: '/candy-machine/todo' },
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
            { title: 'Installation', href: '/candy-machine/sugar/todo' },
            { title: 'Quick Start', href: '/candy-machine/sugar/todo' },
            { title: 'Configuration', href: '/candy-machine/sugar/todo' },
            { title: 'Upload Methods', href: '/candy-machine/sugar/todo' },
          ],
        },
        {
          title: 'Commands',
          links: [
            {
              title: 'My First Candy Machine',
              href: '/candy-machine/sugar/todo',
            },
            {
              title: 'Preparing your Assets',
              href: '/candy-machine/sugar/todo',
            },
            { title: 'Working with Sugar', href: '/candy-machine/sugar/todo' },
            { title: 'Configuration', href: '/candy-machine/sugar/todo' },
            {
              title: 'Sugar with Candy Machine v3',
              href: '/candy-machine/sugar/todo',
            },
            {
              title: 'Bring Your Own Uploader',
              href: '/candy-machine/sugar/todo',
            },
          ],
        },
        {
          title: 'References',
          links: [
            { title: 'Commands', href: '/candy-machine/sugar/todo' },
            { title: 'Configuration', href: '/candy-machine/sugar/todo' },
            { title: 'Upload Methods', href: '/candy-machine/sugar/todo' },
          ],
        },
      ],
    },
    { ...referencesSection('candy-machine') },
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
  ],
}
