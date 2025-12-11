---
title: コレクション内のミントの取得
metaTitle: コレクション内のミントの取得 | Token Metadataガイド
description: コレクション内のすべてのミントを取得するためのハウツーガイド
---

Metaplex Token Metadataには[オンチェーンコレクション](/ja/token-metadata/collections)があり、オンチェーン標準の不在において、コミュニティが使用する様々な主観的で潜在的に競合するヒューリスティックではなく、NFTコレクションを客観的に識別できます。

仕様設計により、任意のNFTを調べて、それがコレクションに属しているか、どのコレクションに属しているかを、metadataアカウントからCollectionフィールドを単純に読み取ることで非常に簡単に決定できます。オンチェーンの`Metadata`構造体には、オプションの`Collection`構造体が含まれ、これには属しているコレクションのSPLトークンミントの公開鍵である`key`フィールドがあります。

```rust
pub struct Metadata {
	pub key: Key,
	pub update_authority: Pubkey,
	pub mint: Pubkey,
	pub data: Data,
	// 不変、一度フリップされると、このメタデータのすべての販売はセカンダリとみなされます。
	pub primary_sale_happened: bool,
	// データ構造体が変更可能かどうか、デフォルトは不可
	pub is_mutable: bool,
	/// エディションの簡単な計算のためのnonce（存在する場合）
	pub edition_nonce: Option<u8>,
	/// Token Standardは決定論的で、create master edition呼び出しを行い、
	/// それが成功した場合、SemiFungibleからNonFungibleに変更されます。
	pub token_standard: Option<TokenStandard>,
	/// Metadataを簡単に変更できないため、新しいDataV2フィールドをここの最後に追加します。
	/// Collection
	pub collection: Option<Collection>,
...
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct Collection {
	pub verified: bool, // コレクションが検証されているかどうか
	pub key: Pubkey,    // コレクションNFTのSPLトークンミントアカウント
}
```

しかし、コレクションミントアドレスが与えられた場合、その特定のコレクションに属するすべてのNFTを見つけることは、チェーンから直接読み取る場合、はるかに困難です。[DAS](/ja/das-api)を使用する1つの優れた方法と、チェーンから直接データを取得する2つの基本的なアプローチがあります。

## DAS API
[DASをサポートするRPCプロバイダー](/ja/rpc-providers#metaplex-das-api)を使用する場合、DASを使用してミントを取得することが優れた方法です。

{% dialect-switcher title="getAssetByGroup Example" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

`endpoint`をあなたのRPC URLに、`collection`を探しているコレクションアドレスに置き換えてください。

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const endpoint = '<ENDPOINT>';
const collection = 'J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p'

const umi = createUmi(endpoint).use(dasApi());

const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: collection,
});
console.log(assets.items.length > 0);
```

{% /totem %}
{% /dialect %}
{% dialect title="cURL" id="curl" %}
{% totem %}

シェルでこのコマンドを実行してください。`<ENDPOINT>`と`<GROUPVALUE>`を必ず置き換えてください。

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByGroup",
    "params": {
        "groupKey": "collection",
        "groupValue": "<GROUPVALUE>",
        "page": 1,
        "limit": 10
    },
    "id": 1
}'
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## チェーンから直接取得

DAS APIが利用できない場合、チェーンから直接データを取得する2つの主要な方法があります：

### 方法1: getProgramAccountsを使用

```js
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const collectionMint = new PublicKey('COLLECTION_MINT_ADDRESS');

// Token Metadataプログラムアカウントを取得
const metadataProgramId = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

const accounts = await connection.getProgramAccounts(metadataProgramId, {
    filters: [
        {
            memcmp: {
                offset: 326, // コレクションフィールドのオフセット
                bytes: collectionMint.toBase58(),
            },
        },
    ],
});

console.log(`コレクション内で見つかったNFT: ${accounts.length}個`);
```

### 方法2: トランザクション履歴をクロール

```js
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const collectionMint = new PublicKey('COLLECTION_MINT_ADDRESS');

// コレクションミントのすべてのトランザクション署名を取得
const signatures = await connection.getSignaturesForAddress(collectionMint);

// 各トランザクションを解析してVerifyCollection命令を見つける
const collectionNfts = [];

for (const sig of signatures) {
    const tx = await connection.getTransaction(sig.signature);
    // トランザクションデータを解析してVerifyCollection命令を見つける
    // これは複雑な解析が必要です
}
```

## 推奨アプローチ

1. **DAS API（推奨）**: 最も効率的で使いやすい
2. **getProgramAccounts**: シンプルですが、大きなコレクションではRPC制限に達する可能性
3. **トランザクション履歴**: 最も複雑ですが、すべてのRPCで動作

ほとんどの使用例では、DAS APIを使用することを強く推奨します。これは最も信頼性が高く、効率的で、使いやすい方法です。