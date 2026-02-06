---
title: Core Candy Machine용 커스텀 Guard 클라이언트 생성
metaTitle: 커스텀 Guard 클라이언트 | Core Candy Machine.
description: 최신 Core Candy Machine 프로그램을 위해 커스텀으로 구축한 guard에 대한 Umi 호환 클라이언트를 생성하는 방법을 알아보세요.
---

Candy Machine Guard 프로그램용 커스텀 guard를 작성한 후, 예를 들어 프론트엔드에서 guard를 사용할 수 있도록 Umi SDK와 작동하는 Kinobi 클라이언트를 생성해야 합니다.

## IDL 및 초기 클라이언트 생성

### Shankjs 구성

Shankjs는 Anchor 및 비 Anchor 프로그램 모두에서 작동하는 IDL 생성기입니다. 제대로 작동하는 클라이언트를 생성하기 위해 새로운 커스텀 Candy Guard 배포 키로 이를 구성하고 싶을 것입니다. mpl-candy-machine 저장소의 `/configs/shank.cjs`에 있는 파일을 편집하세요.

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // 커스텀 Candy Guard 배포된 프로그램 키.
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
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // 커스텀 Candy Guard 배포된 프로그램 키.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
  rustbin: {
    locked: true,
    versionRangeFallback: "0.27.0",
  },
});

```

### IDL 및 클라이언트 생성

이제 IDL과 초기 클라이언트를 생성할 수 있어야 합니다. 프로젝트의 루트에서 실행하세요:

```shell
pnpm run generate
```

이는 `pnpm generate:idls`와 `pnpm generate:clients` 스크립트를 모두 실행하고 초기 클라이언트를 구축합니다.
어떤 이유로든 이것들을 별도로 실행해야 한다면 그렇게 할 수 있습니다.

## 클라이언트에 Guard 추가

### Guard 파일 생성

초기 클라이언트의 성공적인 생성이 완료되면 `/clients/js/src`로 이동하세요.

첫 번째 단계는 새로운 guard를 `/clients/js/src/defaultGuards` 폴더에 추가하는 것입니다.

아래는 생성한 guard 유형을 기반으로 필요에 따라 사용하고 조정할 수 있는 템플릿입니다.
guard 이름을 원하는 대로 지을 수 있지만 예제에서는 `customGuard.ts`라고 명명하겠습니다.

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
      // mint args에서 커스텀 guard에 필요한 모든 계정을 전달하세요.
      // guard는 남은 계정이 필요하거나 필요하지 않을 수 있습니다.
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// 여기에 guard가 작동하는 데 필요한 모든 커스텀 Mint args를 채워넣습니다.
// guard는 MintArgs가 필요하거나 필요하지 않을 수 있습니다.

export type CustomGuardMintArgs = {
  /**
   * 커스텀 Guard Mint Arg 1
   */
  publicKeyArg1: PublicKey

  /**
   * 커스텀 Guard Mint Arg 2
   */
  publicKeyArg2: PublicKey

  /**
   * 커스텀 Guard Mint Arg 3.
   */
  arg3: Number
}
```

### 기존 파일에 Guard 추가

여기서부터 새로운 guard를 일부 기존 파일에 추가해야 합니다.

`/clients/js/src/defaultGuards.index.ts`에서 새로운 guard를 내보내세요:

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// guard를 목록에 추가
export * from './customGuard';
```

`/clients/js/src/defaultGuards.defaults.ts` 내에서 다음 위치에 guard를 추가하세요:

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // guard를 목록에 추가
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { customGuard } from "../generated"

export type DefaultGuardSet = GuardSet & {
    ...
     // guard를 목록에 추가
    customGuard: Option<CustomGuard>
}
```

```ts
import { CustomGuardMintArgs } from "./defaultGuards/customGuard.ts"
export type DefaultGuardSetMintArgs = GuardSetMintArgs & {
    ...
    // guard를 목록에 추가
    customGuard: OptionOrNullable<CustomGuardMintArgs>
}
```

```ts
export const defaultCandyGuardNames: string[] = [
  ...// guard를 목록에 추가
  'customGuard',
]
```

마지막으로 내보낸 customGuardManifest를 `/clients/js/src/plugin.ts`에 있는 플러그인 파일에 추가해야 합니다:

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// guard manifest를 목록에 추가
  customGuardManifest
)
```

이 시점에서 클라이언트 패키지를 빌드하고 npm에 업로드하거나 새로운 guard 클라이언트에 액세스하려는 프로젝트 폴더에 링크/이동할 수 있습니다.

guard를 여러 시나리오에서 완전히 테스트하는 테스트를 작성하기 위해 AVA의 내장 테스트 스위트를 사용하는 것이 좋습니다. 테스트 예제는 `/clients/js/tests`에서 찾을 수 있습니다.
