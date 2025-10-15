---
title: Anchorでステーキングプログラムを作る
metaTitle: Anchorでステーキングプログラムを作る | Core Guides
description: FreezeDelegateとAttributeプラグインを用いて、Metaplex Core準拠のステーキングをAnchorで実装します。
---

このガイドでは、AnchorとCoreの`Attribute`/`Freeze Delegate`プラグインを使って、コレクション向けのステーキングを実装します。データはPDAではなくアセット自体に保存します。

## 仕組み
単一ファイル（lib.rs）構成で、以下のマクロを利用します。`declare_id`/`#[program]`/`#[derive(Accounts)]`/`#[account]`

必要要素:
- アセット
- （任意だが本例では利用）コレクション
- FreezeDelegateプラグイン
- Attributeプラグイン

### Freeze Delegate
オーナー管理型。委任者が凍結/解凍でき、譲渡を防ぎます（凍結中は取り消し不可）。詳細は[Freeze Delegate](/core/plugins/freeze-delegate)。

### Attribute
権限管理型。オンチェーンで属性を保持できます（`AttributeList`は文字列のkey/value配列）。詳細は[Attribute](/core/plugins/attribute)。

### ロジック
ステーキングに必要最低限の2命令を実装します。
- Stake: FreezeDelegateで凍結し、`staked`を現在時刻、`staked_time`を0に設定
- Unstake: 解凍してFreezeDelegateを取り外し、`staked`を0、`staked_time`に累積時間を加算

`staked`/`staked_time`はAttributeプラグインに保存します。

## 実装

### 依存とインポート
```rust
use mpl_core::{
  ID as CORE_PROGRAM_ID,
  fetch_plugin,
  accounts::{BaseAssetV1, BaseCollectionV1},
  instructions::{AddPluginV1CpiBuilder, RemovePluginV1CpiBuilder, UpdatePluginV1CpiBuilder},
  types::{Attribute, Attributes, FreezeDelegate, Plugin, PluginAuthority, PluginType, UpdateAuthority},
};
```

### アカウント構造体
```rust
#[derive(Accounts)]
pub struct Stake<'info> {
  pub owner: Signer<'info>,
  pub update_authority: Signer<'info>,
  #[account(mut)] pub payer: Signer<'info>,
  #[account(mut, has_one = owner, constraint = asset.update_authority == UpdateAuthority::Collection(collection.key()))]
  pub asset: Account<'info, BaseAssetV1>,
  #[account(mut, has_one = update_authority)]
  pub collection: Account<'info, BaseCollectionV1>,
  #[account(address = CORE_PROGRAM_ID)]
  /// CHECK: coreで検証
  pub core_program: UncheckedAccount<'info>,
  pub system_program: Program<'info, System>,
}
```

### ステーク命令（概略）
```rust
match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), PluginType::Attributes) {
  Err(_) => {
    // Attribute未設定: staked/0, staked_time/0を初期化して追加
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
      .asset(&ctx.accounts.asset.to_account_info())
      .collection(Some(&ctx.accounts.collection.to_account_info()))
      .payer(&ctx.accounts.payer.to_account_info())
      .authority(Some(&ctx.accounts.update_authority.to_account_info()))
      .plugin(Plugin::Attributes(Attributes { attribute_list: vec![ /* staked, staked_time */ ] }))
      .init_authority(PluginAuthority::UpdateAuthority)
      .invoke()?;
  }
  Ok((_, list, _)) => {
    // 既存属性をチェックし、stakedが0であることを確認して更新
    UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
      .asset(&ctx.accounts.asset.to_account_info())
      .collection(Some(&ctx.accounts.collection.to_account_info()))
      .payer(&ctx.accounts.payer.to_account_info())
      .authority(Some(&ctx.accounts.update_authority.to_account_info()))
      .plugin(Plugin::Attributes(Attributes { attribute_list: /* 更新後 */ vec![] }))
      .invoke()?;
  }
}

// 凍結を付与
AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
  .asset(&ctx.accounts.asset.to_account_info())
  .collection(Some(&ctx.accounts.collection.to_account_info()))
  .payer(&ctx.accounts.payer.to_account_info())
  .authority(Some(&ctx.accounts.update_authority.to_account_info()))
  .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
  .invoke()?;
```

### アンステーク命令（概略）
属性から経過時間を加算して`staked`を0に更新し、`frozen: false`へ更新後、FreezeDelegateを`RemovePlugin`で取り外します。

---

以上で、Anchor + Coreによる基本的なステーキングの流れが実装できます。あとは報酬設計やポイント消費など、要件に応じて拡張してください。

