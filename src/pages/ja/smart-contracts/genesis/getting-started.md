---
title: はじめに
metaTitle: Genesis - はじめに
description: Genesisを使用してSolanaでトークンをローンチする基本を学びます。
---

このガイドでは、Genesisでトークンをローンチするためのコアコンセプトとワークフローを紹介します。Genesisアカウントの初期化、バケットシステムの理解、ローンチ構成の確定方法を学びます。

## 前提条件

開始する前に、以下を準備してください：
- Node.js 16+がインストール済み
- トランザクション手数料用のSOLを持つSolanaウォレット
- Genesis SDKのインストールと設定完了（[JavaScript SDK](/ja/smart-contracts/genesis/sdk/javascript)を参照）

## Genesisローンチフロー

すべてのGenesisトークンローンチは同じ基本フローに従います：

```
1. Genesisアカウントの初期化
   └── トークンとマスター調整アカウントを作成

2. バケットの追加
   └── トークン配布方法を設定（ローンチタイプ）

3. 確定
   └── 構成をロックしてローンチを有効化

4. アクティブ期間
   └── バケット構成に基づいてユーザーが参加

5. トランジション
   └── 終了動作を実行（例：アウトフローバケットへの資金送信）
```

## ステップ1：Genesisアカウントの初期化

Genesisアカウントはトークンローンチの基盤です。初期化時に以下が作成されます：
- メタデータ付きの新しいSPLトークン
- すべての配布バケットを調整するマスターアカウント
- エスクローに保持された総トークン供給量

```typescript
import {
  findGenesisAccountV2Pda,
  initializeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

// トークン用の新しいミントキーペアを生成
const baseMint = generateSigner(umi);

// wSOLが標準のクォートトークン
const WSOL_MINT = publicKey('So11111111111111111111111111111111111111112');

// GenesisアカウントPDAを導出
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint: baseMint.publicKey,
  genesisIndex: 0,  // 最初のキャンペーンには0を使用
});

// Genesisアカウントを初期化
await initializeV2(umi, {
  baseMint,
  quoteMint: WSOL_MINT,
  fundingMode: 0,
  totalSupplyBaseToken: 1_000_000_000_000_000n,  // 100万トークン（9デシマル）
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi);

console.log('Genesisアカウント作成:', genesisAccount);
console.log('トークンミント:', baseMint.publicKey);
```

### トークン供給量の理解

`totalSupplyBaseToken`を指定する際は、デシマルを考慮してください。SPLトークンは通常9デシマルを使用します：

```typescript
const ONE_TOKEN = 1_000_000_000n;           // 1トークン
const ONE_MILLION = 1_000_000_000_000_000n; // 1,000,000トークン
const ONE_BILLION = 1_000_000_000_000_000_000n; // 1,000,000,000トークン
```

{% callout type="note" %}
`totalSupplyBaseToken`はすべてのバケット割り当ての合計と等しくなければなりません。初期化前にバケット全体でのトークン配布を計画してください。
{% /callout %}

## ステップ2：バケットの追加

バケットはローンチ中のトークンフローを定義するモジュラーコンポーネントです。2つのカテゴリがあります：

### インフローバケット
ユーザーからクォートトークン（SOL）を収集します：

| バケットタイプ | ユースケース |
|-------------|----------|
| **Launch Pool** | 比例配分付きの預金期間 |
| **Presale** | 固定価格トークン販売 |

### アウトフローバケット
終了動作を通じてトークンまたはクォートトークンを受け取ります：

| バケットタイプ | ユースケース |
|-------------|----------|
| **Unlocked Bucket** | チーム/財務の請求用に資金を受け取る |

### ローンチタイプの選択

{% callout type="note" %}
**[Launch Pool](/ja/smart-contracts/genesis/launch-pool)** - ユーザーが期間中に預金し、総預金額に対する比率に応じてトークンを受け取ります。
{% /callout %}

{% callout type="note" %}
**[Presale](/ja/smart-contracts/genesis/presale)** - 固定価格トークン販売。ユーザーがSOLを預金し、事前に決められたレートでトークンを受け取ります。
{% /callout %}

## ステップ3：確定

すべてのバケットが設定されたら、Genesisアカウントを確定して構成をロックします：

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
}).sendAndConfirm(umi);

console.log('Genesisアカウント確定！');
```

### 確定の意味

確定後：
- バケットの追加不可
- バケット構成がロック
- 時間条件に基づいてローンチがアクティブ化
- ユーザーが参加を開始可能

{% callout type="warning" %}
**確定は不可逆です。** 確定する前に、すべてのバケット構成、時間条件、トークン割り当てを再確認してください。
{% /callout %}

## 次のステップ

ローンチタイプを選択し、詳細ガイドに従ってください：

1. **[Launch Pool](/ja/smart-contracts/genesis/launch-pool)** - 預金期間付きのトークン配布
2. **[Presale](/ja/smart-contracts/genesis/presale)** - 固定価格トークン販売
3. **[Uniform Price Auction](/ja/smart-contracts/genesis/uniform-price-auction)** - 均一クリアリング価格の時間ベースオークション

各ガイドには完全なセットアップコード、ユーザー操作、構成が含まれています。
