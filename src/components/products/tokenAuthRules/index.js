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
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Create or Update Rule Sets', href: '/token-auth-rules/create-or-update' },
            { title: 'Validating with a Rule Set', href: '/token-auth-rules/validate' },
          ],
        },
        {
          title: 'Available Rules',
          links: [
            {
              title: 'Composite Rules',
              href: '/token-auth-rules/composite-rules',
            },
            {
              title: 'Primitive Rules',
              href: '/token-auth-rules/primitive-rules',
            },
          ],
        },
        {
          title: 'Advanced',
          links: [
            { title: 'Rule Set Buffers', href: '/token-auth-rules/buffers' },
          ],
        }
      ],
    },
    { ...referencesSection('token-auth-rules') },
    { ...recipesSection('token-auth-rules') },
    { ...changelogSection('token-auth-rules') },
  ],
}
