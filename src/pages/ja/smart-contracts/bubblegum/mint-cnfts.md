---
title: 圧縮NFTのミント
metaTitle: 圧縮NFTのミント | Bubblegum
description: Bubblegumで圧縮NFTをミントする方法を学びます。
---
{% callout title="Bubblegum v2" type="note" %}
このページはBubblegum v1に固有です。拡張された機能セットについては、Bubblegum v2の使用をお勧めします。Bubblegum v2を使用している場合は、詳細について[Bubblegum v2](/ja/smart-contracts/bubblegum-v2/mint-cnfts)のドキュメントを参照してください。
{% /callout %}

[前のページ](/ja/smart-contracts/bubblegum/create-trees)では、圧縮NFTをミントするためにBubblegum Treeが必要であり、その作成方法を見てきました。今度は、指定されたBubblegum Treeから圧縮NFTをミントする方法を見てみましょう。 {% .lead %}

BubblegumプログラムはTwo つのミント命令を提供します。1つはNFTをコレクションに関連付けずにミントするもの、もう1つはNFTを指定されたコレクションにミントするものです。後者は単にいくつかの追加パラメータが必要なだけなので、まず前者から見てみましょう。

## コレクションなしでのミント

BubblegumプログラムはBubblegum Treeから圧縮NFTをミントできる**Mint V1**命令を提供します。Bubblegum Treeが公開されている場合、誰でもこの命令を使用できます。そうでない場合は、Tree CreatorまたはTree Delegateのみが使用できます。

Mint V1命令の主要パラメータは以下の通りです：

- **Merkle Tree**: 圧縮NFTがミントされるMerkle Treeのアドレス。
- **Tree Creator Or Delegate**: Bubblegum Treeからのミントを許可された権限 — これはtreeの作成者またはdelegateのいずれかです。この権限はトランザクションに署名する必要があります。パブリックtreeの場合、このパラメータは任意の権限にできますが、それでも署名者である必要があります。
- **Leaf Owner**: ミントされる圧縮NFTの所有者。
- **Leaf Delegate**: ミントされたcNFTを管理することが許可されたdelegate権限（存在する場合）。そうでない場合は、Leaf Ownerに設定されます。
- **Metadata**: ミントされる圧縮NFTのメタデータ。これには、NFTの**名前**、その**URI**、その**コレクション**、その**作成者**などの情報が含まれます。
  - メタデータ内で**Collection**オブジェクトを提供することは可能ですが、Collection Authorityがこの命令で要求されておらず、したがってトランザクションに署名できないため、その**Verified**フィールドは`false`に設定する必要があることに注意してください。
  - また、作成者はミント時にcNFT上で自分自身を検証できることにも注意してください。これを機能させるには、**Creator**オブジェクトの**Verified**フィールドを`true`に設定し、残りのアカウントに作成者をSignerとして追加する必要があります。これは、すべての作成者がトランザクションに署名し、残りのアカウントに追加される限り、複数の作成者に対して実行できます。

{% dialect-switcher title="コレクションなしで圧縮NFTをミント" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi'
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintV1(umi, {
  leafOwner,
  merkleTree,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: none(),
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### ミントトランザクションからのリーフスキーマとアセットIDの取得 {% #get-leaf-schema-from-mint-transaction %}

`parseLeafFromMintV1Transaction`ヘルパーを使用して、`mintV1`トランザクションからリーフを取得し、アセットIDを決定できます。この関数はTransactionを解析するため、`parseLeafFromMintV1Transaction`を呼び出す前にトランザクションが最終化されていることを確認する必要があります。

{% callout type="note" title="トランザクションの最終化" %}
`parseLeafFromMintV1Transaction`を呼び出す前に、トランザクションが最終化されていることを確認してください。
{% /callout %}

{% dialect-switcher title="ミントトランザクションからリーフスキーマを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
    findLeafAssetIdPda,
    mintV1,
    parseLeafFromMintV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";

const { signature } = await mintV1(umi, {
  leafOwner,
  merkleTree,
  metadata,
}).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

const leaf: LeafSchema = await parseLeafFromMintV1Transaction(umi, signature);
const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
// or const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへのミント

圧縮NFTがミントされた_後に_コレクションを設定および検証することは可能ですが、Bubblegumプログラムは圧縮NFTを指定されたコレクションに直接ミントする便利な命令を提供します。BubblegumはMetaplex Token MetadataコレクションNFTを使用して圧縮NFTをグループ化します。この命令は**MintToCollectionV1**と呼ばれ、**MintV1**命令と同じパラメータを使用しますが、以下のパラメータが追加されます：

- **Collection Mint**: 圧縮NFTが属する[Token Metadata Collection NFT](/ja/smart-contracts/token-metadata/collections#creating-collection-nfts)のミントアドレス。
- **Collection Authority**: 指定されたCollection NFTを管理することが許可された権限。これは、Collection NFTのupdate authorityまたは委任されたコレクション権限のいずれかです。Bubblegum Treeが公開されているかどうかに関係なく、この権限はトランザクションに署名する必要があります。
- **Collection Authority Record Pda**: 委任されたコレクション権限を使用する場合、権限がCollection NFTを管理することが許可されていることを確認するために、Delegate Record PDAを提供する必要があります。これは、新しい「Metadata Delegate」PDAまたはレガシーの「Collection Authority Record」PDAのいずれかを使用できます。

さらに、**Metadata**パラメータには次のような**Collection**オブジェクトが含まれている必要があることに注意してください：

- その**Address**フィールドが**Collection Mint**パラメータと一致している。
- その**Verified**フィールドは`true`または`false`のいずれかとして渡すことができます。`false`として渡された場合、トランザクション中に`true`に設定され、cNFTは**Verified**を`true`に設定してミントされます。

また、**Mint V1**命令と同様に、作成者はトランザクションに署名し、残りのアカウントに自分自身を追加することで自分自身を検証できることにも注意してください。

{% dialect-switcher title="圧縮NFTをコレクションにミント" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { none } from '@metaplex-foundation/umi'
import { mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  collectionMint,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionMint, verified: false },
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

デフォルトでは、Collection AuthorityはUmi identityに設定されますが、以下の例に示すようにカスタマイズできます。

```ts
const customCollectionAuthority = generateSigner(umi)
await mintToCollectionV1(umi, {
  // ...
  collectionAuthority: customCollectionAuthority,
})
```

{% totem-accordion title="コレクションNFTの作成" %}

まだコレクションNFTをお持ちでない場合は、`@metaplex-foundation/mpl-token-metadata`ライブラリを使用して作成できます。

```shell
npm install @metaplex-foundation/mpl-token-metadata
```

そして、次のようにコレクションNFTを作成します：

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  isCollection: true,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### mintToCollectionトランザクションからのリーフスキーマとアセットIDの取得 {% #get-leaf-schema-from-mint-to-collection-transaction %}

同様に、`parseLeafFromMintToCollectionV1Transaction`ヘルパーを使用して、`mintToCollectionV1`トランザクションからリーフを取得し、アセットIDを決定できます。

{% callout type="note" title="トランザクションの最終化" %}
`parseLeafFromMintToCollectionV1Transaction`を呼び出す前に、トランザクションが最終化されていることを確認してください。
{% /callout %}

{% dialect-switcher title="mintToCollectionV1トランザクションからリーフスキーマを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
    findLeafAssetIdPda,
    mintV1,
    parseLeafFromMintToCollectionV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";

const { signature } = await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  metadata,
  collectionMint: collectionMint.publicKey,
}).sendAndConfirm(umi);

const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(umi, signature);
const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
// or const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}
