import {
  documentationSection,
  guidesSection,
  referencesSection,
} from '@/shared/sections'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const mplHybrid = {
  name: 'MPL-Hybrid',
  headline: 'Hybrid Assets',
  description: 'Framework and on-chain protocol for hybrid assets.',
  navigationMenuCatergory: 'MPL',
  path: 'mpl-hybrid',
  icon: <ArrowsRightLeftIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-hybrid',
  className: 'accent-green',
  heroes: [{ path: '/mpl-hybrid', component: Hero }],
  sections: [
    {
      ...documentationSection('mpl-hybrid'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/mpl-hybrid' },
            { title: 'Preparation', href: '/mpl-hybrid/preparation' },
            { title: 'FAQ', href: '/mpl-hybrid/faq' },
          ],
        },
        {
          title: 'SDK',
          links: [
            { title: 'Javascript SDK', href: '/mpl-hybrid/sdk/javascript' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Create Escrow Configuration',
              href: '/mpl-hybrid/create-escrow',
            },
            {
              title: 'Fetch Escrow Configuration',
              href: '/mpl-hybrid/fetch-escrow',
            },
            { title: 'Funding Escrow', href: '/mpl-hybrid/funding-escrow' },
            {
              title: 'Updating Escrow Configuration',
              href: '/mpl-hybrid/update-escrow',
            },
            {
              title: 'Swapping NFTs to Tokens',
              href: '/mpl-hybrid/swapping-nfts-to-tokens',
            },
            {
              title: 'Swapping Tokens to NFTs',
              href: '/mpl-hybrid/swapping-tokens-to-nfts',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('mpl-hybrid'),
      href: 'https://mpl-hybrid.typedoc.metaplex.com/',
      target: '_blank',
    },
    {
      ...guidesSection('mpl-hybrid'),
      navigation: [
        {
          title: 'General',
          links: [
            {
              title: 'Overview',
              href: '/mpl-hybrid/guides',
            },
            {
              title: 'Create your first Hybrid Collection',
              href: '/mpl-hybrid/guides/create-your-first-hybrid-collection',
            },
          ],
        },
      ],
    },
  ],
}
