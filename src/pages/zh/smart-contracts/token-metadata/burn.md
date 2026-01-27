---
title: 销毁资产
metaTitle: 销毁资产 | Token Metadata
description: 了解如何在 Token Metadata 上销毁资产
---

资产的所有者可以使用 Token Metadata 程序的 **Burn** 指令来销毁它。这将关闭与资产关联的所有可能账户,并将之前保存在已关闭账户中的各种租金豁免费用转移给所有者。此指令接受以下属性:

- **Authority**:授权销毁的签名者。通常,这是资产的所有者,但请注意,某些委托权限也可以代表所有者销毁资产,如"[委托权限](/zh/smart-contracts/token-metadata/delegates)"页面所述。
- **Token Owner**:资产当前所有者的公钥。
- **Token Standard**:被销毁资产的标准。此指令适用于所有代币标准,以提供统一的资产销毁接口。话虽如此,值得注意的是,非可编程资产可以直接使用 SPL Token 程序的 **Burn** 指令来销毁。

**Burn** 指令关闭的确切账户取决于被销毁资产的代币标准。以下是总结每种代币标准账户的表格:

| 代币标准                       | Mint | Token                    | Metadata | Edition | Token Record | Edition Marker          |
| ------------------------------ | ---- | ------------------------ | -------- | ------- | ------------ | ----------------------- |
| `NonFungible`                  | ❌   | ✅                       | ✅       | ✅      | ❌           | ❌                      |
| `NonFungibleEdition`           | ❌   | ✅                       | ✅       | ✅      | ❌           | ✅ 如果所有打印都被销毁 |
| `Fungible` 和 `FungibleAsset` | ❌   | ✅ 如果所有代币都被销毁 | ❌       | ❌      | ❌           | ❌                      |
| `ProgrammableNonFungible`      | ❌   | ✅                       | ✅       | ✅      | ✅           | ❌                      |

请注意,Mint 账户永远不会被关闭,因为 SPL Token 程序不允许这样做。

以下是如何使用我们的 SDK 在 Token Metadata 上销毁资产。

## NFT 销毁

{% code-tabs-imported from="token-metadata/burn-nft" frameworks="umi,kit,shank,anchor" /%}

## pNFT 销毁

`pNFT` 可能需要传入附加账户才能使指令正常工作。这些可能包括:

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% code-tabs-imported from="token-metadata/burn-pnft" frameworks="umi,kit,shank,anchor" /%}
