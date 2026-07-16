import getAssetsByAuthority from './das/getAssestByAuthority'
import getAsset from './das/getAsset'
import getAssetProof from './das/getAssetProof'
import getAssetProofs from './das/getAssetProofs'
import getAssets from './das/getAssets'
import getAssetsByCreator from './das/getAssetsByCreator'
import getAssetsByGroup from './das/getAssetsByGroup'
import getAssetsByOwner from './das/getAssetsByOwner'
import getAssetSignatures from './das/getAssetSignatures'
import getGrouping from './das/getGrouping'
import getNftEditions from './das/getNftEditions'
import getTokenAccounts from './das/getTokenAccounts'
import searchAssets from './das/searchAssest'


import testApiMethod from './template'

const apiMethods = {
  testApiMethod: testApiMethod,
  getAsset: getAsset,
  getAssetProof: getAssetProof,
  getAssetsByAuthority: getAssetsByAuthority,
  getAssetsByCreator: getAssetsByCreator,
  getAssetsByGroup: getAssetsByGroup,
  getAssetsByOwner: getAssetsByOwner,
  getAssets: getAssets,
  getAssetProofs: getAssetProofs,
  getGrouping: getGrouping,
  getNftEditions: getNftEditions,
  searchAssets: searchAssets,
  getAssetSignatures: getAssetSignatures,
  getTokenAccounts: getTokenAccounts,
}
export default apiMethods
