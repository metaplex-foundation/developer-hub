import { Fence } from '@/components/Fence';

import PropTypes from 'prop-types'

const UmiRequestRenderer = ({
  url,
  headers,
  bodyMethod,
  rpcVersion,
  bodyParams,
  id,
}) => {
  // ...existing implementation...
}

UmiRequestRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  headers: PropTypes.object,
  bodyMethod: PropTypes.string.isRequired,
  rpcVersion: PropTypes.string,
  bodyParams: PropTypes.object,
  id: PropTypes.string,
}

export default UmiRequestRenderer
  const httpBody = bodyParams;

  // Convert display options to UMI format with proper formatting
  const convertDisplayOptions = (options) => {
    if (!options) return '';

    const displayOptions = [];
    if (options.showCollectionMetadata !== undefined) {
      displayOptions.push(`    showCollectionMetadata: ${options.showCollectionMetadata}`);
    }
    if (options.showFungible !== undefined) {
      displayOptions.push(`    showFungible: ${options.showFungible}`);
    }
    if (options.showInscription !== undefined) {
      displayOptions.push(`    showInscription: ${options.showInscription}`);
    }
    if (options.showUnverifiedCollections !== undefined) {
      displayOptions.push(`    showUnverifiedCollections: ${options.showUnverifiedCollections}`);
    }
    if (options.showZeroBalance !== undefined) {
      displayOptions.push(`    showZeroBalance: ${options.showZeroBalance}`);
    }

    return displayOptions.length > 0 ? `{\n${displayOptions.join(',\n')}\n  }` : '';
  };

  // Convert parameters to UMI format using object-based input types with proper formatting
  const convertParamsToUmi = (params, method) => {
    if (!params) return '';

    if (!method) {
      console.warn('UmiRequestRenderer: No method specified');
      return '';
    }
    switch (method) {
      case 'getAsset': {
        const assetParams = [];
        if (params.id) {
          assetParams.push(`  id: publicKey('${params.id}')`);
        } else {
          assetParams.push(`  id: publicKey('')`);
        }
        if (params.options) {
          const displayOptions = convertDisplayOptions(params.options);
          if (displayOptions) assetParams.push(`  displayOptions: ${displayOptions}`);
        }
        return `{\n${assetParams.join(',\n')}\n}`;
      }
      case 'getAssets': {
        const assetsParams = [];
        if (params.ids && Array.isArray(params.ids)) {
          const idsList = params.ids.map(id => `    publicKey('${id}')`).join(',\n');
          assetsParams.push(`  ids: [\n${idsList}\n  ]`);
        } else {
          assetsParams.push(`  ids: []`);
        }
        if (params.options) {
          const displayOptions = convertDisplayOptions(params.options);
          if (displayOptions) assetsParams.push(`  displayOptions: ${displayOptions}`);
        }
        return `{\n${assetsParams.join(',\n')}\n}`;
      }
      case 'getAssetsByOwner': {
        const ownerParams = [];
        if (params.ownerAddress) ownerParams.push(`  owner: publicKey('${params.ownerAddress}')`);
        if (params.limit) ownerParams.push(`  limit: ${params.limit}`);
        if (params.page) ownerParams.push(`  page: ${params.page}`);
        if (params.before) ownerParams.push(`  before: publicKey('${params.before}')`);
        if (params.after) ownerParams.push(`  after: publicKey('${params.after}')`);
        if (params.sortBy) {
          const sortBy = typeof params.sortBy === 'object' ? params.sortBy : { sortBy: params.sortBy, sortDirection: 'desc' };
          ownerParams.push(`  sortBy: {\n    sortBy: '${sortBy.sortBy || 'created'}',\n    sortDirection: '${sortBy.sortDirection || 'desc'}'\n  }`);
        }
        if (params.options) {
          const displayOptions = convertDisplayOptions(params.options);
          if (displayOptions) ownerParams.push(`  displayOptions: ${displayOptions}`);
        }
        return `{\n${ownerParams.join(',\n')}\n}`;
      }
      case 'getAssetsByCreator': {
        const creatorParams = [];
        if (params.creatorAddress) creatorParams.push(`  creator: publicKey('${params.creatorAddress}')`);
        if (params.onlyVerified !== undefined) creatorParams.push(`  onlyVerified: ${params.onlyVerified}`);
        if (params.limit) creatorParams.push(`  limit: ${params.limit}`);
        if (params.page) creatorParams.push(`  page: ${params.page}`);
        if (params.before) creatorParams.push(`  before: publicKey('${params.before}')`);
        if (params.after) creatorParams.push(`  after: publicKey('${params.after}')`);
        if (params.sortBy) {
          const sortBy = typeof params.sortBy === 'object' ? params.sortBy : { sortBy: params.sortBy, sortDirection: 'desc' };
          creatorParams.push(`  sortBy: {\n    sortBy: '${sortBy.sortBy || 'created'}',\n    sortDirection: '${sortBy.sortDirection || 'desc'}'\n  }`);
        }
        if (params.options) {
          const displayOptions = convertDisplayOptions(params.options);
          if (displayOptions) creatorParams.push(`  displayOptions: ${displayOptions}`);
        }
        return `{\n${creatorParams.join(',\n')}\n}`;
      }
      case 'getAssetsByAuthority': {
        const authorityParams = [];
        if (params.authorityAddress) authorityParams.push(`  authority: publicKey('${params.authorityAddress}')`);
        if (params.limit) authorityParams.push(`  limit: ${params.limit}`);
        if (params.page) authorityParams.push(`  page: ${params.page}`);
        if (params.before) authorityParams.push(`  before: publicKey('${params.before}')`);
        if (params.after) authorityParams.push(`  after: publicKey('${params.after}')`);
        if (params.sortBy) {
          const sortBy = typeof params.sortBy === 'object' ? params.sortBy : { sortBy: params.sortBy, sortDirection: 'desc' };
          authorityParams.push(`  sortBy: {\n    sortBy: '${sortBy.sortBy || 'created'}',\n    sortDirection: '${sortBy.sortDirection || 'desc'}'\n  }`);
        }
        if (params.options) {
          const displayOptions = convertDisplayOptions(params.options);
          if (displayOptions) authorityParams.push(`  displayOptions: ${displayOptions}`);
        }
        return `{\n${authorityParams.join(',\n')}\n}`;
      }
      case 'getAssetsByGroup': {
        const groupParams = [];
        if (params.grouping && Array.isArray(params.grouping) && params.grouping.length >= 2) {
          groupParams.push(`  groupKey: '${params.grouping[0]}'`);
          groupParams.push(`  groupValue: '${params.grouping[1]}'`);
        } else {
          groupParams.push(`  groupKey: ''`);
          groupParams.push(`  groupValue: ''`);
        }
        if (params.limit) groupParams.push(`  limit: ${params.limit}`);
        if (params.page) groupParams.push(`  page: ${params.page}`);
        if (params.before) groupParams.push(`  before: publicKey('${params.before}')`);
        if (params.after) groupParams.push(`  after: publicKey('${params.after}')`);
        if (params.sortBy) {
          const sortBy = typeof params.sortBy === 'object' ? params.sortBy : { sortBy: params.sortBy, sortDirection: 'desc' };
          groupParams.push(`  sortBy: {\n    sortBy: '${sortBy.sortBy || 'created'}',\n    sortDirection: '${sortBy.sortDirection || 'desc'}'\n  }`);
        }
        if (params.options) {
          const displayOptions = convertDisplayOptions(params.options);
          if (displayOptions) groupParams.push(`  displayOptions: ${displayOptions}`);
        }
        return `{\n${groupParams.join(',\n')}\n}`;
      }
      case 'searchAssets': {
        const searchParams = [];
        if (params.ownerAddress) searchParams.push(`  owner: publicKey('${params.ownerAddress}')`);
        if (params.creatorAddress) searchParams.push(`  creator: publicKey('${params.creatorAddress}')`);
        if (params.authorityAddress) searchParams.push(`  authority: publicKey('${params.authorityAddress}')`);
        if (params.grouping && Array.isArray(params.grouping) && params.grouping.length >= 2) {
          searchParams.push(`  grouping: [\n    '${params.grouping[0]}',\n    '${params.grouping[1]}'\n   ]`);
        }
        if (params.jsonUri) searchParams.push(`  jsonUri: '${params.jsonUri}'`);
        if (params.limit) searchParams.push(`  limit: ${params.limit}`);
        if (params.page) searchParams.push(`  page: ${params.page}`);
        if (params.before) searchParams.push(`  before: publicKey('${params.before}')`);
        if (params.after) searchParams.push(`  after: publicKey('${params.after}')`);
        if (params.interface) searchParams.push(`  interface: '${params.interface}'`);
        if (params.ownerType) searchParams.push(`  ownerType: '${params.ownerType}'`);
        if (params.creatorVerified !== undefined) searchParams.push(`  creatorVerified: ${params.creatorVerified}`);
        if (params.delegateAddress) searchParams.push(`  delegate: publicKey('${params.delegateAddress}')`);
        if (params.frozen !== undefined) searchParams.push(`  frozen: ${params.frozen}`);
        if (params.supply) searchParams.push(`  supply: ${params.supply}`);
        if (params.supplyMint) searchParams.push(`  supplyMint: publicKey('${params.supplyMint}')`);
        if (params.compressed !== undefined) searchParams.push(`  compressed: ${params.compressed}`);
        if (params.compressible !== undefined) searchParams.push(`  compressible: ${params.compressible}`);
        if (params.royaltyTargetType) searchParams.push(`  royaltyTargetType: '${params.royaltyTargetType}'`);
        if (params.royaltyTarget) searchParams.push(`  royaltyTarget: publicKey('${params.royaltyTarget}')`);
        if (params.royaltyAmount) searchParams.push(`  royaltyAmount: ${params.royaltyAmount}`);
        if (params.burnt !== undefined) searchParams.push(`  burnt: ${params.burnt}`);
        if (params.sortBy) {
          const sortBy = typeof params.sortBy === 'object' ? params.sortBy : { sortBy: params.sortBy, sortDirection: 'desc' };
          searchParams.push(`  sortBy: {\n    sortBy: '${sortBy.sortBy || 'created'}',\n    sortDirection: '${sortBy.sortDirection || 'desc'}'\n  }`);
        }
        if (params.negate !== undefined) searchParams.push(`  negate: ${params.negate}`);
        if (params.conditionType) searchParams.push(`  conditionType: '${params.conditionType}'`);
        if (params.options) {
          const displayOptions = convertDisplayOptions(params.options);
          if (displayOptions) searchParams.push(`  displayOptions: ${displayOptions}`);
        }
        return `{\n${searchParams.join(',\n')}\n}`;
      }
      case 'getAssetProof': {
        if (!params.id) return '';
        return `publicKey('${params.id}')`;
      }
      case 'getAssetProofs': {
        if (!params.ids || !Array.isArray(params.ids)) return '[]';
        const proofIds = params.ids.map(id => `  publicKey('${id}')`).join(',\n');
        return `[\n${proofIds}\n]`;
      }
      case 'getAssetSignatures': {
        const signatureParams = [];
        if (params.id) signatureParams.push(`  assetId: publicKey('${params.id}')`);
        if (params.limit) signatureParams.push(`  limit: ${params.limit}`);
        if (params.page) signatureParams.push(`  page: ${params.page}`);
        if (params.before) signatureParams.push(`  before: '${params.before}'`);
        if (params.after) signatureParams.push(`  after: '${params.after}'`);
        if (params.sortDirection) signatureParams.push(`  sortDirection: '${params.sortDirection}'`);
        return `{\n${signatureParams.join(',\n')}\n}`;
      }
      default: {
        console.warn(`UmiRequestRenderer: Unsupported method: ${method}`);
        return JSON.stringify(params);
      }
    }
  };

  const umiParams = convertParamsToUmi(httpBody, bodyMethod);

  const code = `import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('${url}').use(dasApi())

const result = await umi.rpc.${bodyMethod}(${umiParams})
console.log(result)`;

  return (
    <Fence className="w-full" language="javascript">
      {code}
    </Fence>
  );
};

export default UmiRequestRenderer; 