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
  description: 'A collection of core programs for your applications.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'toolbox',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-toolbox',
  className: 'accent-sky',
  heroes: [{ path: '/toolbox', component: Hero }],
  sections: [
    {
      ...documentationSection('toolbox'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/toolbox' },
            { title: 'Getting started', href: '/toolbox/getting-started' },
          ],
        },
      ],
    },
    {
      ...referencesSection('toolbox'),
      href: `https://mpl-toolbox-js-docs.vercel.app/`,
      target: '_blank',
    },
    { ...recipesSection('toolbox') },
    { ...changelogSection('toolbox') },
  ],
}
