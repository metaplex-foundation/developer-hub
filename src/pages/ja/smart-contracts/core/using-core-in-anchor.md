---
title: AnchorでMetaplex Coreを使用する
metaTitle: AnchorでMetaplex Coreを使用する | Metaplex Core
description: Metaplex CoreをAnchorプログラムに統合します。オンチェーンNFT操作のためのCPI呼び出し、アカウントのデシリアライゼーション、プラグインアクセスを学びます。
updated: '07-15-2026'
keywords:
  - Core Anchor
  - mpl-core CPI
  - Anchor NFT
  - on-chain Core
about:
  - Anchor integration
  - CPI patterns
  - On-chain development
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
faqs:
  - q: anchorフィーチャーフラグは必要ですか？
    a: はい、Accounts構造体での直接デシリアライゼーションには必要です。なしの場合は、from_bytes()を手動で使用します。anchorを有効にする際は常にdefault-features = falseを設定してください。
  - q: どのAnchorバージョンを使用すべきですか？
    a: anchor-lang 0.32.xの場合は、default-features = falseとfeatures = ["anchor", "anchor-0-32"]を使用します。anchor-lang 0.31.xの場合は、features = ["anchor"]のみを使用します。
  - q: どのRustバージョンが必要ですか？
    a: mpl-coreにはRust 1.89.0以降が必要です。Anchorプロジェクトのrust-toolchain.tomlでバージョンを固定してください。
  - q: プラグインが存在するかどうかを確認するにはどうすればよいですか？
    a: Optionを返すfetch_plugin()を使用します。プラグインが存在しない場合でもエラーをスローしません。
  - q: 外部プラグイン（Oracle、AppData）にアクセスできますか？
    a: はい。fetch_plugin()の代わりに適切なキーでfetch_external_plugin()を使用します。
  - q: 利用可能なすべての命令はどこで見つけられますか？
    a: 完全なAPIリファレンスについては、mpl-core docs.rsの命令モジュールを参照してください。
---
Anchorを使用してCore Assetsと対話する**オンチェーンプログラム**を構築します。このガイドでは、インストール、アカウントのデシリアライゼーション、プラグインアクセス、CPIパターンについて説明します。 {% .lead %}
{% callout title="学べること" %}
- AnchorプロジェクトでのMpl-coreのインストールと設定
- プログラムでのCore AssetsとCollectionsのデシリアライズ
- プラグインデータ（Attributes、Freezeなど）へのアクセス
- Assetsの作成、転送、管理のためのCPI呼び出し
{% /callout %}
## 概要
`mpl-core` Rustクレートは、AnchorプログラムからCoreと対話するために必要なすべてを提供します。ネイティブAnchorアカウントのデシリアライゼーションのために`anchor`フィーチャーフラグを有効にします。
- `default-features = false`と適切なAnchor機能で`mpl-core`を追加
- `anchor-lang 0.32.x`とともに`features = ["anchor", "anchor-0-32"]`を使用
- `anchor-lang 0.31.x`とともに`features = ["anchor"]`を使用
- Accounts構造体でAssets/Collectionsをデシリアライズ
- `fetch_plugin()`を使用してプラグインデータを読み取り
- CPIビルダーが命令呼び出しを簡素化
## 対象外
クライアントサイドJavaScript SDK（[JavaScript SDK](/smart-contracts/core/sdk/javascript)を参照）、スタンドアロンRustクライアント（[Rust SDK](/smart-contracts/core/sdk/rust)を参照）、およびクライアントからのCore Assetsの作成。
## クイックスタート
**ジャンプ先:** [インストール](#インストール) · [アカウントのデシリアライゼーション](#アカウントのデシリアライゼーション) · [プラグインアクセス](#プラグインのデシリアライズ) · [CPI例](#cpi命令ビルダー)
1. `default-features = false`とAnchor機能で`mpl-core`をCargo.tomlに追加
2. `rust-toolchain.toml`でRust `1.89.0`以降を固定
3. `Account<'info, BaseAssetV1>`でAssetsをデシリアライズ
4. `fetch_plugin::<BaseAssetV1, PluginType>()`でプラグインにアクセス
5. `CreateV2CpiBuilder`、`TransferV1CpiBuilder`などでCPI呼び出し
## インストール
Anchorプログラムの`Cargo.toml`に`mpl-core`を追加します。デフォルトの`borsh-v1`機能はAnchor統合と互換性がないため、`anchor`を有効にする際は常にデフォルト機能を無効にしてください。
### フィーチャーフラグ
| 機能 | 説明 |
|------|------|
| `anchor` | `anchor-lang 0.31.1`とSolana 2.x型でAnchorアカウントのデシリアライゼーションを有効化 |
| `anchor-0-32` | `anchor-lang 0.32.x`サポートのオプトイン機能; `anchor`が必要 |
| `serde` | オフチェーンツール用のオプションserdeサポート |
#### Anchor 0.32.x（推奨）
プログラムが`anchor-lang 0.32.x`に依存する場合:
```rust
[dependencies]
anchor-lang = "0.32.1"
mpl-core = { version = "x.x.x", default-features = false, features = ["anchor", "anchor-0-32"] }
```
#### Anchor 0.31.x（レガシー）
プログラムが`anchor-lang 0.31.x`に依存する場合:
```rust
[dependencies]
anchor-lang = "0.31.1"
mpl-core = { version = "x.x.x", default-features = false, features = ["anchor"] }
```
{% callout title="重要" %}
- `anchor-0-32`だけでは不十分です — `anchor`と組み合わせて使用する必要があります。
- `default-features = false`が必要です。設定しないと、デフォルトの`borsh-v1`機能がAnchor統合と競合します。
- Anchorパスは`Pubkey`、`AccountInfo`および関連するAnchor traitにSolana 2.x型を使用します。
{% /callout %}
### Rustツールチェーン
`mpl-core`には**Rust 1.89.0**以降が必要です。Anchorワークスペースに`rust-toolchain.toml`ファイルを追加してください:
```toml
[toolchain]
channel = "1.89.0"
```
`base64ct`などの推移的依存関係により`edition2024`エラーが発生した場合は、Rust 1.89.0以降にアップグレードしてください。
### Core Rust SDKモジュール
Core Rust SDKはいくつかのモジュールで構成されています：
- `accounts`: プログラムのアカウントを表します
- `errors`: プログラムのエラーを列挙します
- `instructions`: 命令、命令引数、CPI命令の作成を容易にします
- `types`: プログラムで使用される型を表します
異なる命令がどのように呼び出され、使用されるかの詳細については、[mpl-core docs.rsウェブサイト](https://docs.rs/mpl-core/0.7.2/mpl_core/)を参照するか、命令上で`cmd + 左クリック`（mac）または`ctrl + 左クリック`（windows）を使用して展開できます。
## アカウントのデシリアライゼーション
### デシリアライズ可能なアカウント
以下のアカウント構造体は、`mpl-core`クレート内でデシリアライゼーションに使用できます：
```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```
Anchor内でCoreアカウントをデシリアライズするには2つの方法があります。
- AnchorのAccountリスト構造体を使用（ほとんどの場合に推奨）
- `<Account>::from_bytes()`を使用して命令関数の本体内で直接
### Anchor Accountsリストメソッド
`anchorフラグ`を有効にすることで、Anchor Accountsリスト構造体で`BaseAssetV1`と`BaseCollectionV1`アカウントの両方を直接デシリアライズできるようになります：
{% dialect-switcher title="アカウントのデシリアライゼーション" %}
{% dialect title="Asset" id="asset" %}
```rust
#[derive(Accounts)]
pub struct ExampleAccountStruct<'info> {
    ...
    pub asset: Account<'info, BaseAssetV1>,
}
```
{% /dialect %}
{% dialect title="Collection" id="collection" %}
```rust
#[derive(Accounts)]
pub struct ExampleAccountStruct<'info> {
    ...
    pub collection: Account<'info, BaseCollectionV1>,
}
```
{% /dialect %}
{% /dialect-switcher %}
### Account from_bytes()メソッド
`try_borrow_data()`関数を使用してアセット/コレクションアカウント内のデータを借用し、それらのバイトからアセット/コレクション構造体を作成します：
{% dialect-switcher title="アカウントのデシリアライゼーション" %}
{% dialect title="Asset" id="asset" %}
```rust
let data = ctx.accounts.asset.try_borrow_data()?;
let base_asset: BaseAssetV1 = BaseAssetV1::from_bytes(&data.as_ref())?;
```
{% /dialect %}
{% dialect title="Collection" id="collection" %}
```rust
let data = ctx.accounts.collectino.try_borrow_data()?;
let base_collection: BaseCollectionV1 = BaseCollectionV1::from_bytes(&data.as_ref())?;
```
{% /dialect %}
{% /dialect-switcher %}
### プラグインのデシリアライズ
AssetまたはCollectionアカウント内の個々のプラグインにアクセスするには、`fetch_plugin()`関数を使用します。この関数は、プラグインデータを返すか、ハードエラーをスローせずに`null`レスポンスを返すため、データにアクセスせずにプラグインが存在するかどうかを確認できます。
`fetch_plugin()`関数は、AssetsとCollectionsアカウントの両方に使用でき、適切な型を指定することですべてのプラグインタイプを処理できます。プラグイン内のデータにアクセスする場合は、この関数が返す中間値を使用します。
{% dialect-switcher title="プラグインのデシリアライゼーション" %}
{% dialect title="Asset" id="asset" %}
```rust
let (_, attribute_list, _) = fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)?;
```
{% /dialect %}
{% dialect title="Collection" id="collection" %}
```rust
let (_, attribute_list, _) = fetch_plugin::<BaseCollectionV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)?;
```
{% /dialect %}
{% /dialect-switcher %}
**注意**: `fetch_plugin()`関数は非外部プラグインにのみ使用されます。外部プラグインを読み取るには、`fetch_plugin()`と同じ方法で動作する`fetch_external_plugin()`関数を使用します。
## CPI命令ビルダー
Coreクレートの各命令には**CpiBuilder**バージョンが付属しています。CpiBuilderバージョンは`命令の名前` + `CpiBuilder`を使用して作成され、多くのボイラープレートコードを抽象化してコードを大幅に簡素化します！
Coreで利用可能なすべての命令について詳しく知りたい場合は、[mpl-core docs.rsウェブサイト](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)で見つけることができます。
### CPIの例
`CreateCollectionV2CpiBuilder`命令を例にしてみましょう
`CpiBuilder`で`new`を呼び出し、Coreプログラムを`AccountInfo`として渡すことでビルダーを初期化します：
```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```
次に、Cmd + 左クリック（Windowsユーザーの場合はCtrl + 左クリック）を使用して、このCPI呼び出しに必要なすべてのCPI引数を表示します：
```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```
## 一般的なエラー
### `AccountNotInitialized`
AssetまたはCollectionアカウントが存在しないか、まだ作成されていません。
### `PluginNotFound`
取得しようとしているプラグインがAssetに存在しません。安全に`None`を返す`fetch_plugin()`で確認してください。
### `InvalidAuthority`
署名者がこの操作の権限を持っていません。正しい権限が署名していることを確認してください。
## 注意事項
- Anchor機能を有効にする際は常に`default-features = false`を設定
- `anchor-lang 0.32.x`とともに`features = ["anchor", "anchor-0-32"]`を使用
- `anchor-lang 0.31.x`とともに`features = ["anchor"]`を使用
- `rust-toolchain.toml`でRust `1.89.0`以降を固定
- 組み込みプラグインには`fetch_plugin()`を、外部には`fetch_external_plugin()`を使用
- CPIビルダーがアカウント順序の複雑さを抽象化
- 完全なAPIリファレンスは[docs.rs/mpl-core](https://docs.rs/mpl-core/)を確認
## クイックリファレンス
### 一般的なCPIビルダー
| 操作 | CPIビルダー |
|-----------|-------------|
| Assetの作成 | `CreateV2CpiBuilder` |
| Collectionの作成 | `CreateCollectionV2CpiBuilder` |
| Assetの転送 | `TransferV1CpiBuilder` |
| Assetのバーン | `BurnV1CpiBuilder` |
| Assetの更新 | `UpdateV1CpiBuilder` |
| プラグインの追加 | `AddPluginV1CpiBuilder` |
| プラグインの更新 | `UpdatePluginV1CpiBuilder` |
### アカウントタイプ
| アカウント | 構造体 |
|---------|--------|
| Asset | `BaseAssetV1` |
| Collection | `BaseCollectionV1` |
| Hashed Asset | `HashedAssetV1` |
| Plugin Header | `PluginHeaderV1` |
| Plugin Registry | `PluginRegistryV1` |
## FAQ
### anchorフィーチャーフラグは必要ですか？
はい、Accounts構造体での直接デシリアライゼーションには必要です。なしの場合は、`from_bytes()`を手動で使用します。`anchor`を有効にする際は常に`default-features = false`を設定してください。
### どのAnchorバージョンを使用すべきですか？
`anchor-lang 0.32.x`の場合は、`default-features = false`と`features = ["anchor", "anchor-0-32"]`を使用します。`anchor-lang 0.31.x`の場合は、`features = ["anchor"]`のみを使用します。
### どのRustバージョンが必要ですか？
`mpl-core`にはRust **1.89.0**以降が必要です。Anchorプロジェクトの`rust-toolchain.toml`でバージョンを固定してください。
### プラグインが存在するかどうかを確認するにはどうすればよいですか？
`Option`を返す`fetch_plugin()`を使用します。プラグインが存在しない場合でもエラーをスローしません。
### 外部プラグイン（Oracle、AppData）にアクセスできますか？
はい。適切なキーで`fetch_plugin()`の代わりに`fetch_external_plugin()`を使用します。
### 利用可能なすべての命令はどこで見つけられますか？
[mpl-core docs.rs命令モジュール](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)を参照してください。
## 用語集
| 用語 | 定義 |
|------|------------|
| **CPI** | Cross-Program Invocation - あるプログラムから別のプログラムを呼び出すこと |
| **CpiBuilder** | CPI呼び出しを構築するためのヘルパー構造体 |
| **BaseAssetV1** | デシリアライゼーション用のCore Assetアカウント構造体 |
| **fetch_plugin()** | アカウントからプラグインデータを読み取る関数 |
| **anchorフィーチャー** | Anchorネイティブデシリアライゼーションを有効にするCargoフィーチャー |
| **anchor-0-32フィーチャー** | `anchor-lang 0.32.x`サポートのオプトインCargoフィーチャー |
## 関連ページ
- [Anchorステーキング例](/smart-contracts/core/guides/anchor/anchor-staking-example) - 完全なステーキングプログラム
- [AnchorでAssetを作成](/smart-contracts/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor) - ステップバイステップガイド
- [Rust SDK](/smart-contracts/core/sdk/rust) - スタンドアロンRustクライアントの使用方法
- [mpl-core docs.rs](https://docs.rs/mpl-core/) - 完全なAPIリファレンス
