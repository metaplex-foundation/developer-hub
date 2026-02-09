---
title: Solana 프로그램과 상태 개요
metaTitle: Solana 프로그램과 상태 개요 | 가이드
description: Solana 프로그램과 Solana에서 계정 상태에 데이터가 저장되는 방법에 대해 학습합니다.
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
---

## Solana 프로그램
Solana 프로그램은 Solana 블록체인에서 실행되는 **실행 가능한 코드**입니다. 이들은 다른 블록체인 플랫폼의 스마트 컨트랙트와 유사하지만, Solana에 특화된 독특한 특성과 최적화가 있습니다.

#### 주요 특성:
- **무상태**: Solana 프로그램은 내부적으로 상태를 저장하지 않습니다. 대신, 상태는 체인의 별도 계정에 저장됩니다.
- **Rust로 작성**: 프로그램은 일반적으로 Rust로 작성됩니다.
- **트랜잭션에 의해 실행**: 프로그램은 프로그램 ID와 필요한 계정 및 데이터를 지정하는 트랜잭션에 의해 호출됩니다.

## 계정
계정은 **데이터와 SOL을 저장하는 데 사용됩니다**. 각 계정에는 해당 데이터를 수정할 수 있는 프로그램인 소유자가 있습니다.

#### 계정 유형:
- **데이터 계정**: 프로그램이 사용하는 임의의 데이터를 저장합니다.
- **SPL 토큰 계정**: 토큰 잔액을 관리합니다 (Ethereum의 ERC-20 토큰과 유사).
- **프로그램 계정**: Solana 프로그램의 실행 가능한 코드를 포함합니다.

## 지시사항
지시사항은 Solana 프로그램에 전송되는 **작업**입니다. 이들은 트랜잭션에 포함되며 프로그램이 작업해야 할 계정과 작업을 수행하는 데 필요한 추가 데이터를 지정합니다.

#### 지시사항의 주요 요소:
- **프로그램 ID**: 실행할 프로그램을 식별합니다.
- **계정**: 지시사항이 읽거나 쓸 계정의 목록입니다.
- **데이터**: 지시사항을 수행하는 데 필요한 커스텀 데이터입니다.

## 상태 관리
Solana에서 상태는 프로그램에서 **외부적으로 관리되며**, 계정에 저장됩니다. 이러한 상태와 로직의 분리는 더 높은 확장성과 효율성을 가능하게 합니다.

#### 상태 관리 워크플로우:
- **계정 생성**: 데이터를 저장할 계정을 생성합니다.
- **프로그램 실행**: 읽거나 쓸 계정을 지정하는 지시사항으로 프로그램을 실행합니다.
- **상태 업데이트**: 프로그램이 계정의 데이터를 업데이트하여 상태를 수정합니다.

#### 예제 워크플로우
1. 프로그램 정의:
   - 카운터 증가와 같은 특정 작업을 수행하는 Rust 프로그램을 작성합니다.
2. 프로그램 배포:
   - 프로그램을 컴파일하고 Solana 블록체인에 배포합니다.
3. 계정 생성:
   - 프로그램의 상태를 저장할 계정을 생성합니다.
4. 지시사항 전송:
   - 사용할 계정과 데이터를 지정하여 프로그램을 호출하는 지시사항이 포함된 트랜잭션을 전송합니다.

## 예제 코드
다음은 계정에 저장된 값을 증가시키는 Rust로 작성된 간단한 Solana 프로그램의 예제입니다.

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

    // 계정이 프로그램 소유인지 확인
    if account.owner != program_id {
        msg!("Account is not owned by the program");
        return Err(ProgramError::IncorrectProgramId);
    }

    // 지시사항 데이터 역직렬화 (증가값)
    let increment_amount = instruction_data[0];

    // 값 증가
    let mut data = account.try_borrow_mut_data()?;
    data[0] = data[0].wrapping_add(increment_amount);

    msg!("Value after increment: {}", data[0]);

    Ok(())
}
```
