import getAssetsByAuthority from './das/getAssestByAuthority'
import getAsset from './das/getAsset'
import getAssetBatch from './das/getAssetBatch'
import getAssetProof from './das/getAssetProof'
import getAssetProofBatch from './das/getAssetProofBatch'
import getAssetsByCreator from './das/getAssetsByCreator'
import getAssetsByGroup from './das/getAssetsByGroup'
import getAssetsByOwner from './das/getAssetsByOwner'
import getSignaturesForAsset from './das/getSignaturesForAsset'
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
  getAssetBatch: getAssetBatch,
  getAssetProofBatch: getAssetProofBatch,
  searchAssets: searchAssets,
  getSignaturesForAsset: getSignaturesForAsset,
  getTokenAccounts: getTokenAccounts,
}
export default apiMethods
