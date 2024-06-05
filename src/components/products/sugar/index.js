import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { CommandLineIcon } from '@heroicons/react/24/solid'

export const sugar = {
  name: 'Sugar',
  headline: 'Create Candy Machines easily',
  description: 'Create Candy Machines easily',
  navigationMenuCatergory: 'Dev Tools',
  path: '/candy-machine/sugar',
  icon: <CommandLineIcon />,
  github: 'https://github.com/metaplex-foundation/sugar',
  className: 'accent-sky',
  heroes: [{ path: '/candy-machine/sugar', component: Hero }],
  sections: [
  ],
}
