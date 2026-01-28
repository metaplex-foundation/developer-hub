---
title: 转移资产
metaTitle: 转移资产 | Token Metadata
description: 了解如何在 Token Metadata 上转移资产
---

资产的所有者可以通过向 Token Metadata 程序发送 **Transfer** 指令将资产转移到另一个账户。此指令接受以下属性：

- **Authority**：授权转移的签名者。通常，这是资产的所有者，但请注意，某些委托权限也可以代表所有者转移资产，如"[委托权限](/zh/smart-contracts/token-metadata/delegates)"页面所述。
- **Token Owner**：资产当前所有者的公钥。
- **Destination Owner**：资产新所有者的公钥。
- **Token Standard**：被转移资产的标准。此指令适用于所有代币标准，以提供统一的资产转移接口。话虽如此，值得注意的是，非可编程资产可以直接使用 SPL Token 程序的 **Transfer** 指令来转移。

以下是如何使用我们的 SDK 在 Token Metadata 上转移资产。

## NFT 转移

{% code-tabs-imported from="token-metadata/transfer-nft" frameworks="umi,kit" /%}

## pNFT 转移

可编程 NFT（pNFT）可能有需要在转移过程中处理的额外授权规则。该指令将自动处理 Token Record 账户。

{% code-tabs-imported from="token-metadata/transfer-pnft" frameworks="umi,kit" /%}

### 高级 pNFT 转移

对于具有复杂授权规则的 pNFT，您可能需要提供额外的参数。

{% code-tabs-imported from="token-metadata/transfer-pnft-advanced" frameworks="umi,kit" /%}
