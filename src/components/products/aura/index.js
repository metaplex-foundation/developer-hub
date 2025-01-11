import { documentationSection } from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { Hero } from './Hero'

export const aura = {
  name: 'Aura',
  headline: 'Indexing and Data Availability Network',
  description:
    'A decentralized indexing and data availability network that extends Solana and the Solana Virtual Machine (SVM)',
  navigationMenuCatergory: 'Aura',
  path: 'aura',
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation/aura/',
  className: 'accent-pink',
  primaryCta: {
    disabled: true,
  },
  heroes: [{ path: '/aura', component: Hero }],
  sections: [
    {
      ...documentationSection('aura'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/aura',
            },
            {
              title: 'FAQ',
              href: '/aura/faq',
            },
            {
              title: 'Access and Pricing',
              href: '/aura/pricing',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Reading Solana and SVM Data',
              href: '/aura/reading-solana-and-svm-data',
            },
            {
              title: 'Managing Compressed State',
              href: '/aura/managing-compressed-state',
            },
            {
              title: 'Batch Minting',
              href: '/aura/batch-minting',
            },
          ],
        },
        {
          title: 'DAS Methods',
          collapsed: true,
          links: [
            {
              title: 'Get Asset',
              href: '/aura/api/v1/das/get-asset',
            },
            {
              title: 'Get Asset Proof',
              href: '/aura/api/v1/das/get-asset-proof',
            },
            {
              title: 'Get Asset Batch',
              href: '/aura/api/v1/das/get-asset-batch',
            },
            {
              title: 'Get Asset Proof Batch',
              href: '/aura/api/v1/das/get-asset-proof-batch',
            },
            {
              title: 'Get Assets by Owner',
              href: '/aura/api/v1/das/get-assets-by-owner',
            },
            {
              title: 'Get Assets by Authority',
              href: '/aura/api/v1/das/get-assets-by-authority',
            },
            {
              title: 'Get Assets By Creator',
              href: '/aura/api/v1/das/get-assets-by-creator',
            },
            {
              title: 'Get Assets By Group',
              href: '/aura/api/v1/das/get-assets-by-group',
            },
            {
              title: 'Get Signatures For Asset',
              href: '/aura/api/v1/das/get-signatures-for-asset',
            },
            {
              title: 'Get Token Accounts',
              href: '/aura/api/v1/das/get-token-accounts',
            },
            {
              title: 'Search Assets',
              href: '/aura/api/v1/das/search-assets',
            },
          ],
        },
        {
          title: 'Guides',
          links: [
            {
              title: 'Using Aura Endpoints',
              href: '/aura/using-aura-endpoints',
            },
          ],
        },
      ],
    },
  ],
}
