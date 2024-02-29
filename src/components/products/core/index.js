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
            { title: 'Compressing Assets', href: '/core/compress' },
          ],
        },
        {
          title: 'Plugins',
          links: [
            { title: 'Burn Delegate', href: '/core/plugins/burn-delegate' },
            { title: 'Freeze Delegate', href: '/core/plugins/freeze-delegate' },
            { title: 'Transfer Delegate', href: '/core/plugins/transfer-delegate' },
            { title: 'Update Delegate', href: '/core/plugins/update-delegate' },
            { title: 'Royalties Delegate', href: '/core/plugins/royalties' },
          ],
        },
      ],
    },
    { ...referencesSection('core') },
    { ...recipesSection('core') },
    { ...changelogSection('core') },
  ],
}
