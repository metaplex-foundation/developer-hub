---
title: AnchorでCore NFT Assetを作成する方法
metaTitle: AnchorでCore NFT Assetを作成する方法 | Coreガイド
description: Anchorを使用してSolana上でMetaplex CoreのCore NFT Assetを作成する方法を学びます！
created: '06-16-2024'
updated: '01-31-2026'
keywords:
  - Anchor NFT
  - create NFT Rust
  - CPI mpl-core
  - Solana program NFT
about:
  - Anchor framework
  - CPI integration
  - On-chain minting
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
howToSteps:
  - Anchorプロジェクトをセットアップし、mpl-core依存関係を追加
  - Asset作成用の命令アカウントを定義
  - CoreプログラムへのCPI呼び出しを構築
  - devnetでプログラムをデプロイしてテスト
howToTools:
  - Anchor framework
  - mpl-core Rust crate
  - Solana CLI
---
このガイドでは、`mpl-core` Rust SDKクレートを使用して、**Solana**プログラムの**Anchor**フレームワークでCPIを介して**Core NFT Asset**を作成する方法を説明します。
{% callout title="Coreとは？" %}
**Core**は単一アカウント設計を使用し、代替品と比較してミントコストを削減し、Solanaネットワークの負荷を改善します。また、開発者がアセットの動作と機能を変更できる柔軟なプラグインシステムも備えています。
{% /callout %}
始める前に、Assetsについて話しましょう：
{% callout title="Assetとは？" %}
SolanaのTokenプログラムのような既存のアセットプログラムとは異なり、Metaplex CoreとCore NFT Assets（Core NFT Assetsと呼ばれることもあります）は、Associated Token Accountsのような複数のアカウントに依存しません。代わりに、Core NFT Assetsはウォレットと「ミント」アカウント間の関係をアセット自体に保存します。
{% /callout %}
## 前提条件
- 任意のコードエディタ（**Rust Analyzer Plugin**を使用した**Visual Studio Code**を推奨）
- Anchor **0.30.1**以上
## 初期セットアップ
このガイドでは**Anchor**を使用し、必要なすべてのマクロが`lib.rs`ファイルにあるモノファイルアプローチを採用しています：
- `declare_id`: プログラムのオンチェーンアドレスを指定
- `#[program]`: プログラムの命令ロジックを含むモジュールを指定
- `#[derive(Accounts)]`: 命令に必要なアカウントのリストを示す構造体に適用
- `#[account]`: プログラム固有のカスタムアカウントタイプを作成するために構造体に適用
**注意**: 必要に応じて関数を変更および移動する必要がある場合があります。
### プログラムの初期化
`avm`（Anchor Version Manager）を使用して新しいプロジェクトを初期化します（オプション）。初期化するには、ターミナルで以下のコマンドを実行します
```
anchor init create-core-asset-example
```
### 必要なクレート
このガイドでは、`anchor`機能を有効にした`mpl_core`クレートを使用します。インストールするには、まず`create-core-asset-example`ディレクトリに移動します：
```
cd create-core-asset-example
```
次に、以下のコマンドを実行します：
```
cargo add mpl-core --features anchor
```
## プログラム
### インポートとテンプレート
ここでは、このガイドに必要なすべてのインポートを定義し、`lib.rs`ファイルにAccount構造体と命令のテンプレートを作成します。
```rust
use anchor_lang::prelude::*;
use mpl_core::{
    ID as MPL_CORE_ID,
    accounts::BaseCollectionV1,
    instructions::CreateV2CpiBuilder,
};
declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateAssetArgs {
}
#[program]
pub mod create_core_asset_example {
    use super::*;
    pub fn create_core_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
        Ok(())
    }
}
#[derive(Accounts)]
pub struct CreateAsset<'info> {
}
```
### Args構造体の作成
関数を整理し、パラメータが多すぎて混乱するのを避けるために、すべての入力を構造化された形式で渡すのが標準的な方法です。これは、引数構造体（`CreateAssetArgs`）を定義し、`AnchorDeserialize`と`AnchorSerialize`を派生させることで実現されます。これにより、構造体はNBORを使用してバイナリ形式にシリアライズでき、**Anchor**で読み取り可能になります。
```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateAssetArgs {
    name: String,
    uri: String,
}
```
この`CreateAssetArgs`構造体では、**name**と**uri**フィールドが入力として提供され、**Core NFT Asset**を作成するために使用される`CreateV2CpiBuilder`命令の引数として機能します。
**注意**: これはAnchorに焦点を当てたガイドであるため、Uriの作成方法はここには含まれていません。方法がわからない場合は、[この例](/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#creating-the-metadata-for-the-asset)を参照してください
### Account構造体の作成
`Account`構造体は、命令が期待するアカウントを定義し、これらのアカウントが満たす必要のある制約を指定する場所です。これは、**タイプ**と**制約**という2つの主要な構成要素を使用して行われます。
**アカウントタイプ**
各タイプはプログラム内で特定の目的を果たします：
- **Signer**: アカウントがトランザクションに署名していることを確認
- **Option**: 提供されるかもしれないし、されないかもしれないオプションのアカウントを許可
- **Program**: アカウントが特定のプログラムであることを検証
**制約**
アカウントタイプは基本的な検証を処理しますが、プログラムが必要とするすべてのセキュリティチェックには十分ではありません。ここで制約が登場します。
制約は追加の検証ロジックを追加します。例えば、`#[account(mut)]`制約は、`asset`と`payer`アカウントが可変に設定されていることを確認し、命令中にこれらのアカウント内のデータを変更できることを意味します。
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
    /// CHECK: this account will be checked by the mpl_core program
    pub owner: Option<UncheckedAccount<'info>>,
    /// CHECK: this account will be checked by the mpl_core program
    pub update_authority: Option<UncheckedAccount<'info>>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: this account is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
}
```
`CreateAsset`構造体の一部のアカウントは`optional`としてマークされています。これは、`CreateV2CpiBuilder`の定義で、特定のアカウントを省略できるためです。
```rust
/// ### Accounts:
///
///   0. `[writable, signer]` asset
///   1. `[writable, optional]` collection
///   2. `[signer, optional]` authority
///   3. `[writable, signer]` payer
///   4. `[optional]` owner
///   5. `[optional]` update_authority
///   6. `[]` system_program
```
例をできるだけ柔軟にするために、プログラム命令のすべての`optional`アカウントは、`create_core_asset`命令のアカウント構造体でも`optional`として扱われます。
### 命令の作成
`create_core_asset`関数は、先に定義した`CreateAsset`アカウント構造体と`CreateAssetArgs`引数構造体からの入力を利用して、`CreateV2CpiBuilder`プログラム命令と対話します。
```rust
pub fn create_core_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
  let collection = match &ctx.accounts.collection {
    Some(collection) => Some(collection.to_account_info()),
    None => None,
  };
  let authority = match &ctx.accounts.authority {
    Some(authority) => Some(authority.to_account_info()),
    None => None,
  };
  let owner = match &ctx.accounts.owner {
    Some(owner) => Some(owner.to_account_info()),
    None => None,
  };
  let update_authority = match &ctx.accounts.update_authority {
    Some(update_authority) => Some(update_authority.to_account_info()),
    None => None,
  };

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
この関数では、`CreateAsset`構造体で定義されたアカウントは`ctx.accounts`を使用してアクセスされます。これらのアカウントを`CreateV2CpiBuilder`プログラム命令に渡す前に、`.to_account_info()`メソッドを使用して生データ形式に変換する必要があります。
この変換は、ビルダーがSolanaランタイムと正しく対話するためにこの形式のアカウントを必要とするため必要です。
`CreateAsset`構造体の一部のアカウントは`optional`であり、その値は`Some(account)`または`None`のいずれかになる可能性があります。これらのオプションアカウントをビルダーに渡す前に処理するために、match文を使用します。これにより、アカウントが存在する（Some）か存在しない（None）かを確認でき、このチェックに基づいて、存在する場合は`Some(account.to_account_info())`として、存在しない場合は`None`としてアカウントをバインドします。このように：
```rust
let collection = match &ctx.accounts.collection {
  Some(collection) => Some(collection.to_account_info()),
  None => None,
};
```
**注意**: ご覧のとおり、このアプローチは`authority`、`owner`、`update_authority`などの他のオプションアカウントでも繰り返されます。
必要なすべてのアカウントを準備した後、それらを`CreateV2CpiBuilder`に渡し、`.invoke()`を使用して命令を実行するか、署名者シードを使用する必要がある場合は`.invoke_signed()`を使用します。
Metaplex CPIビルダーの動作の詳細については、この[ドキュメント](/guides/rust/how-to-cpi-into-a-metaplex-program#using-metaplex-rust-transaction-cpi-builders)を参照してください
### 追加アクション
次に進む前に、`FreezeDelegate`プラグインや`AppData`外部プラグインなどのプラグインや外部プラグインを既に含めた状態でアセットを作成したい場合はどうすればよいでしょうか？その方法を説明します。
まず、追加で必要なすべてのインポートを追加しましょう：
```rust
use mpl_core::types::{
    Plugin, FreezeDelegate, PluginAuthority,
    ExternalPluginAdapterInitInfo, AppDataInitInfo,
    ExternalPluginAdapterSchema
};
```
次に、プラグインと外部プラグインアダプターを保持するベクターを作成し、適切なインポートを使用してプラグイン（または複数）を簡単に追加できるようにします：
```rust
let mut plugins: Vec<PluginAuthorityPair> = vec![];
plugins.push(
  PluginAuthorityPair {
      plugin: Plugin::FreezeDelegate(FreezeDelegate {frozen: true}),
      authority: Some(PluginAuthority::UpdateAuthority)
  }
);
let mut external_plugin_adapters: Vec<ExternalPluginAdapterInitInfo> = vec![];

external_plugin_adapters.push(
  ExternalPluginAdapterInitInfo::AppData(
    AppDataInitInfo {
      init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
      data_authority: PluginAuthority::Address{ address: data_authority },
      schema: Some(ExternalPluginAdapterSchema::Binary),
    }
  )
);
```
最後に、これらのプラグインを`CreateV2CpiBuilder`プログラム命令に統合します：
```rust
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
  .plugins(plugins)
  .external_plugin_adapters(external_plugin_adapters)
  .invoke()?;
```
**注意**: 使用するフィールドとプラグインがわからない場合は、[ドキュメント](/smart-contracts/core/plugins)を参照してください！
## クライアント
これで、Core Collectionを作成するためのガイドの「テスト」部分に到達しました。ただし、構築したプログラムをテストする前に、ワークスペースをコンパイルする必要があります。以下のコマンドを使用してすべてをビルドし、デプロイとテストの準備をします：
```
anchor build
```
ビルド後、スクリプトでアクセスできるようにプログラムをデプロイする必要があります。`anchor.toml`ファイルでプログラムをデプロイするクラスターを設定し、以下のコマンドを使用できます：
```
anchor deploy
```
最後に、プログラムをテストする準備ができましたが、その前に、testsフォルダの`create-core-asset-example.ts`を作成する必要があります。
### インポートとテンプレート
テストに必要なすべてのインポートと一般的なテンプレートは以下の通りです。
```ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CreateCoreAssetExample } from "../target/types/create_core_asset_example";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";
describe("create-core-asset-example", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const wallet = anchor.Wallet.local();
  const program = anchor.workspace.CreateCoreAssetExample as Program<CreateCoreAssetExample>;
  let asset = Keypair.generate();
  it("Create Asset", async () => {
  });
});
```
### テスト関数の作成
テスト関数では、`createAssetArgs`構造体を定義し、必要なすべてのアカウントを`createCoreAsset`関数に渡します。
```ts
it("Create Asset", async () => {
  let createAssetArgs = {
    name: 'My Asset',
    uri: 'https://example.com/my-asset.json',
  };
  const createAssetTx = await program.methods.createCoreAsset(createAssetArgs)
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
    .rpc();
  console.log(createAssetTx);
});
```
`createCoreAsset`メソッドを呼び出し、作成した`createAssetArgs`構造体を入力として渡すことから始めます：
```ts
await program.methods.createCoreAsset(createAssetArgs)
```
次に、関数が必要とするすべてのアカウントを指定します。これらのアカウントの一部は`optional`であるため、アカウントが必要ない場合は簡単に`null`を渡すことができます：
```ts
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
```
最後に、署名者を提供し、`.rpc()`メソッドを使用してトランザクションを送信します：
```ts
.signers([asset, wallet.payer])
.rpc();
```
