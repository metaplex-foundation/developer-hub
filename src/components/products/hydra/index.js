import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Logo } from './Logo'

export const hydra = {
  name: 'Hydra',
  headline: 'Fanout wallets',
  description: 'TODO',
  path: 'hydra',
  logo: Logo,
  github: 'https://github.com',
  sections: [
    {
      ...documentationSection('hydra'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/hydra' },
            { title: 'Installation', href: '/hydra/installation' },
          ],
        },
      ],
    },
    {
      ...referencesSection('hydra'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/hydra/references' },
            { title: 'Installation', href: '/hydra/references/installation' },
          ],
        },
      ],
    },
    { ...recipesSection('hydra') },
    { ...changelogSection('hydra') },
  ],
}
