---
title: AnchorでCore NFTアセットを作成する方法
metaTitle: AnchorでCore NFTアセットを作成する方法 | Core Guides
description: Metaplex CoreのRust SDK（mpl-core）を用い、Anchor経由のCPIでCore NFTアセットを作成します。
created: '06-16-2024'
updated: '06-18-2024'
---

このガイドでは、`mpl-core`クレートを用い、AnchorプログラムからCPIでCoreのNFT資産を作成する手順を示します。

{% callout title="Coreとは？" %}
Coreは単一アカウント設計で、ミントコストやネットワーク負荷を削減します。柔軟なプラグインシステムで資産の振る舞いを拡張できます。
{% /callout %}

{% callout title="Assetとは？" %}
Core NFT資産は、関連口座（ATAなど）に依存せず、ウォレットと「mint」に相当する関係をアセット自体に保持します。
{% /callout %}

## 前提
- エディタ（VS Code + Rust Analyzer推奨）
- Anchor 0.30.1以上

## 初期設定
単一ファイル（lib.rs）で進めます。

### プロジェクト作成（任意）
```
anchor init create-core-asset-example
```

### 依存クレート
```
cd create-core-asset-example
cargo add mpl-core --features anchor
```

## プログラム

### インポートと雛形
```rust
use anchor_lang::prelude::*;
use mpl_core::{ ID as MPL_CORE_ID, accounts::BaseCollectionV1, instructions::CreateV2CpiBuilder };

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateAssetArgs {}

#[program]
pub mod create_core_asset_example {
    use super::*;
    pub fn create_core_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> { Ok(()) }
}

#[derive(Accounts)]
pub struct CreateAsset<'info> {}
```

### 引数構造体
```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateAssetArgs { name: String, uri: String }
```

### アカウント構造体
```rust
#[derive(Accounts)]
pub struct CreateAsset<'info> {
    #[account(mut)]
    pub asset: Signer<'info>,
    #[account(mut)]
    pub collection: Option<Account<'info, BaseCollectionV1>>,
    pub authority: Option<Signer<'info>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: mpl_core側で検証
    pub owner: Option<UncheckedAccount<'info>>,
    /// CHECK: mpl_core側で検証
    pub update_authority: Option<UncheckedAccount<'info>>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: アドレス制約で検証
    pub mpl_core_program: UncheckedAccount<'info>,
}
```

### 命令本体
```rust
pub fn create_core_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
  let collection = ctx.accounts.collection.as_ref().map(|c| c.to_account_info());
  let authority = ctx.accounts.authority.as_ref().map(|a| a.to_account_info());
  let owner = ctx.accounts.owner.as_ref().map(|o| o.to_account_info());
  let update_authority = ctx.accounts.update_authority.as_ref().map(|u| u.to_account_info());

  CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(collection.as_ref())
    .authority(authority.as_ref())
    .payer(&ctx.accounts.payer.to_account_info())
    .owner(owner.as_ref())
    .update_authority(update_authority.as_ref())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .invoke()?;
  Ok(())
}
```

プラグイン/外部プラグインの追加も`plugins`/`external_plugin_adapters`で可能です（詳細は[プラグイン](/ja/smart-contracts/core/plugins)）。

## クライアント（テスト）

ビルド/デプロイ:
```
anchor build
anchor deploy
```

テスト雛形と呼び出し例（optionalはnull指定可）:
```ts
let createAssetArgs = { name: 'My Asset', uri: 'https://example.com/my-asset.json' }
await program.methods.createCoreAsset(createAssetArgs)
  .accountsPartial({
    asset: asset.publicKey,
    collection: null,
    authority: null,
    payer: wallet.publicKey,
    owner: null,
    updateAuthority: null,
    systemProgram: SystemProgram.programId,
    mplCoreProgram: MPL_CORE_PROGRAM_ID
  })
  .signers([asset, wallet.payer])
  .rpc()
```

