import {
  documentationSection
} from '@/shared/sections';
import { MapIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const shank = {
  name: 'Shank',
  headline: 'IDL Extraction for Solana Programs',
  description: 'Extract IDLs from Rust Solana program code using attribute macros',
  path: 'shank',
  icon: <MapIcon />,
  navigationMenuCatergory: 'Dev Tools',
  github: 'https://github.com/metaplex-foundation/shank',
  className: 'accent-orange',
  heroes: [{ path: '/shank', component: Hero }],
  sections: [
    {
      ...documentationSection('shank'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/shank' },
            {
              title: 'Getting Started',
              href: '/shank/getting-started',
            },
          ],
        },
        {
          title: 'Reference',
          links: [
            {
              title: 'Macros Reference',
              href: '/shank/macros',
            },
          ],
        },
      ],
    },
  ],
}