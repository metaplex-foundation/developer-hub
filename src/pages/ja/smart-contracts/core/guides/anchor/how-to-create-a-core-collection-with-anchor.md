---
title: AnchorでCoreコレクションを作成する方法
metaTitle: AnchorでCoreコレクションを作成する方法 | Core Guides
description: Metaplex CoreのRust SDK（mpl-core）を用い、Anchor経由のCPIでCoreコレクションを作成します。
created: '08-21-2024'
updated: '08-21-2024'
---

このガイドでは、`mpl-core`クレートを用い、AnchorプログラムからCPIでCoreのコレクション資産を作成する手順を示します。

{% callout title="Coreとは？" %}
Coreは単一アカウント設計で、ミントコストやネットワーク負荷を削減します。柔軟なプラグインシステムで資産の振る舞いを拡張できます。
{% /callout %}

{% callout title="コレクションとは？" %}
コレクションは、シリーズやグループとして資産をまとめる仕組みです。まずは「コレクション資産」を作成し、コレクション名や画像などのメタデータ、コレクション全体のプラグインを保持します。
{% /callout %}

## 前提
- エディタ（VS Code + Rust Analyzer推奨）
- Anchor 0.30.1以上

## 初期設定
単一ファイル（lib.rs）で進めます。

### プロジェクト作成（任意）
```
anchor init create-core-collection-example
```

### 依存クレート
```
cd create-core-collection-example
cargo add mpl-core --features anchor
```

## プログラム

### インポートと雛形
```rust
use anchor_lang::prelude::*;
use mpl_core::{ ID as MPL_CORE_ID, instructions::CreateCollectionV2CpiBuilder };

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCollectionArgs {}

#[program]
pub mod create_core_collection_example {
    use super::*;
    pub fn create_core_collection(ctx: Context<CreateCollection>, args: CreateCollectionArgs) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {}
```

### 引数構造体
```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCollectionArgs { name: String, uri: String }
```

### アカウント構造体
```rust
#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: mpl_core側で検証
    pub update_authority: Option<UncheckedAccount<'info>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: アドレス制約で検証
    pub mpl_core_program: UncheckedAccount<'info>,
}
```

### 命令本体
```rust
pub fn create_core_collection(ctx: Context<CreateCollection>, args: CreateCollectionArgs) -> Result<()> {
  let update_authority = match &ctx.accounts.update_authority {
      Some(a) => Some(a.to_account_info()),
      None => None,
  };

  CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
      .collection(&ctx.accounts.collection.to_account_info())
      .payer(&ctx.accounts.payer.to_account_info())
      .update_authority(update_authority.as_ref())
      .system_program(&ctx.accounts.system_program.to_account_info())
      .name(args.name)
      .uri(args.uri)
      .invoke()?;
  Ok(())
}
```

プラグイン/外部プラグインもベクタで組み立てて渡せます。詳細は[プラグイン](/core/plugins)参照。

## クライアント（テスト）

ビルド/デプロイ:
```
anchor build
anchor deploy
```

テスト雛形と呼び出し例（accountsPartialでoptionalをnullに）:
```ts
let createCollectionArgs = { name: 'My Collection', uri: 'https://example.com/my-collection.json' }
await program.methods.createCoreCollection(createCollectionArgs)
  .accountsPartial({
    collection: collection.publicKey,
    payer: wallet.publicKey,
    updateAuthority: null,
    systemProgram: SystemProgram.programId,
    mplCoreProgram: MPL_CORE_PROGRAM_ID
  })
  .signers([collection, wallet.payer])
  .rpc()
```

