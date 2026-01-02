---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis
description: Solanaでのトークンローンチ用Genesis JavaScript SDKのインストールと設定方法を学びます。
---

MetaplexはGenesisプログラムと対話するためのJavaScriptライブラリを提供しています。[Umi Framework](/umi)上に構築されており、あらゆるJavaScriptまたはTypeScriptプロジェクトで使用できる軽量ライブラリです。

{% quick-links %}

{% quick-link title="APIリファレンス" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="Genesis JavaScript SDK自動生成APIドキュメント。" /%}

{% quick-link title="NPMパッケージ" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="NPMのGenesis JavaScript SDK。" /%}

{% quick-link title="GitHub" target="_blank" icon="GitHub" href="https://github.com/metaplex-foundation/genesis" description="GenesisプログラムとSDKのソースコード。" /%}

{% /quick-links %}

## インストール

Genesis SDKと必要なMetaplexおよびSolanaの依存関係をインストールします：

```bash
npm install \
  @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

### パッケージ概要

| パッケージ | 目的 |
|---------|---------|
| `@metaplex-foundation/genesis` | すべてのインストラクションとヘルパーを含むコアGenesis SDK |
| `@metaplex-foundation/umi` | トランザクション構築のためのMetaplexのSolanaフレームワーク |
| `@metaplex-foundation/umi-bundle-defaults` | デフォルトのUmiプラグインと設定 |
| `@metaplex-foundation/mpl-toolbox` | SPLトークン操作のためのユーティリティ |
| `@metaplex-foundation/mpl-token-metadata` | トークンメタデータプログラム統合 |

## Umiセットアップ

Genesis SDKは、MetaplexのSolana用JavaScriptフレームワークである[Umi](/ja/dev-tools/umi)上に構築されています。Umiをまだセットアップしていない場合は、[Umiはじめに](/ja/dev-tools/umi/getting-started)ガイドを確認してください。

### 基本設定

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Umiインスタンスを作成して設定
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

`genesis()`プラグインはすべてのGenesisインストラクションとアカウントデシリアライザーをUmiに登録します。Genesisはメタデータ付きのトークンを作成するため、`mplTokenMetadata()`プラグインが必要です。

### 開発 vs 本番

```typescript
// 開発：devnetを使用
const umi = createUmi('https://api.devnet.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());

// 本番：信頼できるRPCでmainnetを使用
const umi = createUmi('https://your-rpc-provider.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

## サイナーのセットアップ

Genesis操作にはトランザクション承認のためのサイナーが必要です。バックエンド操作では、通常は環境変数からロードしたキーペアを使用します。

### 秘密鍵からサイナーを作成

```typescript
import {
  createSignerFromKeypair,
  signerIdentity,
  type Signer,
  type Umi,
} from '@metaplex-foundation/umi';

// JSONエンコードされた秘密鍵からサイナーを作成するヘルパー
const createSignerFromSecretKeyString = (
  umi: Umi,
  secretKeyString: string
): Signer => {
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return createSignerFromKeypair(umi, keypair);
};

// 環境からバックエンドサイナーをロード
const backendSigner = createSignerFromSecretKeyString(
  umi,
  process.env.BACKEND_KEYPAIR!
);

// トランザクションのデフォルトアイデンティティとして設定
umi.use(signerIdentity(backendSigner));
```

{% callout type="warning" %}
**セキュリティに関する注意**：キーペアをバージョン管理にコミットしないでください。本番デプロイメントには環境変数、AWS KMS、GCP Secret Manager、またはハードウェアウォレットを使用してください。
{% /callout %}

### 完全なセットアップ例

必要なすべてのimportを含む完全なセットアップ：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
  publicKey,
  type Signer,
  type Umi,
} from '@metaplex-foundation/umi';
import {
  genesis,
  initializeV2,
  addLaunchPoolBucketV2,
  addUnlockedBucketV2,
  finalizeV2,
  findGenesisAccountV2Pda,
} from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Umiを初期化
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());

// バックエンドサイナーをセットアップ
const createSignerFromSecretKeyString = (umi: Umi, secretKeyString: string): Signer => {
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return createSignerFromKeypair(umi, keypair);
};

const backendSigner = createSignerFromSecretKeyString(umi, process.env.BACKEND_KEYPAIR!);
umi.use(signerIdentity(backendSigner));

console.log('バックエンドサイナーでUmiを設定:', backendSigner.publicKey);
```

## エラー処理

```typescript
try {
  await initializeV2(umi, { ... }).sendAndConfirm(umi);
  console.log('成功！');
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    console.error('トランザクション手数料用のSOLが不足しています');
  } else if (error.message.includes('already initialized')) {
    console.error('Genesisアカウントは既に存在します');
  } else {
    console.error('トランザクション失敗:', error);
  }
}
```

## トランザクション確認

```typescript
// finalized確認を待機（最も安全）
const result = await initializeV2(umi, { ... })
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' }
  });

console.log('トランザクション署名:', result.signature);
```

## 次のステップ

GenesisプログラムでUmiインスタンスが設定されたら、構築を開始する準備ができました。Genesis機能を探索してください：

- **[Launch Pool](/ja/smart-contracts/genesis/launch-pool)** - 預金期間付きのトークン配布
- **[Priced Sale](/ja/smart-contracts/genesis/priced-sale)** - 取引前の事前預金収集
- **[Uniform Price Auction](/ja/smart-contracts/genesis/uniform-price-auction)** - 均一クリアリング価格の時間ベースオークション
