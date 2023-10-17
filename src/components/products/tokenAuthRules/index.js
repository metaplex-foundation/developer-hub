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
          title: 'Composite Rules',
          links: [
            {
              title: 'All',
              href: '/token-auth-rules/composite-rules/all',
            },
            {
              title: 'Any',
              href: '/token-auth-rules/composite-rules/any',
            },
            {
              title: 'Not',
              href: '/token-auth-rules/composite-rules/not',
            },
          ],
        },
        {
          title: 'Primitive Rules',
          links: [
            {
              title: 'Additional Signer',
              href: '/token-auth-rules/primitive-rules/additional-signer',
            },
            {
              title: 'Amount',
              href: '/token-auth-rules/primitive-rules/amount',
            },
            {
              title: 'Namespace',
              href: '/token-auth-rules/primitive-rules/namespace',
            },
            {
              title: 'Pass',
              href: '/token-auth-rules/primitive-rules/pass',
            },
            {
              title: 'PDA Match',
              href: '/token-auth-rules/primitive-rules/pda-match',
            },
            {
              title: 'Program Owned',
              href: '/token-auth-rules/primitive-rules/program-owned',
            },
            {
              title: 'Public Key Match',
              href: '/token-auth-rules/primitive-rules/pubkey-match',
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
  ],
}
