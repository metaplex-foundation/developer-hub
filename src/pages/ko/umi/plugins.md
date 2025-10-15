---
title: Umi 플러그인
metaTitle: 플러그인 | Umi
description: Metaplex Umi의 플러그인
---
Umi는 작은 무의존성 프레임워크이지만 플러그인으로 확장되도록 설계되었습니다. 플러그인을 통해 인터페이스와 상호작용하거나 인터페이스 구현을 교체할 뿐만 아니라 Umi 자체에 새로운 기능을 추가할 수 있습니다.

## 플러그인 사용하기

Umi 플러그인을 설치하려면 Umi 인스턴스에서 `use` 메서드를 호출하기만 하면 됩니다. 이 `use` 메서드는 Umi 인스턴스를 반환하므로 함께 연결할 수 있습니다.

```ts
import { somePlugin } from 'some-umi-library';
import { myLocalPlugin } from '../plugins';

umi.use(somePlugin).use(myLocalPlugin);
```

라이브러리는 종종 플러그인 자체가 아닌 플러그인을 반환하는 함수를 제공한다는 점이 주목할 만합니다. 이는 플러그인의 동작을 구성하기 위해 인수를 전달할 수 있도록 하기 위해서입니다.

```ts
import { somePlugin } from 'some-umi-library';
import { myLocalPlugin } from '../plugins';

umi.use(somePlugin(somePluginOptions))
  .use(myLocalPlugin(myLocalPluginOptions));
```

일관성을 유지하기 위해 Umi에서 제공하는 플러그인은 인수가 필요하지 않더라도 항상 이 패턴을 따릅니다. 다음은 몇 가지 예시입니다:

```ts
import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';
import { httpDownloader } from '@metaplex-foundation/umi-downloader-http';

umi.use(web3JsRpc('https://api.mainnet-beta.solana.com'))
  .use(mockStorage())
  .use(httpDownloader());
```

## 플러그인 생성하기

내부적으로 Umi는 플러그인을 Umi 인스턴스를 원하는 대로 확장하는 데 사용할 수 있는 `install` 함수가 있는 객체로 정의합니다.

```ts
export const myPlugin: UmiPlugin = {
  install(umi: Umi) {
    // Umi 인스턴스로 무언가를 합니다.
  },
}
```

위에서 언급했듯이 최종 사용자로부터 필요할 수 있는 인수를 요청할 수 있도록 플러그인 함수를 내보내는 것이 권장됩니다.

```ts
export const myPlugin = (myPluginOptions?: MyPluginOptions): UmiPlugin => ({
  install(umi: Umi) {
    // Umi 인스턴스로 무언가를 합니다.
  },
})
```

## 플러그인에서 할 수 있는 일

이제 플러그인을 만드는 방법을 알았으니, 플러그인으로 할 수 있는 일의 몇 가지 예시를 살펴보겠습니다.

### 인터페이스 구현 설정

플러그인의 가장 일반적인 사용 사례 중 하나는 하나 또는 여러 Umi 인터페이스에 구현을 할당하는 것입니다. 다음은 가상의 `MyRpc` 구현을 `rpc` 인터페이스에 설정하는 예시입니다. 필요에 따라 다른 인터페이스에 의존할 수 있도록 Umi 인스턴스를 `MyRpc` 구현에 전달할 수 있는 방법을 주목하세요.

```ts
export const myRpc = (endpoint: string): UmiPlugin => ({
  install(umi: Umi) {
    umi.rpc = new MyRpc(umi, endpoint);
  },
})
```

### 인터페이스 구현 데코레이팅

인터페이스 구현을 설정하는 또 다른 방법은 기존 구현을 데코레이트하는 것입니다. 이를 통해 최종 사용자는 기본 구현 세부사항에 대해 걱정하지 않고 기존 구현에 추가 기능을 추가하여 플러그인을 함께 구성할 수 있습니다.

다음은 모든 전송된 트랜잭션을 타사 서비스에 로그하도록 `rpc` 인터페이스를 데코레이트하는 플러그인의 예시입니다.

```ts
export const myLoggingRpc = (provider: LoggingProvider): UmiPlugin => ({
  install(umi: Umi) {
    umi.rpc = new MyLoggingRpc(umi.rpc, provider);
  },
})
```

### 번들 생성

플러그인도 Umi 인스턴스에서 `use` 메서드를 호출할 수 있으므로 플러그인 내에서 플러그인을 설치하는 것이 가능합니다. 이를 통해 함께 설치할 수 있는 플러그인 번들을 생성할 수 있습니다.

예를 들어, Umi의 "defaults" 플러그인 번들이 정의되는 방식은 다음과 같습니다:

```ts
export const defaultPlugins = (
  endpoint: string,
  rpcOptions?: Web3JsRpcOptions
): UmiPlugin => ({
  install(umi) {
    umi.use(dataViewSerializer());
    umi.use(defaultProgramRepository());
    umi.use(fetchHttp());
    umi.use(httpDownloader());
    umi.use(web3JsEddsa());
    umi.use(web3JsRpc(endpoint, rpcOptions));
    umi.use(web3JsTransactionFactory());
  },
});
```

### 인터페이스 사용

Umi의 인터페이스를 설정하고 업데이트하는 것 외에도 플러그인은 이를 사용할 수도 있습니다. 이에 대한 일반적인 사용 사례 중 하나는 라이브러리가 프로그램 저장소 인터페이스에 새 프로그램을 등록할 수 있도록 하는 것입니다. 다음은 Token Metadata 라이브러리가 프로그램을 등록하는 방법을 보여주는 예시입니다. `override` 인수를 `false`로 설정하여 프로그램이 이미 존재하지 않는 경우에만 등록되도록 하는 방법을 주목하세요.

```ts
export const mplTokenMetadata = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplTokenMetadataProgram(), false);
  },
});
```

### Umi 인스턴스 확장

마지막으로 플러그인은 Umi 인스턴스의 기능 세트를 확장할 수도 있습니다. 이를 통해 라이브러리가 자체 인터페이스를 제공하고 기존 인터페이스를 확장하는 등의 작업을 할 수 있습니다.

좋은 예는 모든 캔디 가드를 저장소에 저장하는 Candy Machine 라이브러리입니다(프로그램 저장소와 매우 유사). 이를 통해 최종 사용자는 자신의 가드를 등록하여 연관된 캔디 가드가 있는 캔디 머신을 생성, 가져오기 및 민팅할 때 인식될 수 있도록 합니다. 이를 작동시키기 위해 라이브러리는 Umi 인스턴스에 새 `guards` 속성을 추가하고 새 가드 저장소를 할당합니다.

```ts
export const mplCandyMachine = (): UmiPlugin => ({
  install(umi) {
    umi.guards = new DefaultGuardRepository(umi);
    umi.guards.add(botTaxGuardManifest);
    umi.guards.add(solPaymentGuardManifest);
    umi.guards.add(tokenPaymentGuardManifest);
    // ...
  },
});
```

위 코드의 약간의 문제는 `Umi` 타입이 더 이상 실제 인스턴스를 반영하지 않는다는 것입니다. 즉, TypeScript는 `guards` 속성이 `Umi` 타입에 존재하지 않는다고 불평할 것입니다. 이를 수정하기 위해 TypeScript의 [모듈 증강](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)을 사용하여 `Umi` 타입을 확장하여 다음과 같이 새 속성을 포함할 수 있습니다:

```ts
declare module '@metaplex-foundation/umi' {
  interface Umi {
    guards: GuardRepository;
  }
}
```

이 모듈 증강은 기존 인터페이스를 확장하는 데도 사용할 수 있습니다. 예를 들어, 추가 메서드가 포함된 새 RPC 인터페이스를 할당하면서 TypeScript에 추가된 메서드에 대해 알려줄 수 있습니다:

```ts
export const myRpcWithAddedMethods = (): UmiPlugin => ({
  install(umi) {
    umi.rpc = new MyRpcWithAddedMethods(umi.rpc);
  },
});

declare module '@metaplex-foundation/umi' {
  interface Umi {
    rpc: MyRpcWithAddedMethods;
  }
}
```