---
title: AnchorでMetaplex Coreを使う
metaTitle: AnchorでMetaplex Coreを使う | Core
description: Anchorプログラム内でMetaplex Coreクレートを活用する方法を学びます。
---

## インストール

AnchorプロジェクトでCoreを使い始めるには、まず最新のクレートを追加します:

```rust
cargo add mpl-core
```

あるいは`cargo.toml`にバージョンを直接記述します:

```rust
[dependencies]
mpl-core = "x.x.x"
```

### フィーチャーフラグ

Coreクレートでは、`mpl-core`の`anchor`機能フラグを有効化してAnchor向けの機能にアクセスできます。`cargo.toml`で次のように設定します:

```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```

### Core Rust SDKのモジュール

Core Rust SDKは次のモジュールで構成されています:

- `accounts`: プログラムのアカウント
- `errors`: プログラムのエラー
- `instructions`: 命令の作成、引数、CPI命令
- `types`: プログラムで使用される型

各命令の呼び出し方法の詳細は、[mpl-core docs.rs](https://docs.rs/mpl-core/0.7.2/mpl_core/)を参照するか、エディタで該当命令を`Cmd + 左クリック（WindowsはCtrl）`して展開できます。

## アカウントのデシリアライズ

### デシリアライズ可能なアカウント

`mpl-core`クレートでデシリアライズできるアカウント構造体:

```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```

AnchorでCoreアカウントをデシリアライズする方法は2つあります。

- AnchorのAccountsリスト構造体を使う（多くの場合推奨）
- 命令関数の本体で`<Account>::from_bytes()`を直接呼ぶ

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

注意: `fetch_plugin()`は「外部プラグイン」には使いません。外部プラグインの読み取りには`fetch_external_plugin()`を使います（使い方は同様）。

## CPIインストラクションビルダー

Coreクレートの各命令には**CpiBuilder**版が用意されています。`<命令名>CpiBuilder`の形で使用し、多くのボイラープレートを隠蔽してコードを簡潔にします。

Coreで利用可能な命令一覧は[docs.rsの一覧](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)を参照してください。

### CPI例

例として`CreateCollectionV2CpiBuilder`を取り上げます。

まず`CpiBuilder::new`にCoreプログラムの`AccountInfo`を渡して初期化します。

```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```

次に、エディタでCmd+左クリック（WindowsはCtrl）して必要なCPI引数を確認し、ビルダーに渡して呼び出します。

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```

