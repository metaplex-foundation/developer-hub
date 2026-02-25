import { buildProductTranslations } from '@/config/navigation-translations'
import { documentationSection } from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/solid'

export const agents = {
  name: 'Skill',
  headline: 'AI Agent Knowledge Base',
  description: 'Give AI coding agents full knowledge of Metaplex programs, CLI commands, and SDK patterns.',
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
              title: 'Run an Agent',
              href: '/agents/run-agent',
            },
          ],
        },
      ],
    },
  ],
}
