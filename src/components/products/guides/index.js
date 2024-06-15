import {
  changelogSection,
  documentationSection,
  recipesSection,
  guidesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { StopCircleIcon } from '@heroicons/react/24/solid'

export const guides = {
  name: 'Guides',
  headline: 'Guides for the Solana Blockchain',
  description: 'Guides for the Solana Blockchain.',
  path: 'guides',
  navigationMenuCatergory: 'Guides',
  icon: <StopCircleIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: [{ path: '/guides', component: Hero }],
  sections: [
    {
      ...documentationSection('core'),
      navigation: [
        {
          title: 'New!',
          links: [{ title: 'JS SDK V1.0', href: '/core/core-js-sdk-v1-0' }],
        },
        {
          title: 'Assets/Nfts',
          links: [
            { title: 'Creating an Asset Using Core', href: '/guides/assets-and-nfts/create-asset-with-core' },
            { title: 'Creating an Nft Using Token Metadata', href: '/guides/assets-and-nfts/create-nft-with-token-metadata' },
          ],
        },
        {
          title: 'Spl Token',
          links: [
            { title: 'Creating an SPL Token', href: '/guides/spl-token/create-spl-token' },
            
          ],
        },
        {
          title: 'React/Nextjs',
          links: [
            { title: 'Connecting to a Wallet', href: '/guides/react-nextjs/plugins' },
          ],
        },
      ],
    },
    {
      ...referencesSection('core'),
      href: `https://mpl-core-js-docs.vercel.app/`,
      target: '_blank',
    },
    {
      ...guidesSection('core'),
      navigation: [
        {
          title: 'Guides',
          links: [
            { title: 'Overview', href: '/core/guides' },
            { title: 'Immutability', href: '/core/guides/immutability' },
            { title: 'Print Editions', href: '/core/guides/print-editions' },
            { title: 'Oracle Plugin Example', href: '/core/guides/oracle-plugin-example' },
          ],
        },
      ],
    },
    // { ...recipesSection('core') },
    { ...changelogSection('core') },
  ],
}
