---
title: Agent Identity
metaTitle: Agent Identityプログラム | MPL Agent Registry | Metaplex
description: MPL Agent Identityプログラムの技術リファレンス — RegisterIdentityV1、SetAgentTokenV1、AgentIdentityV2アカウント構造、PDA導出、エラーコード。
keywords:
  - Agent Identity program
  - RegisterIdentityV1
  - SetAgentTokenV1
  - AgentIdentityV2
  - AgentIdentityV1
  - PDA derivation
  - lifecycle hooks
  - Genesis token
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '02-25-2026'
updated: '03-30-2026'
---

Agent Identityプログラムは、MPL CoreアセットのオンチェーンIDレコードを登録し、オプションで[Genesis](/smart-contracts/genesis)トークンをリンクします。{% .lead %}

## 概要

Agent Identityプログラム（`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`）は、[MPL Core](/smart-contracts/core)アセットのPDAベースのIDレコードを作成し、Transfer、Update、Executeのライフサイクルフック付きの`AgentIdentity`プラグインをアタッチします。

- **2つのインストラクション** — `RegisterIdentityV1`がIDレコードを作成、`SetAgentTokenV1`が既存のIDに[Genesis](/smart-contracts/genesis)トークンをリンク
- **104バイトのアカウント** — `AgentIdentityV2` PDAにはディスクリミネーター、バンプ、アセット公開鍵、オプションのエージェントトークンアドレス、予約領域が格納されます
- **ライフサイクルフック** — プラグインはTransfer、Update、Executeイベントに対してapprove、listen、rejectチェックを登録します
- **決定的PDA** — シード`["agent_identity", <asset_pubkey>]`から導出され、オンチェーンでの簡単な検索が可能です

## プログラムID

| ネットワーク | アドレス |
|---------|---------|
| Mainnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| Devnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## インストラクション: RegisterIdentityV1

PDAを作成し、Transfer、Update、Executeのライフサイクルフック付きの`AgentIdentity`プラグインをMPL Coreアセットにアタッチすることで、エージェントIDを登録します。

### アカウント

| アカウント | 書き込み可能 | 署名者 | オプション | 説明 |
|---------|----------|--------|----------|-------------|
| `agentIdentity` | はい | いいえ | いいえ | 作成されるPDA（アセットから自動導出） |
| `asset` | はい | いいえ | いいえ | 登録するMPL Coreアセット |
| `collection` | はい | いいえ | はい | アセットのコレクション |
| `payer` | はい | はい | いいえ | アカウントレントと手数料を支払う |
| `authority` | いいえ | はい | はい | コレクション権限（デフォルトは`payer`） |
| `mplCoreProgram` | いいえ | いいえ | いいえ | MPL Coreプログラム |
| `systemProgram` | いいえ | いいえ | いいえ | Systemプログラム |

### 引数

| 引数 | 型 | 説明 |
|----------|------|-------------|
| `agentRegistrationUri` | `string` | オフチェーンのエージェント登録メタデータを指すURI |

### RegisterIdentityV1の処理内容

1. シード`["agent_identity", <asset>]`からPDAを導出
2. `AgentIdentityV2`アカウント（104バイト）を作成・初期化
3. MPL CoreにCPIして、指定されたURIを持つ`AgentIdentity`プラグインをアセットにアタッチ
4. **Transfer**、**Update**、**Execute**イベントのライフサイクルチェック（approve、listen、reject）を登録

### ライフサイクルチェック

`AgentIdentity`プラグインは3つのライフサイクルイベントにフックを登録します：

| イベント | Approve | Listen | Reject |
|-------|---------|--------|--------|
| Transfer | はい | はい | はい |
| Update | はい | はい | はい |
| Execute | はい | はい | はい |

これにより、IDプラグインはアセットに対するTransfer、Update、Executeの承認、監視、拒否に参加できます。

## インストラクション: SetAgentTokenV1

既存のエージェントIDに[Genesis](/smart-contracts/genesis)トークンを紐付けます。Genesisアカウントは`Mint`ファンディングモードを使用する必要があります。IDがまだ`AgentIdentityV1`（40バイト）の場合、プログラムは自動的に`AgentIdentityV2`（104バイト）にアップグレードします。

### アカウント

| アカウント | 書き込み可能 | 署名者 | オプション | 説明 |
|---------|----------|--------|----------|-------------|
| `agentIdentity` | はい | いいえ | いいえ | エージェントID PDA（V1またはV2）— アセットから自動導出 |
| `asset` | いいえ | いいえ | いいえ | MPL Coreアセット |
| `genesisAccount` | いいえ | いいえ | いいえ | エージェントのトークンローンチ用Genesisアカウント |
| `payer` | はい | はい | いいえ | 追加レントを支払う（V1からV2へのアップグレード時） |
| `authority` | いいえ | はい | はい | [Asset Signer](/smart-contracts/core/execute-asset-signing) PDAである必要があります（デフォルトは`payer`） |
| `systemProgram` | いいえ | いいえ | いいえ | Systemプログラム |

### SetAgentTokenV1の処理内容

1. エージェントID PDAが存在し、V1またはV2であることを検証
2. Genesisアカウントがジェネシスプログラム（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）によって所有され、`Mint`ファンディングモードを使用していることを検証
3. IDがV1の場合、アカウントを104バイトにリサイズし、ディスクリミネーターをV2にアップグレード
4. Genesisアカウントデータから`base_mint`公開鍵を読み取り
5. `base_mint`をIDの`agent_token`フィールドとして格納

{% callout type="warning" %}
エージェントトークンは一度だけ設定できます。すでに`agent_token`が設定されているIDに対して`SetAgentTokenV1`を呼び出すと、`AgentTokenAlreadySet`エラーで失敗します。
{% /callout %}

{% callout type="note" %}
`authority`はアセットの[Asset Signer](/smart-contracts/core/execute-asset-signing) PDAである必要があります。これはCoreアセットの組み込みウォレットで、アセットの公開鍵から導出されたPDAで秘密鍵はありません。
{% /callout %}

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: assetPublicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

## PDA導出

**シード:** `["agent_identity", <asset_pubkey>]`

V1とV2の両アカウントは同じPDA導出を使用します。SDKは両バージョンのファインダーを提供しています：

```typescript
import {
  findAgentIdentityV2Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV2Pda(umi, { asset: assetPublicKey });
// Returns [publicKey, bump]
```

## アカウント: AgentIdentityV2

104バイト、8バイトアライン、bytemuckによるゼロコピー。これは`RegisterIdentityV1`で作成され、`SetAgentTokenV1`で使用される現行のアカウントバージョンです。

| オフセット | フィールド | 型 | サイズ | 説明 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | アカウントディスクリミネーター（`AgentIdentityV2`） |
| 1 | `bump` | `u8` | 1 | PDAバンプシード |
| 2 | `_padding` | `[u8; 6]` | 6 | アラインメントパディング |
| 8 | `asset` | `Pubkey` | 32 | このIDが紐付けられたMPL Coreアセット |
| 40 | `agentToken` | `OptionalPubkey` | 33 | Genesisトークンミントアドレス（設定済みの場合） |
| 73 | `_reserved` | `[u8; 31]` | 31 | 将来の使用のために予約 |

## アカウント: AgentIdentityV1（レガシー）

40バイト、8バイトアライン。これはレガシーアカウント形式です。既存のV1アカウントは`SetAgentTokenV1`の呼び出し時に自動的にV2にアップグレードされます。

| オフセット | フィールド | 型 | サイズ | 説明 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | アカウントディスクリミネーター（`AgentIdentityV1`） |
| 1 | `bump` | `u8` | 1 | PDAバンプシード |
| 2 | `_padding` | `[u8; 6]` | 6 | アラインメントパディング |
| 8 | `asset` | `Pubkey` | 32 | このIDが紐付けられたMPL Coreアセット |

## アカウントの取得

```typescript
import {
  fetchAgentIdentityV2,
  safeFetchAgentIdentityV2,
  fetchAllAgentIdentityV2,
  getAgentIdentityV2GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const identity = await fetchAgentIdentityV2(umi, pda);

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV2(umi, pda);

// Batch fetch
const identities = await fetchAllAgentIdentityV2(umi, [pda1, pda2]);

// GPA query
const results = await getAgentIdentityV2GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

### レガシーV1フェッチャー

V1フェッチ関数は、V2にアップグレードされていないアカウントに対して引き続き動作します。新しい統合では上記のV2フェッチャーを使用してください。

```typescript
import {
  fetchAgentIdentityV1,
  safeFetchAgentIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1FromSeeds,
  getAgentIdentityV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

const v1Pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV1(umi, v1Pda);

// By seeds
const identity = await fetchAgentIdentityV1FromSeeds(umi, { asset: assetPublicKey });

// GPA query
const results = await getAgentIdentityV1GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

## エラー

| コード | 名前 | 説明 |
|------|------|-------------|
| 0 | `InvalidSystemProgram` | Systemプログラムアカウントが正しくありません |
| 1 | `InvalidInstructionData` | インストラクションデータが不正です |
| 2 | `InvalidAccountData` | PDA導出がアセットと一致しません |
| 3 | `InvalidMplCoreProgram` | MPL Coreプログラムアカウントが正しくありません |
| 4 | `InvalidCoreAsset` | アセットが有効なMPL Coreアセットではありません |
| 5 | `InvalidAgentToken` | エージェントトークンアカウントが無効です |
| 6 | `OnlyAssetSignerCanSetAgentToken` | `SetAgentTokenV1`を呼び出すにはauthorityがAsset Signer PDAである必要があります |
| 7 | `AgentTokenAlreadySet` | このIDにはすでにエージェントトークンが設定されています |
| 8 | `InvalidAgentIdentity` | エージェントIDアカウントが無効か、このプログラムによって所有されていません |
| 9 | `AgentIdentityAlreadyRegistered` | このアセットにはすでに登録済みのIDがあります |
| 10 | `InvalidGenesisAccount` | Genesisアカウントが無効です（オーナー、ディスクリミネーター、またはサイズが不正） |
| 11 | `GenesisNotMintFunded` | Genesisアカウントが`Mint`ファンディングモードを使用していません |

## 注意事項

- `RegisterIdentityV1`は現在`AgentIdentityV2`アカウント（104バイト）を作成します。レガシーV1アカウント（40バイト）は`SetAgentTokenV1`によって自動的にV2にアップグレードされます。
- V2の`agentToken`フィールドは`OptionalPubkey`です。`SetAgentTokenV1`が呼び出されるまで空（`None`）です。
- `_reserved`フィールド（31バイト）はゼロで初期化され、将来の拡張のために予約されています。
- V1とV2の両アカウントは同じPDA導出シード`["agent_identity", <asset_pubkey>]`を共有しています。
