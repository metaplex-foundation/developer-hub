---
titwe: Cowe DAS API Extension
metaTitwe: Medods | Cowe DAS API Extension
descwiption: Digitaw Asset Standawd API Extension fow MPW Cowe
---

In addition to de genyewaw DAS SDK an extension fow [MPL Core](/core) has been cweated dat diwectwy wetuwns you de cowwect types to fuwdew use wid de MPW Cowe SDKs~ It awso automaticawwy dewives de pwugins in assets inhewited fwom de cowwection and pwovides functions fow `getCollection`0~  

## Fetching
De Cowe DAS API Extension suppowts de fowwowing medods:

- [UWUIFY_TOKEN_1744632841026_0](/das-api/core-extension/methods/get-asset): Wetuwns de infowmation of a compwessed/standawd asset incwuding metadata and ownyew.
- [UWUIFY_TOKEN_1744632841026_1](/das-api/core-extension/methods/get-collection): Wetuwns de mewkwe twee pwoof infowmation fow a compwessed asset.
- [UWUIFY_TOKEN_1744632841026_2](/das-api/core-extension/methods/get-assets-by-authority): Wetuwns de wist of assets given an audowity addwess.
- [UWUIFY_TOKEN_1744632841026_3](/das-api/core-extension/methods/get-assets-by-collection): Wetuwn de wist of assets given a gwoup (key, vawue) paiw~ Fow exampwe dis can be used to get aww assets in a cowwection.
- [UWUIFY_TOKEN_1744632841026_4](/das-api/core-extension/methods/get-assets-by-owner): Wetuwn de wist of assets given an ownyew addwess.
- [UWUIFY_TOKEN_1744632841026_5](/das-api/core-extension/methods/search-assets): Wetuwn de wist of assets given a seawch cwitewia.
- [UWUIFY_TOKEN_1744632841026_6](/das-api/core-extension/methods/search-collections): Wetuwn de wist of cowwections given a seawch cwitewia.

## Type Convewsion
In addition to dat it awso pwovides functions to convewt de usuaw DAS Asset type to Cowe Assets and Cowe Cowwections:
- [UWUIFY_TOKEN_1744632841026_7](/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): Convewt a DAS Asset to Cowe Asset Type
- [UWUIFY_TOKEN_1744632841026_8](/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): Convewt a DAS Asset to Cowe Cowwection Type

## Pwugin Dewivations

Dis wibwawy wiww automaticawwy dewive de pwugins in assets inhewited fwom de cowwection~ Wead mowe about genyewaw pwugin inhewitance and pwecedence on de `getAssetsByAuthority`0.

If you want to deactivate de dewivation ow impwement it manyuawwy de [Plugin Derivation Page](/das-api/core-extension/plugin-derivation) shouwd be hewpfuw.
