import { documentationSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const global = {
  name: 'Bakstag',
  headline: 'P2P DEX',
  description: 'Omnichain OTC Market.',
  path: '',
  isFallbackProduct: true,
  icon: <Logo />,
  github: 'https://github.com/bakstag-finance',
  className: 'accent-sky',
  heroes: [{ path: '/', component: Hero }],
  sections: [
    {
      ...documentationSection(''),
      navigation: [
        {
          title: 'Overview',
          links: [
            { title: 'Introduction', href: '/' },
            { title: 'Getting started', href: '/getting-started' },
            {
              title: 'Offer',
              href: '/offer',
            },
          ],
        },
        {
          title: 'Settings',
          links: [
            {
              title: 'Token Precision',
              href: '/token-precision',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Create Offer',
              href: '/create-offer',
            },
          ],
        },
        {
          title: 'Community',
          links: [
            { title: 'Contact Us', href: '/contact' },
          ],
        },
      ],
    },
  ],
}