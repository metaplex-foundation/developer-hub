import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const toolbox = {
  name: 'Toolbox',
  headline: 'Core programs',
  description: 'TODO',
  path: 'toolbox',
  logo: Logo,
  github: 'https://github.com',
  className: 'accent-sky',
  heroes: [
    { path: '/toolbox', component: Hero },
  ],
  sections: [
    {
      ...documentationSection('toolbox'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/toolbox' },
            { title: 'Installation', href: '/toolbox/installation' },
          ],
        },
      ],
    },
    {
      ...referencesSection('toolbox'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/toolbox/references' },
            { title: 'Installation', href: '/toolbox/references/installation' },
          ],
        },
      ],
    },
    { ...recipesSection('toolbox') },
    { ...changelogSection('toolbox') },
  ],
}
