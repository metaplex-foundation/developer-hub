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
  - q: What is Bubblegum V2?
    a: Bubblegum V2 is the latest iteration of Metaplex's program for compressed NFTs on Solana, adding freeze/thaw, soulbound NFTs, MPL-Core collections, and royalty enforcement.
  - q: How do I find the arguments needed for transfer, delegate, burn, etc.?
    a: Use the getAssetWithProof helper which fetches all required parameters (proof, leaf index, nonce, etc.) from the DAS API automatically.
  - q: How do I resolve Transaction too large errors?
    a: Use truncateCanopy true with getAssetWithProof, or implement versioned transactions with Address Lookup Tables.
  - q: How much does it cost to create a compressed NFT tree?
    a: Costs vary by tree size. A 16,384-cNFT tree costs ~0.34 SOL, while a 1 million-cNFT tree costs ~8.5 SOL in rent.
  - q: What is the difference between Bubblegum V1 and V2?
    a: V2 adds freeze/thaw, soulbound NFTs, MPL-Core collections, royalty enforcement, permanent delegates, and LeafSchemaV2.
  - q: Do I need a special RPC provider?
    a: Yes. You need an RPC that supports the Metaplex DAS API to fetch and index compressed NFTs.
  - q: Can I decompress a cNFT back to a regular NFT?
    a: Decompression is only available for Bubblegum V1 assets. V2 does not support decompression.
  - q: How many cNFTs can I store in one tree?
    a: The maximum is 2^maxDepth. A depth-30 tree can hold over 1 billion cNFTs, though larger trees cost more in rent.
---

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
