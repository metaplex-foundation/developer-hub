import {
  changelogSection,
  documentationSection,
  recipesSection,
  guidesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { StopCircleIcon } from '@heroicons/react/24/solid'

export const core = {
  name: 'Core',
  headline: 'Next gen NFT standard',
  description: 'Next generation Solana NFT standard.',
  navigationMenuCatergory: 'Create',
  path: 'core',
  icon: <StopCircleIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: [{ path: '/core', component: Hero }],
  sections: [
    {
      ...documentationSection('core'),
      navigation: [
        {
          title: 'New!',
          links: [{ title: 'JS SDK V1.0', href: '/core/core-js-sdk-v1-0' }],
        },
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/core' },
            {
              title: 'Getting Started',
              href: '/core/getting-started',
            },
            { title: 'What is an Asset?', href: '/core/what-is-an-asset' },
            {
              title: 'Token Metadata Differences',
              href: '/core/tm-differences',
            },
            { title: 'Ecosystem Support', href: '/core/ecosystem-support' },
            { title: 'FAQ', href: '/core/faq' },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Creating Assets', href: '/core/create-asset' },
            { title: 'Fetching Assets', href: '/core/fetch' },
            { title: 'Updating Assets', href: '/core/update' },
            { title: 'Transferring Assets', href: '/core/transfer' },
            { title: 'Burning Assets', href: '/core/burn' },
            {
              title: 'Collection Management',
              href: '/core/collections',
            },
            { title: 'Helpers', href: '/core/helpers' },
            { title: 'Deserializing Assets', href: '/core/deserialization' },
          ],
        },
        {
          title: 'Plugins',
          links: [
            { title: 'Overview', href: '/core/plugins' },
            { title: 'Adding Plugins', href: '/core/plugins/adding-plugins' },
            {
              title: 'Removing Plugins',
              href: '/core/plugins/removing-plugins',
            },
            {
              title: 'Delegating and Revoking Plugins',
              href: '/core/plugins/delegating-and-revoking-plugins',
            },
            {
              title: 'Autograph Plugin',
              href: '/core/plugins/autograph',
            },
            {
              title: 'Transfer Delegate Plugin',
              href: '/core/plugins/transfer-delegate',
            },
            {
              title: 'Freeze Delegate Plugin',
              href: '/core/plugins/freeze-delegate',
            },
            {
              title: 'Burn Delegate Plugin',
              href: '/core/plugins/burn-delegate',
            },
            { title: 'Royalties Plugin', href: '/core/plugins/royalties' },
            {
              title: 'Update Delegate Plugin',
              href: '/core/plugins/update-delegate',
              updated: "06-19-2024"
            },
            { title: 'Attribute Plugin', href: '/core/plugins/attribute' },
            { title: 'AddBlocker Plugin', href: '/core/plugins/addBlocker' },
            { title: 'Edition Plugin', href: '/core/plugins/edition' },
            { title: 'Immutable Metadata Plugin', href: '/core/plugins/immutableMetadata' },
            {
              title: 'Master Edition Plugin',
              href: '/core/plugins/master-edition',
            },
            {
              title: 'Permanent Transfer Plugin',
              href: '/core/plugins/permanent-transfer-delegate',
            },
            {
              title: 'Permanent Freeze Delegate Plugin',
              href: '/core/plugins/permanent-freeze-delegate',
            },
            {
              title: 'Permanent Burn Delegate Plugin',
              href: '/core/plugins/permanent-burn-delegate',
            },
            {
              title: 'Verified Creators Plugin',
              href: '/core/plugins/verified-creators',
            },
          ],
        },
        {
          title: 'External Plugins',
          links: [
            { title: 'Overview', href: '/core/external-plugins/overview' },
            { title: 'Adding External Plugin Adapters', href: '/core/external-plugins/adding-external-plugins' },
            { title: 'Removing External Plugin Adapters', href: '/core/external-plugins/removing-external-plugins' },

            // {
            //   title: 'Removing External Plugins',
            //   href: '/core/plugins/removing-plugins',
            // },
            // {
            //   title: 'Delegating and Revoking External Plugins',
            //   href: '/core/plugins/delegating-and-revoking-plugins',
            // },
            {
              title: 'Oracle Plugin',
              href: '/core/external-plugins/oracle',
            },
            {
              title: 'AppData Plugin',
              href: '/core/external-plugins/app-data',
              created: "2024-06-19"
            },
          ],
        },
        // {
        //   title: 'Integration Guides',
        //   links: [
        //     { title: 'Wallets', href: '/core/integrations/wallets' },
        //     {
        //       title: 'Market Places',
        //       href: '/core/intergations/market-places',
        //     },
        //     {
        //       title: 'Staking',
        //       href: '/core/intergations/staking',
        //     },
        //   ],
        // },
      ],
    },
    {
      ...referencesSection('core'),
      href: `https://mpl-core.typedoc.metaplex.com/`,
      target: '_blank',
    },
    {
      ...guidesSection('core'),
      navigation: [
        {
          title: 'Guides',
          links: [
            { title: 'Overview', href: '/core/guides' },
            { title: 'Immutability', href: '/core/guides/immutability' },
            { title: 'Print Editions', href: '/core/guides/print-editions' },
            { title: 'Oracle Plugin Example', href: '/core/guides/oracle-plugin-example' },
            { title: 'Web2 typescript Staking Example', href: '/core/guides/javascript/web2-typescript-staking-example' },
            { title: 'Using Core with Anchor', href: '/core/guides/using-core-with-anchor' }
          ],
        },
      ],
    },
    // { ...recipesSection('core') },
    { ...changelogSection('core') },
  ],
}
