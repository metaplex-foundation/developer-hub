---
# remember to update dates also in /components/products/guides/index.js
title: Solana 프로그램 파생 주소(PDA) 이해하기
metaTitle: Solana 프로그램 파생 주소 이해하기 | 가이드
description: Solana 프로그램 파생 주소(PDA)와 그 사용 사례에 대해 학습합니다.
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

### 직접 해보기: Token Metadata PDA

모든 토큰의 메타데이터 계정은 Token Metadata 프로그램의 PDA이며, 세 개의 시드(문자열 `"metadata"`, 프로그램 ID `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`, mint)로부터 파생됩니다. 아래 플로우는 브라우저에서 `find_program_address`를 실행합니다. 세 번째 입력의 mint를 다른 mint로 바꾸면 메타데이터 주소가 갱신됩니다. 이것이 바로 `findMetadataPda(umi, { mint })`가 반환하는 값입니다.

{% video src="https://plgrnd.io/embed?theme=dark&ref=metaplex-docs#flow=N4IgbiBcDMA0IDsD2ATApgZygbVASxShAGMBGEeAFwE8AHNIgYQHkBZVgUQDkAVCkWkgx5KeJAiigAHlAAM8alAC0AJgAssgL7wUAQ0q7JISmimUirNAdoAbUwAIeSANZoE9ywb0H7ABQAiAIIAOgihGGhoKBj2ALz22MEgALZWut66SbD2lC5u9qle+rr2tABOSADmZbrJ9gTZyXgIlAC6oeVVNXXxua7uhenFpRXVtaGhHCgiOQAWaAXNlPYAFJSzeGUojhwAGjz2yOgAlPa6CNsA7vrEs3MLgxlnxMRIAK4tZygoZZgxb7RvGgAHSODYxPAxUy6YiUGzUeyXWb6ewAM2aKE8QwMvj0KzeTWywEWn00p1eyVobxMGGBIE02nwhEgxnIVDoDBZPD2fHggmEonERhkkHkIEUou0IAyRhMZiIj2K9MZIAIREoKn4NHoRG5+34-JEYgkkGkcgUUAAnFodErTcZTOYWYMAI4AIykUgAqmgti6VAAOYgAK1IACU3YEAOrOACaAEVktBqG6AF7Bt0ANl0AbdlAArKQA1JSFgGbAmeroFqObqeQahEahfaRWKJUWbdK7aA5U6QBxfMGAGJR775wJvVEugDK05daFYKhdXFIUlTKd0tEYAYA4mpLhwdzvnAAtS7UHj+SikCDlyss2hs4y1lkBQINgXG4VQNQqNtWzsZVNO9VWZaUn21TkQH8ABJadfAAGUCWMPybE0zUgTNM3-SANClICe0dIh8ykaAAwAaVoNRZjAFAkGSHhGAQRgykCBBqDUL1KFYLj8zKeMACEUAEzNaCkFRyNIL08DUfMoxdZUK1AogUE1dkdRZWD4KQlC+UbQV0JAEUsJw0h80A7sHXlFkVHzfNFPvEg1OfDSQBYdhuF5AR9K-FsoBMi1ICUUhSAsgxZSIlksSeGFXg+ZZ0h+P5VlRJAynuewvWnfxGBJShTnObZ1gWYhznEPBSpsew3QJWg6QZVp4CiSpMBwRypGoJRmrQAB9HqNSUXslDKPBKlmSglEfSbRm6GCUCUOxUXMeAMHeMpiCgjV+FWt51rQAAJQq7HVFRBsdYbRvGrVdDKFq+0fa7bqsQ6LmOh9SGmrpajmha0CW+klLVFkOq6lAWr668zrMC6xomqaIiiABiWRfv+la1o29Unx2vaXpQN7WShiaRthx67qIB6qBuu68YJ+HIhQZHUfMFUgaMzruoh06hpJ8bJo+hHGY+xblpAHHMZZLb0d2jbac27nzt50WDCe+6IOp56jqg+mkeFv6WcBsCQc5-roCJmG+Z1xnTpF7aMc26tpdxrWq3NpWyasCn1dVuWvaUQXEZt-WAfajmwd6nqpsBXQLYmlAPuaKkJttp2JYEbH7d997Jr0WOPb7eP86z8ClET6lmZD5TgbD8HI4+mrKVjpRVNLhAk4r1PtYzmWDpd7OG9oPOqdVlTnJVmm++lU6y+T4PNFaTQgA" embed=true /%}

```javascript
import { findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

const [metadataPda, bump] = findMetadataPda(umi, { mint })
```

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
