import {
  changelogSection,
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections';
import { StopCircleIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const core = {
  name: 'Core',
  headline: 'Next gen NFT standard',
  description: 'Next generation Solana NFT standard.',
  navigationMenuCatergory: 'MPL',
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
          title: 'Introduction',
          links: [
            { 
              title: 'Overview', 
              href: '/core' 
            },
            { 
              title: 'What is an Asset?', 
              href: '/core/what-is-an-asset' 
            },
            { 
              title: 'JSON Schema', 
              href: '/core/json-schema' 
            },
            {
              title: 'Token Metadata Differences',
              href: '/core/tm-differences',
            },
            { 
              title: 'Ecosystem Support', 
              href: '/core/ecosystem-support' },
            { 
              title: 'Anchor', 
              href: '/core/using-core-in-anchor' 
            },
            { 
              title: 'FAQ', 
              href: '/core/faq' 
            },
          ],
        },
        {
          title: 'SDK',
          links: [
            {
              title: 'Javascript SDK',
              href: '/core/sdk/javascript',
            },
            {
              title: 'Rust SDK',
              href: '/core/sdk/rust',
            }
          ]
        },
        {
          title: 'Features',
          links: [
            { 
              title: 'Creating Assets', 
              href: '/core/create-asset' 
            },
            { 
              title: 'Fetching Assets', 
              href: '/core/fetch'
            },
            { 
              title: 'Updating Assets', 
              href: '/core/update' 
            },
            { 
              title: 'Transferring Assets', 
              href: '/core/transfer' 
            },
            { 
              title: 'Burning Assets', 
              href: '/core/burn' 
            },
            {
              title: 'Collection Management',
              href: '/core/collections',
            },
            { 
              title: 'Helpers', 
              href: '/core/helpers' 
            },
            { 
              title: 'Deserializing Assets', 
              href: '/core/deserialization' 
            },
          ],
        },
        {
          title: 'Plugins',
          links: [
            { 
              title: 'Overview', 
              href: '/core/plugins' 
            },
            { 
              title: 'Adding Plugins', 
              href: '/core/plugins/adding-plugins' 
            },
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
            { 
              title: 'Royalties Plugin', 
              href: '/core/plugins/royalties' 
            },
            {
              title: 'Update Delegate Plugin',
              href: '/core/plugins/update-delegate',
              updated: "06-19-2024"
            },
            { 
              title: 'Attribute Plugin', 
              href: '/core/plugins/attribute' 
            },
            { 
              title: 'AddBlocker Plugin', 
              href: '/core/plugins/addBlocker' 
            },
            { 
              title: 'Edition Plugin', 
              href: '/core/plugins/edition' 
            },
            {
              title: 'Immutable Metadata Plugin',
              href: '/core/plugins/immutableMetadata',
            },
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
            {
              title: 'Adding External Plugin Adapters',
              href: '/core/external-plugins/adding-external-plugins',
            },
            {
              title: 'Removing External Plugin Adapters',
              href: '/core/external-plugins/removing-external-plugins',
            },

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
      ],
    },
    {
      ...guidesSection('core'),
      navigation: [
        {
          title: 'General',
          links: [
            { 
              title: 'Overview', 
              href: '/core/guides' 
            },
            { 
              title: 'Immutability', 
              href: '/core/guides/immutability' 
            },
            { 
              title: 'Soulbound Assets', 
              href: '/core/guides/create-soulbound-nft-asset',
              created: '2024-12-06',
              updated: null, // null means it's never been updated
            },
            { 
              title: 'Print Editions', 
              href: '/core/guides/print-editions'
            },
            {
              title: 'Oracle Plugin Example',
              href: '/core/guides/oracle-plugin-example',
            },
            {
              title: 'Appdata Plugin Example',
              href: '/core/guides/onchain-ticketing-with-appdata',
            },
          ],
        },
        {
          title: 'Javascript',
          links: [
            {
              title: 'How to Create a Core Asset with Javascript',
              href: '/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript',
            },
            {
              title: 'How to Create a Core Collection with JavaScript',
              href: '/core/guides/javascript/how-to-create-a-core-collection-with-javascript',
            },
            { 
              title: 'Web2 typescript Staking Example', 
              href: '/core/guides/javascript/web2-typescript-staking-example' 
            },
          ],
        },
        {
          title: 'Anchor',
          links: [
            {
              title: 'How to Create a Core Asset with Anchor',
              href: '/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor',
            },
            {
              title: 'How to Create a Core Collection with Anchor',
              href: '/core/guides/anchor/how-to-create-a-core-collection-with-anchor',
            },
            {
              title: 'Anchor Staking Example', 
              href: '/core/guides/anchor/anchor-staking-example' 
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('core'),
      href: `https://mpl-core.typedoc.metaplex.com/`,
      target: '_blank',
    },
  ],
}
