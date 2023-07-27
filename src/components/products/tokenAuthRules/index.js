import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const tokenAuthRules = {
  name: 'Token Auth Rules',
  headline: 'NFT permissions',
  description: 'Design custom authorization rules for your NFTs.',
  path: 'token-auth-rules',
  logo: Logo,
  github: 'https://github.com/metaplex-foundation/mpl-token-auth-rules',
  className: 'accent-green',
  heroes: [{ path: '/token-auth-rules', component: Hero }],
  sections: [
    {
      ...documentationSection('token-auth-rules'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/token-auth-rules' },
            {
              title: 'Getting started',
              href: '/token-auth-rules/getting-started',
            },
          ],
        },
      ],
    },
    { ...referencesSection('token-auth-rules') },
    { ...recipesSection('token-auth-rules') },
    { ...changelogSection('token-auth-rules') },
  ],
}
