---
title: Rust를 사용하여 시작하기
metaTitle: Candy Machine - 시작하기 - Rust SDK | Candy Machine
description: Rust를 사용하여 Candy Machine을 시작하세요
---

Rust 개발자라면 Rust 크레이트를 사용하여 Candy Machine 프로그램과 상호작용할 수도 있습니다. 프로그램이 Rust로 작성되었기 때문에 이 크레이트에는 우리를 위해 명령어를 준비하는 도우미 메서드를 포함하여 모든 프로그램 로직이 포함되어 있습니다.

이는 Rust 클라이언트를 개발하거나 프로그램 내에서 Candy Machine 프로그램에 [CPI 호출](https://solanacookbook.com/references/programs.html#how-to-do-cross-program-invocation)을 하려는 경우에 도움이 될 수 있습니다.

Candy Machine은 두 개의 프로그램으로 구성되어 있으므로 두 개의 라이브러리를 설치해야 합니다.

- **Candy Machine Core**
  - [GitHub 저장소](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core)
  - [크레이트 페이지](https://crates.io/crates/mpl-candy-machine-core)
  - [API 참조](https://docs.rs/mpl-candy-machine-core/0.1.0/mpl_candy_machine_core/)
- **Candy Guard**
  - [GitHub 저장소](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard)
  - [크레이트 페이지](https://crates.io/crates/mpl-candy-guard)
  - [API 참조](https://docs.rs/mpl-candy-guard/0.1.0/mpl_candy_guard/)