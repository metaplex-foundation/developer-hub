---
title: ロイヤリティカード コンセプトガイド
metaTitle: ロイヤリティカード コンセプトガイド | Core Guides
description: MPL Coreのデジタルアセットとプラグインを用いたロイヤリティカード（会員証）システムの設計例。
---

## コンセプトガイド: Metaplex Coreとプラグインでロイヤリティカードを構築

{% callout %}
これはエンドツーエンドの完成チュートリアルではなく、コンセプトガイドです。Rust/Anchorの基本を前提とし、設計判断やコード例を示します（CPIやデプロイなどの基礎は理解している想定）。
{% /callout %}

このガイドは、Solana/Anchorの基礎を前提に、MPL CoreのNFT資産を用いたロイヤリティカードの一例を紹介します。特定の実装に縛られない、応用しやすいパターンを示すことを目的とします。

### Metaplex Coreとは？
Metaplex CoreはSolana上の新しいNFT資産標準で、プラグイン型アーキテクチャを採用しています。レガシーのToken Metadataと異なり、属性のオンチェーン保存や振る舞いの拡張が可能です。

本例で利用する主な要素:
- AppDataプラグイン: ロイヤリティポイントなどの構造化データを格納
- Freeze Delegateプラグイン: カードを譲渡・Burn不可（ソウルバウンド化）に
- Update Delegate権限（PDA使用）: コレクション配下の子NFTをプログラムから更新
加えて、CPIビルダー（例: `CreateV2CpiBuilder`）でCoreへ命令を組み立てます。

### ライフサイクル概要
```
[ユーザー] → カード発行依頼
    ↓
[プログラム] → NFT発行 + AppData + FreezeDelegate（ソウルバウンド）
    ↓
[ユーザー] → 購入/ポイント消費
    ↓
[プログラム] → AppData更新（ポイント加算/減算）
```

詳細なセットアップは[Coreドキュメント](https://developers.metaplex.com/core)も参照ください。

---

## アーキテクチャ

ロイヤリティカードはNFTで表現し、必要なプラグインで振る舞いとデータを管理します。

### ソウルバウンド化の理由
カードをソウルバウンド（非譲渡）にすることで、ユーザー固定の利用を担保し、不正な二次流通を防ぎます。

### LoyaltyCardData構造
カードのスタンプ数などを記録するオンチェーン構造体の例:

```rust
pub struct LoyaltyCardData {
    pub current_stamps: u8,
    pub lifetime_stamps: u64,
    pub last_used: u64,
    pub issue_date: u64,
}

impl LoyaltyCardData {
    pub fn new_card() -> Self {
        let timestamp = clock::Clock::get().unwrap().unix_timestamp as u64;
        LoyaltyCardData { current_stamps: 0, lifetime_stamps: 0, last_used: 0, issue_date: timestamp }
    }
}
```

AppDataプラグインの`dataAuthority`により、プログラム側だけが更新できます。

### コレクション用PDA（Collection Delegate）
`[b"collection_delegate"]`などのSeedでPDAを導出し、コレクション配下資産の更新権限を付与します。

### カード毎の権限PDA
カードごとに`[card_pubkey]`などでPDAを導出し、AppData/FreezeDelegateの権限とします。資産ごとの細粒度制御が可能です。

## ステップ1: コレクション作成

JS SDKやCLIでコレクションを作成します。PDAをアップデート権限に設定すれば、プログラム制御が容易になります。

## ステップ2: ソウルバウンドカードのミント

カードは以下の特徴を持つ想定です:
- コレクション配下
- Freeze Delegateで凍結
+- AppDataプラグインにカード状態を保存

```rust
CreateV2CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .name("Sol Coffee Loyalty Card".to_owned())
    .collection(Some(&ctx.accounts.loyalty_card_collection))
    .uri("https://arweave.net/...".to_owned())
    .external_plugin_adapters(vec![ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
        data_authority: PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() },
        init_plugin_authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
        schema: Some(ExternalPluginAdapterSchema::Binary),
    })])
    .plugins(vec![PluginAuthorityPair {
        authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
        plugin: Plugin::FreezeDelegate(FreezeDelegate { frozen: true }),
    }])
    .owner(Some(&ctx.accounts.signer))
    .payer(&ctx.accounts.signer)
    .authority(Some(&ctx.accounts.collection_delegate))
    .invoke_signed(collection_delegate_seeds)?;
```

## ステップ3: 購入時の更新

購入/ポイント消費のたびに、AppDataへ最新状態（スタンプ数、最終利用時刻など）を書き戻します。`redeem`フラグで分岐し、消費時はポイント減算、購入時は加算するなど、要件に応じて設計してください。

---

以降は、ビジネス要件に合わせて拡張（会員ランク、特典、失効、店舗別集計など）してください。

