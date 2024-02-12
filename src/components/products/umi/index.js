import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const umi = {
  name: 'Umi',
  headline: 'Client wrapper',
  description: 'A collection of core programs for your applications.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'umi',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/umi',
  className: 'accent-pink',
  heroes: [{ path: '/umi', component: Hero }],
  sections: [
    {
      ...documentationSection('umi'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/umi' },
            { title: 'Getting started', href: '/umi/getting-started' },
            { title: 'Connecting to Umi', href: '/umi/connecting-to-umi' },
            { title: 'Web3js Differences', href: '/umi/web3js-differences' },
            
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Accounts', href: '/umi/accounts' },
            { title: 'Helpers', href: '/umi/helpers' },
            { title: 'HTTP Requests', href: '/umi/http-requests' },
            { title: 'Implentations', href: '/umi/implementations' },
            { title: 'Kinobi', href: '/umi/kinobi' },
            { title: 'Plugins', href: '/umi/plugins' },
            { title: 'Programs', href: '/umi/programs' },
            {
              title: 'PubicKeys and Signers',
              href: '/umi/public-keys-and-signers',
            },
            { title: 'RPC', href: '/umi/rpc' },
            { title: 'Serializers', href: '/umi/serializers' },
            { title: 'Storage', href: '/umi/storage' },
            { title: 'Transactions', href: '/umi/transactions' },
            { title: 'Web3Js Adapters', href: '/umi/web3js-adapters' },
          ],
        },
      ],
    },
    { ...referencesSection('umi') },
    { ...recipesSection('umi') },
    { ...changelogSection('umi') },
  ],
}
