---
title: Core Candy Machine용 커스텀 Guard 클라이언트 생성
metaTitle: 커스텀 Guard 클라이언트 | Core Candy Machine
description: Kinobi와 Shankjs를 사용하여 Core Candy Machine 프로그램의 커스텀 guard를 위한 Umi 호환 JavaScript 클라이언트를 생성하는 방법을 알아보세요.
keywords:
  - custom guard
  - core candy machine
  - kinobi
  - IDL
  - shankjs
  - client generation
  - umi sdk
  - candy guard
  - solana nft
  - custom minting logic
  - guard manifest
  - code generation
  - metaplex
about:
  - Custom guards
  - Client generation
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
created: '03-10-2026'
updated: '03-10-2026'
---

## 요약

커스텀 guard 클라이언트 생성은 커스텀 [Core Candy Machine](/ko/smart-contracts/core-candy-machine) guard 프로그램에서 [Umi](/ko/dev-tools/umi) 호환 JavaScript SDK를 생성하여, 프론트엔드 및 스크립트 통합을 가능하게 합니다. {% .lead %}

- [Shankjs](https://github.com/metaplex-foundation/shank)를 사용하여 커스텀 Candy Guard 프로그램에서 IDL을 생성합니다
- Kinobi 코드 생성기를 실행하여 TypeScript 클라이언트 파일을 생성합니다
- 생성된 클라이언트 패키지에 guard manifest, 타입, mint args를 등록합니다
- 클라이언트 패키지를 빌드하여 npm에 게시하거나 로컬로 링크합니다

## IDL 및 초기 클라이언트 생성

커스텀 guard를 작성한 후 첫 번째 단계는 [mpl-core-candy-machine 저장소](https://github.com/metaplex-foundation/mpl-core-candy-machine)에서 Shankjs와 Kinobi를 사용하여 IDL과 초기 TypeScript 클라이언트를 생성하는 것입니다.

### IDL 생성을 위한 Shankjs 구성

Shankjs는 Anchor 및 비 Anchor 프로그램 모두에서 작동하는 IDL 생성기입니다. mpl-candy-machine 저장소의 `/configs/shank.cjs`에 있는 파일을 편집하여 커스텀 Candy Guard 배포 키로 구성합니다.

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // Your custom Candy Guard deployed program key.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
});

```

{% callout %}
anchor 28을 사용하여 생성하는 경우 누락된 crates.io 크레이트로 인해 Shankjs idl 생성기에 anchor 27로의 대체를 추가해야 합니다.
{% /callout %}

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // Your custom Candy Guard deployed program key.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
  rustbin: {
    locked: true,
    versionRangeFallback: "0.27.0",
  },
});

```

### IDL 및 클라이언트 생성 실행

이제 IDL과 초기 클라이언트를 생성할 수 있어야 합니다. 프로젝트의 루트에서 실행하세요:

```shell
pnpm run generate
```

이는 `pnpm generate:idls`와 `pnpm generate:clients` 스크립트를 모두 실행하고 초기 클라이언트를 구축합니다.
어떤 이유로든 이것들을 별도로 실행해야 한다면 그렇게 할 수 있습니다.

## 생성된 클라이언트에 커스텀 Guard 추가

초기 클라이언트의 성공적인 생성 후, guard 파일을 생성하고 클라이언트의 타입 시스템에 등록해야 합니다.

### Guard 파일 생성

생성된 클라이언트의 `/clients/js/src/defaultGuards`로 이동하여 커스텀 guard를 위한 새 파일을 생성합니다. 아래 템플릿은 생성한 guard 유형을 기반으로 조정할 수 있습니다. 이 예제에서는 `customGuard.ts`라는 이름을 사용합니다.

```ts
import { PublicKey } from '@metaplex-foundation/umi'
import {
  getCustomGuardSerializer,
  CustomGuard,
  CustomGuardArgs,
} from '../generated'
import { GuardManifest, noopParser } from '../guards'

export const customGuardManifest: GuardManifest<
  CustomGuardArgs,
  CustomGuard,
  CustomGuardMintArgs
> = {
  name: 'customGuard',
  serializer: getCustomGuardSerializer,
  mintParser: (context, mintContext, args) => {
    const { publicKeyArg1, arg1 } = args
    return {
      data: new Uint8Array(),
      // Pass in any accounts needed for your custom guard from your mint args.
      // Your guard may or may not need remaining accounts.
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// Here you would fill out any custom Mint args needed for your guard to operate.
// Your guard may or may not need MintArgs.

export type CustomGuardMintArgs = {
  /**
   * Custom Guard Mint Arg 1
   */
  publicKeyArg1: PublicKey

  /**
   * Custom Guard Mint Arg 2
   */
  publicKeyArg2: PublicKey

  /**
   * Custom Guard Mint Arg 3.
   */
  arg3: Number
}
```

### 기존 파일에 Guard 등록

guard 파일을 생성한 후, 생성된 클라이언트 내의 여러 기존 파일에 guard를 등록해야 합니다.

`/clients/js/src/defaultGuards/index.ts`에서 새로운 guard를 내보내세요:

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// add your guard to the list
export * from './customGuard';
```

`/clients/js/src/defaultGuards/defaults.ts` 내에서 다음 위치에 guard를 추가하세요:

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // add your guard to the list
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { customGuard } from "../generated"

export type DefaultGuardSet = GuardSet & {
    ...
     // add your guard to the list
    customGuard: Option<CustomGuard>
}
```

```ts
import { CustomGuardMintArgs } from "./defaultGuards/customGuard.ts"
export type DefaultGuardSetMintArgs = GuardSetMintArgs & {
    ...
    // add your guard to the list
    customGuard: OptionOrNullable<CustomGuardMintArgs>
}
```

```ts
export const defaultCandyGuardNames: string[] = [
  ...// add your guard to the list
  'customGuard',
]
```

마지막으로 내보낸 customGuardManifest를 `/clients/js/src/plugin.ts`에 있는 플러그인 파일에 추가해야 합니다:

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// add your guard manifest to the list
  customGuardManifest
)
```

이 시점에서 클라이언트 패키지를 빌드하고 npm에 업로드하거나 새로운 guard 클라이언트에 액세스하려는 프로젝트 폴더에 링크/이동할 수 있습니다.

## 참고사항

- 이 워크플로우는 [mpl-core-candy-machine 저장소](https://github.com/metaplex-foundation/mpl-core-candy-machine)의 포크된 사본이 필요합니다. 해당 포크 내에서 클론하고 작업하세요.
- 내장된 [AVA](https://github.com/avajs/ava) 테스트 스위트를 사용하여 여러 시나리오에서 커스텀 guard를 완전히 테스트하는 테스트를 작성하세요. 테스트 예제는 `/clients/js/tests`에서 찾을 수 있습니다.
- Anchor 28을 사용하는 경우, 누락된 crates.io 의존성으로 인해 위에 표시된 대로 Shankjs에 `rustbin` 대체 구성을 추가해야 합니다.
- 생성된 클라이언트 파일은 커스텀 guard 등록을 추가하는 것 외에는 생성 후 수동으로 편집하지 않아야 합니다.

*[Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine)에서 유지관리 · 2026년 3월 검증*
