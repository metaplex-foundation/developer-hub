import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const bubblegum = {
  name: 'Bubblegum',
  headline: 'Compressed NFTs',
  description: 'NFTs that scale to new orders of magnitude.',
  path: 'bubblegum',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-bubblegum',
  className: 'accent-green',
  heroes: [{ path: '/bubblegum', component: Hero }],
  sections: [
    {
      ...documentationSection('bubblegum'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/bubblegum' },
            { title: 'Getting started', href: '/bubblegum/getting-started' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Creating Bubblegum Trees', href: '/bubblegum/todo' },
            {
              title: 'Minting compressed NFTs (cNFTs)',
              href: '/bubblegum/todo',
            },
            { title: 'Updating cNFTs', href: '/bubblegum/todo' },
            { title: 'Transferring cNFTs', href: '/bubblegum/todo' },
            { title: 'Burning cNFTs', href: '/bubblegum/todo' },
            { title: 'Decompressing cNFTs', href: '/bubblegum/todo' },
            { title: 'Delegating cNFTs', href: '/bubblegum/todo' },
            { title: 'Delegating Trees', href: '/bubblegum/todo' },
            { title: 'Verifying Collections', href: '/bubblegum/todo' },
            { title: 'Verifying Creators', href: '/bubblegum/todo' },
          ],
        },
        {
          title: 'Advanced',
          links: [
            { title: 'What are Merkle Trees?', href: '/bubblegum/todo' },
            { title: 'Where is the Data Stored?', href: '/bubblegum/todo' },
            { title: 'How is the Data Hashed?', href: '/bubblegum/todo' },
            { title: 'How to Use Canopies?', href: '/bubblegum/todo' },
          ],
        },
      ],
    },
    { ...referencesSection('bubblegum') },
    { ...recipesSection('bubblegum') },
    { ...changelogSection('bubblegum') },
  ],
}
