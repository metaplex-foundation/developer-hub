---
title: Solana Program Derived Addresses (PDAs) の理解
metaTitle: Solana Program Derived Addresses の理解 | ガイド
description: Solana Program Derived Addresses（PDAs）とその使用事例について学びます。
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
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