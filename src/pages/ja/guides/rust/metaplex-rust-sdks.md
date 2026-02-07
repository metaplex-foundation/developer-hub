---
title: Metaplex Rust SDK
metaTitle: Metaplex Rust SDK | ガイド
description: Metaplex Rust SDKの簡単な概要。
---

## はじめに

Metaplexは、私たちのプログラムのほとんどにRust SDKを提供しており、一貫性があり予測可能な出力と機能を持ち、私たちの製品を扱う開発者の統合時間の改善につながります。

## モジュール

Core Rust SDKは、いくつかのモジュールに整理されています：

- `accounts`: プログラムのアカウントを表します。
- `instructions`: 命令、命令引数、CPI命令の作成を促進します。
- `errors`: プログラムのエラーを列挙します。
- `types`: プログラムで使用される型を表します。

### アカウント

**accounts**モジュールは、オンチェーンアカウント構造に基づいて生成されます。これらは、RAWプログラム生成を使用しているか、Anchorなどのフレームワークを使用しているかに基づいて、多数の異なる方法を使用してデシリアライズできます。

これらは`<crate_name>::accounts`からアクセスできます。`mpl-core`の場合、次のようにアカウントにアクセスできます：

```rust
mpl_core::accounts
```

### 命令

各SDKには**instructions**モジュールが付属しており、ニーズに応じてボイラープレートの多くを取り除く、指定されたプログラムから提供される命令の複数のバージョンが付属しています。

以下の例は、`mpl-core`クレートから来るすべての`CreateV1`命令を示しています。

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

これらは`<crate_name>::instructions`からアクセスできます。`mpl-core`の場合、次のようにアカウントにアクセスできます：

```rust
mpl_core::instructions
```

### 型

各Metaplex Rust SDKには**types**モジュールが付属しており、初期のaccountsモジュール構造体にない可能性のあるすべての必要な追加型を提供します。

これらは`<crate_name>::types`からアクセスできます。`mpl-core`の場合、次のようにアカウントにアクセスできます：

```rust
mpl_core::types
```

### エラー

すべてのSDKに対して**errors**モジュールが生成されますが、これは単にその特定のプログラムのエラーリストを保持しているだけで、ユーザーはこのモジュールと相互作用する必要はありません。

## 命令ビルダー

Metaplex Rust SDKには、現在インポートできる各命令の2つの**Builder**バージョンも付属しています。これにより大量のコードが抽象化され、送信準備の整った命令が返されます。

これらには以下が含まれます：

- Builder
- CpiBuilder

[mpl-Coreクレートドキュメント](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)の`CreateV1`の場合、これらの命令が現在利用可能です。

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

### Builder

Builder命令は、クライアント側トランザクション用の命令を作成する必要がある場合に使用するよう設計されています。

ここで興味があるのは`CreateV1Builder`です。

ビルダーを初期化するために、`new`を呼び出すことができます。

```rust
CreateV1Builder::new();
```

この時点から、`Builder::`から生成された`new`関数に`ctrl + click`（PC）または`cmd + click`（Mac）することができ、ビルダーの`pub fn new()`に配置されます。少し上にスクロールすると、以下に概説されている`CreateV1Builder`の`pub struct`が表示されます。

```rust
pub struct CreateV1Builder {
    asset: Option<solana_program::pubkey::Pubkey>,
    collection: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    owner: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    log_wrapper: Option<solana_program::pubkey::Pubkey>,
    data_state: Option<DataState>,
    name: Option<String>,
    uri: Option<String>,
    plugins: Option<Vec<PluginAuthorityPair>>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}
```

これらは、ビルダーに渡される必要があるパブリックキーとデータの引数です。一部のアカウントもオプションである場合があります。これらのオプションアカウントは、プログラムでは全く必要ない場合や、省略された場合に別のアドレスにデフォルト設定される可能性があります。この動作は命令によって異なる場合があります。

再び`new()`関数をクリックし、今度は下にスクロールすると、追加のコメントが付いた個々の関数が表示されます。以下のケースでは、ownerはpayerにデフォルト設定されるため、payerもアセットの所有者になる場合は、ownerを渡す必要はありません。

```rust
/// `[optional account]`
    /// 新しいアセットの所有者。存在しない場合はオーソリティにデフォルト設定されます。
    #[inline(always)]
    pub fn owner(&mut self, owner: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.owner = owner;
        self
    }
```

以下は、`.instruction()`を使用してBuilderを閉じる命令を返す`CreateV1Builder`を使用した例です。

```rust
let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();
```

命令が準備できたので、RPCに送信する通常のSolanaトランザクションを作成する必要があります。これにはブロックハッシュと署名者が含まれます。

### 完全なBuilderの例

これは、Metaplex `Builder`関数を使用して命令を作成し、そのトランザクションをチェーンに送信する完全な例です。

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)
```

### CpiBuilder

`CpiBuilder`命令は、独自のプログラムからMetaplexプログラムから命令を呼び出して実行したい場合に使用するよう設計されています。

`CpiBuilders`について議論する完全な別のガイドがあり、こちらで見ることができます：

[Metaplexプログラムへのメンテナンス](/ja/guides/rust/how-to-cpi-into-a-metaplex-program)
