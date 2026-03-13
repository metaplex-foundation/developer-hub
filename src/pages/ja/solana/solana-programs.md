---
# remember to update dates also in /components/products/guides/index.js
title: Solanaプログラムと状態の概要
metaTitle: Solanaプログラムと状態の概要 | ガイド
description: SolanaプログラムとSolanaでアカウント状態にデータがどのように保存されるかについて学習します。
created: '04-19-2024'
updated: '04-19-2025'
keywords:
  - Solana programs
  - smart contracts
  - Solana accounts
  - Solana state management
  - Solana Rust programs
about:
  - Solana programs
  - accounts
  - instructions
  - state management
proficiencyLevel: Beginner
programmingLanguage:
  - Rust
faqs:
  - q: What are Solana programs?
    a: Solana programs are executable code that runs on the Solana blockchain, similar to smart contracts. They are stateless, typically written in Rust, and invoked by transactions.
  - q: How does state management work on Solana?
    a: State is managed externally from programs and stored in separate accounts. Programs modify state by updating data in accounts through instructions sent via transactions.
  - q: What types of accounts exist on Solana?
    a: Solana has Data Accounts for storing arbitrary data, SPL Token Accounts for managing token balances, and Program Accounts that contain executable program code.
---

## Solanaプログラム
Solanaプログラムは、Solanaブロックチェーン上で実行される**実行可能コード**です。これらは他のブロックチェーンプラットフォームのスマートコントラクトと似ていますが、Solana固有のいくつかの異なる特徴と最適化があります。

#### 主な特徴：
- **ステートレス**: Solanaプログラムは内部的に状態を保存しません。代わりに、状態はチェーン上の別々のアカウントに保存されます。
- **Rustで記述**: プログラムは通常Rustで書かれます。
- **トランザクションによって実行**: プログラムは、プログラムIDと必要なアカウントとデータを指定するトランザクションによって呼び出されます。

## アカウント
アカウントは**データとSOLの両方を保存するために使用**されます。各アカウントには所有者があり、これはそのデータを変更できるプログラムです。

#### アカウントの種類：
- **データアカウント**: プログラムによって使用される任意のデータを保存。
- **SPLトークンアカウント**: トークン残高を管理（EthereumのERC-20トークンに類似）。
- **プログラムアカウント**: Solanaプログラムの実行可能コードを含む。

## 命令
命令は、Solanaプログラムに送信される**操作**です。これらはトランザクションに含まれ、プログラムが操作すべきアカウントと、操作を実行するために必要な追加データを指定します。

#### 命令の主要要素：
- **プログラムID**: 実行されるプログラムを識別。
- **アカウント**: 命令が読み取りまたは書き込みを行うアカウントのリスト。
- **データ**: 命令を実行するために必要なカスタムデータ。

## 状態管理
Solanaでは、状態はプログラムから**外部的に管理**され、アカウントに保存されます。この状態とロジックの分離により、より高いスケーラビリティと効率性が可能になります。

#### 状態管理のワークフロー：
- **アカウント作成**: データを保存するためのアカウントを作成。
- **プログラム実行**: 読み取りまたは書き込みを行うアカウントを指定する命令でプログラムを実行。
- **状態更新**: プログラムがアカウント内のデータを更新することで状態を変更。

#### ワークフローの例
1. プログラムの定義：
   - カウンターをインクリメントするなど、特定のタスクを実行するためのRustプログラムを書く。
2. プログラムのデプロイ：
   - プログラムをコンパイルしてSolanaブロックチェーンにデプロイ。
3. アカウントの作成：
   - プログラムの状態を保存するためのアカウントを作成。
4. 命令の送信：
   - プログラムを呼び出すための命令を含むトランザクションを送信し、使用するアカウントとデータを指定。

## コード例
以下は、アカウントに保存された値をインクリメントするRustで書かれたSolanaプログラムの簡単な例です。

```rust
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    program_error::ProgramError,
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    // アカウントがプログラムによって所有されていることを確認
    if account.owner != program_id {
        msg!("アカウントがプログラムによって所有されていません");
        return Err(ProgramError::IncorrectProgramId);
    }

    // 命令データをデシリアライズ（インクリメント値）
    let increment_amount = instruction_data[0];

    // 値をインクリメント
    let mut data = account.try_borrow_mut_data()?;
    data[0] = data[0].wrapping_add(increment_amount);

    msg!("インクリメント後の値: {}", data[0]);

    Ok(())
}
```
