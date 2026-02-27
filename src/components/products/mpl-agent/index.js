import { documentationSection, referencesSection } from '@/shared/sections'
import { CpuChipIcon } from '@heroicons/react/24/solid'

export const mplAgent = {
  name: 'Agent Registry',
  headline: 'Agent Identity Registry',
  description:
    'On-chain program for registering agent identity on MPL Core assets.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/mpl-agent',
  icon: <CpuChipIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-agent-identity',
  className: 'accent-purple',
  sections: [
    {
      ...documentationSection('smart-contracts/mpl-agent'),
      title: '',
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/smart-contracts/mpl-agent',
            },
            {
              title: 'Getting Started',
              href: '/smart-contracts/mpl-agent/getting-started',
            },
          ],
        },
        {
          title: 'Programs',
          links: [
            {
              title: 'Agent Identity',
              href: '/smart-contracts/mpl-agent/identity',
            },
          ],
        },
      ],
    },
  ],
}
