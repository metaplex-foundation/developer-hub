---
title: はじめに
metaTitle: MPLエージェントレジストリ入門 | Metaplex
description: MPLエージェントレジストリSDKをインストールして、Solana上に最初のエージェントアイデンティティを登録します。
keywords:
  - MPL Agent Registry
  - getting started
  - agent identity SDK
  - Umi
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-12-2026'
---

SDKをインストールして、最初のエージェントアイデンティティを登録します。{% .lead %}

## Summary

`@metaplex-foundation/mpl-agent-registry`パッケージをインストールし、`mplAgentIdentity()`と`mplAgentTools()`プラグインでUmiを設定し、MPL CoreアセットにAgent初のエージェントアイデンティティを登録します。

- **インストール** — npmでSDKをインストールし、`mplAgentIdentity()`と`mplAgentTools()`でUmiを設定します
- **作成** — まだMPL Coreコレクションとアセットがない場合は作成します
- **登録** — `registerIdentityV1`でアイデンティティを登録し、アタッチされた`AgentIdentity`プラグインを確認します
- **必要条件** — `@metaplex-foundation/umi-bundle-defaults`と`@metaplex-foundation/mpl-core`が必要です

## インストール

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## セットアップ

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplCore())
  .use(mplAgentIdentity())
  .use(mplAgentTools());
```

## アイデンティティを登録する

MPL Coreアセットが必要です。まだお持ちでない場合は、最初に作成してください。

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import {
  registerIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1,
} from '@metaplex-foundation/mpl-agent-registry';

// コレクションとアセットを作成
const collection = generateSigner(umi);
const asset = generateSigner(umi);

await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// エージェントメタデータを指すURIでアイデンティティを登録
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);

// 確認
const pda = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const identity = await fetchAgentIdentityV1(umi, pda);
console.log(identity.asset); // asset.publicKeyと一致
```

## AgentIdentityプラグインを確認する

登録後、アセットにはURIとライフサイクルチェックを持つ`AgentIdentity`プラグインが付いています。

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, asset.publicKey);

// AgentIdentityプラグインを確認
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // 'https://example.com/agent-registration.json'
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 次のステップ

- **[エージェントアイデンティティ](/smart-contracts/mpl-agent/identity)** — アイデンティティプログラムの詳細
- **[エージェントツール](/smart-contracts/mpl-agent/tools)** — エグゼクティブプロファイルと実行委任

*[Metaplex](https://github.com/metaplex-foundation)が管理 · 2026年3月最終確認 · [GitHubでソースを表示](https://github.com/metaplex-foundation/mpl-agent)*
