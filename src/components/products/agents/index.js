import { documentationSection } from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/solid'

export const agents = {
  name: 'Agents',
  headline: 'AI Agents on Solana',
  description: 'Register agent identity, delegate execution, and give AI agents knowledge of Metaplex programs.',
  navigationMenuCatergory: undefined,
  path: 'agents',
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation',
  className: 'accent-purple',
  sections: [
    {
      ...documentationSection('agents'),
      isFallbackSection: false,
      isPageFromSection: ({ pathname }) => {
        return pathname.startsWith('/agents/') && pathname !== '/agents'
      },
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/agents',
            },
          ],
        },
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Skill',
              href: '/agents/skill',
            },
            {
              title: 'Register an Agent',
              href: '/agents/register-agent',
            },
            {
              title: 'Read Agent Data',
              href: '/agents/run-agent',
            },
            {
              title: 'Run an Agent',
              href: '/agents/run-an-agent',
            },
          ],
        },
      ],
    },
  ],
}
