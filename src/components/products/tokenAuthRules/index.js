import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Logo } from './Logo'

export const tokenAuthRules = {
  name: 'Token Auth Rules',
  headline: 'NFT permissions',
  description: 'TODO',
  path: 'token-auth-rules',
  logo: Logo,
  github: 'https://github.com',
  className: 'accent-green',
  sections: [
    {
      ...documentationSection('token-auth-rules'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/token-auth-rules' },
            { title: 'Installation', href: '/token-auth-rules/installation' },
          ],
        },
      ],
    },
    {
      ...referencesSection('token-auth-rules'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/token-auth-rules/references' },
            {
              title: 'Installation',
              href: '/token-auth-rules/references/installation',
            },
          ],
        },
      ],
    },
    { ...recipesSection('token-auth-rules') },
    { ...changelogSection('token-auth-rules') },
  ],
}
