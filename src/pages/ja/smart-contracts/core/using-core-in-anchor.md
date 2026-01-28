---
title: AnchorでMetaplex Coreを使う
metaTitle: AnchorでMetaplex Coreを使う | Metaplex Core
description: Metaplex CoreをAnchorプログラムに統合します。オンチェーンNFT操作のためのCPI呼び出し、アカウントデシリアライズ、プラグインアクセスを学びます。
---

Anchorを使用してCore Assetと対話する**オンチェーンプログラム**を構築します。このガイドでは、インストール、アカウントのデシリアライズ、プラグインアクセス、CPIパターンをカバーします。 {% .lead %}

{% callout title="学習内容" %}

- AnchorプロジェクトでMPL-Coreをインストールして設定する
- プログラム内でCore AssetとCollectionをデシリアライズする
- プラグインデータ（Attributes、Freezeなど）にアクセスする
- Assetを作成、転送、管理するためのCPI呼び出しを行う

{% /callout %}

## 概要

`mpl-core` RustクレートはAnchorプログラムからCoreと対話するために必要なすべてを提供します。ネイティブなAnchorアカウントデシリアライズのために`anchor`機能フラグを有効にしてください。

- `features = ["anchor"]`で`mpl-core`を追加
- Accounts構造体でAsset/Collectionをデシリアライズ
- プラグインデータを読み取るために`fetch_plugin()`を使用
- CPIビルダーがインストラクション呼び出しを簡素化

## 対象外

クライアントサイドJavaScript SDK（[JavaScript SDK](/ja/smart-contracts/core/sdk/javascript)を参照）、スタンドアロンRustクライアント（[Rust SDK](/ja/smart-contracts/core/sdk/rust)を参照）、クライアントからのCore Asset作成。

## クイックスタート

**移動先:** [インストール](#インストール) · [アカウントのデシリアライズ](#アカウントのデシリアライズ) · [プラグインアクセス](#プラグインのデシリアライズ) · [CPI例](#cpiインストラクションビルダー)

1. Cargo.tomlに`mpl-core = { version = "x.x.x", features = ["anchor"] }`を追加
2. `Account<'info, BaseAssetV1>`でAssetをデシリアライズ
3. `fetch_plugin::<BaseAssetV1, PluginType>()`でプラグインにアクセス
4. `CreateV2CpiBuilder`、`TransferV1CpiBuilder`などでCPI呼び出しを行う

## インストール

AnchorプロジェクトでCoreを使い始めるには、まず最新のクレートを追加します：

```rust
cargo add mpl-core
```

あるいは`cargo.toml`にバージョンを直接記述します：

```rust
[dependencies]
mpl-core = "x.x.x"
```

### 機能フラグ

Coreクレートでは、`mpl-core`の`anchor`機能フラグを有効化してAnchor向けの機能にアクセスできます。`cargo.toml`で次のように設定します：

```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```

### Core Rust SDKのモジュール

Core Rust SDKは次のモジュールで構成されています：

- `accounts`: プログラムのアカウント
- `errors`: プログラムのエラー
- `instructions`: インストラクションの作成、引数、CPIインストラクション
- `types`: プログラムで使用される型

各インストラクションの呼び出し方法の詳細は、[mpl-core docs.rs](https://docs.rs/mpl-core/0.7.2/mpl_core/)を参照するか、エディタで該当インストラクションを`Cmd + 左クリック（WindowsはCtrl）`して展開できます。

## アカウントのデシリアライズ

### デシリアライズ可能なアカウント

`mpl-core`クレートでデシリアライズできるアカウント構造体：

```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```

AnchorでCoreアカウントをデシリアライズする方法は2つあります。

- AnchorのAccountsリスト構造体を使う（多くの場合推奨）
- インストラクション関数の本体で`<Account>::from_bytes()`を直接呼ぶ

### AnchorのAccountsリスト方式

`anchor`フラグを有効にすると、`BaseAssetV1`と`BaseCollectionV1`をAccountsリスト構造体内で直接デシリアライズできます。

{% dialect-switcher title="Accountsのデシリアライズ" %}

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

### from_bytes()方式

`try_borrow_data()`でアセット/コレクションアカウント内部のデータを借用し、そのバイト列から構造体を生成します。

{% dialect-switcher title="Accountsのデシリアライズ" %}

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

アセット/コレクション内の個別プラグインへアクセスするには`fetch_plugin()`を使用します。これは、該当プラグインのデータが存在しない場合でもハードエラーを投げず、`null`を返して存在確認を容易にします。

`fetch_plugin()`はアセット/コレクション両方に利用でき、プラグイン型を指定してあらゆるプラグインに対応します。プラグイン内部のデータが必要な場合は、戻り値の中間の値を利用します。

{% dialect-switcher title="プラグインのデシリアライズ" %}

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

**注意**: `fetch_plugin()`は「外部プラグイン」には使いません。外部プラグインの読み取りには`fetch_external_plugin()`を使います（使い方は同様）。

## CPIインストラクションビルダー

Coreクレートの各インストラクションには**CpiBuilder**版が用意されています。`<インストラクション名>CpiBuilder`の形で使用し、多くのボイラープレートを隠蔽してコードを簡潔にします。

Coreで利用可能なインストラクション一覧は[docs.rsの一覧](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)を参照してください。

### CPI例

例として`CreateCollectionV2CpiBuilder`を取り上げます。

まず`CpiBuilder::new`にCoreプログラムの`AccountInfo`を渡して初期化します：

```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```

次に、エディタでCmd+左クリック（WindowsはCtrl）して必要なCPI引数を確認し、ビルダーに渡して呼び出します：

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```

## よくあるエラー

### `AccountNotInitialized`

AssetまたはCollectionアカウントが存在しないか、まだ作成されていません。

### `PluginNotFound`

フェッチしようとしているプラグインがAssetに存在しません。`fetch_plugin()`で確認してください。安全に`None`を返します。

### `InvalidAuthority`

署名者にこの操作の権限がありません。正しい権限が署名していることを確認してください。

## 注意事項

- ネイティブデシリアライズには常に`features = ["anchor"]`を有効にする
- 組み込みプラグインには`fetch_plugin()`、外部プラグインには`fetch_external_plugin()`を使用
- CPIビルダーはアカウント順序の複雑さを抽象化
- 完全なAPIリファレンスは[docs.rs/mpl-core](https://docs.rs/mpl-core/)を確認

## クイックリファレンス

### 一般的なCPIビルダー

| 操作 | CPIビルダー |
|-----------|-------------|
| Asset作成 | `CreateV2CpiBuilder` |
| Collection作成 | `CreateCollectionV2CpiBuilder` |
| Asset転送 | `TransferV1CpiBuilder` |
| Assetバーン | `BurnV1CpiBuilder` |
| Asset更新 | `UpdateV1CpiBuilder` |
| プラグイン追加 | `AddPluginV1CpiBuilder` |
| プラグイン更新 | `UpdatePluginV1CpiBuilder` |

### アカウントタイプ

| アカウント | 構造体 |
|---------|--------|
| Asset | `BaseAssetV1` |
| Collection | `BaseCollectionV1` |
| Hashed Asset | `HashedAssetV1` |
| Plugin Header | `PluginHeaderV1` |
| Plugin Registry | `PluginRegistryV1` |

## FAQ

### anchor機能フラグは必要ですか？

はい、Accounts構造体での直接デシリアライズには必要です。それなしでは、手動で`from_bytes()`を使用してください。

### プラグインが存在するかどうかを確認するにはどうすればよいですか？

`fetch_plugin()`を使用してください。`Option`を返すため、プラグインが存在しない場合でもエラーをスローしません。

### 外部プラグイン（Oracle、AppData）にアクセスできますか？

はい。`fetch_plugin()`の代わりに適切なキーで`fetch_external_plugin()`を使用してください。

### 利用可能なすべてのインストラクションはどこで見つけられますか？

[mpl-core docs.rs instructionsモジュール](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)を参照してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **CPI** | Cross-Program Invocation - あるプログラムから別のプログラムを呼び出す |
| **CpiBuilder** | CPI呼び出しを構築するためのヘルパー構造体 |
| **BaseAssetV1** | デシリアライズ用のCore Assetアカウント構造体 |
| **fetch_plugin()** | アカウントからプラグインデータを読み取る関数 |
| **anchor feature** | Anchorネイティブデシリアライズを有効にするCargo機能 |

## 関連ページ

- [Anchorステーキング例](/ja/smart-contracts/core/guides/anchor/anchor-staking-example) - 完全なステーキングプログラム
- [AnchorでCore Assetを作成](/ja/smart-contracts/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor) - ステップバイステップガイド
- [Rust SDK](/ja/smart-contracts/core/sdk/rust) - スタンドアロンRustクライアントの使用
- [mpl-core docs.rs](https://docs.rs/mpl-core/) - 完全なAPIリファレンス

---

*Metaplex Foundationによって管理・2026年1月最終確認・@metaplex-foundation/mpl-coreに適用*
