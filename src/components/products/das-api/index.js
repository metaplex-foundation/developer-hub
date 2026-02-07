import {
  documentationSection
} from '@/shared/sections';
import { TableCellsIcon } from '@heroicons/react/24/solid';
import { buildProductTranslations } from '@/config/navigation-translations';

export const das = {
  name: 'DAS API',
  headline: 'Fetch Digital Asset Data',
  description:
    'A DAS API Client to access Digital Asset data on chain',
  path: 'dev-tools/das-api',
  icon: <TableCellsIcon />,
  github: 'https://github.com/metaplex-foundation/digital-asset-standard-api',
  navigationMenuCatergory: 'Dev Tools',
  className: 'accent-sky',
  sections: [
    {
      ...documentationSection('dev-tools/das-api'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/dev-tools/das-api' },
            { title: 'Getting Started', href: '/dev-tools/das-api/getting-started' },
            { title: 'DAS API RPC Providers', href: '/rpc-providers' },
            { title: 'Display Options', href: '/dev-tools/das-api/display-options' },
          ],
        },
        {
          title: 'Methods & Playground',
          links: [
            { title: 'Method Overview', href: '/dev-tools/das-api/methods' },
            { title: 'Get Asset', href: '/dev-tools/das-api/methods/get-asset' },
            { title: 'Get Assets', href: '/dev-tools/das-api/methods/get-assets' },
            { title: 'Get Asset Proof', href: '/dev-tools/das-api/methods/get-asset-proof' },
            { title: 'Get Asset Proofs', href: '/dev-tools/das-api/methods/get-asset-proofs' },
            { title: 'Get Asset Signatures', href: '/dev-tools/das-api/methods/get-asset-signatures' },
            { title: 'Get Assets By Authority', href: '/dev-tools/das-api/methods/get-assets-by-authority' },
            { title: 'Get Assets By Creator', href: '/dev-tools/das-api/methods/get-assets-by-creator' },
            { title: 'Get Assets By Group', href: '/dev-tools/das-api/methods/get-assets-by-group' },
            { title: 'Get Assets By Owner', href: '/dev-tools/das-api/methods/get-assets-by-owner' },
            { title: 'Get NFT Editions', href: '/dev-tools/das-api/methods/get-nft-editions' },
            { title: 'Get Token Accounts', href: '/dev-tools/das-api/methods/get-token-accounts' },
            { title: 'Search Assets', href: '/dev-tools/das-api/methods/search-assets' },
          ],
        },
        {
          title: 'Guides',
          links: [
            { title: 'Guides Overview', href: '/dev-tools/das-api/guides' },
            { title: 'Pagination', href: '/dev-tools/das-api/guides/pagination' },
            { title: 'Get Collection NFTs', href: '/dev-tools/das-api/guides/get-collection-nfts' },
            { title: 'Get NFTs by Owner', href: '/dev-tools/das-api/guides/get-nfts-by-owner' },
            { title: 'Get Wallet Tokens', href: '/dev-tools/das-api/guides/get-wallet-tokens' },
            { title: 'Get Fungible Assets', href: '/dev-tools/das-api/guides/get-fungible-assets' },
            { title: 'Search by Criteria', href: '/dev-tools/das-api/guides/search-by-criteria' },
            { title: 'Owner and Collection', href: '/dev-tools/das-api/guides/owner-and-collection' },
            { title: 'Find Compressed NFTs', href: '/dev-tools/das-api/guides/find-compressed-nfts' },
            { title: 'Collection Statistics', href: '/dev-tools/das-api/guides/collection-statistics' },
            { title: 'Find Token Holders', href: '/dev-tools/das-api/guides/find-token-holders' },
          ],
        },
        {
          title: 'Core Extension SDK',
          links: [
            { title: 'Extension Overview', href: '/dev-tools/das-api/core-extension' },
            { title: 'Get Core Asset', href: '/dev-tools/das-api/core-extension/methods/get-asset' },
            { title: 'Get Core Collection', href: '/dev-tools/das-api/core-extension/methods/get-collection' },
            { title: 'Get Core Assets By Authority', href: '/dev-tools/das-api/core-extension/methods/get-assets-by-authority' },
            { title: 'Get Core Assets By Collection', href: '/dev-tools/das-api/core-extension/methods/get-assets-by-collection' },
            { title: 'Get Core Assets By Owner', href: '/dev-tools/das-api/core-extension/methods/get-assets-by-owner' },
            { title: 'Search Core Assets', href: '/dev-tools/das-api/core-extension/methods/search-assets' },
            { title: 'Search Core Collections', href: '/dev-tools/das-api/core-extension/methods/search-collections' },
            { title: 'Plugin Derivation', href: '/dev-tools/das-api/core-extension/plugin-derivation' },
            { title: 'Type Conversion', href: '/dev-tools/das-api/core-extension/convert-das-asset-to-core' },
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
