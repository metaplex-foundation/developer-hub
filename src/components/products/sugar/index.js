import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const sugar = {
  name: 'Sugar',
  headline: 'Create Candy Machines easily',
  description: 'Create Candy Machines easily',
  navigationMenuCatergory: 'Dev Tools',
  path: '/candy-machine/sugar',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/sugar',
  className: 'accent-sky',
  heroes: [{ path: '/candy-machine/sugar', component: Hero }],
  sections: [
  ],
}
