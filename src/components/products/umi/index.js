import {
  changelogSection,
  documentationSection,
  guidesSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { CodeBracketSquareIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const umi = {
  name: 'Umi',
  headline: 'Client wrapper',
  description: 'A collection of core programs for your applications.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'umi',
  icon: <CodeBracketSquareIcon />,
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
            { 
              title: 'Getting started', 
              href: '/umi/getting-started' },
            {
              title: 'Metaplex Umi Plugins',
              href: '/umi/metaplex-umi-plugins',
            },
            { title: 'Web3js Differences and Adapters', 
              href: '/umi/web3js-differences-and-adapters' 
            },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Accounts', href: '/umi/accounts' },
            { title: 'Helpers', href: '/umi/helpers' },
            { title: 'HTTP Requests', href: '/umi/http-requests' },
            { title: 'Interfaces', href: '/umi/interfaces' },
            { title: 'Implementations', href: '/umi/implementations' },
            { title: 'Kinobi', href: '/umi/kinobi' },
            { title: 'Plugins', href: '/umi/plugins' },
            { title: 'Programs', href: '/umi/programs' },
            {
              title: 'PublicKeys and Signers',
              href: '/umi/public-keys-and-signers',
            },
            { title: 'RPC', href: '/umi/rpc' },
            { title: 'Serializers', href: '/umi/serializers' },
            { title: 'Storage', href: '/umi/storage' },
            { title: 'Transactions', href: '/umi/transactions' },
          ],
        },
        {
          title: 'Toolbox',
          links: [
            { 
              title: 'Overview', 
              href: '/umi/toolbox' 
            },
            { 
              title: 'Create Account', 
              href: '/umi/toolbox/create-account' },
            {
              title: 'Transfer Sol',
              href: '/umi/toolbox/transfer-sol',
            },
            {
              title: 'Token Managment',
              href: '/umi/toolbox/token-managment',
            },
            { 
              title: 'Priority Fees and Compute Managment', 
              href: '/umi/toolbox/priority-fees-and-compute-managment' },
            {
              title: 'Address Lookup Table',
              href: '/umi/toolbox/address-lookup-table',
            },
            { 
              title: 'Transaction Memo', 
              href: '/umi/toolbox/transaction-memo' },
          ],
        },
      ],
    },
    {
      ...guidesSection('umi'),
      navigation: [
        {
          title: 'Guides',
          links: [
            {
              title: 'Serializing and Deserializing Transactions',
              href: '/umi/guides/serializing-and-deserializing-transactions',
              created: '2024-08-04',
              updated: null, // null means it's never been updated
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('umi'),
      href: `https://umi.typedoc.metaplex.com/`,
      target: '_blank',
    },

  ],
}
