import {
  documentationSection,
  guidesSection,
  referencesSection,
} from '@/shared/sections';
import { Square3Stack3DIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

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
            },
          ],
        },
        {
          title: 'Actions',

          links: [
            {
              title: 'Creating a Candy Machine',
              href: '/core-candy-machine/create',
            },
            {
              title: 'Loading Items in a Candy Machine',
              href: '/core-candy-machine/insert-items',
            },
            {
              title: 'Updating a Candy Machine and Guards',
              href: '/core-candy-machine/update',
            },
            {
              title: 'Minting from a Candy Machine',
              href: '/core-candy-machine/mint',
            },
            {
              title: 'Withdrawing a Candy Machine',
              href: '/core-candy-machine/withdrawing-a-candy-machine',
            },
            {
              title: 'Fetching a Candy Machine',
              href: '/core-candy-machine/fetching-a-candy-machine',
            },
          ],
        },
        {
          title: 'Candy Guards',

          links: [
            {
              title: 'Overview',
              href: '/core-candy-machine/guards',
            },
            {
              title: 'Candy Groups and Phases',
              href: '/core-candy-machine/guard-groups',
            },
            {
              title: 'Custom Guards',
              href: '/core-candy-machine/guard-route',
            },
            {
              title: 'Available Candy Guards',
              href: '/core-candy-machine/guards/overview',
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
      navigation: [
        {
          title: 'General',
          links: [
            { 
              title: 'Overview', 
              href: '/core-candy-machine/guides' 
            },
            {
              title: 'Create a Website for minting Assets from your Core Candy Machine',
              href: '/core-candy-machine/guides/create-a-core-candy-machine-ui',
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
      href: `https://mpl-core-candy-machine.typedoc.metaplex.com/`,
      title: 'Javascript API References',
      icon: 'JavaScript',
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
