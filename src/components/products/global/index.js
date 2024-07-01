import { documentationSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const global = {
  name: 'Metaplex',
  isJsxPage: true,
  headline: 'Developer Hub',
  description: 'One place for all Metaplex developer resources.',
  path: '',
  isFallbackProduct: true,
  icon: <Logo />,
  github: 'https://github.com/metaplex-foundation',
  className: 'accent-sky',
  heroes: [{ path: '/', component: Hero }],
  sections: [
  ],
}
