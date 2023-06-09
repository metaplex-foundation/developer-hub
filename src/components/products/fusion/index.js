import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Logo } from './Logo'

export const fusion = {
  name: 'Fusion',
  headline: 'NFTs inside NFTs',
  description: 'TODO',
  path: 'fusion',
  logo: Logo,
  github: 'https://github.com',
  className: 'accent-amber',
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
