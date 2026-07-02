---
title: 方法
metaTitle: 方法 | DAS API
description: Metaplex DAS API 客户端的可调用 API 方法。
---

DAS API 支持以下方法：

- [`getAsset`](/zh/dev-tools/das-api/methods/get-asset): 返回压缩/标准资产的信息，包括元数据和所有者。
- [`getAssets`](/zh/dev-tools/das-api/methods/get-assets): 返回多个压缩/标准资产的信息，包括元数据和所有者。
- [`getAssetProof`](/zh/dev-tools/das-api/methods/get-asset-proof): 返回压缩资产的默克尔树证明信息。
- [`getAssetProofs`](/zh/dev-tools/das-api/methods/get-asset-proofs): 返回多个压缩资产的默克尔树证明信息。
- [`getAssetSignatures`](/zh/dev-tools/das-api/methods/get-asset-signatures): 返回压缩资产的交易签名。
- [`getAssetsByAuthority`](/zh/dev-tools/das-api/methods/get-assets-by-authority): 根据权限地址返回资产列表。
- [`getAssetsByCreator`](/zh/dev-tools/das-api/methods/get-assets-by-creator): 根据创建者地址返回资产列表。
- [`getAssetsByGroup`](/zh/dev-tools/das-api/methods/get-assets-by-group): 根据组（键、值）对返回资产列表。合集使用 `"collection"`，mpl-core GroupV1 使用 `"group"`。
- [`getGrouping`](/zh/dev-tools/das-api/methods/get-grouping): 返回分组（键、值）对的分组元数据，包括名称和成员数量。
- [`getAssetsByOwner`](/zh/dev-tools/das-api/methods/get-assets-by-owner): 根据所有者地址返回资产列表。
- [`getNftEditions`](/zh/dev-tools/das-api/methods/get-nft-editions): 返回主版 NFT 铸币的所有可打印版本。
- [`getTokenAccounts`](/zh/dev-tools/das-api/methods/get-token-accounts): 按所有者或铸币返回代币账户列表。
- [`searchAssets`](/zh/dev-tools/das-api/methods/search-assets): 根据搜索条件返回资产列表。
