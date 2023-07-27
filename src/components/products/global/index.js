import { documentationSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const global = {
  name: 'Metaplex',
  headline: 'Developer Hub',
  description: 'One place for all Metaplex developer resources.',
  path: '',
  isFallbackProduct: true,
  logo: Logo,
  github: 'https://github.com/metaplex-foundation',
  className: 'accent-sky',
  heroes: [{ path: '/', component: Hero }],
  sections: [
    {
      ...documentationSection(''),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/' },
            { title: 'Our products', href: '/products' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { title: 'Understanding Programs', href: '/todo' },
            { title: 'RPC Providers', href: '/todo' },
            { title: 'Storage Providers', href: '/todo' },
            { title: 'Stability Index', href: '/todo' },
            { title: 'Protocol Fees', href: '/todo' },
          ],
        },
        {
          title: 'Community',
          links: [
            { title: 'Community Guides', href: '/todo' },
            { title: 'Security', href: '/todo' },
            { title: 'Contact Us', href: '/todo' },
          ],
        },
      ],
    },
  ],
}
