---
title: 使用 JavaScript 入门
metaTitle: JavaScript SDKs | Token Metadata
description: 使用 Metaplex Token Metadata JavaScript SDK 开始使用 NFT。
---

Metaplex 提供了两个用于与 Token Metadata NFT 交互的 JavaScript SDK。两者都提供对 Token Metadata 功能的完整访问 - 根据您的项目架构进行选择。 {% .lead %}

## 选择您的 SDK

{% quick-links %}

{% quick-link title="Umi SDK" icon="JavaScript" href="/zh/smart-contracts/token-metadata/getting-started/umi" description="基于 Umi 框架构建，具有流畅的 API。适合使用 Umi 的项目。" /%}

{% quick-link title="Kit SDK" icon="JavaScript" href="/zh/smart-contracts/token-metadata/getting-started/kit" description="基于 @solana/kit 构建，具有函数式指令构建器。适合新项目。" /%}

{% /quick-links %}

## 比较

| 功能 | Umi SDK | Kit SDK |
| ------- | ------- | ------- |
| 包 | `@metaplex-foundation/mpl-token-metadata` | `@metaplex-foundation/mpl-token-metadata-kit` |
| 基础 | Umi 框架 | @solana/kit |
| 交易构建 | 使用 `.sendAndConfirm()` 的流畅 API | 使用指令构建器的函数式 |
| 钱包处理 | 内置身份系统 | 标准 @solana/signers |
| 适用于 | 已经使用 Umi 的项目 | 使用 @solana/kit 的新项目 |

## 快速示例

{% dialect-switcher title="创建 NFT" %}
{% dialect title="Umi SDK" id="umi" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

const mint = generateSigner(umi);
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi);
```

{% /dialect %}
{% dialect title="Kit SDK" id="kit" %}

```ts
import { generateKeyPairSigner } from '@solana/kit';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';

const mint = await generateKeyPairSigner();
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550,
  tokenOwner: authority.address,
});
await sendAndConfirm([createIx, mintIx], [mint, authority]);
```

{% /dialect %}
{% /dialect-switcher %}

请参阅各个页面了解完整的设置说明和更多示例。
