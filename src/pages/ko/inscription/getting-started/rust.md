---
title: Rust를 사용해서 시작하기
metaTitle: Rust SDK | Inscription
description: Rust를 사용해서 Inscriptions로 시작하기
---

Rust 개발자라면 Token Metadata 프로그램과 상호작용하기 위해 Rust 클라이언트 SDK를 사용할 수도 있습니다. Metaplex는 최소한의 종속성을 가진 가벼운 crate인 전용 Rust 클라이언트 crate를 제공합니다.

시작하려면 프로젝트에 `mpl-inscription` 종속성을 추가해야 합니다. 프로젝트의 루트 폴더에서 터미널에서:
```
cargo add mpl-inscription
```
이렇게 하면 프로젝트의 종속성 목록에 crate의 최신 버전이 모두 추가됩니다.