---
title: エージェントアイデンティティ
metaTitle: エージェントアイデンティティプログラム | MPLエージェントレジストリ | Metaplex
description: MPLエージェントアイデンティティプログラムの技術リファレンス — インストラクションアカウント、PDA派生、アカウント構造、エラーコード。
keywords:
  - Agent Identity program
  - RegisterIdentityV1
  - AgentIdentityV1
  - PDA derivation
  - lifecycle hooks
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '02-25-2026'
updated: '03-12-2026'
---

エージェントアイデンティティプログラムは、MPL CoreアセットのオンチェーンアイデンティティレコードをPDAとして登録します。{% .lead %}

## Summary

エージェントアイデンティティプログラム（`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`）はMPL CoreアセットのPDAベースのアイデンティティレコードを作成し、Transfer、Update、Executeのライフサイクルフックを持つ`AgentIdentity`プラグインをアタッチします。

- **単一インストラクション** — `RegisterIdentityV1`が1つのトランザクションでPDA作成、アカウント初期化、プラグインアタッチを処理します
- **40バイトのアカウント** — `AgentIdentityV1` PDAはディスクリミネーター、バンプ、アセット公開鍵のみを保存します
- **ライフサイクルフック** — プラグインはTransfer、Update、Executeイベントのapprove、listen、rejectチェックを登録します
- **決定論的PDA** — オンチェーンルックアップのためにシード`["agent_identity", <asset_pubkey>]`から派生します

## プログラムID

| ネットワーク | アドレス |
|------------|---------|
| メインネット | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| デブネット | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## インストラクション：RegisterIdentityV1

PDAを作成し、Transfer、Update、Executeのライフサイクルフックを持つ`AgentIdentity`プラグインをMPL Coreアセットにアタッチすることでエージェントアイデンティティを登録します。

### アカウント

| アカウント | 書き込み可能 | 署名者 | オプション | 説明 |
|-----------|------------|--------|---------|------|
| `agentIdentity` | はい | いいえ | いいえ | 作成されるPDA（アセットから自動派生） |
| `asset` | はい | いいえ | いいえ | 登録するMPL Coreアセット |
| `collection` | はい | いいえ | はい | アセットのコレクション |
| `payer` | はい | はい | いいえ | アカウントレンタルと手数料を支払います |
| `authority` | いいえ | はい | はい | コレクション権限者（デフォルトは`payer`） |
| `mplCoreProgram` | いいえ | いいえ | いいえ | MPL Coreプログラム |
| `systemProgram` | いいえ | いいえ | いいえ | システムプログラム |

### 引数

| 引数 | 型 | 説明 |
|-----|-----|------|
| `agentRegistrationUri` | `string` | オフチェーンのエージェント登録メタデータを指すURI |

### 動作内容

1. シード`["agent_identity", <asset>]`からPDAを派生します
2. `AgentIdentityV1`アカウント（40バイト）を作成して初期化します
3. MPL CoreにCPIして、提供されたURIと`AgentIdentity`プラグインをアセットにアタッチします
4. **Transfer**、**Update**、**Execute**イベント（approve、listen、reject）のライフサイクルチェックを登録します

### ライフサイクルチェック

`AgentIdentity`プラグインは3つのライフサイクルイベントにフックを登録します。

| イベント | Approve | Listen | Reject |
|---------|---------|--------|--------|
| Transfer | はい | はい | はい |
| Update | はい | はい | はい |
| Execute | はい | はい | はい |

つまり、アイデンティティプラグインはアセットへのTransfer、Update、Executeの承認、観察、または拒否に参加できます。

## PDA派生

**シード：** `["agent_identity", <asset_pubkey>]`

```typescript
import { findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
// [publicKey, bump]を返します
```

## アカウント：AgentIdentityV1

40バイト、8バイトアライン、bytemuck経由のゼロコピー。

| オフセット | フィールド | 型 | サイズ | 説明 |
|----------|----------|-----|------|------|
| 0 | `key` | `u8` | 1 | アカウントディスクリミネーター（`1` = AgentIdentityV1） |
| 1 | `bump` | `u8` | 1 | PDAバンプシード |
| 2 | `_padding` | `[u8; 6]` | 6 | アライメントパディング |
| 8 | `asset` | `Pubkey` | 32 | このアイデンティティにバインドされているMPL Coreアセット |

## アカウントの取得

```typescript
import {
  fetchAgentIdentityV1,
  safeFetchAgentIdentityV1,
  fetchAgentIdentityV1FromSeeds,
  fetchAllAgentIdentityV1,
  getAgentIdentityV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// PDAアドレスで取得（見つからない場合はthrow）
const identity = await fetchAgentIdentityV1(umi, pda);

// セーフフェッチ（見つからない場合はnullを返す）
const identity = await safeFetchAgentIdentityV1(umi, pda);

// シードで取得（内部でPDAを派生）
const identity = await fetchAgentIdentityV1FromSeeds(umi, { asset });

// バッチ取得
const identities = await fetchAllAgentIdentityV1(umi, [pda1, pda2]);

// GPAクエリ
const results = await getAgentIdentityV1GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

## エラー

| コード | 名前 | 説明 |
|------|------|------|
| 0 | `InvalidSystemProgram` | システムプログラムのアカウントが正しくありません |
| 1 | `InvalidInstructionData` | インストラクションデータが不正です |
| 2 | `InvalidAccountData` | PDA派生がアセットと一致しません |
| 3 | `InvalidMplCoreProgram` | MPL Coreプログラムのアカウントが正しくありません |
| 4 | `InvalidCoreAsset` | アセットが有効なMPL Coreアセットではありません |

*[Metaplex](https://github.com/metaplex-foundation)が管理 · 2026年3月最終確認 · [GitHubでソースを表示](https://github.com/metaplex-foundation/mpl-agent)*
