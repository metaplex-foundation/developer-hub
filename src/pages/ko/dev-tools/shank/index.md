---
title: Shank
metaTitle: Shank | Metaplex Developer Hub
description: 속성 매크로를 사용하여 Rust Solana 프로그램 코드에서 IDL을 추출합니다
---

Shank는 Shank 속성 매크로로 주석이 달린 Solana 프로그램 코드에서 인터페이스 정의 언어(IDL)를 추출하기 위해 설계된 Rust 크레이트 모음입니다. 추출된 IDL은 TypeScript SDK를 생성하고 Solana 프로그램과의 상호 작용을 용이하게 하는 데 사용할 수 있습니다.

Shank는 Rust 프로그램 코드와 클라이언트 측 SDK 사이의 다리 역할을 하는 IDL 파일 생성을 자동화하여 Solana 프로그램의 개발 워크플로를 단순화합니다.

## 빠른 시작

1. Shank CLI 설치: `cargo install shank-cli`
2. 프로젝트에 Shank 추가: `shank = "0.4"`
3. `ShankAccount` 및 `ShankInstruction` 매크로로 프로그램 주석 달기
4. IDL 추출: `shank idl --out-dir ./target/idl --crate-root ./`

## 주요 기능

- Solana 프로그램에 주석을 달기 위한 **다섯 가지 derive 매크로** (`ShankAccount`, `ShankInstruction`, `ShankBuilder`, `ShankContext`, `ShankType`)
- 주석이 달린 Rust 코드에서 **자동 IDL 생성**
- Solita 및 Kinobi와의 통합을 통한 **TypeScript SDK 생성**
- 타입 오버라이드 및 패딩 필드를 지원하는 **Borsh 직렬화 지원**
- 가변성, 서명자 요구사항 및 설명을 포함한 **포괄적인 계정 메타데이터**

## 문서

- **[시작하기](/ko/shank/getting-started)** - 설치, 설정, 상세한 사용법 안내 및 포괄적인 예제

## 통합

Shank는 다른 Metaplex 도구들과 원활하게 통합됩니다:
- **[Kinobi](/ko/umi/kinobi)** - 현대적인 IDL 생성 및 클라이언트 생성
- **[Solita](/ko/legacy-documentation/developer-tools/solita)** - TypeScript SDK 생성

## 리소스

- [GitHub 저장소](https://github.com/metaplex-foundation/shank)
- [Rust 크레이트](https://docs.rs/shank)
- [CLI 크레이트](https://docs.rs/shank-cli)
- [Discord 커뮤니티](https://discord.gg/metaplex)