import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const das = {
  name: 'DAS API',
  headline: 'Fetch Digital Asset Data',
  description:
    'A DAS API Client to access Digital Asset data on chain',
  path: 'das-api',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/digital-asset-standard-api',
  navigationMenuCatergory: 'Dev Tools',
  className: 'accent-sky',
  heroes: [{ path: '/das-api', component: Hero }],
  sections: [
    {
      ...documentationSection('das-api'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/das-api' },
            { title: 'Getting started', href: '/das-api/getting-started' },
            { title: 'Methods', href: '/das-api/methods' },
            { title: 'DAS API RPC Providers', href: '/rpc-providers' },   
          ],
        },
        {
          title: 'Methods',
          links: [
            { title: 'Method Overview', href: '/das-api/methods' },
            { title: 'Get Asset', href: '/das-api/methods/get-asset' },
            { title: 'Get Asset Proof', href: '/das-api/methods/get-asset-proof' },
            { title: 'Get Asset By Authority', href: '/das-api/methods/get-asset-by-authority' },
            { title: 'Get Asset By Creator', href: '/das-api/methods/get-asset-by-creator' },
            { title: 'Get Asset By Group', href: '/das-api/methods/get-asset-by-group' },
            { title: 'Get Asset By Owner', href: '/das-api/methods/get-asset-by-owner' },
            { title: 'Search Asset', href: '/das-api/methods/search-assets' },
          ],
        },
      ],
    },
    { ...changelogSection('das-api') },
  ],
}
