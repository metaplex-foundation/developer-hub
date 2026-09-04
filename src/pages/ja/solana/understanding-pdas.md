---
# remember to update dates also in /components/products/guides/index.js
title: Solana Program Derived Addresses (PDAs) の理解
metaTitle: Solana Program Derived Addresses の理解 | ガイド
description: Solana Program Derived Addresses（PDAs）とその使用事例について学びます。
created: '04-19-2024'
updated: '09-03-2026'
keywords:
  - Program Derived Addresses
  - PDA
  - Solana PDAs
  - Ed25519 curve
  - Solana PDA tutorial
  - deterministic addresses
about:
  - Program Derived Addresses
  - Solana account management
  - deterministic key derivation
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
faqs:
  - q: What are Program Derived Addresses (PDAs) on Solana?
    a: PDAs are special account addresses deterministically derived from a program ID and seed values. They have no associated private keys, meaning only the owning program can sign transactions involving them.
  - q: Why can't PDAs have private keys?
    a: PDAs are derived to fall off the Ed25519 elliptic curve, which means no valid private key exists for these addresses. This ensures only the program that derived the PDA can authorize transactions for it.
  - q: How are PDAs derived?
    a: PDAs are derived using Pubkey::find_program_address with a program ID and seed values. The function hashes these together and ensures the resulting address is not on the Ed25519 curve.
  - q: What are common use cases for PDAs?
    a: PDAs are used to manage program state by creating deterministic accounts for data storage, and to authorize transactions where only the owning program can sign on behalf of the PDA.
---

## 概要
**Program Derived Addresses (PDAs)** は、Solana上で使用される特別なタイプのアカウントで、決定論的に導出され、標準的なパブリックキーのように見えますが、対応する秘密鍵がありません。

PDAを導出したプログラムのみが、そのアドレス/アカウントに関わるトランザクションに署名できます。これは、PDAがEd25519曲線（楕円曲線暗号）上に現れないという事実によるものです。曲線上に現れるアドレスのみがマッチングする秘密鍵を持つことができ、PDAをプログラム内からトランザクションに署名する安全な方法にしています。これは、外部ユーザーがPDAアドレスに対して有効な署名を生成し、PDA/プログラムの代わりに署名することができないことを意味します。

## PDAの役割
PDAは主に以下の用途に使用されます：

- **状態管理**: PDAによりプログラムはアカウントを作成し、決定論的なPDAアドレスにデータを保存でき、プログラムが読み書きアクセスを行うことができます。
- **トランザクションの認可**: PDAを所有するプログラムのみがそれに関わるトランザクションを認可でき、安全な制御されたアクセスを確保します。例えば、これによりプログラムとPDAアカウントがトークン/NFTを保存/所有でき、アイテムを他のアカウントに転送するトランザクションに署名するためにはトークン/NFTの現在の所有者が必要になります。

## PDAの導出方法
PDAは、プログラムIDとシード値のセットの組み合わせを使用して導出されます。導出プロセスでは、これらの値をハッシュ化し、結果として得られるアドレスが有効であることを確認します。

### 導出プロセス
1. **プログラムIDの選択**: PDAが導出されるプログラムのパブリックキー。
2. **シードの選択**: プログラムIDと組み合わせて、結合された値に基づいて決定論的にPDAをアルゴリズム的に生成する1つ以上のシード値。
3. **PDAの計算**: `Pubkey::find_program_address`関数を使用してPDAを導出します。この関数は、導出されたアドレスが有効であり、通常の（非PDA）アドレスと衝突しないことを保証します。

### 実際に試す: Token Metadata の PDA

すべてのトークンのメタデータアカウントは Token Metadata プログラムの PDA で、3 つのシード（文字列 `"metadata"`、プログラム ID `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`、mint）から導出されます。下のフローはブラウザ内で `find_program_address` を実行します。3 番目の入力の mint を任意の mint に置き換えると、メタデータアドレスが更新されます。これは `findMetadataPda(umi, { mint })` が返す値そのものです。

{% video src="https://plgrnd.io/embed?theme=dark&ref=metaplex-docs#flow=N4IgbiBcDMA0IDsD2ATApgZygbVASxShAGMBGEeAFwE8AHNIgYQHkBZVgUQDkAVCkWkgx5KeJAiigAHlAAM8alAC0AJgAssgL7wUAQ0q7JISmimUirNAdoAbUwAIeSANZoE9ywb0H7ABQAiAIIAOgihGGhoKBj2ALz22MEgALZWut66SbD2lC5u9qle+rr2tABOSADmZbrJ9gTZyXgIlAC6oeVVNXXxua7uhenFpRXVtaGhHCgiOQAWaAXNlPYAFJSzeGUojhwAGjz2yOgAlPa6CNsA7vrEs3MLgxlnxMRIAK4tZygoZZgxb7RvGgAHSODYxPAxUy6YiUGzUeyXWb6ewAM2aKE8QwMvj0KzeTWywEWn00p1eyVobxMGGBIE02nwhEgxnIVDoDBZPD2fHggmEonERhkkHkIEUou0IAyRhMZiIj2K9MZIAIREoKn4NHoRG5+34-JEYgkkGkcgUUAAnFodErTcZTOYWYMAI4AIykUgAqmgti6VAAOYgAK1IACU3YEAOrOACaAEVktBqG6AF7Bt0ANl0AbdlAArKQA1JSFgGbAmeroFqObqeQahEahfaRWKJUWbdK7aA5U6QBxfMGAGJR775wJvVEugDK05daFYKhdXFIUlTKd0tEYAYA4mpLhwdzvnAAtS7UHj+SikCDlyss2hs4y1lkBQINgXG4VQNQqNtWzsZVNO9VWZaUn21TkQH8ABJadfAAGUCWMPybE0zUgTNM3-SANClICe0dIh8ykaAAwAaVoNRZjAFAkGSHhGAQRgykCBBqDUL1KFYLj8zKeMACEUAEzNaCkFRyNIL08DUfMoxdZUK1AogUE1dkdRZWD4KQlC+UbQV0JAEUsJw0h80A7sHXlFkVHzfNFPvEg1OfDSQBYdhuF5AR9K-FsoBMi1ICUUhSAsgxZSIlksSeGFXg+ZZ0h+P5VlRJAynuewvWnfxGBJShTnObZ1gWYhznEPBSpsew3QJWg6QZVp4CiSpMBwRypGoJRmrQAB9HqNSUXslDKPBKlmSglEfSbRm6GCUCUOxUXMeAMHeMpiCgjV+FWt51rQAAJQq7HVFRBsdYbRvGrVdDKFq+0fa7bqsQ6LmOh9SGmrpajmha0CW+klLVFkOq6lAWr668zrMC6xomqaIiiABiWRfv+la1o29Unx2vaXpQN7WShiaRthx67qIB6qBuu68YJ+HIhQZHUfMFUgaMzruoh06hpJ8bJo+hHGY+xblpAHHMZZLb0d2jbac27nzt50WDCe+6IOp56jqg+mkeFv6WcBsCQc5-roCJmG+Z1xnTpF7aMc26tpdxrWq3NpWyasCn1dVuWvaUQXEZt-WAfajmwd6nqpsBXQLYmlAPuaKkJttp2JYEbH7d997Jr0WOPb7eP86z8ClET6lmZD5TgbD8HI4+mrKVjpRVNLhAk4r1PtYzmWDpd7OG9oPOqdVlTnJVmm++lU6y+T4PNFaTQgA" embed=true /%}

```javascript
import { findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

const [metadataPda, bump] = findMetadataPda(umi, { mint })
```

## Rustでの例
以下は、Rustで書かれたSolanaプログラムでPDAを導出する例です：

```rust
use solana_program::{
    pubkey::Pubkey,
    system_instruction,
    system_program,
    sysvar::rent::Rent,
    program::invoke_signed,
};

// PDAを導出する関数
fn derive_pda(program_id: &Pubkey, seeds: &[&[u8]]) -> (Pubkey, u8) {
    Pubkey::find_program_address(seeds, program_id)
}

// 使用例
fn example_usage(program_id: &Pubkey) {
    // シードを定義
    let seed1 = b"seed1";
    let seed2 = b"seed2";

    // PDAを導出
    let (pda, bump_seed) = derive_pda(program_id, &[seed1, seed2]);

    // PDAを出力
    println!("Derived PDA: {}", pda);
}
```
**実用的な使用事例：** アカウント作成
プログラムは、プログラム固有のアカウントを作成および管理するためにPDAを使用することがよくあります。以下は、PDAを使用してアカウントを作成する方法の例です：

```rust

use solana_program::{
    pubkey::Pubkey,
    system_instruction,
    system_program,
    sysvar::rent::Rent,
    program::invoke_signed,
};

fn create_account_with_pda(
    program_id: &Pubkey,
    payer: &Pubkey,
    seeds: &[&[u8]],
    lamports: u64,
    space: u64,
) -> Result<(), ProgramError> {
    let (pda, bump_seed) = Pubkey::find_program_address(seeds, program_id);

    let create_account_ix = system_instruction::create_account(
        payer,
        &pda,
        lamports,
        space,
        program_id,
    );

    // PDAで命令に署名
    let signers_seeds = &[&seeds[..], &[bump_seed]];

    invoke_signed(
        &create_account_ix,
        &[payer_account_info, pda_account_info],
        signers_seeds,
    )?;

    Ok(())
}
```
