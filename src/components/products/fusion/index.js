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
  description: 'TODO',
  path: 'fusion',
  logo: Logo,
  github: 'https://github.com',
  className: 'accent-amber',
  heroes: [
    { path: '/fusion', component: Hero },
  ],
  sections: [
    {
      ...documentationSection('fusion'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/fusion' },
            { title: 'Installation', href: '/fusion/installation' },
          ],
        },
      ],
    },
    {
      ...referencesSection('fusion'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/fusion/references' },
            { title: 'Installation', href: '/fusion/references/installation' },
          ],
        },
      ],
    },
    { ...recipesSection('fusion') },
    { ...changelogSection('fusion') },
  ],
}
