import {
  documentationSection
} from '@/shared/sections'
import { CircleStackIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const fusion = {
  name: 'Fusion',
  headline: 'NFTs inside NFTs',
  description: 'Create composable NFTs.',
  navigationMenuCatergory: 'MPL',
  path: 'fusion',
  icon: <CircleStackIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-trifle',
  className: 'accent-amber',
  heroes: [{ path: '/fusion', component: Hero }],
  sections: [
    {
      ...documentationSection('fusion'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/fusion' },
            { title: 'Getting started', href: '/fusion/getting-started' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Constraint Types', href: '/fusion/constraint-types' },
            { title: 'Transfer Effects', href: '/fusion/transfer-effects' },
          ],
        },
      ],
    },
  ],
}
