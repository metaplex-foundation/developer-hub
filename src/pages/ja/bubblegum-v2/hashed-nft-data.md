---
title: NFTデータのハッシュ化
metaTitle: NFTデータのハッシュ化 | Bubblegum V2
description: BubblegumでNFTデータがどのようにハッシュ化されるかについて詳しく学びます。
---

前のセクションで、Bubblegumマークルツリーのリーフノードはそれぞれ圧縮NFT（cNFT）のデータをハッシュ化することで得られると述べました。しかし、これは正確にはどのように行われるのでしょうか？cNFTのメタデータから始めます。Bubblegum V2の各cNFTは、ミント命令への引数として以下のメタデータ構造でミントされることに注意してください。Bubblegum v1は代わりにMetadataArgsを使用します：

```rust
pub struct MetadataArgsV2 {
    /// アセットの名前
    pub name: String,
    /// アセットのシンボル
    pub symbol: String,
    /// アセットを表すJSONを指すURI
    pub uri: String,
    /// 二次販売で作成者に行くロイヤリティベーシスポイント（0-10000）
    pub seller_fee_basis_points: u16,
    /// 不変、一度変更されると、このメタデータのすべての販売は二次とみなされる。
    pub primary_sale_happened: bool,
    /// データ構造が可変かどうか、デフォルトは不変
    pub is_mutable: bool,
    /// トークン標準。現在、`NonFungible`のみが許可されている。
    pub token_standard: Option<TokenStandard>,
    /// 作成者配列
    pub creators: Vec<Creator>,
    /// コレクション。V2では単に`Pubkey`であり、常に検証済みとみなされる。
    pub collection: Option<Pubkey>,
}
```

cNFTのメタデータは、図に示され以下に説明されているように複数回ハッシュ化されます：

{% diagram %}

{% node %}
{% node #metadata label="メタデータ引数" theme="blue" /%}
{% node label="名前" /%}
{% node label="シンボル" /%}
{% node label="URI" /%}
{% node label="販売者手数料ベーシスポイント" /%}
{% node label="主要販売が発生" /%}
{% node label="可変性" /%}
{% node label="トークン標準" /%}
{% node label="コレクション" /%}
{% node label="作成者" /%}
{% /node %}

{% node #seller-fee-basis-points parent="metadata" y="305" label="販売者手数料ベーシスポイント" theme="blue" /%}

{% /diagram %}
