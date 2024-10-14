import { documentationSection } from '@/shared/sections'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const mplHybrid = {
  name: 'MPL-Hybrid',
  headline: 'Hybrid Assets',
  description: 'Framework and on-chain protocol for hybrid assets.',
  navigationMenuCatergory: 'MPL',
  path: 'mpl-hybrid',
  icon: <ArrowsRightLeftIcon />,
  github: '',
  className: 'accent-amber',
  heroes: [{ path: '/mpl-hybrid', component: Hero }],
  sections: [
    {
      ...documentationSection('mpl-hybrid'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/mpl-hybrid' },
            { title: 'Getting Started', href: '/mpl-hybrid/getting-started' },
            { title: 'Preparation', href: '/mpl-hybrid/preparation' },
            { title: 'FAQ', href: '/mpl-hybrid/faq' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Escrow', href: '/mpl-hybrid/escrow' },
            { title: 'Swapping', href: '/mpl-hybrid/swapping' },
          ],
        },
      ],
    },
  ],
}
