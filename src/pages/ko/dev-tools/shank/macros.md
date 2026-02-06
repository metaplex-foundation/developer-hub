---
title: Shank 매크로 참조
metaTitle: Shank 매크로 참조 | Metaplex Developer Hub
description: Solana 프로그램에서 사용되는 Shank derive 매크로 및 속성에 대한 완전한 참조
---

Shank는 IDL 추출을 위해 Solana Rust 프로그램에 주석을 달기 위해 사용되는 여러 매크로를 제공합니다:

## ShankAccount

Shank가 직렬화/역직렬화 가능한 데이터를 포함하는 계정으로 간주할 *구조체*에 주석을 답니다.

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct Metadata {
    pub update_authority: Pubkey,
    pub mint: Pubkey,
    pub primary_sale_happened: bool,
}
```

### 필드 속성

#### `#[idl_type(...)]` 속성

이 속성을 사용하면 IDL을 생성할 때 Shank가 필드 타입을 해석하는 방법을 오버라이드할 수 있습니다. 다음과 같은 경우에 유용합니다:

1. 내부 타입으로 처리되어야 하는 래퍼 타입을 가진 필드
2. 열거형 값을 원시 타입으로 저장하는 필드
3. 더 간단한 표현이 필요한 복잡한 타입을 가진 필드

두 가지 형식을 지원합니다:

- 문자열 리터럴: `#[idl_type("TypeName")]`
- 직접 타입: `#[idl_type(TypeName)]`

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct MyAccount {
    // u8로 저장되지만 열거형을 나타내는 필드
    #[idl_type("MyEnum")]
    pub enum_as_byte: u8,

    // 더 간단한 타입으로 처리되는 래퍼 타입을 가진 필드
    #[idl_type("u64")]
    pub wrapped_u64: CustomU64Wrapper,
}
```

#### `#[padding]` 속성

필드가 패딩에 사용되며 IDL에서 그렇게 표시되어야 함을 나타냅니다.

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct PaddedAccount {
    pub active_field: u64,

    #[padding]
    pub unused_space: [u8; 32],

    pub another_field: String,
}
```

**참고**: *ShankAccount* 구조체의 필드는 `BorshSerialize`, `BorshDeserialize` 또는 `ShankType`으로 주석이 달린 경우 다른 타입을 참조할 수 있습니다.

## ShankInstruction

`#[account]` 속성을 포함하도록 프로그램 *Instruction* `Enum`에 주석을 답니다.

```rust
#[derive(Debug, Clone, ShankInstruction, BorshSerialize, BorshDeserialize)]
#[rustfmt::skip]
pub enum MyProgramInstruction {
    /// 주어진 이름으로 새 계정을 생성합니다
    #[account(0, writable, signer, name="user", desc="사용자 계정")]
    #[account(1, writable, name="account", desc="생성할 계정")]
    #[account(2, name="system_program", desc="시스템 프로그램")]
    CreateAccount {
        name: String,
        space: u64,
    },

    /// 기존 계정을 업데이트합니다
    #[account(0, writable, signer, name="authority", desc="계정 권한")]
    #[account(1, writable, name="account", desc="업데이트할 계정")]
    UpdateAccount {
        new_name: String,
    },
}
```

### `#[account]` 속성

각 명령어 변형에 대한 계정을 구성합니다. 속성은 다음 형식을 따릅니다:

```rust
#[account(index, mutability?, signer?, name="account_name", desc="Account description")]
```

여기서:

- `index`: 계정 배열에서 계정의 위치 (0부터 시작)
- `mutability?`: 선택사항. 계정이 수정될 경우 `writable` 사용
- `signer?`: 선택사항. 계정이 거래에 서명해야 하는 경우 `signer` 사용
- `name="account_name"`: 필수. 계정의 이름
- `desc="Account description"`: 선택사항. 계정의 목적에 대한 설명

### 계정 속성 예제

```rust
// 읽기 전용 계정
#[account(0, name="mint", desc="민트 계정")]

// 쓰기 가능한 계정
#[account(1, writable, name="token_account", desc="수정할 토큰 계정")]

// 서명자 계정
#[account(2, signer, name="owner", desc="계정 소유자")]

// 쓰기 가능한 서명자 계정
#[account(3, writable, signer, name="authority", desc="프로그램 권한")]

// 선택적 계정
#[account(4, optional, name="delegate", desc="선택적 위임 계정")]
```

## ShankType

계정이나 명령어에서 사용자 정의 타입으로 사용되는 직렬화 가능한 데이터가 있는 구조체나 열거형을 표시합니다.

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub enum TokenState {
    Uninitialized,
    Initialized,
    Frozen,
}

#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    pub share: u8,
}
```

## ShankBuilder

각 주석이 달린 명령어에 대한 명령어 빌더를 생성하여 명령어 구성을 간소화하는 빌더 패턴 구현을 생성합니다.

```rust
#[derive(Debug, Clone, ShankInstruction, ShankBuilder, BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    CreateAccount { name: String, space: u64 },
}
```

이렇게 하면 유창한 명령어 생성을 허용하는 빌더 메소드가 생성됩니다.

## ShankContext

명령어를 위한 계정 구조체를 생성하여 Anchor 프레임워크 패턴과 통합되는 프로그램 명령어를 위한 컨텍스트 구조를 생성합니다.

```rust
#[derive(Debug, Clone, ShankInstruction, ShankContext, BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    #[account(0, writable, signer, name="payer")]
    #[account(1, writable, name="account")]
    CreateAccount { name: String },
}
```

이렇게 하면 명령어에서 정의된 계정 요구사항과 일치하는 컨텍스트 구조체가 생성됩니다.

## 모범 사례

1. `#[account]` 속성에서 **항상 설명적인 이름 사용**
2. 더 나은 문서화를 위해 **설명 포함**
3. `#[idl_type()]`는 **신중하게 사용** - 타입 오버라이드가 필요한 경우에만
4. `#[padding]`으로 **패딩 필드를 적절하게 표시**
5. **모든 참조된 타입이** Borsh 특성으로 올바르게 주석되어 있는지 확인
6. 함께 작동하는 **관련 매크로 그룹화** (예: `ShankInstruction` + `ShankBuilder`)

## 일반적인 패턴

### 사용자 정의 타입이 있는 계정

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct TokenAccount {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub state: TokenState, // ShankType 참조
}

#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub enum TokenState {
    Uninitialized,
    Initialized,
    Frozen,
}
```

### 완전한 명령어 정의

```rust
#[derive(Debug, Clone, ShankInstruction, BorshSerialize, BorshDeserialize)]
#[rustfmt::skip]
pub enum TokenInstruction {
    /// 계정 간 토큰 전송
    #[account(0, writable, name="source", desc="소스 토큰 계정")]
    #[account(1, writable, name="destination", desc="대상 토큰 계정")]
    #[account(2, signer, name="owner", desc="소스 계정 소유자")]
    Transfer {
        amount: u64,
    },
}
```

이 참조는 Solana 프로그램에서 효과적인 IDL 생성을 위한 모든 필수 Shank 매크로와 사용 패턴을 다룹니다.
