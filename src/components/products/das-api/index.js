import {
  documentationSection
} from '@/shared/sections';
import { TableCellsIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';
import { buildProductTranslations } from '@/config/navigation-translations';

export const das = {
  name: 'DAS API',
  headline: 'Fetch Digital Asset Data',
  description:
    'A DAS API Client to access Digital Asset data on chain',
  path: 'das-api',
  icon: <TableCellsIcon />,
  github: 'https://github.com/metaplex-foundation/digital-asset-standard-api',
  navigationMenuCatergory: 'Dev Tools',
  className: 'accent-sky',
  heroes: [{ path: '/das-api', component: Hero }],
  sections: [
    {
      ...documentationSection('das-api'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/das-api' },
            { title: 'Getting Started', href: '/das-api/getting-started' },
            { title: 'DAS API RPC Providers', href: '/rpc-providers' },
            { title: 'Display Options', href: '/das-api/display-options' },
          ],
        },
        {
          title: 'Methods & Playground',
          links: [
            { title: 'Method Overview', href: '/das-api/methods' },
            { title: 'Get Asset', href: '/das-api/methods/get-asset' },
            { title: 'Get Assets', href: '/das-api/methods/get-assets' },
            { title: 'Get Asset Proof', href: '/das-api/methods/get-asset-proof' },
            { title: 'Get Asset Proofs', href: '/das-api/methods/get-asset-proofs' },
            { title: 'Get Asset Signatures', href: '/das-api/methods/get-asset-signatures' },
            { title: 'Get Assets By Authority', href: '/das-api/methods/get-assets-by-authority' },
            { title: 'Get Assets By Creator', href: '/das-api/methods/get-assets-by-creator' },
            { title: 'Get Assets By Group', href: '/das-api/methods/get-assets-by-group' },
            { title: 'Get Assets By Owner', href: '/das-api/methods/get-assets-by-owner' },
            { title: 'Get NFT Editions', href: '/das-api/methods/get-nft-editions' },
            { title: 'Get Token Accounts', href: '/das-api/methods/get-token-accounts' },
            { title: 'Search Assets', href: '/das-api/methods/search-assets' },
          ],
        },
        {
          title: 'Guides',
          links: [
            { title: 'Guides Overview', href: '/das-api/guides' },
            { title: 'Pagination', href: '/das-api/guides/pagination' },
            { title: 'Get Collection NFTs', href: '/das-api/guides/get-collection-nfts' },
            { title: 'Get NFTs by Owner', href: '/das-api/guides/get-nfts-by-owner' },
            { title: 'Get Wallet Tokens', href: '/das-api/guides/get-wallet-tokens' },
            { title: 'Get Fungible Assets', href: '/das-api/guides/get-fungible-assets' },
            { title: 'Search by Criteria', href: '/das-api/guides/search-by-criteria' },
            { title: 'Owner and Collection', href: '/das-api/guides/owner-and-collection' },
            { title: 'Find Compressed NFTs', href: '/das-api/guides/find-compressed-nfts' },
            { title: 'Collection Statistics', href: '/das-api/guides/collection-statistics' },
            { title: 'Find Token Holders', href: '/das-api/guides/find-token-holders' },
          ],
        },
        {
          title: 'Core Extension SDK',
          links: [
            { title: 'Extension Overview', href: '/das-api/core-extension' },
            { title: 'Get Core Asset', href: '/das-api/core-extension/methods/get-asset' },
            { title: 'Get Core Collection', href: '/das-api/core-extension/methods/get-collection' },
            { title: 'Get Core Assets By Authority', href: '/das-api/core-extension/methods/get-assets-by-authority' },
            { title: 'Get Core Assets By Collection', href: '/das-api/core-extension/methods/get-assets-by-collection' },
            { title: 'Get Core Assets By Owner', href: '/das-api/core-extension/methods/get-assets-by-owner' },
            { title: 'Search Core Assets', href: '/das-api/core-extension/methods/search-assets' },
            { title: 'Search Core Collections', href: '/das-api/core-extension/methods/search-collections' },
            { title: 'Plugin Derivation', href: '/das-api/core-extension/plugin-derivation' },
            { title: 'Type Conversion', href: '/das-api/core-extension/convert-das-asset-to-core' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: buildProductTranslations({
    productKey: 'dasApi',
    sectionKeys: {
      'Introduction': 'sections.introduction',
      'Methods & Playground': 'sections.methods',
      'Guides': 'sections.guides',
      'Core Extension SDK': 'sections.coreExtension'
    },
    linkKeys: {
      'Overview': 'links.overview',
      'Getting Started': 'links.gettingStarted',
      'DAS API RPC Providers': 'links.dasApiProviders',
      'Display Options': 'links.displayOptions',
      'Method Overview': 'links.methodOverview',
      'Get Asset': 'links.getAsset',
      'Get Assets': 'links.getAssets',
      'Get Asset Proof': 'links.getAssetProof',
      'Get Asset Proofs': 'links.getAssetProofs',
      'Get Asset Signatures': 'links.getAssetSignatures',
      'Get Assets By Authority': 'links.getAssetsByAuthority',
      'Get Assets By Creator': 'links.getAssetsByCreator',
      'Get Assets By Group': 'links.getAssetsByGroup',
      'Get Assets By Owner': 'links.getAssetsByOwner',
      'Get NFT Editions': 'links.getNftEditions',
      'Get Token Accounts': 'links.getTokenAccounts',
      'Search Assets': 'links.searchAssets',
      'Guides Overview': 'links.guidesOverview',
      'Pagination': 'links.pagination',
      'Get Collection NFTs': 'links.getCollectionNfts',
      'Get NFTs by Owner': 'links.getNftsByOwner',
      'Get Wallet Tokens': 'links.getWalletTokens',
      'Get Fungible Assets': 'links.getFungibleAssets',
      'Search by Criteria': 'links.searchByCriteria',
      'Owner and Collection': 'links.ownerAndCollection',
      'Find Compressed NFTs': 'links.findCompressedNfts',
      'Collection Statistics': 'links.collectionStatistics',
      'Find Token Holders': 'links.findTokenHolders',
      'Extension Overview': 'links.extensionOverview',
      'Get Core Asset': 'links.getCoreAsset',
      'Get Core Collection': 'links.getCoreCollection',
      'Get Core Assets By Authority': 'links.getCoreAssetsByAuthority',
      'Get Core Assets By Collection': 'links.getCoreAssetsByCollection',
      'Get Core Assets By Owner': 'links.getCoreAssetsByOwner',
      'Search Core Assets': 'links.searchCoreAssets',
      'Search Core Collections': 'links.searchCoreCollections',
      'Plugin Derivation': 'links.pluginDerivation',
      'Type Conversion': 'links.typeConversion'
    }
  })
}
