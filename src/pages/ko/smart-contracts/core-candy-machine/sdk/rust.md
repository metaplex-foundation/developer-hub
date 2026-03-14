---
title: Core Candy Machine Rust SDK
metaTitle: Core Candy Machine Rust SDK | Core Candy Machine
description: Solana에서 Core Candy Machine을 빌드하고 관리하기 위한 mpl-core-candy-machine-core 및 mpl-core-candy-guard Rust 크레이트를 시작하세요.
keywords:
  - core candy machine
  - rust sdk
  - mpl-core-candy-machine-core
  - mpl-core-candy-guard
  - solana programs
  - rust crate
  - candy machine rust
  - onchain programs
  - metaplex rust
  - cargo
  - solana nft
about:
  - Rust SDK
  - Solana programs
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
created: '03-10-2026'
updated: '03-10-2026'
---

## 요약

Core Candy Machine Rust SDK는 Solana에서 Candy Machine과 상호작용하기 위한 두 개의 크레이트를 제공합니다: 머신 초기화 및 관리를 위한 `mpl-core-candy-machine-core`와 가드 생성 및 구성을 위한 `mpl-core-candy-guard`입니다. {% .lead %}

- `cargo add mpl-core-candy-machine-core`와 `cargo add mpl-core-candy-guard`로 Cargo를 통해 설치합니다
- 스크립트, 데스크톱 애플리케이션, 모바일 애플리케이션, Solana 온체인 프로그램에서 사용 가능합니다
- Core 크레이트는 Candy Machine 생성, 구성, 에셋 로딩을 처리합니다
- Guard 크레이트는 가드 생성 및 Candy Machine에 가드 래핑을 처리합니다

## Core Candy Machine Rust 크레이트

`mpl-core-candy-machine-core` 크레이트는 [Core Candy Machine](/ko/smart-contracts/core-candy-machine) 프로그램의 핵심 컴포넌트로, Solana에서 Candy Machine의 초기화와 관리를 제공합니다.

### 설치

`mpl-core-candy-machine-core` Rust 크레이트는 스크립트/데스크톱/모바일 애플리케이션과 Solana 온체인 프로그램 모두에서 사용할 수 있습니다.

```rust
cargo add mpl-core-candy-machine-core
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core-candy-machine-core" description="MPL Core Candy Machine용 Rust SDK를 시작하세요." /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core-candy-machine-core/" description="Core Candy Machine crate를 위한 Rust SDK typedoc 플랫폼." /%}

{% /quick-links %}

## Core Candy Guard Rust 크레이트

`mpl-core-candy-guard` 크레이트는 Core Candy Machine에 래핑하여 민팅 조건을 강제할 수 있는 [Core Candy Guard](/ko/smart-contracts/core-candy-machine/guards)의 생성과 관리를 가능하게 합니다.

### 설치

`mpl-core-candy-guard` Rust 크레이트는 스크립트/데스크톱/모바일 애플리케이션과 Solana 온체인 프로그램 모두에서 사용할 수 있습니다.

```rust
cargo add mpl-core-candy-guard
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core-candy-guard" description="Core Candy Guards용 Rust SDK를 시작하세요." /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core-candy-guard" description="Core Candy Guards crate를 위한 Rust SDK typedoc 플랫폼." /%}

{% /quick-links %}

## 참고사항

- 두 크레이트 모두 온체인 프로그램 개발(CPI 호출)과 오프체인 클라이언트 스크립트에 사용할 수 있습니다.
- `mpl-core-candy-machine-core`와 `mpl-core-candy-guard` 크레이트는 별도의 패키지입니다. 전체 Candy Machine 및 가드 기능이 필요한 경우 둘 다 설치하세요.
- 상세한 타입 및 함수 시그니처는 [docs.rs 문서](https://docs.rs/mpl-core-candy-machine-core/)를 참조하세요.

*[Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine)에서 유지관리 · 2026년 3월 검증*
