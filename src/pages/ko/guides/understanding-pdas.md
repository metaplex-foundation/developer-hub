---
title: Solana 프로그램 파생 주소(PDA) 이해하기
metaTitle: Solana 프로그램 파생 주소 이해하기 | 가이드
description: Solana 프로그램 파생 주소(PDA)와 그 사용 사례에 대해 학습합니다.
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
---

## 개요
**프로그램 파생 주소(PDA)**는 결정론적으로 파생되고 표준 공개 키처럼 보이지만 연관된 개인 키가 없는 Solana에서 사용되는 특별한 유형의 계정입니다.

PDA를 파생한 프로그램만이 해당 주소/계정과 관련된 트랜잭션에 서명할 수 있습니다. 이는 PDA가 Ed25519 곡선(타원곡선 암호화)에 나타나지 않기 때문입니다. 곡선에 나타나는 주소만이 일치하는 개인 키를 가질 수 있으므로 PDA는 프로그램 내에서 트랜잭션에 서명하는 안전한 방법입니다. 이는 외부 사용자가 PDA 주소에 대한 유효한 서명을 생성하여 PDA/프로그램을 대신하여 서명할 수 없음을 의미합니다.

## PDA의 역할
PDA는 주로 다음과 같은 용도로 사용됩니다:

- **상태 관리**: PDA를 통해 프로그램은 계정을 생성하고 데이터를 결정론적 PDA 주소에 저장할 수 있으며, 이를 통해 프로그램이 읽기 및 쓰기 액세스를 할 수 있습니다.
- **트랜잭션 승인**: PDA를 소유한 프로그램만이 이와 관련된 트랜잭션을 승인할 수 있어 안전한 제어 액세스를 보장합니다. 예를 들어, 이를 통해 프로그램과 PDA 계정이 토큰/NFT를 저장/소유할 수 있으며, 토큰/NFT의 현재 소유자가 해당 아이템을 다른 계정으로 전송하는 트랜잭션에 서명해야 합니다.

## PDA가 파생되는 방법
PDA는 프로그램 ID와 시드 값들의 조합을 사용하여 파생됩니다. 파생 과정은 이러한 값들을 함께 해싱하고 결과 주소가 유효한지 확인하는 것을 포함합니다.

### 파생 과정
1. **프로그램 ID 선택**: PDA가 파생되는 프로그램의 공개 키입니다.
2. **시드 선택**: 프로그램 ID와 함께 결합된 값을 기반으로 알고리즘적으로 PDA를 결정론적으로 생성할 하나 이상의 시드 값입니다.
3. **PDA 계산**: `Pubkey::find_program_address` 함수를 사용하여 PDA를 파생합니다. 이 함수는 파생된 주소가 유효하고 일반적인(비PDA) 주소와 충돌할 수 없음을 보장합니다.

## Rust 예제
다음은 Rust로 작성된 Solana 프로그램에서 PDA를 파생하는 예제입니다:

```rust
use solana_program::{
    pubkey::Pubkey,
    system_instruction,
    system_program,
    sysvar::rent::Rent,
    program::invoke_signed,
};

// PDA를 파생하는 함수
fn derive_pda(program_id: &Pubkey, seeds: &[&[u8]]) -> (Pubkey, u8) {
    Pubkey::find_program_address(seeds, program_id)
}

// 사용 예제
fn example_usage(program_id: &Pubkey) {
    // 시드 정의
    let seed1 = b"seed1";
    let seed2 = b"seed2";

    // PDA 파생
    let (pda, bump_seed) = derive_pda(program_id, &[seed1, seed2]);

    // PDA 출력
    println!("Derived PDA: {}", pda);
}
```
**실용적인 사용 사례:** 계정 생성
프로그램은 종종 PDA를 사용하여 프로그램별 계정을 생성하고 관리합니다. 다음은 PDA를 사용하여 계정을 생성하는 방법의 예제입니다:

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

    // PDA로 지시사항에 서명
    let signers_seeds = &[&seeds[..], &[bump_seed]];

    invoke_signed(
        &create_account_ix,
        &[payer_account_info, pda_account_info],
        signers_seeds,
    )?;

    Ok(())
}
```
