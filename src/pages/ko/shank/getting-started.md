---
title: Shank 시작하기
metaTitle: 시작하기 | Shank
description: Rust Solana 프로그램에서 IDL 추출을 위한 Shank 설치 및 설정 방법을 알아보세요
---

이 가이드는 Shank를 설정하고 Rust Solana 프로그램에서 첫 번째 IDL을 추출하는 과정을 안내합니다.

## 전제 조건

Shank를 시작하기 전에 다음이 필요합니다:

- Rust 툴체인 설치 (1.56.0 이상)
- Cargo 패키지 관리자
- Rust로 작성된 Solana 프로그램
- Solana 프로그램 개발에 대한 기본적인 이해

## 설치

### Shank CLI 설치

Cargo를 사용하여 Shank 명령줄 도구를 설치하세요:

```bash
cargo install shank-cli
```

설치를 확인하세요:

```bash
shank --version
```

### 프로젝트에 Shank 추가

`Cargo.toml`에 Shank를 의존성으로 추가하세요:

```toml
[dependencies]
shank = "0.4"

[build-dependencies]
shank-cli = "0.4"
```

## 첫 번째 Shank 프로젝트

### 1. 프로그램에 주석 달기

기존 Solana 프로그램에 Shank derive 매크로를 추가하여 시작하세요:

```rust
use shank::ShankInstruction;

#[derive(ShankInstruction)]
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

### 2. 계정 구조체에 주석 달기

계정 구조체에 `ShankAccount`를 추가하세요:

```rust
use shank::ShankAccount;

#[derive(ShankAccount)]
pub struct UserAccount {
    pub name: String,
    pub created_at: i64,
    pub authority: Pubkey,
}
```

### 3. IDL 추출

Shank CLI를 실행하여 IDL을 추출하세요:

```bash
shank idl --out-dir ./target/idl --crate-root ./
```

이렇게 하면 `./target/idl` 디렉토리에 IDL 파일(예: `my_program.json`)이 생성됩니다.

### 4. 출력 확인

생성된 IDL 파일을 확인하세요:

```bash
cat ./target/idl/my_program.json
```

프로그램의 명령어, 계정 및 타입을 포함하는 JSON 구조를 볼 수 있습니다.

## 프로젝트 구조

일반적인 Shank가 활성화된 프로젝트 구조는 다음과 같습니다:

```
my-solana-program/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── instruction.rs    # ShankInstruction 열거형 포함
│   ├── state.rs         # ShankAccount 구조체 포함
│   └── processor.rs     # 프로그램 로직
├── target/
│   └── idl/
│       └── my_program.json  # 생성된 IDL
└── sdk/                 # 생성된 TypeScript SDK (선택사항)
    └── ...
```

## 핵심 구성 요소

Shank는 여러 개의 상호 연결된 크레이트로 구성됩니다:

- **shank**: 매크로 주석을 제공하는 최상위 크레이트
- **shank-cli**: IDL 추출을 위한 명령줄 도구
- **shank-macro**: 코드 생성을 위한 derive 매크로
- **shank-idl**: 파일을 처리하고 주석을 IDL로 변환
- **shank-render**: Rust 구현 블록을 생성

## 주요 기능

### Derive 매크로

Shank는 Solana 프로그램 코드에 주석을 달기 위한 다섯 가지 필수 derive 매크로를 제공합니다:

1. **`ShankAccount`**: 직렬화 가능한 데이터가 있는 계정을 나타내는 구조체에 주석
   - 타입 오버라이드를 위한 `#[idl_type()]` 지원
   - 패딩 필드를 위한 `#[padding]` 지원
   - Borsh 직렬화와 함께 작동

2. **`ShankBuilder`**: 각 주석이 달린 명령어에 대한 명령어 빌더 생성
   - 빌더 패턴 구현 생성
   - 명령어 구성 간소화

3. **`ShankContext`**: 명령어를 위한 계정 구조체 생성
   - 프로그램 명령어를 위한 컨텍스트 구조 생성
   - Anchor 프레임워크 패턴과 통합

4. **`ShankInstruction`**: 프로그램의 명령어 열거형에 주석
   - `#[account()]` 속성을 사용하여 계정 요구사항 지정
   - 계정 가변성, 서명자 요구사항 및 설명 지원
   - 포괄적인 명령어 메타데이터 생성

5. **`ShankType`**: 직렬화 가능한 데이터가 있는 구조체 또는 열거형 표시
   - 계정이나 명령어에서 참조되는 사용자 정의 타입에 사용
   - 복잡한 데이터 구조에 대한 올바른 IDL 생성 보장

### Metaplex 생태계와의 통합

Shank는 다른 Metaplex 도구들과 원활하게 통합됩니다:

- **[Kinobi](/kr/umi/kinobi)**: IDL 생성 및 클라이언트 생성을 위해 Shank JS 라이브러리 사용
- **[Solita](/kr/legacy-documentation/developer-tools/solita)**: Shank에서 추출한 IDL로부터 TypeScript SDK 생성

## CLI 사용법

Shank가 설치되고 프로그램에 주석이 달렸다면, 다음과 같이 IDL을 추출하세요:

```bash
# 기본 IDL 추출
shank idl --out-dir ./target/idl --crate-root ./

# 특정 크레이트에 대한 IDL 추출
shank idl --out-dir ./idl --crate-root ./my-program

# 사용자 정의 프로그램 ID로 IDL 생성
shank idl --out-dir ./idl --crate-root ./ --program-id MyProgram111111111111111111111111111111
```

## 다음 단계

이제 Shank가 설정되고 IDL 파일을 생성하고 있으므로, 다음을 수행할 수 있습니다:

1. **[매크로 참조](/kr/shank/macros)**: 모든 Shank 매크로 및 속성에 대한 완전한 참조
2. **[Kinobi와의 통합](/kr/umi/kinobi)**: Umi와 호환되는 현대적인 TypeScript SDK 생성 (권장)
3. **[Solita](https://github.com/metaplex-foundation/solita)**: web3.js와 호환되는 레거시 TypeScript SDK 생성

## 문제 해결

### 일반적인 문제

**파싱 오류로 IDL 생성 실패:**
- Rust 코드가 성공적으로 컴파일되는지 확인하세요
- 모든 derive 매크로가 올바르게 가져와졌는지 확인하세요
- 계정 주석이 올바르게 형식화되었는지 확인하세요

**생성된 IDL에서 계정 누락:**
- 구조체가 `#[derive(ShankAccount)]`로 주석이 달렸는지 확인하세요
- 구조체가 public이고 접근 가능한지 확인하세요

**빌드 스크립트 오류:**
- `shank-cli`가 설치되어 있고 PATH에서 사용 가능한지 확인하세요
- 빌드 스크립트 권한 및 실행 권한을 확인하세요

더 많은 도움이 필요하면 [GitHub 저장소](https://github.com/metaplex-foundation/shank)를 방문하거나 [Metaplex Discord](https://discord.gg/metaplex)에 참여하세요.