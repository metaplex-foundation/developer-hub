import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Logo } from './Logo'

export const toolbox = {
  name: 'Toolbox',
  headline: 'Core programs',
  description: 'TODO',
  path: 'toolbox',
  logo: Logo,
  github: 'https://github.com',
  className: 'accent-sky',
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
