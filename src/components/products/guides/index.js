import {
  documentationSection
} from '@/shared/sections'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import { Hero } from './Hero'

export const guides = {
  name: 'Guides',
  headline: 'Guides for the Solana Blockchain',
  description: 'Guides for the Solana Blockchain.',
  path: 'guides',
  navigationMenuCatergory: 'Guides',
  icon: <BookOpenIcon className='text-green-500' />,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: [{ path: '/guides', component: Hero }],
  sections: [
    {
      ...documentationSection('guides'),
      navigation: [
        {
          title: 'Assets/Nfts',
          links: [
            {
              title: 'Creating an Nft',
              href: '/guides/how-to-create-an-nft-on-solana',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            }
          ],
        },
        {
          title: 'Spl Token',
          links: [
            {
              title: 'Creating an SPL Token',
              href: '/guides/how-to-create-an-spl-token-on-solana',
              created: '2024-06-16',
              updated: null, // null means it's never been updated
            },
          ],
        },
        {
          title: 'React/Nextjs',
          links: [
            {
              title: 'Connecting to a Wallet',
              href: '/guides/react-nextjs/plugins',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
          ],
        },
      ],
    },
    // {
    //   ...referencesSection('core'),
    //   href: `https://mpl-core-js-docs.vercel.app/`,
    //   target: '_blank',
    // },
    // {
    //   ...guidesSection('core'),
    //   navigation: [
    //     {
    //       title: 'Guides',
    //       links: [
    //         { title: 'Overview', href: '/core/guides' },
    //         { title: 'Immutability', href: '/core/guides/immutability' },
    //         { title: 'Print Editions', href: '/core/guides/print-editions' },
    //         { title: 'Oracle Plugin Example', href: '/core/guides/oracle-plugin-example' },
    //       ],
    //     },
    //   ],
    // },
    // { ...recipesSection('core') },
    // { ...changelogSection('core') },
  ],
}
