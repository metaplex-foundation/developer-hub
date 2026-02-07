---
title: Rustでの作業
metaTitle: Rustでの作業 | ガイド
description: Rustとメタプレックスプロトコルでの作業の簡単な概要。
---

## はじめに

Solanaで開発を行っていると、間違いなく「Rust」という言葉に出会うでしょう。これは、Solanaエコシステム内でプログラムを構築するための最も人気のある言語です。

Rustは、開発が初めての方にとってはかなり困難に見える場合がありますが、Rustとsolanaエコシステムを始めるためのリソースをいくつか紹介します。

**The Rust Book**

Rustを学ぶにはここから始めてください。言語を使用した基本から高度なコーディングまで扱います。

[https://doc.rust-lang.org/stable/book/](https://doc.rust-lang.org/stable/book/)

**Anchor**

Anchorは、セキュリティボイラープレートの大部分を除去し、それをあなたの代わりに処理することでSolanaプログラムの構築を支援し、開発プロセスを高速化するフレームワークです。

[https://www.anchor-lang.com/](https://www.anchor-lang.com/)

## ローカルでのRustスクリプトの作業

### Solanaクライアントのセットアップ

RustスクリプトでSolana RPCクライアントをセットアップするのは非常に簡単です。`solana_client`クレートを取得するだけです。

```rust
use solana_client::rpc_client;

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
```

### Metaplex Rust命令ビルダーの使用

Metaplex Rustクレートから来る各命令には、現在インポートできるその命令の`Builder`バージョンも付属しています。これにより大量のコードが抽象化され、送信準備の整った命令が返されます。

Coreの`CreateV1`命令を例に取りましょう（これは、このクレートおよびすべての他のMetaplexクレートからのすべての他の命令にも適用されます）。

[Mpl Coreクレートタイプドキュメント](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)の命令を見ると、多数の命令が利用可能であることがわかります。

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

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

これらは、ビルダーに渡される必要があるパブリックキーとデータの引数です。一部のアカウントもオプションで、他にデフォルト設定される場合があります。これは命令によって異なる場合があります。再び`new()`関数をクリックし、今度は下にスクロールすると、追加のコメントが付いた個々の関数が表示されます。以下のケースでは、ownerはpayerにデフォルト設定されるため、payerもアセットの所有者になる場合は、ownerを渡す必要はありません。

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
.       .instruction();
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

## プログラムでの作業

### CPI（クロスプログラム呼び出し）

以前に「プログラムにCPIする」または「プログラムでCPIを呼び出す」という用語が投げかけられるのを聞いたことがあり、「一体彼らは何について話しているのか？」と考えているかもしれません。

プログラムにCPIすることは、基本的にトランザクション中にあるプログラムが別のプログラムを呼び出すことです。

例として、私がプログラムを作成し、このトランザクション中にNftやアセットを転送する必要があるとします。私のプログラムは、すべての正しい詳細を提供すれば、Token MetadataまたはCoreプログラムにCPI呼び出しをして、転送命令を実行するよう依頼できます。

### Metaplex Rust トランザクション CPI ビルダーの使用

Metaplex Rustクレートから来る各命令には、現在インポートできるその命令の`CpiBuilder`バージョンも付属しています。これにより大量のコードが抽象化され、CpiBuilder自体から直接呼び出すことができます。

ここではCoreの`Transfer`命令を例に取りましょう（これは、このクレートおよびすべての他のMetaplexクレートからのすべての他の命令にも適用されます）。

[Mpl Coreクレートタイプドキュメント](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)の命令を見ると、多数の命令が利用可能であることがわかります。

```
TransferV1
TransferV1Builder
TransferV1Cpi
TransferV1CpiAccounts
TransferV1CpiBuilder
TransferV1InstructionArgs
TransferV1InstructionData
```

ここで興味があるのは`TransferV1CpiBuilder`です。

ビルダーを初期化するために、CpiBuilderで`new`を呼び出し、CPI呼び出しが行われるプログラムアドレスのプログラム`AccountInfo`を渡すことができます。

```rust
TransferV1CpiBuilder::new(ctx.accounts.mpl_core_program);
```

この時点から、`CpiBuilder::`から生成された`new`関数に`ctrl + click`（PC）または`cmd + click`（Mac）することができ、この特定のCPI呼び出しに必要なすべてのCPI引数（アカウントとデータ）が表示されます。

```rust
//TransferV1CpiBuilderのnew()関数

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(TransferV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            payer: None,
            authority: None,
            new_owner: None,
            system_program: None,
            log_wrapper: None,
            compression_proof: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

ご覧のとおり、これにはすべてのアカウントが必要でデータは不要で、記入するのがかなり簡単なCPI呼び出しです。

2番目のCpiBuilderを見てみますが、今度はCreateV1用で、`name`と`uri`（両方とも文字列）など、必要な追加のデータがここにあることがわかります。

```rust
//CreateV1CpiBuilderのnew()関数

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CreateV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            authority: None,
            payer: None,
            owner: None,
            update_authority: None,
            system_program: None,
            log_wrapper: None,
            data_state: None,
            name: None,
            uri: None,
            plugins: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

一部のアカウントはCpiBuilder内でオプションである場合があるため、使用ケースに何が必要で何が不要かを確認する必要があります。

以下は、TransferとCreateの両方のCpiBuilderを記入したものです。

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
```

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        .collection(context.accounts.collection)
        .authority(context.accounts.authority)
        .payer(context.accounts.payer)
        .owner(context.accounts.owner)
        .update_authority(context.accounts.update_authority)
        .system_program(context.accounts.system_program)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(args.asset_name)
        .uri(args.asset_uri)
        .plugins(args.plugins)
```

### 呼び出し

呼び出しとは、他のプログラムへのCPI呼び出しを実行するために使用される用語です。「トランザクションを送信する」というプログラムのバージョンです。

CPI呼び出しを呼び出す際には2つのオプションがあります。`invoke()`と`invoke_signed()`です。

#### invoke()

`invoke()`は、トランザクションが成功するために呼び出される命令にPDA署名者シードを渡す必要がない場合に使用されます。
ただし、元の命令に署名したアカウントは、cpi呼び出しへの署名者検証を自動的に通過します。

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke()

```

#### invoke_signed()

`invoke_signed()`は、PDAがcpi呼び出しで署名者である必要があるアカウントの1つである場合に使用されます。例えば、私たちのアセットを所有するプログラムがあり、プログラムのPDAアドレスの1つがそれの他方になったとしましょう。それを転送して所有者を他の人に変更するために、そのPDAがトランザクションに署名する必要があります。

PDAが再作成でき、プログラムに代わってcpi呼び出しに署名できるように、元のPDAシードとバンプを渡す必要があります。

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke_signed(signers)

```

### 完全なCpiBuilderの例

以下は、CoreプログラムのTransferV1命令を使用したCpiBuilderの完全な例です。

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
        .invoke()

```
