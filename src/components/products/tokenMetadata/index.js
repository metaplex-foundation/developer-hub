import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Logo } from './Logo'

export const tokenMetadata = {
  name: 'Token Metadata',
  headline: 'Digital ownership standard',
  description: 'TODO',
  path: 'token-metadata',
  logo: Logo,
  github: 'https://github.com',
  className: 'accent-green',
  sections: [
    {
      ...documentationSection('token-metadata'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/token-metadata' },
            { title: 'Installation', href: '/token-metadata/installation' },
          ],
        },
        {
          title: 'Core concepts',
          links: [
            {
              title: 'Understanding caching',
              href: '/token-metadata/understanding-caching',
            },
            {
              title: 'Predicting user behavior',
              href: '/token-metadata/predicting-user-behavior',
            },
            {
              title: 'Basics of time-travel',
              href: '/token-metadata/basics-of-time-travel',
            },
            {
              title: 'Introduction to string theory',
              href: '/token-metadata/introduction-to-string-theory',
            },
            {
              title: 'The butterfly effect',
              href: '/token-metadata/the-butterfly-effect',
            },
          ],
        },
        {
          title: 'Advanced guides',
          links: [
            {
              title: 'Writing plugins',
              href: '/token-metadata/writing-plugins',
            },
            {
              title: 'Neuralink integration',
              href: '/token-metadata/neuralink-integration',
            },
            {
              title: 'Temporal paradoxes',
              href: '/token-metadata/temporal-paradoxes',
            },
            { title: 'Testing', href: '/token-metadata/testing' },
            {
              title: 'Compile-time caching',
              href: '/token-metadata/compile-time-caching',
            },
            {
              title: 'Predictive data generation',
              href: '/token-metadata/predictive-data-generation',
            },
          ],
        },
        {
          title: 'API reference',
          links: [
            {
              title: 'CacheAdvance.predict()',
              href: '/token-metadata/cacheadvance-predict',
            },
            {
              title: 'CacheAdvance.flush()',
              href: '/token-metadata/cacheadvance-flush',
            },
            {
              title: 'CacheAdvance.revert()',
              href: '/token-metadata/cacheadvance-revert',
            },
            {
              title: 'CacheAdvance.regret()',
              href: '/token-metadata/cacheadvance-regret',
            },
          ],
        },
        {
          title: 'Contributing',
          links: [
            {
              title: 'How to contribute',
              href: '/token-metadata/how-to-contribute',
            },
            {
              title: 'Architecture guide',
              href: '/token-metadata/architecture-guide',
            },
            {
              title: 'Design principles',
              href: '/token-metadata/design-principles',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('token-metadata'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Getting started', href: '/token-metadata/references' },
            {
              title: 'Installation',
              href: '/token-metadata/references/installation',
            },
          ],
        },
        {
          title: 'Core concepts',
          links: [
            {
              title: 'Understanding caching',
              href: '/token-metadata/references/understanding-caching',
            },
            {
              title: 'Predicting user behavior',
              href: '/token-metadata/references/predicting-user-behavior',
            },
            {
              title: 'Basics of time-travel',
              href: '/token-metadata/references/basics-of-time-travel',
            },
            {
              title: 'Introduction to string theory',
              href: '/token-metadata/references/introduction-to-string-theory',
            },
            {
              title: 'The butterfly effect',
              href: '/token-metadata/references/the-butterfly-effect',
            },
          ],
        },
      ],
    },
    { ...recipesSection('token-metadata') },
    { ...changelogSection('token-metadata') },
  ],
}
