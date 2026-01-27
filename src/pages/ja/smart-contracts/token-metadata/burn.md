---
title: アセットのバーン
metaTitle: アセットのバーン | Token Metadata
description: Token Metadataでアセットをバーンする方法を学習します
---

アセットの所有者は、Token Metadataプログラムの**Burn**命令を使用してアセットをバーンできます。これにより、アセットに関連する可能性のあるすべてのアカウントが閉じられ、閉じられたアカウントで以前保持されていた様々な家賃免除手数料が所有者に転送されます。この命令は以下の属性を受け取ります：

- **Authority**: バーンを承認する署名者。通常、これはアセットの所有者ですが、「[委任された権限](/ja/smart-contracts/token-metadata/delegates)」ページで説明されているように、特定の委任された権限も所有者の代わりにアセットをバーンできることに注意してください。
- **Token Owner**: アセットの現在の所有者の公開鍵。
- **Token Standard**: バーンされるアセットの標準。この命令は、アセットをバーンするための統一されたインターフェースを提供するために、すべてのToken Standardで動作します。つまり、プログラマブルでないアセットはSPL TokenプログラムのBurn命令を直接使用してバーンできることに注意する価値があります。

**Burn**命令によって閉じられる正確なアカウントは、バーンされるアセットのToken Standardによって異なります。以下は、各Token Standardのアカウントを要約した表です：

| Token Standard                 | Mint | Token                        | Metadata | Edition | Token Record | Edition Marker                      |
| ------------------------------ | ---- | ---------------------------- | -------- | ------- | ------------ | ----------------------------------- |
| `NonFungible`                  | ❌   | ✅                           | ✅       | ✅      | ❌           | ❌                                  |
| `NonFungibleEdition`           | ❌   | ✅                           | ✅       | ✅      | ❌           | ✅ 全プリントがバーンされた場合      |
| `Fungible` and `FungibleAsset` | ❌   | ✅ 全トークンがバーンされた場合 | ❌       | ❌      | ❌           | ❌                                  |
| `ProgrammableNonFungible`      | ❌   | ✅                           | ✅       | ✅      | ✅           | ❌                                  |

SPL TokenプログラムがMintアカウントの閉じることを許可しないため、Mintアカウントは決して閉じられないことに注意してください。

以下は、Token MetadataでアセットをバーンするためのSDKの使用方法です。

## NFTバーン

{% code-tabs-imported from="token-metadata/burn-nft" frameworks="umi,kit,shank,anchor" /%}

## pNFTバーン

`pNFT`では、命令が動作するために追加のアカウントを渡す必要がある場合があります。これらには以下が含まれる場合があります：

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% code-tabs-imported from="token-metadata/burn-pnft" frameworks="umi,kit,shank,anchor" /%}
