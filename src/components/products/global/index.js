import { documentationSection } from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const global = {
  name: 'Metaplex',
  headline: 'Developer Hub',
  description: 'One place for all Metaplex developer resources.',
  path: '',
  isFallbackProduct: true,
  icon: <Logo />,
  github: 'https://github.com/metaplex-foundation',
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
            { title: 'Programs and Tools', href: '/programs-and-tools' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { title: 'Official Links', href: '/official-links' },
            { title: 'Developer Tools', href: '/developer-tools' },
            {
              title: 'Understanding Programs',
              href: '/understanding-programs',
            },
            {title: "Metaplex Rust SDKs", href: '/guides/rust/metaplex-rust-sdks'},
            { title: 'RPC Providers', href: '/rpc-providers' },
            { title: 'Storage Providers', href: '/storage-providers' },
            { title: 'Stability Index', href: '/stability-index' },
            { title: 'Protocol Fees', href: '/protocol-fees' },
          ],
        },
        {
          title: 'Community',
          links: [
            { title: 'Community Guides', href: '/community-guides' },
            { title: 'Security', href: '/security' },
            { title: 'Contact Us', href: '/contact' },
          ],
        },
      ],
    },
  ],
}