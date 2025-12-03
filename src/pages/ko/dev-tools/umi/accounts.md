---
title: 계정 가져오기
metaTitle: 계정 가져오기 | Umi
description: Umi를 사용하여 계정을 가져오는 방법
---

Umi를 사용하여 Solana 블록체인에서 계정 데이터를 가져오는 방법을 살펴보겠습니다. 이를 위해서는 직렬화된 데이터로 계정을 가져오는 [`RpcInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html)와 이를 역직렬화하는 데 도움이 되는 [serializers](serializers)가 필요합니다.

## 계정 정의

Umi는 직렬화된 데이터가 있는 계정을 `RpcAccount`로 정의합니다. 여기에는 계정 헤더의 정보(즉, 계정의 SOL, 프로그램 소유자 등)와 계정의 공개 키 및 직렬화된 데이터가 포함됩니다.

```ts
type RpcAccount = AccountHeader & {
  publicKey: PublicKey;
  data: Uint8Array;
};
```

또한 존재할 수도 있고 존재하지 않을 수도 있는 `RpcAccount`를 나타내는 `MaybeRpcAccount` 타입도 정의합니다. 계정이 존재하지 않을 때는 공개 키를 추적하여 계정 목록에서 어떤 공개 키를 찾지 못했는지 알 수 있습니다.

```ts
type MaybeRpcAccount =
  | ({ exists: true } & RpcAccount)
  | { exists: false; publicKey: PublicKey };
```

`MaybeRpcAccount`를 다룰 때는 `assertAccountExists` 헬퍼 메서드를 사용하여 계정이 존재한다고 주장하고 그렇지 않으면 실패하도록 할 수 있습니다.

```ts
assertAccountExists(myMaybeAccount);
// 이제부터 myMaybeAccount가 RpcAccount라는 것을 알고 있습니다.
```

마지막으로 역직렬화된 데이터를 직접 노출하는 제네릭 `Account` 타입을 제공합니다. 여기서 제네릭 타입 `T`로 표현되며 두 개의 추가 속성인 `publicKey`와 `header`가 있습니다. 이를 통해 중첩된 `data` 속성 없이 역직렬화된 데이터에 직접 접근할 수 있습니다.

```ts
type Account<T extends object> = T & {
  publicKey: PublicKey;
  header: AccountHeader;
};
```

## RPC 계정 가져오기

이제 Umi에서 계정이 어떻게 표현되는지 알았으니, 어떻게 가져올 수 있는지 살펴보겠습니다.

먼저 `RpcInterface`의 `getAccount` 메서드를 사용하여 단일 계정을 가져올 수 있습니다. 계정이 존재할 수도 있고 존재하지 않을 수도 있으므로 `MaybeRpcAccount` 인스턴스를 반환합니다. 위에서 언급했듯이 `assertAccountExists` 함수를 사용하여 계정이 존재하는지 확인할 수 있습니다.

```ts
const myAccount = await umi.rpc.getAccount(myPublicKey);
assertAccountExists(myAccount);
```

주어진 주소에 계정이 존재하는지만 알고 싶다면 `accountExists` 메서드를 대신 사용할 수 있습니다.

```ts
const accountExists = await umi.rpc.accountExists(myPublicKey);
```

여러 계정을 한 번에 가져와야 한다면 `getAccounts` 메서드를 사용할 수 있습니다. 이는 전달한 각 공개 키에 대해 하나씩 `MaybeRpcAccount` 목록을 반환합니다.

```ts
const myAccounts = await umi.rpc.getAccounts(myPublicKeys);
```

마지막으로 `getProgramAccounts` 메서드는 주어진 필터 세트와 일치하는 특정 프로그램의 모든 계정을 가져오는 데 사용할 수 있습니다. 이 메서드는 존재하는 계정만 반환하므로 `RpcAccount` 목록을 직접 반환합니다. 필터와 데이터 슬라이싱에 대해 자세히 알아보려면 다음 [Get Program Account 문서](https://solanacookbook.com/guides/get-program-accounts.html)를 참조하세요.

```ts
// 프로그램의 모든 계정을 가져옵니다.
const allProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId);

// 프로그램의 모든 계정 중 일부를 슬라이스하여 가져옵니다.
const slicedProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId, {
  dataSlice: { offset: 32, length: 8 },
});

// 주어진 필터 세트와 일치하는 프로그램의 일부 계정을 가져옵니다.
const filteredProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId, {
  filters: [
    { dataSize: 42 },
    { memcmp: { offset: 0, bytes: new Uint8Array([1, 2, 3]) } },
  ],
});
```

프로그램 계정을 가져올 때 [`GpaBuilder`s](helpers#gpabuilders)에 관심이 있을 수 있습니다.

## 계정 역직렬화

`RpcAccount`를 역직렬화된 `Account<T>`로 변환하려면 `deserializeAccount` 함수와 계정 데이터를 역직렬화하는 방법을 아는 `Serializer`만 있으면 됩니다. `Serializer`에 대한 자세한 내용은 [Serializers 페이지](serializers)에서 읽을 수 있지만, 데이터가 두 개의 공개 키와 하나의 `u64` 숫자로 구성되어 있다고 가정한 간단한 예시입니다.

```ts
import { assertAccountExists, deserializeAccount } from '@metaplex-foundation/umi';
import { struct, publicKey, u64 } from '@metaplex-foundation/umi/serializers';

// 기존 RPC 계정이 주어졌을 때
const myRpcAccount = await umi.rpc.getAccount(myPublicKey);
assertAccountExists(myRpcAccount);

// 그리고 계정 데이터 직렬화기가 있을 때
const myDataSerializer = struct([
  ['source', publicKey()],
  ['destination', publicKey()],
  ['amount', u64()],
]);

// 다음과 같이 계정을 역직렬화할 수 있습니다.
const myAccount = deserializeAccount(rawAccount, myDataSerializer);
// myAccount.source -> PublicKey
// myAccount.destination -> PublicKey
// myAccount.amount -> bigint
// myAccount.publicKey -> PublicKey
// myAccount.header -> AccountHeader
```

실제로는 프로그램 라이브러리가 계정 데이터 직렬화기와 헬퍼를 제공해야 합니다. 다음은 [Kinobi 생성 라이브러리](kinobi)를 사용한 예시입니다.

```ts
import { Metadata, deserializeMetadata, fetchMetadata, safeFetchMetadata } from '@metaplex-foundation/mpl-token-metadata';

// 메타데이터 계정을 역직렬화합니다.
const metadata: Metadata = deserializeMetadata(umi, unparsedMetadataAccount);

// 메타데이터 계정을 가져와서 역직렬화하고, 계정이 존재하지 않으면 실패합니다.
const metadata: Metadata = await fetchMetadata(umi, metadataPublicKey);

// 메타데이터 계정을 가져와서 역직렬화하고, 계정이 존재하지 않으면 null을 반환합니다.
const metadata: Metadata | null = await safeFetchMetadata(umi, metadataPublicKey);
```