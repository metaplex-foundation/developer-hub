import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const das = {
  name: 'DAS API',
  headline: 'DAS API',
  description:
    'A DAS API Client for access the Digital Asset Standard',
  path: 'das-api',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/digital-asset-standard-api',
  navigationMenuCatergory: 'Dev Tools',
  className: 'accent-sky',
  heroes: [{ path: '/das-api', component: Hero }],
  sections: [
    {
      ...documentationSection('das-api'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/das-api' },
            { title: 'Getting started', href: '/das-api/getting-started' },
           
            { title: 'Methods', href: '/das-api/methods' },

          ],
        },
      ],
    },
    { ...changelogSection('das-api') },
  ],
}
