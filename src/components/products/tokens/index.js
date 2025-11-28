import { documentationSection } from '@/shared/sections'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const tokens = {
  name: 'Tokens',
  headline: 'Fungible Tokens',
  description: 'Create and manage fungible tokens on Solana.',
  navigationMenuCatergory: undefined,
  path: 'tokens',
  icon: <CurrencyDollarIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-token-metadata',
  className: 'accent-amber',
  heroes: [{ path: '/tokens', component: Hero }],
  sections: [
    {
      ...documentationSection('tokens'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/tokens',
            },
          ],
        },
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Create a Token',
              href: '/tokens/create-a-token',
            },
            {
              title: 'Mint Tokens',
              href: '/tokens/mint-tokens',
            },
            {
              title: 'Transfer Tokens',
              href: '/tokens/transfer-a-token',
            },
            {
              title: 'Update Token Metadata',
              href: '/tokens/update-token',
            },
            {
              title: 'Burn Tokens',
              href: '/tokens/burn-tokens',
            },
          ],
        },
      ],
    },
  ],
}
