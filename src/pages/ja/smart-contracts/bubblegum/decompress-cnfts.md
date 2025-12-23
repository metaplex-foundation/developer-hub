---
title: 圧縮NFTの解凍
metaTitle: 圧縮NFTの解凍 | Bubblegum
description: Bubblegumで圧縮NFTを償還および解凍する方法を学びます。
---

{% callout type="note" title="v1機能" %}

Token Metadata NFTへの解凍は、Bubblegum v1でのみ利用可能です。

{% /callout %}

圧縮NFTの所有者が、それを通常のNFTに解凍することが可能です。 {% .lead %}

これは、Mintアカウント、Metadataアカウント、Master EditionアカウントなどのオンチェーンアカウントがそのNFT用に作成されることを意味します。これにより、NFTは圧縮NFTではできない特定の操作を実行し、圧縮NFTをサポートしていないプラットフォームとやりとりし、一般的にNFTエコシステムとの相互運用性を向上させることができます。

## 解凍プロセス

圧縮NFTの解凍は、NFTの所有者によって開始される2段階のプロセスです。

1. まず、所有者は圧縮NFTをVoucherと**Redeem**（償還）する必要があります。これにより、Bubblegum treeからリーフが削除され、そのリーフが一度treeに存在していたことの証明として機能するVoucherアカウントが作成されます。

2. 次に、所有者はVoucherを通常のNFTに**Decompress**（解凍）する必要があります。この時点で、通常のNFTのすべてのアカウントが圧縮NFTと同じデータで作成されます。あるいは、所有者は**Cancel Redeem**命令を使用してプロセスを逆転させることができ、これによりBubblegum tree上でリーフが復元され、Voucherアカウントが閉じられます。cNFTが完全に解凍されると、**Cancel Redeem**命令はもはや使用できず、したがってプロセスは逆転できなくなることに注意してください。

{% diagram %}

{% node #merkle-tree-wrapper %}
{% node #merkle-tree label="Merkle Tree Account" theme="blue" /%}
{% node label="Owner: Account Compression Program" theme="dimmed" /%}
{% /node %}

{% node #tree-config-pda parent="merkle-tree" x="87" y="-60" label="PDA" theme="crimson" /%}

{% node #tree-config parent="tree-config-pda" x="-63" y="-80" %}
{% node label="Tree Config Account" theme="crimson" /%}
{% node label="Owner: Bubblegum Program" theme="dimmed" /%}
{% /node %}

{% node #voucher-wrapper parent="merkle-tree" x="350" %}
{% node #voucher label="Voucher Account" theme="crimson" /%}
{% node label="Owner: Bubblegum Program" theme="dimmed" /%}
{% /node %}

{% node parent="voucher" x="320" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #edition-pda parent="mint" x="80" y="-100" label="PDA" theme="crimson" /%}
{% node #metadata-pda parent="mint" x="80" y="-200" label="PDA" theme="crimson" /%}

{% node parent="edition-pda" x="-250" %}
{% node #edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node parent="metadata-pda" x="-250" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% edge from="merkle-tree" to="tree-config-pda" path="straight" /%}
{% edge from="tree-config-pda" to="tree-config" path="straight" /%}
{% edge from="merkle-tree" to="voucher" animated=true label="1️⃣  Redeem" theme="mint" /%}
{% edge from="voucher" to="mint" animated=true label="2️⃣  Decompress" theme="mint" /%}
{% edge from="voucher-wrapper" to="merkle-tree-wrapper" animated=true label="2️⃣  Cancel Redeem" fromPosition="bottom" toPosition="bottom" theme="red" labelX=175 /%}
{% edge from="mint" to="edition-pda" fromPosition="right" toPosition="right" /%}
{% edge from="mint" to="metadata-pda" fromPosition="right" toPosition="right" /%}
{% edge from="edition-pda" to="edition" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}

{% /diagram %}

## 圧縮NFTの償還

解凍プロセスの最初のステップを開始するために、圧縮NFTの所有者は**Redeem**命令を送信し、トランザクションに署名する必要があります。これにより、解凍プロセスの次のステップで使用されるcNFT用のVoucherアカウントが作成されます。

この命令はBubblegum TreeからリーフKを削除することに注意してください。したがって、削除する圧縮NFTの整合性を検証するために追加のパラメータを提供する必要があります。これらのパラメータはリーフを変更するすべての命令に共通であるため、[以下のFAQ](/ja/smart-contracts/bubblegum/faq#replace-leaf-instruction-arguments)に文書化されています。幸い、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% dialect-switcher title="圧縮NFTの償還" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, redeem } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await redeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 償還されたNFTの解凍

解凍プロセスを完了するために、cNFTの所有者は償還されたVoucherアカウントを通常のNFTに変換する**Decompress**命令を送信する必要があります。以下のパラメータを提供する必要があります：

- **Mint**: 作成するNFTのmintアドレス。これは圧縮NFTの**Asset ID**、つまりMerkle Treeアドレスとリーフのインデックスから派生したPDAでなければなりません。
- **Voucher**: 前のステップで作成されたVoucherアカウントのアドレス。このアドレスも、Merkle Treeアドレスとリーフのインデックスから派生します。
- **Metadata**: cNFTのすべてのデータを含むメタデータオブジェクト。この属性は圧縮NFTのデータと正確に一致する必要があります。そうでないと、ハッシュが一致せず、解凍が失敗します。

ここでも、SDKが提供するヘルパー関数を使用して、Metaplex DAS APIからこれらの属性のほとんどを取得し、解析できます。

{% dialect-switcher title="償還された圧縮NFTの解凍" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  decompressV1,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await decompressV1(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  mint: assetId,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 償還されたNFTのキャンセル

所有者がcNFTの解凍について気が変わった場合、**Cancel Redeem**命令を送信することで解凍プロセスをキャンセルできます。これにより、リーフがtreeに追加され、Voucherアカウントが閉じられます。**Decompress**命令と同様に、**Voucher**アドレスを提供する必要があり、Metaplex DAS APIを使用して取得できる他の属性も必要です。

{% dialect-switcher title="償還された圧縮NFTの解凍をキャンセル" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  cancelRedeem,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await cancelRedeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}