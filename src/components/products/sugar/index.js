import { CommandLineIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const sugar = {
  name: 'Sugar',
  headline: 'Create Candy Machines easily',
  description: 'Create Candy Machines easily',
  navigationMenuCatergory: 'Dev Tools',
  path: 'candy-machine/sugar',
  icon: <CommandLineIcon />,
  github: 'https://github.com/metaplex-foundation/sugar',
  className: 'accent-sky',
  heroes: [{ path: '/candy-machine/sugar', component: Hero }],
  sections: [
  ],
  localizedNavigation: {
    en: {
      headline: 'Create Candy Machines easily',
      description: 'Create Candy Machines easily'
    },
    jp: {
      headline: 'Candy Machineを簡単に作成',
      description: 'Candy Machineを簡単に作成'
    },
    kr: {
      headline: 'Candy Machine 쉽게 만들기',
      description: 'Candy Machine을 쉽게 만들 수 있습니다'
    }
  }
}
