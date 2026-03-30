---
title: はじめに
metaTitle: MPL Agent Registryのはじめ方 | Metaplex
description: MPL Agent Registry SDKをインストールし、Solana上で最初のエージェントIDを登録します。
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
updated: '03-30-2026'
---

SDKをインストールし、最初のエージェントIDを登録します。{% .lead %}

## 概要

`@metaplex-foundation/mpl-agent-registry`パッケージをインストールし、Umiを`mplAgentIdentity()`と`mplAgentTools()`プラグインで設定して、MPL Coreアセットに最初のエージェントIDを登録します。

- SDKをnpmで**インストール**し、Umiを`mplAgentIdentity()`と`mplAgentTools()`で設定
- まだお持ちでない場合は、MPL Coreコレクションとアセットを**作成**
- `registerIdentityV1`でIDを**登録**し、アタッチされた`AgentIdentity`プラグインを確認
- `@metaplex-foundation/umi-bundle-defaults`と`@metaplex-foundation/mpl-core`が**必要**

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

## IDを登録する

MPL Coreアセットが必要です。まだお持ちでない場合は、まず作成してください：

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import {
  registerIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1,
} from '@metaplex-foundation/mpl-agent-registry';

// Create a collection and asset
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

// Register the identity with a URI pointing to agent metadata
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);

// Verify
const pda = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const identity = await fetchAgentIdentityV1(umi, pda);
console.log(identity.asset); // matches asset.publicKey
```

## AgentIdentityプラグインを確認する

登録後、アセットにはURIとライフサイクルチェックを持つ`AgentIdentity`プラグインがアタッチされます：

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, asset.publicKey);

// Check the AgentIdentity plugin
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // 'https://example.com/agent-registration.json'
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 次のステップ

- **[Agent Identity](/smart-contracts/mpl-agent/identity)** — Identityプログラムの完全な詳細
- **[Agent Tools](/smart-contracts/mpl-agent/tools)** — エグゼクティブプロファイルと実行委任
