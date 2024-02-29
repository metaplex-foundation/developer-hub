import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const core = {
  name: 'Core',
  headline: 'Clean, simple digital assets',
  description: 'Clean and simple core spec for digital assets.',
  navigationMenuCatergory: 'Create',
  path: 'core',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: [{ path: '/core', component: Hero }],
  sections: [
    {
      ...documentationSection('core'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/core' },
            {
              title: 'Getting Started',
              href: '/core/getting-started',
            },
          ],
        },
        {
          title: 'Features',
          links: [

          ],
        },
      ],
    },
    { ...referencesSection('core') },
    { ...recipesSection('core') },
    { ...changelogSection('core') },
  ],
}
