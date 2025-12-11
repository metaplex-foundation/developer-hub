---
title: Candy Machine용 커스텀 가드 클라이언트 생성
metaTitle: 커스텀 가드 클라이언트 생성 | Candy Machine 
description: 커스텀 가드용 Umi 호환 클라이언트를 생성하는 방법입니다.
---

Candy Machine Guard 프로그램용 커스텀 가드를 작성한 후에는 Umi SDK와 함께 작동하는 Kinobi 클라이언트를 생성해야 합니다. 예를 들어 프론트엔드에서 가드를 사용할 수 있도록 하기 위해서입니다.

## IDL 및 초기 클라이언트 생성

### Shankjs 구성

Shankjs는 Anchor와 비-Anchor 프로그램 모두에서 작동하는 IDL 생성기입니다. 제대로 작동하는 클라이언트를 생성하려면 새로운 커스텀 Candy Guard 배포 키로 이를 구성하려고 합니다. mpl-candy-machine 저장소의 `/configs/shank.cjs`에 있는 파일을 편집하세요.

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // 커스텀 Candy Guard 배포된 프로그램 키
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
});

```

{% callout %}
anchor 28을 사용하여 생성하는 경우 누락된 crates.io crate로 인해 Shankjs idl 생성기에 anchor 27로의 폴백을 추가해야 합니다.
{% /callout %}

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // 커스텀 Candy Guard 배포된 프로그램 키
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

이제 IDL과 초기 클라이언트를 생성할 수 있을 것입니다. 프로젝트 루트에서 실행하세요

```shell
pnpm run generate
```

이는 `pnpm generate:idls`와 `pnpm generate:clients` 스크립트를 모두 실행하고 초기 클라이언트를 구축합니다.
어떤 이유로든 이를 별도로 실행해야 하는 경우 그렇게 할 수 있습니다.

## 클라이언트에 가드 추가

### 가드 파일 생성

초기 클라이언트의 성공적인 생성이 완료되면 `/clients/js/src`로 이동하세요.

첫 번째 단계는 `/clients/js/src/defaultGuards` 폴더에 새로운 가드를 추가하는 것입니다.

아래는 생성한 가드 유형에 따라 필요에 맞게 조정할 수 있는 템플릿입니다.
가드에 원하는 이름을 지을 수 있지만 예시로 `customGuard.ts`라고 하겠습니다

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
      // 민트 args에서 커스텀 가드에 필요한 모든 계정을 전달합니다.
      // 가드는 나머지 계정이 필요할 수도 있고 필요하지 않을 수도 있습니다.
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// 여기서 가드가 작동하기 위해 필요한 모든 커스텀 민트 args를 작성합니다.
// 가드는 MintArgs가 필요할 수도 있고 필요하지 않을 수도 있습니다.

export type CustomGuardMintArgs = {
  /**
   * 커스텀 가드 민트 인수 1
   */
  publicKeyArg1: PublicKey

  /**
   * 커스텀 가드 민트 인수 2
   */
  publicKeyArg2: PublicKey

  /**
   * 커스텀 가드 민트 인수 3
   */
  arg3: Number
}
```

### 기존 파일에 가드 추가

여기서 기존 파일들에 새로운 가드를 추가해야 합니다.

`/clients/js/src/defaultGuards/index.ts`에서 새로운 가드를 내보내세요

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// 가드를 목록에 추가
export * from './customGuard';
```

`/clients/js/src/defaultGuards/defaults.ts` 내에서 다음 위치에 가드를 추가하세요;

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // 가드를 목록에 추가
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { CustomGuard } from "../generated"

export type DefaultGuardSet = GuardSet & {
    ...
     // 가드를 목록에 추가
    customGuard: Option<CustomGuard>
}
```

```ts
import { CustomGuardMintArgs } from "./defaultGuards/customGuard.ts"
export type DefaultGuardSetMintArgs = GuardSetMintArgs & {
    ...
    // 가드를 목록에 추가
    customGuard: OptionOrNullable<CustomGuardMintArgs>
}
```

```ts
export const defaultCandyGuardNames: string[] = [
  ...// 가드를 목록에 추가
  'customGuard',
]
```

마지막으로 내보낸 customGuardManifest를 `/clients/js/src/plugin.ts`에 있는 플러그인 파일에 추가해야 합니다

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// 가드 매니페스트를 목록에 추가
  customGuardManifest
)
```

이 지점에서 클라이언트 패키지를 구축하여 npm에 업로드하거나 새로운 가드 클라이언트에 액세스하려는 프로젝트 폴더에 링크/이동할 수 있습니다.

AVA의 내장 테스트 도구를 사용하여 여러 시나리오에서 가드를 완전히 테스트하는 테스트를 작성하는 것이 좋습니다. 테스트 예시는 `/clients/js/tests`에서 찾을 수 있습니다.