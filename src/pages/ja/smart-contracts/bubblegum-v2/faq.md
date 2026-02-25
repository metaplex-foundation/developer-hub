---
title: FAQ
metaTitle: FAQ - Bubblegum V2
description: Bubblegumに関するよくある質問。
created: '01-15-2025'
updated: '02-24-2026'
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
    a: getAssetWithProofでtruncateCanopy: trueを使用するか、アドレスルックアップテーブルを使用したバージョン化トランザクションを実装します。
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
---

## Summary

このページはBubblegum V2の圧縮NFTに関する最も一般的な質問に答えています。

- `getAssetWithProof`を使用してリーフを変更する命令の必須パラメータを取得する
- `truncateCanopy`またはアドレスルックアップテーブルで「トランザクションが大きすぎる」エラーを解決する
- ツリーを作成する前にツリーのコストと容量を理解する
- Bubblegum V2はV1ツリーや圧縮解除との後方互換性はない

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
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, 
// {  truncateCanopy: true } // 証明を剪定するためのオプション 
);
await transferV2(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // 署名者として。
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi);

await transferV2(umi, {
  ...assetWithProof,
