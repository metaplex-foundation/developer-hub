import {
  documentationSection
} from '@/shared/sections'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const mpl404 = {
  name: 'MPL-404',
  headline: 'Hybrid Assets',
  description: 'Framework and on-chain protocol for hybrid assets.',
  navigationMenuCatergory: 'Utility',
  path: 'mpl-404',
  icon: <ArrowsRightLeftIcon />,
  github: '',
  className: 'accent-amber',
  heroes: [{ path: '/mpl-404', component: Hero }],
  sections: [
    {
      ...documentationSection('mpl-404'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/mpl-404' },
            { title: 'Getting Started', href: '/mpl-404/getting-started' },
            { title: 'Preperation', href: '/mpl-404/preperation' },
            { title: 'Philosophy', href: '/mpl-404/philosophy' },
            // { title: 'Advanced Topics', href: '/mpl-404/advancedTopics' },
            { title: 'FAQ', href: '/mpl-404/faq' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Escrow', href: '/mpl-404/escrow' },
            // { title: 'Initialize NFT Data', href: '/mpl-404/initializeNFTData' },
            { title: 'Swapping', href: '/mpl-404/swapping' },
          ],
        },
        {
          title: 'Guides',
          links: [
            { title: '', href: '/mpl-404/' },
          ],
        },
      ],
    },
  ],
}
