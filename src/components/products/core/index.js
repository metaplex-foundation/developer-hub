import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const core = {
  name: 'Core',
  headline: 'Clean, simple digital assets',
  description: 'Clean and simple core spec for digital assets.',
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
            { title: 'FAQ', href: '/core/faq' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Minting Assets', href: '/core/mint' },
            { title: 'Fetching Assets', href: '/core/fetch' },
            { title: 'Updating Assets', href: '/core/update' },
            { title: 'Transferring Assets', href: '/core/transfer' },
            { title: 'Burning Assets', href: '/core/burn' },
            {
              title: 'Collection Management',
              href: '/core/collections',
            },
          ],
        },
        {
          title: 'Plugins',
          links: [
            { title: 'Overview', href: '/core/plugins/overview' },
            { title: 'Adding Plugins', href: '/core/plugins/adding-plugins' },
            {
              title: 'Removing Plugins',
              href: '/core/plugins/removing-plugins',
            },
            {
              title: 'Delegating Plugins',
              href: '/core/plugins/delegating-plugins',
            },
            {
              title: 'Transfer Plugin',
              href: '/core/plugins/transfer',
            },
            { title: 'Freeze Plugin', href: '/core/plugins/freeze' },
            { title: 'Burn Plugin', href: '/core/plugins/burn' },
            { title: 'Royalties Plugin', href: '/core/plugins/royalties' },
            { title: 'Update Plugin', href: '/core/plugins/update' },
            { title: 'Attribute Plugin', href: '/core/plugins/attribute' },
            {
              title: 'Permanent Transfer Plugin',
              href: '/core/plugins/permanent-transfer',
            },
            {
              title: 'Permanent Freeze Plugin',
              href: '/core/plugins/permanent-freeze',
            },
            {
              title: 'Permanent Burn Plugin',
              href: '/core/plugins/permanent-burn',
            },
          ],
        },
        {
          title: 'Intergration Guides',
          links: [
            { title: 'Wallets', href: '/core/intergrations/wallets' },
            {
              title: 'Market Places',
              href: '/core/intergrations/market-places',
            },
            {
              title: 'Staking',
              href: '/core/intergrations/staking',
            },
          ],
        },
      ],
    },
    { ...referencesSection('core') },
    { ...recipesSection('core') },
    { ...changelogSection('core') },
  ],
}
