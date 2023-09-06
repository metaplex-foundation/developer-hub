import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const fusion = {
  name: 'Fusion',
  headline: 'NFTs inside NFTs',
  description: 'Create composable NFTs.',
  path: 'fusion',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-trifle',
  className: 'accent-amber',
  heroes: [{ path: '/fusion', component: Hero }],
  sections: [
    {
      ...documentationSection('fusion'),
      navigation: [
        {
          title: 'Introduction',
          links: [{ title: 'Overview', href: '/fusion' }],
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
    { ...referencesSection('fusion') },
    { ...recipesSection('fusion') },
    { ...changelogSection('fusion') },
  ],
}
