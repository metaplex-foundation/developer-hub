import { documentationSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const global = {
  name: 'Metaplex',
  headline: 'Developer Hub',
  description: 'TODO',
  path: '',
  isFallbackProduct: true,
  logo: Logo,
  github: 'https://github.com',
  className: 'accent-sky',
  heroes: [{ path: '/', component: Hero }],
  sections: [
    {
      ...documentationSection(''),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/' },
            { title: 'Installation', href: '/installation' },
          ],
        },
      ],
    },
  ],
}
