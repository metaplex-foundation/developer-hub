---
title: 委任された権限
metaTitle: 委任された権限 | Token Metadata
description: Token Metadataでアセットに委任された権限を承認する方法を学習します
---

アセットに単一の権限を持つことは常に理想的ではありません。時々、これらの責任の一部を他のウォレットやプログラムに委任して、私たちの代わりに行動できるようにしたい場合があります。これがToken Metadataが異なるスコープを持つ一連の委任を提供する理由です。 {% .lead %}

## MetadataとTokenの委任

Token Metadataによって提供される委任は、**Metadata委任**と**Token委任**の2つのカテゴリに分けることができます。以下でそれぞれについて詳しく説明しますが、まずそれらの違いを簡単に見てみましょう。

- **Metadata委任**は、アセットのMintアカウントに関連付けられ、委任された権限がMetadataアカウントで更新を実行できるようにします。これらはアセットの更新権限によって承認され、必要な数だけ存在できます。
- **Token委任**は、アセットのTokenアカウントに関連付けられ、委任された権限がトークンを転送、バーン、および/またはロックできるようにします。これらはアセットの所有者によって承認され、一度に1つのトークンアカウントにつき1つだけ存在できます。

## Metadata委任

Metadata委任は、Metadataレベルで動作する委任です。これらの委任は**Metadata Delegate Record** PDA（シードは `["metadata", program id, mint id, delegate role, update authority id, delegate id]`）を使用して保存されます。

そのアカウントは、**Delegate**権限およびそれを承認した**Update Authority**を追跡します。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-15" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-delegate-pda parent="mint" x="-15" y="-260" label="PDA" theme="crimson" /%}

{% node parent="metadata-delegate-pda" x="-283" %}
{% node #metadata-delegate label="Metadata Delegate Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataDelegate" /%}
{% node label="Bump" /%}
{% node label="Mint" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Update Authority" theme="orange" z=1 /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="metadata-delegate-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="metadata-delegate-pda" to="metadata-delegate" path="straight" /%}
{% /diagram %}

Metadata委任の主要な特性は以下の通りです：

- 特定のアセットに対して必要な数だけMetadata委任を作成できます。
- Metadata委任はMintアカウントから派生されるため、アセットの所有者に関係なく存在します。そのため、アセットの転送はMetadata委任に影響しません。
- Metadata委任は、アセットの現在のUpdate Authorityからも派生されます。これは、アセットのUpdate Authorityが更新されるたびに、すべてのMetadata委任が無効になり、新しいUpdate Authorityによって使用できなくなることを意味します。ただし、Update Authorityが転送し直された場合、それに関連するすべてのMetadata委任は自動的に再アクティブ化されます。
- Metadata委任は、それを承認したUpdate Authorityによって取り消すことができます。
- Metadata委任は自分自身を取り消すこともできます。

7つの異なるタイプのMetadata委任が存在し、それぞれ異なる行動スコープを持っています。以下は、異なるタイプのMetadata委任を要約した表です：

| 委任                      | セルフ更新 | コレクション内アイテム更新 | 更新スコープ                                                              |
| ------------------------- | ---------- | -------------------------- | ------------------------------------------------------------------------- |
| Authority Item            | ✅         | ❌                         | `newUpdateAuthority` ,`primarySaleHappened` ,`isMutable` ,`tokenStandard` |
| Collection                | ✅         | ✅                         | `collection` + アイテムでのコレクション検証/未検証                        |
| Collection Item           | ✅         | ❌                         | `collection`                                                              |
| Data                      | ✅         | ✅                         | `data`                                                                    |
| Data Item                 | ✅         | ❌                         | `data`                                                                    |
| Programmable Configs      | ✅         | ✅                         | `programmableConfigs`                                                     |
| Programmable Configs Item | ✅         | ❌                         | `programmableConfigs`                                                     |

名前が`Item`で終わるMetadata委任は、自分自身にのみ作用できるのに対し、他の委任は委任アセットのコレクションアイテムにも作用できることに注意してください。例えば、NFT BとCを含むCollection NFT Aがあるとします。AでData委任を承認すると、NFT A、B、CのdataオブジェクトをUpdate アップデートできます。しかし、AでData Item委任を承認すると、NFT Aのdataオブジェクトのみを更新できます。

さらに、Collection委任は、コレクションのアイテムで委任されたNFTを検証/未検証できるため、少し特別です。上記の例では、AでCollection委任を承認すると、NFT BとCでそのコレクションを検証/未検証できます。

## Token委任

Token委任は、Tokenレベルで動作する委任です。これらの委任は**Token Delegate Record** PDA（シードは `["metadata", program id, mint id, token standard, delegate role, delegate id]`）を使用して保存されます。

7つの異なるタイプのToken委任が存在します：

| 委任              | 転送 | バーン | ロック | セール | 利用 | スタンダード                            |
| ----------------- | ---- | ------ | ------ | ------ | ------ | --------------------------------------- |
| Standard          | ✅   | ✅     | ✅     | ❌     | ✅     | NonFungible, FungibleAsset, Fungible    |
| Sale              | ✅   | ❌     | ❌     | ✅     | ❌     | NonFungible, FungibleAsset, Fungible    |
| Transfer          | ✅   | ❌     | ❌     | ❌     | ❌     | NonFungible, FungibleAsset, Fungible    |
| Update            | ❌   | ❌     | ❌     | ❌     | ❌     | ProgrammableNonFungible                 |
| Locked Transfer   | ✅   | ❌     | ❌     | ❌     | ❌     | ProgrammableNonFungible                 |
| Utility           | ❌   | ❌     | ✅     | ❌     | ✅     | NonFungible, FungibleAsset, Fungible    |
| Staking           | ❌   | ❌     | ✅     | ❌     | ❌     | NonFungible, FungibleAsset, Fungible    |

### Standard委任の例

{% dialect-switcher title="Work with Standard delegates" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { 
  delegateStandardV1, 
  revokeStandardV1,
  transferV1 
} from '@metaplex-foundation/mpl-token-metadata'

// 承認
await delegateStandardV1(umi, {
  mint,
  token,
  authority: owner,
  delegate: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)

// 取り消し
await revokeStandardV1(umi, {
  mint,
  token,
  authority: owner, // または委任権限を署名者として渡してセルフ取り消し
  delegate: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)

// 委任による転送
await transferV1(umi, {
  mint,
  authority: standardDelegate,
  tokenOwner: owner.publicKey,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}