---
title: Metaplexプログラムへのファイバ方法
metaTitle: Metaplexプログラムへの乙方法 | ガイド
description: 各MetaplexプログラムへのCPIを実行する際にMetaplexが一貫性のある体験を提供する方法の概要。
---

## はじめに

以前に「プログラムにCPIする」または「プログラムでCPIを呼び出す」という用語が投げかけられるのを聞いたことがあり、「彼らは何について話しているのか？」と考えているかもしれません。

CPI（Cross Program Invocation、クロスプログラム呼び出し）は、あるプログラムが別のプログラムの命令を呼び出すことです。

例として、私がプログラムを作成し、このトランザクション中にNFTやアセットを転送する必要があるとします。私のプログラムは、すべての正しい詳細を提供すれば、Token MetadataまたはCoreプログラムにCPI呼び出しをして、転送命令を実行するよう依頼できます。

## Metaplex Rust トランザクション CPI ビルダーの使用

Metaplex Rustクレートから来る各命令には、現在インポートできるその命令の`CpiBuilder`バージョンも付属しています。これにより大量のコードが抽象化され、`CpiBuilder`自体から直接呼び出すことができます。

ここではCoreの`Transfer`命令を例に取りましょう（これは、このクレートおよびすべての他のMetaplexクレートからのすべての他の命令にも適用されます）。

[MPL Coreクレートタイプドキュメント](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)の命令を見ると、多数の命令が利用可能であることがわかります。

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

ビルダーを初期化するために、`CpiBuilder`で`new`を呼び出し、CPI呼び出しが行われるプログラムアドレスのプログラム`AccountInfo`を渡すことができます。

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

一部のアカウントは`CpiBuilder`内でオプションである場合があるため、使用ケースに何が必要で何が不要かを確認する必要があります。

以下は、TransferとCreateの両方の`CpiBuilder`バージョンを記入したものです。

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

## 呼び出し

呼び出しとは、他のプログラムへのCPI呼び出しを実行するために使用される用語で、「トランザクションを送信する」というプログラムのバージョンです。

CPI呼び出しを呼び出す際には2つのオプションがあります。`invoke()`と`invoke_signed()`です。

### invoke()

`invoke()`は、トランザクションが成功するために呼び出される命令にPDA署名者シードを渡す必要がない場合に使用されます。
ただし、元の命令に署名したアカウントは、cpi呼び出しへの署名者検証を自動的に通過します。

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke()

```

### invoke_signed()

`invoke_signed()`は、PDAがcpi呼び出しで署名者である必要があるアカウントの1つである場合に使用されます。例えば、私たちのアセットを所有するプログラムがあり、プログラムのPDAアドレスの1つがその所有者になったとしましょう。それを転送して所有者を他の人に変更するために、そのPDAがトランザクションに署名する必要があります。

PDAが再作成でき、プログラムに代わってcpi呼び出しに署名できるように、元のPDAシードとバンプを渡す必要があります。

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke_signed(signers)
```

## 完全なCpiBuilderの例

以下は、CoreプログラムのTransferV1命令を使用した`CpiBuilder`使用の完全な例です。

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
