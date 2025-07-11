import {
  documentationSection
} from '@/shared/sections'
import { TableCellsIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const das = {
  name: 'DAS API',
  headline: 'Fetch Digital Asset Data',
  description:
    'A DAS API Client to access Digital Asset data on chain',
  path: 'das-api',
  icon: <TableCellsIcon />,
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
            { title: 'Getting Started', href: '/das-api/getting-started' },
            { title: 'DAS API RPC Providers', href: '/rpc-providers' },
          ],
        },
        {
          title: 'Methods',
          links: [
            { title: 'Method Overview', href: '/das-api/methods' },
            { title: 'Get Asset', href: '/das-api/methods/get-asset' },
            { title: 'Get Assets', href: '/das-api/methods/get-assets' },
            { title: 'Get Asset Proof', href: '/das-api/methods/get-asset-proof' },
            { title: 'Get Asset Proofs', href: '/das-api/methods/get-asset-proofs' },
            { title: 'Get Asset Signatures', href: '/das-api/methods/get-asset-signatures' },
            { title: 'Get Assets By Authority', href: '/das-api/methods/get-assets-by-authority' },
            { title: 'Get Assets By Creator', href: '/das-api/methods/get-assets-by-creator' },
            { title: 'Get Assets By Group', href: '/das-api/methods/get-assets-by-group' },
            { title: 'Get Assets By Owner', href: '/das-api/methods/get-assets-by-owner' },
            { title: 'Search Assets', href: '/das-api/methods/search-assets' },
          ],
        },
        {
          title: 'Core Extension SDK',
          links: [
            { title: 'Extension Overview', href: '/das-api/core-extension' },
            { title: 'Get Core Asset', href: '/das-api/core-extension/methods/get-asset' },
            { title: 'Get Core Collection', href: '/das-api/core-extension/methods/get-collection' },
            { title: 'Get Core Assets By Authority', href: '/das-api/core-extension/methods/get-assets-by-authority' },
            { title: 'Get Core Assets By Collection', href: '/das-api/core-extension/methods/get-assets-by-collection' },
            { title: 'Get Core Assets By Owner', href: '/das-api/core-extension/methods/get-assets-by-owner' },
            { title: 'Search Core Assets', href: '/das-api/core-extension/methods/search-assets' },
            { title: 'Search Core Collections', href: '/das-api/core-extension/methods/search-collections' },
            { title: 'Plugin Derivation', href: '/das-api/core-extension/plugin-derivation' },
            { title: 'Type Conversion', href: '/das-api/core-extension/convert-das-asset-to-core' },
          ],
        },
      ],
    },
  ],
}
