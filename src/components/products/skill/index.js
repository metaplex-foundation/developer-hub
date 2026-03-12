import {
  documentationSection
} from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/solid'

export const skill = {
  name: 'Skill',
  headline: 'AI Agent Knowledge Base',
  description: 'Give AI coding agents full knowledge of Metaplex programs, CLI commands, and SDK patterns.',
  path: 'agents/skill',
  navigationMenuCatergory: undefined,
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation/skill',
  className: 'accent-purple',
  sections: [
    {
      ...documentationSection('agents/skill'),
      navigation: [
        {
          title: 'Getting Started',
          links: [
            { title: 'Overview', href: '/agents/skill' },
            { title: 'Installation', href: '/agents/skill/installation' },
          ],
        },
        {
          title: 'Details',
          links: [
            { title: 'How It Works', href: '/agents/skill/how-it-works' },
            { title: 'Programs & Operations', href: '/agents/skill/programs-and-operations' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'AI Agent Knowledge Base',
      description: 'Give AI coding agents full knowledge of Metaplex programs, CLI commands, and SDK patterns.',
      sections: {
        'Getting Started': 'Getting Started',
        'Details': 'Details'
      },
      links: {
        'Overview': 'Overview',
        'Installation': 'Installation',
        'How It Works': 'How It Works',
        'Programs & Operations': 'Programs & Operations'
      }
    }
  }
}
