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
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/mpl-404' },
          ],
        },
      ],
    },
  ],
}
