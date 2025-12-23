---
title: 转移资产
metaTitle: 转移资产 | Token Metadata
description: 了解如何在 Token Metadata 上转移资产
---

资产所有者可以通过向 Token Metadata 程序发送 **Transfer** 指令将其转移到另一个账户。此指令接受以下属性：

- **Authority**：授权转移的签名者。通常这是资产的所有者，但请注意，某些委托权限也可以代表所有者转移资产，如"[委托权限](/token-metadata/delegates)"页面中所述。
- **Token Owner**：资产当前所有者的公钥。
- **Destination Owner**：资产新所有者的公钥。
- **Token Standard**：正在转移的资产的标准。此指令适用于所有代币标准，以提供统一的资产转移接口。话虽如此，值得注意的是，非可编程资产可以直接使用 SPL Token 程序的 **Transfer** 指令进行转移。

以下是如何使用我们的 SDK 在 Token Metadata 上转移资产。

## 转移 NFT

{% dialect-switcher title="转移 NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: currentOwner,
  tokenOwner: currentOwner.publicKey,
  destinationOwner: newOwner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 转移 pNFT

以下代码是将 pNFT 转移给新所有者的示例。

{% dialect-switcher title="转移 pNFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { getMplTokenAuthRulesProgramId } from "@metaplex-foundation/mpl-candy-machine";
import {
  fetchDigitalAssetWithAssociatedToken,
  findTokenRecordPda,
  TokenStandard,
  transferV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { publicKey, unwrapOptionRecursively } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

// NFT 资产 Mint ID
const mintId = publicKey("11111111111111111111111111111111");

// 获取带有 Token 账户的 pNFT 资产
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// 目标钱包
const destinationAddress = publicKey(
  "22222222222222222222222222222222"
);

// 计算目标钱包的 Token 账户
const destinationTokenAccount = findAssociatedTokenPda(umi, {
  mint: mintId,
  owner: destinationAddress,
});

// 计算目标钱包的 Token Record 账户
const destinationTokenRecord = findTokenRecordPda(umi, {
  mint: mintId,
  token: destinationTokenAccount[0],
});

// 转移 pNFT
const { signature } = await transferV1(umi, {
  mint: mintId,
  destinationOwner: destinationAddress,
  destinationTokenRecord: destinationTokenRecord,
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // 检查 pNFT 资产是否有授权规则。
  authorizationRules:
    unwrapOptionRecursively(assetWithToken.metadata.programmableConfig)
      ?.ruleSet || undefined,
  // Auth rules 程序 ID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // 如果设置了某些 pNFT 可能需要授权数据。
  authorizationData: undefined,
}).sendAndConfirm(umi);

console.log("Signature: ", base58.deserialize(signature));
```
{% /dialect %}
{% /dialect-switcher %}
