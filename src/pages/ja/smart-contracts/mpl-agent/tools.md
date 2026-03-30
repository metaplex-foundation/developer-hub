---
title: Agent Tools
metaTitle: Agent Toolsプログラム | MPL Agent Registry | Metaplex
description: MPL Agent Toolsプログラムの技術リファレンス — エグゼクティブプロファイル、実行委任、取り消し、アカウント、PDA導出。
keywords:
  - Agent Tools program
  - executive profile
  - execution delegation
  - RegisterExecutiveV1
  - DelegateExecutionV1
  - RevokeExecutionV1
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '03-11-2026'
updated: '03-30-2026'
---

Agent Toolsプログラムは、エージェントアセットのエグゼクティブ委任を管理し、アセットオーナーが実行権限の委任と取り消しを行えるようにします。{% .lead %}

## 概要

Agent Toolsプログラム（`TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`）は、実行委任を管理するための3つのインストラクションを提供します：`RegisterExecutiveV1`はエグゼクティブプロファイルを作成し、`DelegateExecutionV1`はそのプロファイルにエージェントアセットに代わって実行する権限を付与し、`RevokeExecutionV1`はその権限を削除します。

- **3つのインストラクション** — `RegisterExecutiveV1`（一度限りのプロファイル設定）、`DelegateExecutionV1`（アセットごとの委任）、`RevokeExecutionV1`（取り消し）
- **ExecutiveProfileV1** — `["executive_profile", <authority>]`から導出される40バイトのPDA、ウォレットごとに1つ
- **ExecutionDelegateRecordV1** — エグゼクティブプロファイルと特定のエージェントアセットをリンクする104バイトのPDA
- **オーナーのみの委任** — アセットオーナーのみが委任レコードを作成可能。プログラムがオンチェーンで所有権を検証します
- **双方向の取り消し** — アセットオーナーまたはエグゼクティブ権限者のどちらでも委任を取り消せます

## プログラムID

同じプログラムアドレスがMainnetとDevnetの両方にデプロイされています。

| ネットワーク | アドレス |
|---------|---------|
| Mainnet | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| Devnet | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |

## 概要

Toolsプログラムは3つのインストラクションを提供します：

1. **RegisterExecutiveV1** — エージェントアセットのエグゼキューターとして動作できるエグゼクティブプロファイルを作成
2. **DelegateExecutionV1** — エグゼクティブプロファイルにエージェントアセットに代わって実行する権限を付与
3. **RevokeExecutionV1** — 既存の実行委任を削除し、レントを回収

エグゼクティブプロファイルは権限者ごとに一度登録します。委任はアセットごとに行われます。アセットオーナーがエージェントアセットと特定のエグゼクティブプロファイルをリンクする委任レコードを作成します。どちらの当事者も委任を取り消すことができます。

## インストラクション: RegisterExecutiveV1

指定された権限者のエグゼクティブプロファイルPDAを作成します。

### アカウント

4つのアカウントが必要です：作成するプロファイルPDA、支払者、オプションの権限者、Systemプログラム。

| アカウント | 書き込み可能 | 署名者 | オプション | 説明 |
|---------|----------|--------|----------|-------------|
| `executiveProfile` | はい | いいえ | いいえ | 作成されるPDA（権限者から自動導出） |
| `payer` | はい | はい | いいえ | アカウントレントと手数料を支払う |
| `authority` | いいえ | はい | はい | このエグゼクティブプロファイルの権限者（デフォルトは`payer`） |
| `systemProgram` | いいえ | いいえ | いいえ | Systemプログラム |

### RegisterExecutiveV1の処理内容

1. シード`["executive_profile", <authority>]`からPDAを導出
2. アカウントが未初期化であることを検証
3. 権限者を格納する`ExecutiveProfileV1`アカウント（40バイト）を作成・初期化

## インストラクション: DelegateExecutionV1

エージェントアセットの実行権限をエグゼクティブプロファイルに委任します。

### アカウント

エグゼクティブプロファイル、エージェントアセット、そのID PDA、作成する委任レコードPDAを含む7つのアカウントが必要です。

| アカウント | 書き込み可能 | 署名者 | オプション | 説明 |
|---------|----------|--------|----------|-------------|
| `executiveProfile` | いいえ | いいえ | いいえ | 登録済みのエグゼクティブプロファイル |
| `agentAsset` | いいえ | いいえ | いいえ | 委任するMPL Coreアセット |
| `agentIdentity` | いいえ | いいえ | いいえ | アセットの[エージェントID](/smart-contracts/mpl-agent/identity) PDA |
| `executionDelegateRecord` | はい | いいえ | いいえ | 作成されるPDA（自動導出） |
| `payer` | はい | はい | いいえ | アカウントレントと手数料を支払う |
| `authority` | いいえ | はい | はい | アセットオーナーである必要があります（デフォルトは`payer`） |
| `systemProgram` | いいえ | いいえ | いいえ | Systemプログラム |

### DelegateExecutionV1の処理内容

1. エグゼクティブプロファイルが存在し、初期化されていることを検証
2. エージェントアセットが有効なMPL Coreアセットであることを検証
3. [エージェントID](/smart-contracts/mpl-agent/identity)がアセットに登録されていることを検証
4. 署名者がアセットオーナーであることを検証
5. シード`["execution_delegate_record", <executive_profile>, <agent_asset>]`からPDAを導出
6. `ExecutionDelegateRecordV1`アカウント（104バイト）を作成・初期化

## インストラクション: RevokeExecutionV1

実行委任レコードを閉じ、エグゼクティブがエージェントアセットに代わって行動する権限を削除します。閉じたアカウントのレントは指定された宛先に返金されます。

### アカウント

| アカウント | 書き込み可能 | 署名者 | オプション | 説明 |
|---------|----------|--------|----------|-------------|
| `executionDelegateRecord` | はい | いいえ | いいえ | 閉じる委任レコード |
| `agentAsset` | いいえ | いいえ | いいえ | 委任の対象だったエージェントアセット |
| `destination` | はい | いいえ | いいえ | 閉じたアカウントから返金されるレントの受取先 |
| `payer` | はい | はい | いいえ | 支払者 |
| `authority` | いいえ | はい | はい | アセットオーナーまたはエグゼクティブ権限者である必要があります（デフォルトは`payer`） |
| `systemProgram` | いいえ | いいえ | いいえ | Systemプログラム |

### RevokeExecutionV1の処理内容

1. 委任レコードが存在し、初期化されており、このプログラムによって所有されていることを検証
2. レコードの`agentAsset`フィールドが提供されたエージェントアセットと一致することを検証
3. 委任レコードのPDA導出を確認
4. エージェントアセットが有効なMPL Coreアセットであることを検証
5. 署名者が**アセットオーナー**または委任に記録された**エグゼクティブ権限者**であることを検証
6. 委任レコードアカウントを閉じ、レントを`destination`に返金

{% callout type="note" %}
アセットオーナーとエグゼクティブの両方が委任を取り消すことができます。つまり、エグゼクティブは自発的にエージェントから離脱でき、オーナーはエグゼクティブの署名なしにエグゼクティブを削除できます。
{% /callout %}

```typescript
import { revokeExecutionV1 } from '@metaplex-foundation/mpl-agent-registry';

await revokeExecutionV1(umi, {
  executionDelegateRecord: delegateRecordPda,
  agentAsset: agentAssetPublicKey,
  destination: umi.payer.publicKey,
}).sendAndConfirm(umi);
```

## PDA導出

両アカウントタイプは決定的シードから導出されたPDAです。SDKヘルパーを使用して計算してください。

| アカウント | シード | サイズ |
|---------|-------|------|
| `ExecutiveProfileV1` | `["executive_profile", <authority>]` | 40バイト |
| `ExecutionDelegateRecordV1` | `["execution_delegate_record", <executive_profile>, <agent_asset>]` | 104バイト |

```typescript
import {
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const profilePda = findExecutiveProfileV1Pda(umi, {
  authority: authorityPublicKey,
});

const delegatePda = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile: profilePda,
  agentAsset: assetPublicKey,
});
```

## アカウント: ExecutiveProfileV1

このエグゼクティブプロファイルを所有する権限者を格納します。40バイト、8バイトアライン。

| オフセット | フィールド | 型 | サイズ | 説明 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | アカウントディスクリミネーター（`1` = ExecutiveProfileV1） |
| 1 | `_padding` | `[u8; 7]` | 7 | アラインメントパディング |
| 8 | `authority` | `Pubkey` | 32 | このエグゼクティブプロファイルの権限者 |

## アカウント: ExecutionDelegateRecordV1

エグゼクティブプロファイルとエージェントアセットをリンクし、誰がアセットに代わって実行する権限を持つかを記録します。104バイト、8バイトアライン。

| オフセット | フィールド | 型 | サイズ | 説明 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | アカウントディスクリミネーター（`2` = ExecutionDelegateRecordV1） |
| 1 | `bump` | `u8` | 1 | PDAバンプシード |
| 2 | `_padding` | `[u8; 6]` | 6 | アラインメントパディング |
| 8 | `executiveProfile` | `Pubkey` | 32 | エグゼクティブプロファイルアドレス |
| 40 | `authority` | `Pubkey` | 32 | エグゼクティブ権限者 |
| 72 | `agentAsset` | `Pubkey` | 32 | エージェントアセットアドレス |

## アカウントの取得

### エグゼクティブプロファイル

```typescript
import {
  fetchExecutiveProfileV1,
  safeFetchExecutiveProfileV1,
  fetchAllExecutiveProfileV1,
  fetchExecutiveProfileV1FromSeeds,
  getExecutiveProfileV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const profile = await fetchExecutiveProfileV1(umi, profilePda);

// Safe fetch (returns null if not found)
const profile = await safeFetchExecutiveProfileV1(umi, profilePda);

// By seeds (derives PDA internally)
const profile = await fetchExecutiveProfileV1FromSeeds(umi, {
  authority: authorityPublicKey,
});

// Batch fetch
const profiles = await fetchAllExecutiveProfileV1(umi, [pda1, pda2]);

// GPA query
const results = await getExecutiveProfileV1GpaBuilder(umi)
  .whereField('authority', authorityPublicKey)
  .get();
```

### 実行委任レコード

```typescript
import {
  fetchExecutionDelegateRecordV1,
  safeFetchExecutionDelegateRecordV1,
  fetchAllExecutionDelegateRecordV1,
  fetchExecutionDelegateRecordV1FromSeeds,
  getExecutionDelegateRecordV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const record = await fetchExecutionDelegateRecordV1(umi, delegatePda);

// Safe fetch (returns null if not found)
const record = await safeFetchExecutionDelegateRecordV1(umi, delegatePda);

// By seeds (derives PDA internally)
const record = await fetchExecutionDelegateRecordV1FromSeeds(umi, {
  executiveProfile: profilePda,
  agentAsset: assetPublicKey,
});

// Batch fetch
const records = await fetchAllExecutionDelegateRecordV1(umi, [pda1, pda2]);

// GPA query — find all delegations for a specific agent
const results = await getExecutionDelegateRecordV1GpaBuilder(umi)
  .whereField('agentAsset', assetPublicKey)
  .get();
```

## エラー

| コード | 名前 | 説明 |
|------|------|-------------|
| 0 | `InvalidSystemProgram` | Systemプログラムアカウントが正しくありません |
| 1 | `InvalidInstructionData` | インストラクションデータが不正です |
| 2 | `InvalidAccountData` | 無効なアカウントデータ |
| 3 | `InvalidMplCoreProgram` | MPL Coreプログラムアカウントが正しくありません |
| 4 | `InvalidCoreAsset` | アセットが有効なMPL Coreアセットではありません |
| 5 | `ExecutiveProfileMustBeUninitialized` | エグゼクティブプロファイルは既に存在しています |
| 6 | `InvalidExecutionDelegateRecordDerivation` | 委任レコードPDA導出の不一致 |
| 7 | `ExecutionDelegateRecordMustBeUninitialized` | 委任レコードは既に存在しています |
| 8 | `InvalidAgentIdentity` | エージェントIDアカウントが無効です |
| 9 | `AgentIdentityNotRegistered` | アセットに登録済みのIDがありません |
| 10 | `AssetOwnerMustBeTheOneToDelegateExecution` | アセットオーナーのみが実行を委任できます |
| 11 | `InvalidExecutiveProfileDerivation` | エグゼクティブプロファイルPDA導出の不一致 |
| 12 | `ExecutionDelegateRecordMustBeInitialized` | 委任レコードが存在しないか、初期化されていません |
| 13 | `UnauthorizedRevoke` | 署名者がアセットオーナーでもエグゼクティブ権限者でもありません |

## 注意事項

- 各ウォレットはエグゼクティブプロファイルを1つしか持てません。同じウォレットで2つ目のプロファイルを登録しようとすると`ExecutiveProfileMustBeUninitialized`で失敗します。
- 委任レコードは（エグゼクティブ、アセット）ペアごとに作成されます。同じエグゼクティブが複数のエージェントアセットに委任されることが可能です。
- 取り消しにより、委任レコードのレントは`destination`アカウントに返金されます。必ずしも元の支払者に返金されるわけではありません。
- アセットオーナーとエグゼクティブ権限者のどちらも委任を取り消すことができます — 両当事者がこの権利を持っています。
