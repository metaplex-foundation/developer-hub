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
isMutable: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
is_mutable: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### Collection

この属性により、アセットのコレクションを設定またはクリアできます。新しいコレクションを設定する場合、verifiedブール値はfalseに設定し、[別の命令を使用して検証する](/ja/smart-contracts/token-metadata/collections)必要があることに注意してください。

#### コレクションの設定

{% dialect-switcher title="Setting A Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle('Set', [
  {
    key: publicKey('11111111111111111111111111111111'),
    verified: false,
  },
])
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: Some( Collection {
  key: PubKey,
  verified: Boolean,
}),
```

{% /dialect %}
{% /dialect-switcher %}

#### コレクションのクリア

{% dialect-switcher title="Clearing a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle("Clear"),
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: None,
```

{% /dialect %}
{% /dialect-switcher %}

### New Update Authority

`newUpdateAuthority`フィールドを渡すことで、新しい更新権限をアセットに割り当てることができます。

{% dialect-switcher title="New Update Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
newUpdateAuthority: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
new_update_authority: Option<PubKey>,
```

{% /dialect %}
{% /dialect-switcher %}

### Programable RuleSets

この属性により、アセットのルールセットを設定またはクリアできます。これは[Programmable Non-Fungibles](/ja/smart-contracts/token-metadata/pnfts)にのみ関連します。

{% dialect-switcher title="Programable RuleSets" %}
{% dialect title="JavaScript" id="js" %}

```ts
ruleSet: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
// Rust anchor-spl SDKでは利用できません
```

{% /dialect %}
{% /dialect-switcher %}

以下は、SDKを使用してToken Metadataでアセットを更新する方法です。

## 更新権限としての更新

### NFTアセット

この例では、アセットの更新権限としてNFTアセットを更新する方法を示します。

{% code-tabs-imported from="token-metadata/update-nft" frameworks="umi,kit,anchor" /%}

### pNFTアセット

この例では、アセットの更新権限としてProgrammable NFT（pNFT）アセットを更新する方法を示します。

`pNFTs`は、命令が機能するために追加のアカウントを渡す必要がある場合があります。これらには、tokenAccount、tokenRecord、authorizationRules、authorizationRulesProgramが含まれます。

{% code-tabs-imported from="token-metadata/update-pnft" frameworks="umi,kit,anchor" /%}
