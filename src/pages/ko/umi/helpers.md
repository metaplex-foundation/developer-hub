---
title: Umi 헬퍼
metaTitle: Umi 헬퍼 | Umi
description: Umi에 내장된 헬퍼 개요
---
핵심 인터페이스 외에도 Umi는 Solana 프로그램 작업을 더 쉽게 만들어주는 헬퍼 함수 세트를 제공합니다.

## 금액

`Amount`는 큰 십진수를 정의할 수 있게 해주는 특별한 타입입니다. 숫자를 가능한 가장 낮은 단위(예: lamports)로 표현하고 해당 단위의 소수점 자릿수(예: 9)를 추적하는 방식으로 이를 수행합니다. 이를 통해 숫자를 더 정확하게 표현할 수 있고 IEEE 754 부동 소수점 수로 인한 JavaScript 반올림 오류를 방지할 수 있습니다. 또한 문자열 식별자를 사용하여 연산을 수행할 때 같은 단위의 금액을 처리하고 있음을 보장합니다. `Amount` 제네릭 타입은 다음과 같이 정의됩니다:

```ts
type AmountIdentifier = 'SOL' | 'USD' | '%' | 'splToken' | string;
type AmountDecimals = number;
type Amount<
  I extends AmountIdentifier = AmountIdentifier,
  D extends AmountDecimals = AmountDecimals
> = {
  /** 소수점을 포함하지 않도록 가능한 가장 낮은 단위의 금액 */
  basisPoints: bigint;
  /** 금액의 식별자 */
  identifier: I;
  /** 금액의 소수점 자릿수 */
  decimals: D;
};
```

Umi는 SOL과 USD 같은 특정 경우를 위한 이 `Amount` 타입의 특정 버전도 제공합니다.

```ts
type SolAmount = Amount<'SOL', 9>;
type UsdAmount = Amount<'USD', 2>;
type PercentAmount<D extends AmountDecimals> = Amount<'%', D>;
```

개발자가 금액을 더 쉽게 처리할 수 있도록 Umi는 금액을 생성, 포맷, 연산하는 데 사용할 수 있는 헬퍼 함수 세트를 제공합니다.

이러한 모든 헬퍼에 대해 자세히 알아보려면 [API 참조의 "Utils — Amounts" 섹션을 확인](https://umi.typedoc.metaplex.com/modules/umi.html)해보고 싶을 수 있지만, 새로운 금액 타입을 생성하는 데 도움이 되는 함수들의 간단한 목록은 다음과 같습니다.

```ts
// 베이시스 포인트에서 금액을 생성합니다.
createAmount(123, 'USD', 2); // -> "USD 1.23"에 대한 Amount

// 십진수에서 금액을 생성합니다.
createAmountFromDecimals(1.23, 'USD', 2); // -> "USD 1.23"에 대한 Amount

// USD 금액을 생성하는 헬퍼 함수
usd(1.23) // -> "USD 1.23"에 대한 Amount

// SOL 금액을 처리하는 헬퍼 함수
sol(1.23) // -> "1.23 SOL"에 대한 Amount
lamports(1_230_000_000) // -> "1.23 SOL"에 대한 Amount

// 퍼센트 금액을 생성하는 헬퍼 함수
percentAmount(50.42); // -> "50.42%"에 대한 Amount
percentAmount(50.42, 2); // -> "50.42%"에 대한 Amount
percentAmount(50.42, 0); // -> "50%"에 대한 Amount

// 토큰 금액을 생성하는 헬퍼 함수
tokenAmount(123); // -> "123 Tokens"에 대한 Amount
tokenAmount(123, 'splToken.BONK'); // -> "123 BONK"에 대한 Amount
tokenAmount(123.45, 'splToken.BONK', 2); // -> "123.45 BONK"에 대한 Amount
```

## 옵션

Rust에서는 선택적 값을 `Some(T)` 또는 `None`일 수 있는 `Option<T>` 열거형으로 정의합니다. 이는 보통 JavaScript 세계에서 `T | null`로 표현됩니다. 이 접근 방식의 문제는 중첩된 옵션과 함께 작동하지 않는다는 것입니다. 예를 들어, Rust의 `Option<Option<T>>`는 JavaScript에서 `T | null | null`이 되고 이는 `T | null`과 동일합니다. 즉, JavaScript에서 `Some(None)` 값이나 다른 중첩된 옵션을 표현할 방법이 없습니다.

이 문제를 해결하기 위해 Umi는 Rust `Option<T>` 타입과 매우 유사하게 작동하는 [`Option<T>` 유니온 타입](https://umi.typedoc.metaplex.com/types/umi.Option.html)을 제공합니다. 다음과 같이 정의됩니다:

```ts
type Option<T> = Some<T> | None;
type Some<T> = { __option: 'Some'; value: T };
type None = { __option: 'None' };
```

개발자 경험을 개선하기 위해 Umi는 옵션을 생성하는 `some`과 `none` 함수를 제공합니다. 옵션의 타입 `T`는 TypeScript에 의해 추론되거나 명시적으로 제공될 수 있습니다.

```ts
// 값이 있는 옵션을 생성합니다.
some('Hello World');
some<number | string>(123);

// 빈 옵션을 생성합니다.
none();
none<number | string>();
```

Umi는 또한 옵션을 확인하고 조작하는 헬퍼 함수 세트를 제공합니다.

```ts
// 옵션이 `Some`인지 `None`인지 확인합니다.
isSome(some('Hello World')); // -> true
isSome(none()); // -> false
isNone(some('Hello World')); // -> false
isNone(none()); // -> true

// 옵션이 `Some`이면 값을 언랩하고 그렇지 않으면 null을 반환합니다.
// `None`에 대한 사용자 정의 폴백 값을 지원합니다.
unwrapOption(some('Hello World')) // -> 'Hello World'
unwrapOption(none()) // -> null
unwrapOption(some('Hello World'), () => 'Default'); // -> 'Hello World'
unwrapOption(none(), () => 'Default'); // -> 'Default'

// `unwrapOption`과 같지만 재귀적으로 수행합니다(원본 객체/배열을 변경하지 않음).
// 또한 `None`에 대한 사용자 정의 폴백 값을 지원합니다.
unwrapOptionRecursively({
  a: 'hello',
  b: none<string>(),
  c: [{ c1: some(42) }, { c2: none<number>() }],
}) // -> { a: 'hello', b: null, c: [{ c1: 42 }, { c2: null }] }
```

## DateTimes

Umi는 초 단위의 타임스탬프를 사용하여 날짜와 시간을 나타내는 데 사용할 수 있는 `DateTime` 타입을 제공합니다. 이는 단순히 `bigint` 숫자로 정의되며 날짜 시간을 생성하고 포맷하는 헬퍼 함수 세트를 제공합니다.

```ts
// 새 DateTime을 생성합니다.
dateTime(1680097346);
dateTime(new Date(Date.now()));
dateTime("2021-12-31T23:59:59.000Z");

// 현재 시간에 대한 새 DateTime을 생성합니다.
now();

// DateTime을 포맷합니다.
formatDateTime(now());
formatDateTime(now(), 'fr-FR', myFormatOptions);
```

## GpaBuilders

`getProgramAccounts` RPC 요청을 준비하는 데 도움이 되도록 Umi는 [불변 `GpaBuilder` 헬퍼 클래스](https://umi.typedoc.metaplex.com/classes/umi.GpaBuilder.html)를 제공합니다. 이는 필터를 추가하고, 데이터를 슬라이스하고, 원시 계정을 가져와서 원하는 것으로 매핑하는 데 사용할 수 있습니다. 다음은 몇 가지 예시입니다.

```ts
// 프로그램의 모든 계정을 가져옵니다.
await gpaBuilder(umi, programId).get();

// 500바이트 길이인 계정의 첫 32바이트를 가져옵니다.
await gpaBuilder(umi, programId)
  .slice(0, 32)
  .whereSize(500)
  .get();

// 오프셋 32에 주어진 공개 키가 있는 계정의 공개 키를 가져옵니다.
await gpaBuilder(umi, programId)
  .withoutData()
  .where(32, myPublicKey)
  .getPublicKey();

// 계정 데이터의 첫 32바이트를 공개 키로 가져옵니다.
await gpaBuilder(umi, programId)
  .slice(0, 32)
  .getDataAsPublicKey();

// 계정 데이터의 두 번째 바이트를 가져와서 2를 곱합니다.
await gpaBuilder(umi, programId)
  .slice(1, 1)
  .getAndMap((n) => n * 2);
```

`GpaBuilder`는 `deserializeUsing` 메서드를 통해 원시 계정을 역직렬화된 계정으로 역직렬화하는 방법을 알려줄 수도 있습니다. 역직렬화 콜백이 제공되면 `getDeserialized` 메서드를 사용하여 역직렬화된 계정을 가져올 수 있습니다.

```ts
const metadataGpaBuilder = gpaBuilder(umi, programId)
  .deserializeUsing<Metadata>((account) => deserializeMetadata(umi, account));

const accounts: Metadata[] = await metadataGpaBuilder.getDeserialized();
```

또한 `GpaBuilder`에 오프셋이 있는 필드 세트를 전달하여 데이터 필터링 및 슬라이싱에 대한 개발자 경험을 개선할 수 있습니다. 이를 위해 `registerFields` 메서드를 사용할 수 있습니다. 예를 들어, 바이트 16부터 시작하여 다음 32바이트가 고정 크기 문자열을 통한 `name`을 나타내고 그 다음 4바이트가 `age`를 나타낸다고 알고 있다고 가정해보겠습니다. 다음과 같이 해당 필드를 등록할 수 있습니다.

```ts
import { gpaBuilder } from '@metaplex-foundation/umi';
import { string, u32 } from '@metaplex-foundation/umi/serializers';

const myGpaBuilderWithFields = gpaBuilder(umi, programId)
  .registerFields<{ name: string; age: number; }>({
    name: [16, string({ size: 32 })],
    age: [48, u32()],
  })
```

필드가 등록되면 `whereField`와 `sliceField` 메서드를 사용하여 필드를 사용해 데이터를 필터링하고 슬라이스할 수 있습니다. 사용할 오프셋을 알 뿐만 아니라 값을 직렬화하는 방법도 알게 됩니다.

```ts
// 나이가 42인 계정의 이름을 가져옵니다.
await myGpaBuilderWithFields
  .whereField('age', 42)
  .sliceField('name')
  .get();
```