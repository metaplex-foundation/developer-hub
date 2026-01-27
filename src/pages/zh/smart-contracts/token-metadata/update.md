---
title: 更新资产
metaTitle: 更新资产 | Token Metadata
description: 了解如何在 Token Metadata 上更新资产
---

只要 **Is Mutable** 属性设置为 `true`，资产的更新权限就可以使用 **Update** 指令更新其 **Metadata** 账户。**Update** 指令要求 **Update Authority** 签署交易，并可以更新 **Metadata** 账户的以下属性：

## 可更新字段

请注意，某些委托权限也可以更新资产的 **Metadata** 账户，如"[委托权限](/zh/smart-contracts/token-metadata/delegates)"页面中所述。

以下是 `UpdateV1` 指令中所有可更新的单独字段的说明。

### Data 对象

定义资产的 Name、Symbol、URI、Seller Fee Basis Points 和 Creators 数组的对象。请注意，更新权限只能从 Creators 数组中添加和/或删除未验证的创建者。唯一的例外是如果创建者是更新权限，在这种情况下，添加或删除的创建者可以被验证。

{% dialect-switcher title="Data 对象" %}
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

Primary Sale Happened：一个布尔值，指示资产是否已经被销售过。

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

一个布尔值，指示资产是否可以再次更新。当将其更改为 false 时，任何未来的更新都将失败。

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

此属性使我们能够设置或清除资产的集合。请注意，在设置新集合时，verified 布尔值必须设置为 false，并[使用另一个指令进行验证](/zh/smart-contracts/token-metadata/collections)。

#### 设置集合

{% dialect-switcher title="设置集合" %}
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

#### 清除集合

{% dialect-switcher title="清除集合" %}
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

可以通过传入 `newUpdateAuthority` 字段将新的更新权限分配给资产。

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

此属性使我们能够设置或清除资产的规则集。这仅与[可编程非同质化代币](/zh/smart-contracts/token-metadata/pnfts)相关。

{% dialect-switcher title="Programable RuleSets" %}
{% dialect title="JavaScript" id="js" %}

```ts
ruleSet: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
// 在 Rust anchor-spl SDK 中不可用
```

{% /dialect %}
{% /dialect-switcher %}

以下是如何使用我们的 SDK 在 Token Metadata 上更新资产。

## 作为更新权限进行更新

### NFT 资产

此示例向您展示如何作为资产的更新权限更新 NFT 资产。

{% code-tabs-imported from="token-metadata/update-nft" frameworks="umi,kit,anchor" /%}

### pNFT 资产

此示例向您展示如何作为资产的更新权限更新可编程 NFT (pNFT) 资产。

`pNFTs` 可能需要传入附加账户才能使指令工作。这些包括：tokenAccount、tokenRecord、authorizationRules 和 authorizationRulesProgram。

{% code-tabs-imported from="token-metadata/update-pnft" frameworks="umi,kit,anchor" /%}
