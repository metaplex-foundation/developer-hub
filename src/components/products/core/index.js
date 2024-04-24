import {
  changelogSection,
  documentationSection,
  recipesSection,
  guidesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const core = {
  name: 'Core',
  headline: 'Next gen NFT standard',
  description: 'Next generation Solana NFT standard.',
  navigationMenuCatergory: 'Create',
  path: 'core',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: [{ path: '/core', component: Hero }],
  sections: [
    {
      ...documentationSection('core'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/core' },
            {
              title: 'Getting Started',
              href: '/core/getting-started',
            },
            { title: 'What is an Asset?', href: '/core/what-is-an-asset' },
            { title: 'Token Metadata Differences', href: '/core/tm-differences' },
            { title: 'FAQ', href: '/core/faq' },

          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Creating Assets', href: '/core/create-asset' },
            { title: 'Fetching Assets', href: '/core/fetch' },
            { title: 'Updating Assets', href: '/core/update' },
            { title: 'Transferring Assets', href: '/core/transfer' },
            { title: 'Burning Assets', href: '/core/burn' },
            {
              title: 'Collection Management',
              href: '/core/collections',
            },
            // { title: 'Compressing Assets', href: '/core/compress' },
          ],
        },
        {
          title: 'Plugins',
          links: [
            { title: 'Overview', href: '/core/plugins' },
            { title: 'Adding Plugins', href: '/core/plugins/adding-plugins' },
            {
              title: 'Removing Plugins',
              href: '/core/plugins/removing-plugins',
            },
            {
              title: 'Delegating and Revoking Plugins',
              href: '/core/plugins/delegating-and-revoking-plugins',
            },
            {
              title: 'Transfer Delegate Plugin',
              href: '/core/plugins/transfer-delegate',
            },
            { title: 'Freeze Delegate Plugin', href: '/core/plugins/freeze-delegate' },
            { title: 'Burn Delegate Plugin', href: '/core/plugins/burn-delegate' },
            { title: 'Royalties Plugin', href: '/core/plugins/royalties' },
            { title: 'Update Delegate Plugin', href: '/core/plugins/update-delegate' },
            { title: 'Attribute Plugin', href: '/core/plugins/attribute' },
            { title: 'Master Edition Plugin', href: '/core/plugins/master-edition' },
            {
              title: 'Permanent Transfer Plugin',
              href: '/core/plugins/permanent-transfer-delegate',
            },
            {
              title: 'Permanent Freeze Delegate Plugin',
              href: '/core/plugins/permanent-freeze-delegate',
            },
            {
              title: 'Permanent Burn Delegate Plugin',
              href: '/core/plugins/permanent-burn-delegate',
            },
          ],
        },
        // {
        //   title: 'Integration Guides',
        //   links: [
        //     { title: 'Wallets', href: '/core/intergrations/wallets' },
        //     {
        //       title: 'Market Places',
        //       href: '/core/intergrations/market-places',
        //     },
        //     {
        //       title: 'Staking',
        //       href: '/core/intergrations/staking',
        //     },
        //   ],
        // },
      ],
    },
    { 
      ...referencesSection('core'),
      href: `https://mpl-core-js-docs.vercel.app/`,
      target: '_blank'
     },
    // { ...guidesSection('core') },
    // { ...recipesSection('core') },
    { ...changelogSection('core') },
  ],
}
