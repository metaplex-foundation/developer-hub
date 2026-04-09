---
title: エージェントツール
metaTitle: エージェントツールプログラム | MPLエージェントレジストリ | Metaplex
description: MPLエージェントツールプログラムの技術リファレンス — エグゼクティブプロファイル、実行委任、アカウント、PDA派生。
keywords:
  - Agent Tools program
  - executive profile
  - execution delegation
  - RegisterExecutiveV1
  - DelegateExecutionV1
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '03-11-2026'
updated: '03-12-2026'
---

エージェントツールプログラムはエージェントアセットのエグゼクティブ委任を管理し、アセットオーナーがエグゼクティブプロファイルに実行権限を委任できるようにします。{% .lead %}

## Summary

エージェントツールプログラム（`TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`）は実行委任を管理するための2つのインストラクションを提供します：`RegisterExecutiveV1`はエグゼクティブプロファイルを作成し、`DelegateExecutionV1`はそのプロファイルにエージェントアセットの代わりに実行する権限を付与します。

- **2つのインストラクション** — `RegisterExecutiveV1`（一回限りのプロファイルセットアップ）と`DelegateExecutionV1`（アセットごとの委任）
- **ExecutiveProfileV1** — `["executive_profile", <authority>]`から派生した40バイトのPDA。ウォレットごとに1つ
- **ExecutionDelegateRecordV1** — エグゼクティブプロファイルと特定のエージェントアセットをリンクする104バイトのPDA
- **オーナーのみの委任** — アセットオーナーのみが委任レコードを作成できます。プログラムはオーナーシップをオンチェーンで検証します

## プログラムID

同一のプログラムアドレスがメインネットとデブネットの両方にデプロイされています。

| ネットワーク | アドレス |
|------------|---------|
| メインネット | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| デブネット | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |

## 概要

ツールプログラムは2つのインストラクションを提供します。

1. **RegisterExecutiveV1** — エージェントアセットの実行者として機能できるエグゼクティブプロファイルを作成します
2. **DelegateExecutionV1** — エグゼクティブプロファイルにエージェントアセットの代わりに実行する権限を付与します

エグゼクティブプロファイルは権限者ごとに一度だけ登録されます。委任はアセットごとに行われます。アセットオーナーがエージェントアセットを特定のエグゼクティブプロファイルにリンクする委任レコードを作成します。

## インストラクション：RegisterExecutiveV1

指定された権限者のエグゼクティブプロファイルPDAを作成します。

### アカウント

プロファイルPDA、ペイヤー、オプションの権限者、システムプログラムの4つのアカウントが必要です。

| アカウント | 書き込み可能 | 署名者 | オプション | 説明 |
|-----------|------------|--------|---------|------|
| `executiveProfile` | はい | いいえ | いいえ | 作成されるPDA（権限者から自動派生） |
| `payer` | はい | はい | いいえ | アカウントレンタルと手数料を支払います |
| `authority` | いいえ | はい | はい | このエグゼクティブプロファイルの権限者（デフォルトは`payer`） |
| `systemProgram` | いいえ | いいえ | いいえ | システムプログラム |

### 動作内容

1. シード`["executive_profile", <authority>]`からPDAを派生します
2. アカウントが未初期化であることを検証します
3. 権限者を保存する`ExecutiveProfileV1`アカウント（40バイト）を作成して初期化します

## インストラクション：DelegateExecutionV1

エグゼクティブプロファイルにエージェントアセットの実行権限を委任します。

### アカウント

エグゼクティブプロファイル、エージェントアセット、そのアイデンティティPDA、作成される委任レコードPDAを含む7つのアカウントが必要です。

| アカウント | 書き込み可能 | 署名者 | オプション | 説明 |
|-----------|------------|--------|---------|------|
| `executiveProfile` | いいえ | いいえ | いいえ | 登録済みのエグゼクティブプロファイル |
| `agentAsset` | いいえ | いいえ | いいえ | 委任するMPL Coreアセット |
| `agentIdentity` | いいえ | いいえ | いいえ | アセットのエージェントアイデンティティPDA |
| `executionDelegateRecord` | はい | いいえ | いいえ | 作成されるPDA（自動派生） |
| `payer` | はい | はい | いいえ | アカウントレンタルと手数料を支払います |
| `authority` | いいえ | はい | はい | アセットオーナーである必要があります（デフォルトは`payer`） |
| `systemProgram` | いいえ | いいえ | いいえ | システムプログラム |

### 動作内容

1. エグゼクティブプロファイルが存在し初期化されていることを検証します
2. エージェントアセットが有効なMPL Coreアセットであることを検証します
3. エージェントアイデンティティがアセットに登録されていることを検証します
4. 署名者がアセットオーナーであることを検証します
5. シード`["execution_delegate_record", <executive_profile>, <agent_asset>]`からPDAを派生します
6. `ExecutionDelegateRecordV1`アカウント（104バイト）を作成して初期化します

## PDA派生

両方のアカウントタイプは決定論的なシードから派生したPDAです。SDKヘルパーを使用して計算してください。

| アカウント | シード | サイズ |
|----------|-------|------|
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

## アカウント：ExecutiveProfileV1

このエグゼクティブプロファイルを所有する権限者を保存します。40バイト、8バイトアライン。

| オフセット | フィールド | 型 | サイズ | 説明 |
|----------|----------|-----|------|------|
| 0 | `key` | `u8` | 1 | アカウントディスクリミネーター（`1` = ExecutiveProfileV1） |
| 1 | `_padding` | `[u8; 7]` | 7 | アライメントパディング |
| 8 | `authority` | `Pubkey` | 32 | このエグゼクティブプロファイルの権限者 |

## アカウント：ExecutionDelegateRecordV1

エグゼクティブプロファイルとエージェントアセットをリンクし、代わりに実行を許可された者を記録します。104バイト、8バイトアライン。

| オフセット | フィールド | 型 | サイズ | 説明 |
|----------|----------|-----|------|------|
| 0 | `key` | `u8` | 1 | アカウントディスクリミネーター（`2` = ExecutionDelegateRecordV1） |
| 1 | `bump` | `u8` | 1 | PDAバンプシード |
| 2 | `_padding` | `[u8; 6]` | 6 | アライメントパディング |
| 8 | `executiveProfile` | `Pubkey` | 32 | エグゼクティブプロファイルアドレス |
| 40 | `authority` | `Pubkey` | 32 | エグゼクティブ権限者 |
| 72 | `agentAsset` | `Pubkey` | 32 | エージェントアセットアドレス |

## エラー

プログラムは登録または委任中の検証失敗時にこれらのエラーを返します。

| コード | 名前 | 説明 |
|------|------|------|
| 0 | `InvalidSystemProgram` | システムプログラムのアカウントが正しくありません |
| 1 | `InvalidInstructionData` | インストラクションデータが不正です |
| 2 | `InvalidAccountData` | 無効なアカウントデータ |
| 3 | `InvalidMplCoreProgram` | MPL Coreプログラムのアカウントが正しくありません |
| 4 | `InvalidCoreAsset` | アセットが有効なMPL Coreアセットではありません |
| 5 | `ExecutiveProfileMustBeUninitialized` | エグゼクティブプロファイルはすでに存在します |
| 6 | `InvalidExecutionDelegateRecordDerivation` | 委任レコードPDA派生の不一致 |
| 7 | `ExecutionDelegateRecordMustBeUninitialized` | 委任レコードはすでに存在します |
| 8 | `InvalidAgentIdentity` | エージェントアイデンティティアカウントが無効です |
| 9 | `AgentIdentityNotRegistered` | アセットに登録済みアイデンティティがありません |
| 10 | `AssetOwnerMustBeTheOneToDelegateExecution` | 実行を委任できるのはアセットオーナーのみです |
| 11 | `InvalidExecutiveProfileDerivation` | エグゼクティブプロファイルPDA派生の不一致 |

*[Metaplex](https://github.com/metaplex-foundation)が管理 · 2026年3月最終確認 · [GitHubでソースを表示](https://github.com/metaplex-foundation/mpl-agent)*
