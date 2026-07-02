---
title: FAQ
metaTitle: FAQ - Bubblegum V2
description: Bubblegumに関するよくある質問。
created: '01-15-2025'
updated: '06-19-2026'
keywords:
  - Bubblegum FAQ
  - compressed NFT questions
  - cNFT cost
  - troubleshooting
  - transaction too large
  - getAssetWithProof
about:
  - Compressed NFTs
  - Troubleshooting
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Bubblegum V2とは何ですか？
    a: Bubblegum V2は、SolanaでのMetaplexの圧縮NFTプログラムの最新バージョンで、フリーズ/解凍、ソウルバウンドNFT、MPL-Coreコレクション、ロイヤリティ強制が追加されています。
  - q: 転送、デリゲート、バーンなどに必要な引数はどのように見つけますか？
    a: DAS APIから必要なすべてのパラメータ（証明、リーフインデックス、ノンスなど）を自動的に取得するgetAssetWithProofヘルパーを使用します。
  - q: 「トランザクションが大きすぎる」エラーを解決するにはどうすればよいですか？
    a: "getAssetWithProofでtruncateCanopy: trueを使用するか、アドレスルックアップテーブルを使用したバージョン化トランザクションを実装します。"
  - q: 圧縮NFTツリーの作成にはいくらかかりますか？
    a: コストはツリーのサイズによって異なります。16,384個のcNFTのツリーは約0.34 SOL、100万個のcNFTのツリーはレントで約8.5 SOLかかります。
  - q: Bubblegum V1とV2の違いは何ですか？
    a: V2はフリーズ/解凍、ソウルバウンドNFT、MPL-Coreコレクション、ロイヤリティ強制、パーマネントデリゲート、LeafSchemaV2を追加します。
  - q: 特別なRPCプロバイダーが必要ですか？
    a: はい。圧縮NFTを取得およびインデックスするには、Metaplex DAS APIをサポートするRPCが必要です。
  - q: cNFTを通常のNFTに解凍できますか？
    a: 解凍はBubblegum V1アセットのみで利用できます。V2は解凍をサポートしていません。
  - q: 1つのツリーにcNFTをいくつ保存できますか？
    a: 最大数は2^maxDepthです。深度30のツリーは10億を超えるcNFTを保持できますが、大きなツリーほどレントのコストが高くなります。
  - q: cNFTはMPL-Coreコレクションからロイヤリティを継承できますか？
    a: はい。Royaltiesプラグインを持つコレクションにミントする場合、sellerFeeBasisPointsを省略します。リーフには継承センチネル（65535）が保存され、表示時にコレクションからロイヤリティが解決されます。書き込み命令にはgetAssetWithProofのcurrentMetadataを使用してください。
---

## Summary

このページはBubblegum V2の圧縮NFTに関する最も一般的な質問に答えています。

- `getAssetWithProof`を使用してリーフを変更する命令の必須パラメータを取得する
- `truncateCanopy`またはアドレスルックアップテーブルで「トランザクションが大きすぎる」エラーを解決する
- ツリーを作成する前にツリーのコストと容量を理解する
- Bubblegum V2はV1ツリーや圧縮解除との後方互換性はない
- cNFTはMPL-CoreコレクションのRoyaltiesプラグインからセラーフィーベーシスポイントを継承できる

## Bubblegum V2とは何ですか？

Bubblegum V2は、いくつかの改良と新機能を導入するBubblegumプログラムの新しい反復です。
これは既知のBubblegumプログラムの一部ですが、命令とデータ構造は異なります。
Bubblegum V2では、cNFTはMetaplex Token Metadataコレクションの代わりにMPL-Coreコレクションを使用してコレクションにグループ化されます。また、凍結、解凍、ソウルバウンドNFTなどの新機能と以下のような追加機能も導入しています：
- **凍結・解凍機能**: プロジェクト作成者は、特定のイベント中の転送を防ぐことや権利確定メカニズムの実装など、さまざまなユースケースでアセットをより詳細に制御するためにcNFTを凍結・解凍できるようになりました。
- **MPL-Coreコレクション統合**: Bubblegum V2 NFTは、トークンメタデータコレクションに限定されることなく、MPL-Coreコレクションに追加できるようになり、より大きなMetaplexエコシステムとの柔軟性と統合を可能にします。
- **ロイヤリティ強制**: Bubblegum V2は[MPL-Core](/ja/smart-contracts/core)コレクションを使用しているため、`ProgramDenyList`などを使用してcNFTにロイヤリティを強制することが可能です。
- **ソウルバウンドNFT**: cNFTをソウルバウンド（転送不可）にすることが可能になり、所有者のウォレットに永続的に紐づけられます。これは資格、出席証明、身元確認などに最適です。コレクションで`PermanentFreezeDelegate`プラグインを有効にする必要があります。
- **永続転送の許可**: コレクションで`PermanentTransferDelegate`プラグインが有効になっている場合、永続転送デリゲートはリーフ所有者の相互作用なしにcNFTを新しい所有者に転送できます。

## 転送、デリゲート、バーンなどの操作に必要な引数はどのように見つけますか？ {% #replace-leaf-instruction-arguments %}

転送、デリゲート、バーンなどのBubblegumツリー内のリーフを置き換える命令を使用するたびに、プログラムは現在のリーフが有効で更新できることを確認するために使用される多くのパラメータを必要とします。これは、圧縮NFTのデータがオンチェーンアカウント内で利用できないため、プログラムがピースを埋めるために**証明**、**リーフインデックス**、**ノンス**などの追加パラメータが必要だからです。

すべての情報は、`getAsset`と`getAssetProof`の両方のRPCメソッドを使用して**Metaplex DAS API**から取得できます。ただし、これらのメソッドからのRPCレスポンスと命令で期待されるパラメータは全く同じではなく、一方から他方への解析は簡単ではありません。

幸いなことに、私たちのSDKは、以下のコード例で見ることができるように、すべての重い作業を行うヘルパーメソッドを提供します。圧縮NFTのアセットIDを受け入れ、バーン、転送、更新などのリーフを置き換える命令に直接注入できる多くのパラメータを返します。

とはいえ、その解析を自分で行う必要がある場合のために、命令で期待されるパラメータとMetaplex DAS APIからそれらを取得する方法の簡単な内訳を以下に示します。ここでは、`getAsset`と`getAssetProof` RPCメソッドの結果が、それぞれ`rpcAsset`と`rpcAssetProof`変数を介してアクセス可能であると仮定します。

- **リーフ所有者**: `rpcAsset.ownership.owner`を介してアクセス可能。
- **リーフデリゲート**: `rpcAsset.ownership.delegate`を介してアクセス可能で、nullの場合は`rpcAsset.ownership.owner`にデフォルト設定する必要があります。
- **マークルツリー**: `rpcAsset.compression.tree`または`rpcAssetProof.tree_id`を介してアクセス可能。
- **ルート**: `rpcAssetProof.root`を介してアクセス可能。
- **データハッシュ**: `rpcAsset.compression.data_hash`を介してアクセス可能。
- **作成者ハッシュ**: `rpcAsset.compression.creator_hash`を介してアクセス可能。
- **ノンス**: `rpcAsset.compression.leaf_id`を介してアクセス可能。
- **インデックス**: `rpcAssetProof.node_index - 2^max_depth`を介してアクセス可能。ここで`max_depth`はツリーの最大深度で、`rpcAssetProof.proof`配列の長さから推測できます。
- **証明**: `rpcAssetProof.proof`を介してアクセス可能。
- **メタデータ**: 現在、`rpcAsset`レスポンス内のさまざまなフィールドから再構築する必要があります。

{% dialect-switcher title="リーフを置き換える命令のパラメータを取得" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Bubblegum UmiライブラリはPATHの説明に適合する`getAssetWithProof`ヘルパーメソッドを提供します。以下は`transfer`命令を使用した使用例です。この場合、`leafOwner`パラメータをSignerである必要があり、`assetWithProof`は所有者をPublic Keyとして提供するため、オーバーライドしています。

キャノピーサイズによっては、`getAssetWithProof`ヘルパーの`truncateCanopy: true`パラメータを使用することが意味がある場合があります。これによりツリー設定を取得し、不要な証明を切り捨てます。これはトランザクションサイズが大きくなりすぎる場合に役立ちます。

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, 
// {  truncateCanopy: true } // 証明を剪定するためのオプション 
);
await transferV2(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // 署名者として。
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi);
```

{% totem-accordion title="ヘルパー関数なしでパラメータを取得" %}

完成度のために、提供されたヘルパー関数を使用せずに同じ結果を得る方法は次のとおりです。

```ts
import { publicKeyBytes } from '@metaplex-foundation/umi'
import { transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const rpcAsset = await umi.rpc.getAsset(assetId)
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)

await transferV2(umi, {
  leafOwner: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
  merkleTree: rpcAssetProof.tree_id,
  root: publicKeyBytes(rpcAssetProof.root),
  dataHash: publicKeyBytes(rpcAsset.compression.data_hash),
  creatorHash: publicKeyBytes(rpcAsset.compression.creator_hash),
  nonce: rpcAsset.compression.leaf_id,
  index: rpcAssetProof.node_index - 2 ** rpcAssetProof.proof.length,
  proof: rpcAssetProof.proof,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 「トランザクションが大きすぎる」エラーを解決する方法 {% #transaction-size %}

転送やバーンなどのリーフ置換操作を行う際、「トランザクションが大きすぎる」エラーが発生することがあります。解決するには次の方法を検討してください：

1. `truncateCanopy` オプションを使用する：
   `getAssetWithProof` 関数に `{ truncateCanopy: true }` を渡します：

   ```ts
   const assetWithProof = await getAssetWithProof(umi, assetId, 
    { truncateCanopy: true }
   );
   ```

   このオプションはマークルツリー設定を取得し、キャノピーに基づいて不要な証明を削除して `assetWithProof` を最適化します。追加のRPC呼び出しが発生しますが、トランザクションサイズを大幅に削減します。

2. バージョン管理トランザクションとアドレスルックアップテーブルを使用する：
   別のアプローチとして、[バージョン管理トランザクションとアドレスルックアップテーブル](/ja/dev-tools/umi/toolbox/address-lookup-table)を実装できます。

これらの手法を適用することで、トランザクションサイズ制限を克服し、操作を正常に実行できます。

## 1つのツリーにcNFTをいくつ保存できますか？ {% #tree-capacity %}

cNFTの最大数は `2^maxDepth` です。深度14のツリーは16,384個、深度20は約100万個、深度24は約1,600万個、深度30は10億を超えるcNFTを保持できます。すべてのオプションについては[ツリー容量表](/ja/smart-contracts/bubblegum-v2/create-trees)を参照してください。

## cNFTはMPL-Coreコレクションからロイヤリティを継承できますか？ {% #inherited-royalties %}

はい。`Royalties` プラグインを持つMPL-Coreコレクションにミントする場合、`metadata.sellerFeeBasisPoints` を省略（または `SELLER_FEE_BASIS_POINTS_INHERIT`、`65535` を渡す）できます。リーフにはそのセンチネルがオンチェーンに保存され、マーケットプレイスとインデクサーは表示時にコレクションから実効ロイヤリティを解決します。

**要件:**

- コレクションには `BubblegumV2` と `Royalties` の両方のプラグインが必要です。
- 継承されたセラーフィーを使用する場合、`metadata.creators` は空の配列である必要があります。

**よくある落とし穴 — `metadata` と `currentMetadata`:**

`getAssetWithProof` は、継承されたcNFTについてロイヤリティ関連の2つの形状を返す場合があります：

- **`metadata`** — 表示用の値。`sellerFeeBasisPoints` は解決されたコレクションのパーセンテージを示すことがあります。
- **`currentMetadata`** — リーフ検証用の正規オンチェーンメタデータ。継承センチネル（`65535`）を保持します。

`updateMetadataV2` や `setCollectionV2` などの書き込み命令には、常に `currentMetadata` を渡してください。Bubblegum Umiライブラリを使用している場合、正しいメタデータが自動的に渡されます。

**コレクション管理:**

- 継承されたセラーフィーを持つcNFTは、明示的な `sellerFeeBasisPoints` に更新するまでコレクションから**削除できません**。
- 移行先に `Royalties` プラグインがある場合、別のコレクションへの移動は許可されます。

詳細な例については、[ミント — ロイヤリティの継承](/ja/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)、[cNFTの更新](/ja/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)、[コレクションの管理](/ja/smart-contracts/bubblegum-v2/collections#inherited-royalties)を参照してください。
