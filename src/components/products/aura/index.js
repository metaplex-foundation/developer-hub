import { documentationSection } from '@/shared/sections';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Hero } from './Hero';

export const aura = {
  name: 'Aura',
  headline: 'Indexing and Data Availability Network',
  description:
    'A data network that extends Solana and the Solana Virtual Machine (SVM)',
  navigationMenuCatergory: 'Dev Tools',
  path: 'aura',
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation/aura/',
  className: 'accent-pink',
  primaryCta: {
    disabled: true,
  },
  heroes: [{ path: '/aura', component: Hero }],
  sections: [
    {
      ...documentationSection('aura'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/aura',
            },
            {
              title: 'FAQ',
              href: '/aura/faq',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Reading Solana and SVM Data',
              href: '/aura/reading-solana-and-svm-data',
            },
          ],
        }
      ],
    },
  ],
}
