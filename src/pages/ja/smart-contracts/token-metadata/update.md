---
title: アセットの更新
metaTitle: アセットの更新 | Token Metadata
description: Token Metadataでアセットを更新する方法を学習します
---

アセットの更新権限は、**Is Mutable**属性が`true`に設定されている限り、**Update**命令を使用してその**Metadata**アカウントを更新できます。**Update**命令は**Update Authority**がトランザクションに署名することを要求し、**Metadata**アカウントの以下の属性を更新できます：

## 更新可能フィールド

「[委任された権限](/ja/smart-contracts/token-metadata/delegates)」ページで説明されているように、特定の委任された権限もアセットの**Metadata**アカウントを更新できることに注意してください。

以下は、`UpdateV1`命令で更新可能なすべての個別フィールドの説明です。

### Dataオブジェクト

アセットの名前、シンボル、URI、販売手数料ベーシスポイント、および作成者配列を定義するオブジェクト。更新権限は、Creators配列から検証されていない作成者のみを追加および/または削除できることに注意してください。唯一の例外は、作成者が更新権限である場合で、この場合、追加または削除された作成者を検証できます。

{% dialect-switcher title="Data Object" %}
{% dialect title="JavaScript" id="js" %}

```ts
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
pub struct DataV2 {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub seller_fee_basis_points: u16,
    pub creators: Option<Vec<Creator>>,
    pub collection: Option<Collection>,
    pub uses: Option<Uses>,
}
```

{% /dialect %}

{% /dialect-switcher %}

### Primary Sale Happened

アセットが以前に販売されたかどうかを示すブール値。

{% dialect-switcher title="Primary Sale Happened" %}
{% dialect title="JavaScript" id="js" %}

```ts
primarySaleHappened: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
primary_sale_happened: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### Is Mutable

アセットを再度更新できるかどうかを示すブール値。これをfalseに変更すると、将来のすべての更新は失敗します。

{% dialect-switcher title="Is Mutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: false
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
is_mutable: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### Collection

アセットがどのコレクションに属するかを示すオプションのオブジェクト。コレクションは、キー（コレクションNFTのmintアドレス）と検証済みフラグを含みます。

{% dialect-switcher title="Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: {
  key: collectionMintAddress,
  verified: false, // 更新時は常にfalseに設定されます
}
```

{% /dialect %}
{% /dialect-switcher %}

### New Update Authority

アセットの新しい更新権限。これは、更新権限を別のアカウントに転送するために使用されます。

{% dialect-switcher title="New Update Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
newUpdateAuthority: newAuthorityPublicKey
```

{% /dialect %}
{% /dialect-switcher %}

## アセットの更新例

{% dialect-switcher title="Update an Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateV1 } from '@metaplex-foundation/mpl-token-metadata'

await updateV1(umi, {
  mint,
  authority: updateAuthority,
  data: {
    name: '更新されたNFT名',
    symbol: 'UNFT',
    uri: 'https://updated-uri.com/metadata.json',
    sellerFeeBasisPoints: 750, // 7.5%
  },
  primarySaleHappened: true,
  isMutable: true,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## プログラマブルNFTの更新

プログラマブルNFT（pNFT）の場合、追加の考慮事項があります：

{% dialect-switcher title="Update a pNFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { 
  updateV1,
  fetchDigitalAsset,
  TokenStandard 
} from '@metaplex-foundation/mpl-token-metadata'

// pNFTのデータを取得
const asset = await fetchDigitalAsset(umi, mint)

await updateV1(umi, {
  mint,
  authority: updateAuthority,
  data: {
    name: '更新されたpNFT名',
    symbol: 'UPNFT',
    uri: 'https://updated-pnft-uri.com/metadata.json',
    sellerFeeBasisPoints: 1000, // 10%
  },
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // pNFTは認証ルールを持つ場合があります
  authorizationRules: asset.metadata.programmableConfig?.ruleSet,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}