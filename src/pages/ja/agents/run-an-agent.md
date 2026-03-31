---
title: エージェントを実行
metaTitle: Solanaでエージェントを実行 | Metaplex Agent Registry
description: エグゼクティブプロファイルを設定し、実行を委任してSolana上で自律型エージェントを実行します。
keywords:
  - run agent
  - executive profile
  - execution delegation
  - Agent Tools
  - autonomous agent
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Execution Delegation
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '03-11-2026'
updated: '03-30-2026'
---

エグゼクティブプロファイルを設定し、実行を委任してSolana上でエージェントを実行します。{% .lead %}

## 概要

実行委任により、オフチェーンのエグゼクティブがエージェントアセットに代わってトランザクションに署名でき、オンチェーンIDとオフチェーン操作の間のギャップを埋めます。

- **エグゼクティブプロファイルを登録** — ウォレットごとに1回のオンチェーンセットアップで検証可能なオペレーターIDを作成
- **実行を委任** — アセットオーナーがオンチェーンの委任レコードを通じてエージェントを特定のエグゼクティブにリンク
- **委任を確認** — 委任レコードPDAを派生し、アカウントが存在するかチェック
- [登録済みエージェント](/agents/create-agent)と`@metaplex-foundation/mpl-agent-registry`パッケージ（v0.2.0以上）が**必要**

## クイックスタート

1. [委任が必要な理由](#委任が必要な理由) — 委任が解決する問題を理解
2. [エグゼクティブプロファイルを登録](#エグゼクティブプロファイルを登録) — ウォレットごとに1回のセットアップ
3. [実行を委任](#実行を委任) — エージェントをエグゼクティブにリンク
4. [委任を確認](#委任を確認) — 委任レコードの存在を確認
5. [委任を取り消し](#委任を取り消し) — エグゼクティブの権限を削除
6. [完全な例](#完全な例) — エンドツーエンドのコードサンプル

## 委任が必要な理由

すべてのCoreアセットには内蔵ウォレット（[Asset Signer](/smart-contracts/core/execute-asset-signing)）があります。秘密鍵のないPDAなので、盗まれることはありません。CoreのExecuteライフサイクルフックを通じて、アセット自身のみがそのウォレットに対して署名できます。

問題は、Solanaがバックグラウンドタスクやオンチェーン推論をサポートしていないことです。エージェントは自分でトランザクションを送信するために起動することができません。オフチェーンの何かがそれを行う必要があります。しかし、エージェントのオーナーもすべてのアクションを承認するためにコンピュータの前に座っている必要はないはずです。

実行委任がこのギャップを埋めます。オーナーは**エグゼクティブ**に委任します。エグゼクティブとは、Executeフックを使用してエージェントに代わってトランザクションに署名する信頼できるオフチェーンオペレーターです。オーナーはすべてのトランザクションのためにオンラインである必要なく、誰がエージェントを実行するかを制御します。

## エグゼクティブとは？

エグゼクティブは、エージェントアセットを操作する権限を持つウォレットを表すオンチェーンプロファイルです。サービスアカウントと考えてください：ウォレットをエグゼクティブとして1回登録すれば、個々のエージェントオーナーがそれに実行を委任できます。

これにより**ID**（エージェントが誰か）と**実行**（誰が操作するか）が分離されます。エグゼクティブプロファイルはウォレットの公開鍵から派生したPDAです（ウォレットごとに1つ）。委任はアセットごとに行われます：エージェントオーナーがエージェントを特定のエグゼクティブにリンクする委任レコードを作成します。1つのエグゼクティブが多数のエージェントを実行でき、オーナーはエージェントのIDに触れることなくエグゼクティブを切り替えられます。

すべてのエグゼクティブプロファイルはオンチェーンに存在するため、レジストリは検証可能なディレクトリとして機能します。誰でもプロファイルを列挙し、エグゼクティブがどのエージェントを操作しているかを確認し、委任履歴を検査できます。これにより、エグゼクティブがオンチェーンの実績に基づいて評価されるレピュテーションレイヤーの基盤が築かれます。

## 前提条件

IDレコードとAgentIdentityプラグインを持つ[登録済みエージェント](/agents/create-agent)と、`@metaplex-foundation/mpl-agent-registry`パッケージ（v0.2.0以上）が必要です。

## エグゼクティブプロファイルを登録

エグゼクティブがエージェントを実行する前に、プロファイルが必要です。これはウォレットごとに1回のセットアップです：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import { registerExecutiveV1 } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentTools());

await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);
```

プロファイルPDAはシード`["executive_profile", <authority>]`から派生されるため、各ウォレットは1つしか持てません。

## 実行を委任

エグゼクティブプロファイルが準備できたら、エージェントアセットのオーナーはそれに実行を委任できます。これにより、エージェントをエグゼクティブにリンクするオンチェーンの委任レコードが作成されます：

```typescript
import { delegateExecutionV1 } from '@metaplex-foundation/mpl-agent-registry';
import { findAgentIdentityV1Pda, findExecutiveProfileV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const agentIdentity = findAgentIdentityV1Pda(umi, { asset: agentAssetPublicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: executiveAuthorityPublicKey });

await delegateExecutionV1(umi, {
  agentAsset: agentAssetPublicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);
```

アセットオーナーのみが実行を委任できます。プログラムは以下を検証します：

- エグゼクティブプロファイルが存在すること
- エージェントアセットが有効なMPL Coreアセットであること
- エージェントが登録済みIDを持つこと
- 署名者がアセットオーナーであること

## パラメータ

### RegisterExecutiveV1

| パラメータ | 説明 |
|-----------|-------------|
| `payer` | レントと手数料を支払う（権限としても使用） |
| `authority` | このエグゼクティブプロファイルを所有するウォレット（デフォルトは`payer`） |

### DelegateExecutionV1

| パラメータ | 説明 |
|-----------|-------------|
| `agentAsset` | 登録済みエージェントのMPL Coreアセット |
| `agentIdentity` | アセットのエージェントID PDA |
| `executiveProfile` | 委任先のエグゼクティブプロファイルPDA |
| `payer` | レントと手数料を支払う（デフォルトは`umi.payer`） |
| `authority` | アセットオーナーである必要がある（デフォルトは`payer`） |

## 委任を確認

委任が存在するかどうかを確認するには、委任レコードPDAを派生し、アカウントが存在するかチェックします：

```typescript
import {
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const executiveProfile = findExecutiveProfileV1Pda(umi, {
  authority: executiveAuthorityPublicKey,
});

const delegateRecord = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile,
  agentAsset: agentAssetPublicKey,
});

const account = await umi.rpc.getAccount(delegateRecord);
console.log('Delegated:', account.exists);
```

## 委任を取り消し

`revokeExecutionV1`命令は、委任レコードアカウントを閉じることでエグゼクティブの権限を削除します。閉じられたアカウントのレントは指定された宛先に返金されます。

**アセットオーナー**または**エグゼクティブ権限者**のいずれかが委任を取り消すことができます：

```typescript
import { revokeExecutionV1, findExecutionDelegateRecordV1Pda, findExecutiveProfileV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const executiveProfile = findExecutiveProfileV1Pda(umi, {
  authority: executiveAuthorityPublicKey,
});

const delegateRecord = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile,
  agentAsset: agentAssetPublicKey,
});

await revokeExecutionV1(umi, {
  executionDelegateRecord: delegateRecord,
  agentAsset: agentAssetPublicKey,
  destination: umi.payer.publicKey,
}).sendAndConfirm(umi);
```

### RevokeExecutionV1 パラメータ

| パラメータ | 説明 |
|-----------|-------------|
| `executionDelegateRecord` | 閉じる委任レコードPDA |
| `agentAsset` | エージェントのMPL Coreアセット |
| `destination` | 閉じられたアカウントから返金されるレントの受取先 |
| `payer` | 支払者（デフォルトは`umi.payer`） |
| `authority` | アセットオーナーまたはエグゼクティブ権限者である必要がある（デフォルトは`payer`） |

## 完全な例

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import {
  registerIdentityV1,
  registerExecutiveV1,
  delegateExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity())
  .use(mplAgentTools());

// 1. Create a collection
const collection = generateSigner(umi);
await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

// 2. Create an asset
const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// 3. Register identity
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);

// 4. Register executive profile
await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);

// 5. Delegate execution
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: umi.payer.publicKey });

await delegateExecutionV1(umi, {
  agentAsset: asset.publicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);
```

## 注意事項

- 各ウォレットは1つのエグゼクティブプロファイルしか持てません。PDAは`["executive_profile", <authority>]`から派生されるため、同じウォレットで`registerExecutiveV1`を再度呼び出すと失敗します。
- 委任はアセットごとです。オーナーはエグゼクティブに操作させたい各エージェントに対して個別の委任レコードを作成する必要があります。
- アセットオーナーのみが実行を委任できます。プログラムはオンチェーンで所有権を検証します。
- アセットオーナーまたはエグゼクティブ権限者のいずれかが委任を取り消すことができます — 双方にこの権利があります。
- オーナーは現在の委任を取り消し、異なるエグゼクティブプロファイルで新しい委任を作成することでエグゼクティブを切り替えられます。

アカウントレイアウト、PDA派生の詳細、エラーコードについては、[Agent Tools](/smart-contracts/mpl-agent/tools)スマートコントラクトリファレンスをご覧ください。
