import {
  documentationSection
} from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { Hero } from './Hero'

export const aura = {
  name: 'Aura',
  headline: 'Indexing and Data Availability Network',
  description:
    'A decentralized indexing and data availability network that extends Solana and the Solana Virtual Machine (SVM)',
  navigationMenuCatergory: 'Utility',
  path: 'aura',
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-aura',
  className: 'accent-pink',
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
          title: 'Blockchains',
          links: [
            {
              title: 'Solana',
              href: '/aura/blockchains/solana',
            },
            {
              title: 'Eclipse',
              href: '/aura/blockchains/eclipse',
            },
          ],
        }
      ],
    },
  ],
}
