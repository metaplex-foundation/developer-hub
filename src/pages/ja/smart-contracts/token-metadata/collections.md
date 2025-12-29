---
title: 検証済みコレクション
metaTitle: 検証済みコレクション | Token Metadata
description: Token Metadataでアセットをコレクションに安全にラップする方法を学習します
---

検証済みコレクションにより、NFT（および一般的なトークン）を**グループ化**し、その情報を**オンチェーンで検証**することができます。さらに、コレクション用のデータをオンチェーンに割り当てることで、これらのコレクションの管理を容易にします。 {% .lead %}

この機能は以下の利点を提供します：

- 追加のオンチェーン呼び出しを行うことなく、任意のNFTがどのコレクションに属しているかを簡単に識別できます。
- 特定のコレクションに属するすべてのNFTを見つけることが可能です（[方法についてはガイドをご覧ください](/ja/smart-contracts/token-metadata/guides/get-by-collection)）。
- コレクションのメタデータ（名前、説明、画像など）を簡単に管理できます。

## コレクションはNFTです

NFT（または任意のトークン）をグループ化するには、まず、そのコレクションに関連するメタデータを保存することが目的のCollection NFTを作成する必要があります。そうです、**NFTのコレクションは、それ自体がNFT**なのです。オンチェーンでは他のNFTと同じデータレイアウトを持っています。

Collection NFTと通常のNFTの違いは、前者によって提供される情報は含まれるNFTのグループを定義するために使用されるのに対し、後者はNFT自体を定義するために使用されることです。

## Collection NFTへのNFTの関連付け

Collection NFTと通常のNFTは、Metadataアカウントの**「Belong To」関係を使用してリンク**されます。Metadataアカウントのオプションの`Collection`フィールドがその目的のために作成されています。

- `Collection`フィールドが`None`に設定されている場合、そのNFTはコレクションの一部ではありません。
- `Collection`フィールドが設定されている場合、そのNFTはそのフィールド内で指定されたコレクションの一部です。

そのため、`Collection`フィールドには2つのネストされたフィールドが含まれています：

- `Key`: このフィールドは、NFTが属するCollection NFTを指します。より正確には、Collection NFTの**Mintアカウントの公開鍵**を指します。このMintアカウントはSPL Tokenプログラムによって所有されている必要があります。
- `Verified`: このブール値は、NFTが指すコレクションの真の一部であることを確認するために使用されるため、非常に重要です。詳細は後述します。

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-180 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
Collection NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-180 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
通常のNFT {% .font-bold %}

コレクションに付加
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-180 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
通常のNFT {% .font-bold %}

コレクション無し
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}

{% /diagram %}

## NFTとCollection NFTの区別

`Collection`フィールドだけでは、NFTとコレクションをリンクすることはできますが、特定のNFTが通常のNFTかCollection NFTかを識別するのに役立ちません。そのため、`CollectionDetails`フィールドが作成されました。これはCollection NFTに追加のコンテキストを提供し、通常のNFTと区別します。

- `CollectionDetails`フィールドが`None`に設定されている場合、そのNFTは**通常のNFT**です。
- `CollectionDetails`フィールドが設定されている場合、そのNFTは**Collection NFT**であり、このフィールド内に追加の属性を見つけることができます。

`CollectionDetails`は、現在`V1`オプションのみを含むオプションの列挙型です。このオプションは以下のフィールドを含む構造体です：

- `Size`: コレクションのサイズ、すなわち、このCollection NFTに直接リンクされているNFTの数です。この数はToken Metadataプログラムによって自動的に計算されますが、移行プロセスを促進するために手動で設定することもできます。なお、[この`Size`属性を非推奨にするMIPが現在実施されています](https://github.com/metaplex-foundation/mip/blob/main/mip-3.md)。

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node theme="orange" z=1 %}
CollectionDetails = **Some**
{% /node %}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
Collection NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
通常のNFT {% .font-bold %}

コレクションに付加
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
通常のNFT {% .font-bold %}

コレクション無し
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}

{% /diagram %}

## Collection NFTの作成

Collection NFTの作成は、通常のNFTの作成と非常に似ています。唯一の違いは、前のセクションで見た通り、`CollectionDetails`フィールドを設定する必要があることです。一部のSDKでは、NFTを作成する際に`isCollection`属性を要求することでこれをカプセル化しています。

{% dialect-switcher title="Create a Collection NFT" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}
{% /dialect-switcher %}

## ネストされたCollection NFT

コレクションとNFTが「Belong To」関係を通じてリンクされているため、設計上、ネストされたコレクションを定義することが可能です。このシナリオでは、`Collection`と`CollectionDetails`フィールドを組み合わせて使用して、ルートコレクションNFTとネストされたCollection NFTを区別できます。

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node label="CollectionDetails = Some" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-1" x=-10 y=-40 theme="transparent" %}
Collection NFT {% .font-bold %}

ルートコレクション
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = Some" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
Collection NFT {% .font-bold %}

ネストされたコレクション
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-3-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
通常のNFT {% .font-bold %}

コレクションに付加
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}
{% edge from="metadata-3-collection" to="mint-2" theme="orange" /%}

{% /diagram %}

## Collection NFTの検証

上記で述べたように、`Collection`フィールドには、**NFTが指すコレクションの真の一部であるかを判断する**ために使用される`Verified`ブール値が含まれています。このフィールドがなければ、誰でも自分のNFTが任意のコレクションの一部であると偽ることができます。

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node theme="orange" z=1 %}
CollectionDetails = **Some**
{% /node %}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
Collection NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="mint" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-55 theme="transparent" %}
検証済みNFT {% .font-bold .text-emerald-600 %}

Collection NFTがこのNFTを検証したため、\
確実にその一部であることがわかります。
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-3-collection theme="red" z=1 %}
Collection

\- Key \
\- Verified = **False**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-55 theme="transparent" %}
未検証NFT {% .font-bold .text-red-500 %}

これは誰かのNFTがこのコレクションの\
一部であると偽装している可能性があります。
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="mint" /%}
{% edge from="metadata-3-collection" to="mint-1" theme="red" path="straight" /%}

{% /diagram %}

`Verified`ブール値を`True`に変更するには、Collection NFTのAuthorityがNFTに署名して、それがコレクションの一部になることが許可されていることを証明する必要があります。

{% callout title="極めて重要" type="warning" %}

エクスプローラー、ウォレット、マーケットプレイスは、`Verified`が`true`であることを**必ずチェックしなければなりません**。Verifiedがtrueに設定されるのは、Collection NFTのAuthorityがNFTに対してToken MetadataのVerify命令の1つを実行した場合のみです。

これは`Creators`フィールドと同じパターンで、NFTを検証するには`Verified`がtrueである必要があります。

NFTでコレクションが有効かをチェックするには、以下が設定されたコレクション構造体が**必要**です：

- 適切なコレクション親のmintアドレスと一致する`key`フィールド。
- `true`に設定された`verified`フィールド。

これらの2つのステップに従わない場合、実際のコレクションで詐欺的なNFTを露出させる可能性があります。
{% /callout %}

### 検証

NFTに`Collection`属性が設定されると、Collection NFTの権限がToken Metadataに**Verify**命令を送信して、その`verify`属性を`false`から`true`に変更できます。この命令は以下の属性を受け取ります：

- **Metadata**: NFTのMetadataアカウントのアドレス。これは、コレクション内で検証したいNFTです。
- **Collection Mint**: Collection NFTのMintアカウントのアドレス。これは、NFTのMetadataアカウントに既に設定されているが、まだ検証されていないCollection NFTです。
- **Authority**: 署名者としてのCollection NFTの権限。これは、Collection NFTのUpdate Authorityまたは適切な役割を持つ承認された委任先である可能性があります（「[委任された権限](/ja/smart-contracts/token-metadata/delegates)」ページを参照）。

以下は、Token MetadataでCollection NFTを検証するためのSDKの使用方法です。

{% dialect-switcher title="Verify a Collection NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import { verifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

// 後で使用するmetadata PDAを最初に見つける
const metadata = findMetadataPda(umi, { 
  mint: publicKey("...")
});

await verifyCollectionV1(umi, {
  metadata,
  collectionMint,
  authority: collectionAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### 未検証

相互に、Collection NFTの権限は、そのコレクションの一部である任意のNFTを未検証にすることができます。これは、Token Metadataプログラムに**Unverify**命令を送信することで行われ、その属性は**Verify**命令と同じです。

{% dialect-switcher title="Unverify a Collection NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import { unverifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

// 後で使用するmetadata PDAを最初に見つける
const metadata = findMetadataPda(umi, { 
  mint: publicKey("...")
});

await unverifyCollectionV1(umi, {
  metadata,
  collectionMint,
  authority: collectionAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}