---
title: 직렬화기
metaTitle: 직렬화기 | Umi
description: Metaplex Umi의 직렬화기와 역직렬화기
---
블록체인에 데이터를 전송하거나 읽을 때 직렬화는 프로세스의 큰 부분을 차지합니다. 직렬화 로직은 프로그램마다 다를 수 있으며, Borsh 직렬화가 Solana 프로그램에서 가장 인기 있는 선택이지만 유일한 선택은 아닙니다.

Umi는 자체 직렬화기를 구축할 수 있는 유연하고 확장 가능한 직렬화 프레임워크를 제공하여 이를 돕습니다. 구체적으로 다음을 포함합니다:
- `From`을 `Uint8Array`로 직렬화하고 `Uint8Array`를 `From`으로 기본 설정되는 `To`로 역직렬화할 수 있는 객체를 나타내는 일반적인 `Serializer<From, To = From>` 타입
- 직렬화기를 새로운 직렬화기로 매핑하고 변환하는 다양한 직렬화기 헬퍼들
- 마지막으로, 문자열 인코더, 숫자 직렬화기, 데이터 구조 등을 포함한 일반적인 타입을 직렬화하는 데 사용할 수 있는 내장 직렬화기 세트. 이러한 프리미티브는 더 복잡한 직렬화기를 구축하는 데 사용할 수 있습니다.

이 모든 것이 어떻게 작동하는지 살펴보겠습니다.

## 직렬화기 정의

`Serializer` 타입은 Umi의 직렬화 프레임워크의 중심 요소입니다. 타입 `T`에 대한 `Serializer` 인스턴스가 있으면 `T`의 인스턴스를 직렬화하고 역직렬화하는 데 필요한 모든 것을 갖게 됩니다. 예를 들어, `Serializer<{ name: string, age: number }>` 인스턴스는 `{ name: string, age: number }`의 인스턴스를 직렬화하고 역직렬화하는 데 사용할 수 있습니다.

경우에 따라 직렬화하려는 데이터가 역직렬화할 때 얻는 데이터보다 약간 느슨할 수 있습니다. 이러한 이유로 `Serializer<From, To>` 타입은 `From`을 확장하고 `From`으로 기본 설정되는 두 번째 타입 매개변수 `To`를 허용합니다. 이전 예시를 사용하여 `age` 속성이 선택적이고 제공되지 않을 때 `42`로 기본 설정된다고 상상해보겠습니다. 이 경우 `{ name: string, age?: number }`를 `Uint8Array`로 직렬화하지만 `Uint8Array`를 `{ name: string, age: number }`로 역직렬화하는 `Serializer<{ name: string, age?: number }, { name: string, age: number }>` 인스턴스를 정의할 수 있습니다.

`Serializer` 타입이 어떻게 정의되는지 보겠습니다.

```ts
type Serializer<From, To extends From = From> = {
  /** 직렬화기에 대한 설명 */
  description: string;
  /** 직렬화된 값의 고정 크기(바이트) 또는 가변인 경우 `null` */
  fixedSize: number | null;
  /** 직렬화된 값이 가질 수 있는 최대 크기(바이트) 또는 가변인 경우 `null` */
  maxSize: number | null;
  /** 값을 바이트로 직렬화하는 함수 */
  serialize: (value: From) => Uint8Array;
  /**
   * 바이트에서 값을 역직렬화하는 함수
   * 역직렬화된 값과 읽은 바이트 수를 반환합니다.
   */
  deserialize: (buffer: Uint8Array, offset?: number) => [To, number];
};
```

놀랍지 않은 `serialize`와 `deserialize` 함수 외에도 `Serializer` 타입에는 `description`, `fixedSize`, `maxSize`도 포함됩니다.
- `description`은 직렬화기를 설명하는 빠른 사람이 읽을 수 있는 문자열입니다.
- `fixedSize` 속성은 고정 크기 직렬화기를 다루는 경우에만 직렬화된 값의 크기를 바이트 단위로 제공합니다. 예를 들어, `u32` 직렬화기는 항상 `4`바이트의 `fixedSize`를 갖습니다.
- `maxSize` 속성은 가질 수 있는 최대 크기에 경계가 있는 가변 크기 직렬화기를 다룰 때 도움이 될 수 있습니다. 예를 들어 borsh `Option<PublicKey>` 직렬화기는 크기가 `1` 또는 `33`일 수 있으므로 `33`바이트의 `maxSize`를 갖습니다.

## 직렬화기 사용

Umi 프레임워크와 함께 번들로 제공되는 `@metaplex-foundation/umi/serializers` 서브모듈에서 `Serializer` 타입과 직렬화기 관련 모든 것을 가져올 수 있습니다. 프레임워크의 나머지 부분 없이 사용하려면 독립 실행형 `@metaplex-foundation/umi-serializers` 라이브러리로 가져올 수도 있습니다.

```ts
// Umi와 함께 번들
import { Serializer } from '@metaplex-foundation/umi/serializers';

// 독립 실행형 라이브러리로
import { Serializer } from '@metaplex-foundation/umi-serializers';
```

가져온 후 Umi가 제공하는 모든 내장 직렬화기와 헬퍼를 사용할 수 있습니다. 다음 섹션에서 각각을 자세히 살펴보겠지만, 지금은 작동 방식을 보여주는 간단한 예시를 살펴보겠습니다. `string` 타입의 `name` 속성, `PublicKey` 타입의 `publicKey` 속성, 각 숫자가 `u32` 정수인 `number[]` 타입의 `numbers` 속성을 포함하는 다양한 속성이 있는 `MyObject` 타입이 있다고 가정해봅시다. 다음과 같이 직렬화기를 만들 수 있습니다.

```ts
import { PublicKey } from '@metaplex-foundation/umi';
import { Serializer, struct, string, publicKey, array, u32 } from '@metaplex-foundation/umi/serializers';

type MyObject = {
  name: string;
  publicKey: PublicKey;
  numbers: number[];
};

const mySerializer: Serializer<MyObject> = struct([
  ['name', string()],
  ['publicKey', publicKey()],
  ['numbers', array(u32())],
]);
```

제공된 각 직렬화기는 자체 인수를 정의합니다(예: `array` 함수는 첫 번째 인수로 항목 직렬화기가 필요함). 하지만 대부분은 끝에 직렬화기의 동작을 조정하는 데 사용할 수 있는 선택적 `options` 인수를 갖습니다. `options` 인수 내의 속성은 직렬화기마다 다를 수 있지만 모두 하나의 공통 속성인 `description`을 공유합니다. 이는 생성된 직렬화기의 특정 설명을 제공하는 데 사용할 수 있습니다. 생략하면 충분한 설명이 자동으로 생성됩니다.

```ts
import { string } from '@metaplex-foundation/umi/serializers';

string().description; // -> 'string(utf8; u32(le))'.
string({ description: 'My custom string description' });
```

## 직렬화기 헬퍼

직렬화기를 가져오고 사용하는 방법을 알았으니 이제 Umi가 제공하는 변환을 위한 일부 헬퍼 메서드를 살펴보겠습니다.

### 직렬화기 매핑

`mapSerializer`는 `A`를 `B`로 변환하고 `A`를 다시 `B`로 변환하는 두 함수를 제공하여 `Serializer<A>`를 `Serializer<B>`로 변환하는 데 사용할 수 있습니다.

예를 들어, 문자열의 길이를 저장하여 문자열 직렬화기를 숫자 직렬화기로 변환하고 싶다고 상상해보겠습니다. `mapSerializer` 함수를 사용하여 이를 수행하는 방법은 다음과 같습니다.

```ts
const serializerA: Serializer<string> = ...;
const serializerB: Serializer<number> = mapSerializer(
  serializerA,
  (value: number): string => 'x'.repeat(value), // 주어진 길이의 모의 문자열 생성
  (value: string): number => value.length, // 문자열의 길이 가져오기
);
```

`mapSerializer`는 다른 `From`과 `To` 타입을 가진 직렬화기를 변환하는 데도 사용할 수 있습니다. 다음은 위와 비슷하지만 다른 `To` 타입을 가진 예시입니다.

```ts
const serializerA: Serializer<string | null, string> = ...;
const serializerB: Serializer<number | null, number> = mapSerializer(
  serializerA,
  (value: number | null): string | null => value === null ? null : 'x'.repeat(value),
  (value: string): number => value.length,
);
```

`To` 타입을 변경하지 않고 직렬화기의 `From` 타입만 변환하는 데 관심이 있다면 대신 하나의 함수만으로 `mapSerializer` 함수를 사용할 수 있습니다. 다음은 직렬화할 때만 `age` 속성을 선택적으로 만들기 위해 `Serializer<{ name: string, age: number }>` 인스턴스를 느슨하게 만드는 방법입니다.

```ts
type Person = { name: string, age: number };
type PersonWithOptionalAge = { name: string, age?: number };

const serializerA: Serializer<Person> = ...;
const serializerB: Serializer<PersonWithOptionalAge, Person> = mapSerializer(
  serializerA,
  (value: PersonWithOptionalAge): Person => ({
    name: value.name,
    age: value.age ?? 42,
  }),
);
```

직렬화기 매핑은 내장 직렬화기에 여전히 의존하면서 복잡한 사용 사례를 구축하는 데 도움이 되는 매우 강력한 기법입니다.

### 직렬화기 고정

`fixSerializer` 함수는 고정 크기를 바이트 단위로 요청하여 가변 크기 직렬화기를 고정 크기 직렬화기로 변환하는 또 다른 헬퍼입니다. 필요할 때 `Uint8Array` 버퍼를 요청된 크기로 패딩하거나 자르는 방식으로 수행됩니다. 반환된 직렬화기는 원래 직렬화기와 동일한 `From`과 `To` 타입을 갖습니다.

```ts
const myFixedSerializer = fixSerializer(myVariableSerializer, 42);
```

### 직렬화기 역순

`reverseSerializer` 함수는 고정 크기 직렬화기의 바이트를 역순으로 만드는 데 사용할 수 있습니다. 이 함수의 적용은 덜 빈번하지만 예를 들어 엔디안니스를 다룰 때 유용할 수 있습니다. 여기서도 반환된 직렬화기는 원래 직렬화기와 동일한 `From`과 `To` 타입을 갖습니다.

```ts
const myReversedSerializer = reverseSerializer(mySerializer);
```

### 바이트 헬퍼

일부 저수준 헬퍼 메서드도 바이트를 조작하기 위해 제공된다는 점에 주목할 가치가 있습니다. 이들은 직렬화기를 반환하지 않지만 사용자 정의 직렬화기를 구축할 때 유용할 수 있습니다.

```ts
// 여러 Uint8Array 버퍼를 하나로 병합
mergeBytes([new Uint8Array([1, 2]), new Uint8Array([3, 4])]); // -> Uint8Array([1, 2, 3, 4])

// Uint8Array 버퍼를 주어진 크기로 패딩
padBytes(new Uint8Array([1, 2]), 4); // -> Uint8Array([1, 2, 0, 0])
padBytes(new Uint8Array([1, 2, 3, 4]), 2); // -> Uint8Array([1, 2, 3, 4])

// Uint8Array 버퍼를 주어진 크기로 패딩하고 자르기
fixBytes(new Uint8Array([1, 2]), 4); // -> Uint8Array([1, 2, 0, 0])
fixBytes(new Uint8Array([1, 2, 3, 4]), 2); // -> Uint8Array([1, 2])
```

## 내장 직렬화기

이제 Umi와 함께 제공되는 다양한 직렬화기들을 살펴보겠습니다. 이러한 각 프리미티브는 이전 섹션에서 본 것처럼 더 복잡한 직렬화기를 구축하는 데 사용할 수 있습니다.

### 숫자

Umi는 12개의 숫자 직렬화기를 제공합니다: 5개의 부호 없는 정수, 5개의 부호 있는 정수, 2개의 부동 소수점 숫자. 이들은 다양한 크기의 숫자를 직렬화하고 역직렬화하는 데 사용할 수 있습니다. 숫자의 크기가 32비트보다 큰 경우, JavaScript의 네이티브 `number` 타입이 `2^53 - 1`보다 큰 숫자를 지원하지 않으므로 반환되는 직렬화기는 `Serializer<number>` 대신 `Serializer<number | bigint, bigint>`입니다.

```ts
// 부호 없는 정수
u8(); // -> Serializer<number>
u16(); // -> Serializer<number>
u32(); // -> Serializer<number>
u64(); // -> Serializer<number | bigint, bigint>
u128(); // -> Serializer<number | bigint, bigint>

// 부호 있는 정수
i8(); // -> Serializer<number>
i16(); // -> Serializer<number>
i32(); // -> Serializer<number>
i64(); // -> Serializer<number | bigint, bigint>
i128(); // -> Serializer<number | bigint, bigint>

// 부동 소수점 숫자
f32(); // -> Serializer<number>
f64(); // -> Serializer<number>
```

하나의 바이트만 사용하는 `u8`과 `i8` 직렬화기를 제외하고, 다른 모든 숫자 직렬화기는 기본적으로 리틀 엔디안으로 표현되며 다른 엔디안니스를 사용하도록 구성할 수 있습니다. 이는 직렬화기에 `endian` 옵션을 전달하여 수행할 수 있습니다.

```ts
u64(); // 리틀 엔디안
u64({ endian: Endian.Little }); // 리틀 엔디안
u64({ endian: Endian.Big }); // 빅 엔디안
```

숫자 직렬화기는 다른 직렬화기에서 자주 재사용되므로 Umi는 `number`와 `bigint` 타입을 모두 포함하는 다음 `NumberSerializer` 타입을 정의합니다.

```ts
type NumberSerializer =
  | Serializer<number>
  | Serializer<number | bigint, bigint>;
```

### 불린

`bool` 직렬화기는 `Serializer<boolean>`을 생성하는 데 사용할 수 있습니다. 기본적으로 불린 값을 저장하기 위해 `u8` 숫자를 사용하지만 `size` 옵션에 `NumberSerializer`를 전달하여 변경할 수 있습니다.

```ts
bool(); // -> u8 사용
bool({ size: u32() }); // -> u32 사용
bool({ size: u32({ endian: Endian.Big }) }); // -> 빅 엔디안 u32 사용
```

### 문자열 인코딩

Umi는 다양한 형식의 문자열을 직렬화하고 역직렬화하는 데 사용할 수 있는 다음 문자열 직렬화기를 제공합니다: `utf8`, `base10`, `base16`, `base58`, `base64`.

```ts
utf8.serialize('Hello World!');
base10.serialize('42');
base16.serialize('ff002a');
base58.serialize('LorisCg1FTs89a32VSrFskYDgiRbNQzct1WxyZb7nuA');
base64.serialize('SGVsbG8gV29ybGQhCg==');
```

또한 주어진 알파벳에 대해 새로운 문자열 직렬화기를 만들 수 있는 `baseX` 함수도 제공합니다. 예를 들어, `base58` 직렬화기가 구현되는 방법은 다음과 같습니다.

```ts
const base58: Serializer<string> = baseX(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);
```

### 문자열

`string` 직렬화기는 다양한 인코딩과 크기 전략을 사용하여 문자열을 직렬화하는 데 사용할 수 있는 `Serializer<string>`을 반환합니다. 다음 옵션을 포함합니다:
- `encoding`: 문자열을 직렬화하고 역직렬화할 때 사용할 인코딩을 나타내는 `Serializer<string>`. 기본적으로 내장 `utf8` 직렬화기를 사용합니다. `Serializer<string>`을 전달하여 `Serializer<string>`을 만드는 이유가 궁금할 수 있습니다. 이는 `encoding` 직렬화기의 목적이 문자열의 크기 저장과 같은 다른 것들에 대해 걱정하지 않고 일부 텍스트를 바이트 배열로 변환하고 되돌리는 것뿐이기 때문입니다. 이를 통해 이 `string` 함수가 제공하는 다른 모든 옵션을 활용하면서 원하는 인코딩을 연결할 수 있습니다.
- `size`: 주어진 버퍼에서 문자열이 얼마나 계속되는지 알기 위해 바이트 단위의 크기를 알아야 합니다. 이를 위해 다음 크기 전략 중 하나를 사용할 수 있습니다:
  - `NumberSerializer`: 숫자 직렬화기가 전달되면 문자열의 크기를 저장하고 복원하기 위한 접두사로 사용됩니다. 기본적으로 크기는 리틀 엔디안의 `u32` 접두사를 사용하여 저장됩니다(borsh 직렬화의 기본 동작).
  - `number`: 바이트 크기를 숫자로 명시적으로 제공할 수도 있습니다. 이는 크기 접두사를 사용하지 않고 항상 동일한 바이트 수를 사용하여 문자열을 저장하는 고정 크기 직렬화기를 생성합니다.
  - `"variable"`: 문자열 `"variable"`이 크기로 전달되면 역직렬화할 때 버퍼의 나머지 모든 바이트를 사용하는 가변 크기 직렬화기를 생성합니다. 직렬화할 때는 직렬화된 문자열의 크기를 저장하지 않고 단순히 `encoding` 직렬화기의 결과를 반환합니다.

```ts
// 참조용으로 다른 인코딩을 사용하여 직렬화된 값
utf8.serialize('Hi'); // -> 0x4869
base58.serialize('Hi'); // -> 0x03c9

// 기본 동작: utf8 인코딩과 u32(리틀 엔디안) 크기
string().serialize('Hi'); // -> 0x020000004869

// 사용자 정의 인코딩: base58
string({ encoding: base58 }).serialize('Hi'); // -> 0x0200000003c9

// 사용자 정의 크기: u16(빅 엔디안) 크기
string({ size: u16({ endian: Endian.Big }) }).serialize('Hi'); // -> 0x00024869

// 사용자 정의 크기: 5바이트
string({ size: 5 }).serialize('Hi'); // -> 0x4869000000

// 사용자 정의 크기: 가변
string({ size: 'variable' }).serialize('Hi'); // -> 0x4869
```

### 바이트

`bytes` 직렬화기는 `Uint8Array`를 `Uint8Array`로 역직렬화하는 `Serializer<Uint8Array>`를 반환합니다. 이것이 다소 쓸모없어 보일 수 있지만 다른 직렬화기에 구성될 때 유용할 수 있습니다. 예를 들어, `struct` 직렬화기에서 특정 필드가 직렬화되지 않은 채로 남아있어야 한다고 말하는 데 사용할 수 있습니다.

`string` 함수와 매우 유사하게 `bytes` 함수는 바이트 배열의 크기가 저장되고 복원되는 방법을 구성하는 `size` 옵션을 포함합니다. 기본 크기가 `"variable"` 전략이라는 점을 제외하고는 `string` 함수와 동일한 크기 전략이 지원됩니다. 요약하면:
- `NumberSerializer`: 접두사 숫자 직렬화기를 사용하여 바이트 배열의 크기를 저장하고 복원합니다.
- `number`: 고정 크기를 사용하여 바이트 배열을 저장합니다.
- `"variable"`: 직렬화할 때 버퍼를 그대로 전달하고 역직렬화할 때 버퍼의 나머지를 반환합니다. 기본 동작.

```ts
// 기본 동작: 가변 크기
bytes().serialize(new Uint8Array([42])); // -> 0x2a

// 사용자 정의 크기: u16(리틀 엔디안) 크기
bytes({ size: u16() }).serialize(new Uint8Array([42])); // -> 0x01002a

// 사용자 정의 크기: 5바이트
bytes({ size: 5 }).serialize(new Uint8Array([42])); // -> 0x2a00000000
```

### 공개 키

`publicKey` 직렬화기는 공개 키를 직렬화하고 역직렬화하는 데 사용할 수 있는 `Serializer<PublicKey>`를 반환합니다. 다음은 동일한 공개 키를 직렬화하고 역직렬화하는 예시입니다. `publicKey` 함수는 메인 `@metaplex-foundation/umi` 패키지에서도 내보내지며 다양한 입력에서 공개 키를 생성할 수 있게 해준다는 점에 주목하세요. 따라서 충돌을 피하기 위해 가져오기에 별칭을 사용해야 할 수 있습니다.

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers';

const myPublicKey = publicKey('...');
const buffer = publicKeySerializer().serialize(myPublicKey);
const [myDeserializedPublicKey, offset] = publicKeySerializer().deserialize(buffer);
myPublicKey === myDeserializedPublicKey; // -> true
```

### 단위

`unit` 직렬화기는 `undefined`를 빈 `Uint8Array`로 직렬화하고 역직렬화할 때 바이트를 소비하지 않고 `undefined`를 반환하는 `Serializer<void>`를 반환합니다. 이는 다른 직렬화기에서 내부적으로 사용할 수 있는 더 저수준의 직렬화기입니다. 예를 들어, 이것이 `dataEnum` 직렬화기가 내부적으로 빈 변형을 설명하는 방법입니다.

```ts
unit().serialize(undefined); // -> new Uint8Array([])
unit().deserialize(new Uint8Array([42])); // -> [undefined, 0]
```

### 배열, 집합, 맵

Umi는 리스트와 맵을 직렬화하는 세 가지 함수를 제공합니다:
- `array`: 항목 배열을 직렬화합니다. `Serializer<T>`를 인수로 받아 `Serializer<T[]>`를 반환합니다.
- `set`: 고유한 항목 집합을 직렬화합니다. `Serializer<T>`를 인수로 받아 `Serializer<Set<T>>`를 반환합니다.
- `map`: 키-값 쌍의 맵을 직렬화합니다. 키에 대한 `Serializer<K>`와 값에 대한 `Serializer<V>`를 인수로 받아 `Serializer<Map<K, V>>`를 반환합니다.

세 함수 모두 배열, 집합 또는 맵의 길이가 저장되고 복원되는 방법을 구성하는 동일한 `size` 옵션을 허용합니다. 이는 `string`과 `bytes` 직렬화기가 작동하는 방식과 매우 유사합니다. 지원되는 전략은 다음과 같습니다:
- `NumberSerializer`: 내용 앞에 크기를 접두사로 붙이는 숫자 직렬화기를 사용합니다. 기본적으로 크기는 리틀 엔디안의 `u32` 접두사를 사용하여 저장됩니다.
- `number`: 고정된 수의 항목을 가진 배열, 집합 또는 맵 직렬화기를 반환합니다.
- `"remainder"`: 버퍼의 나머지를 항목의 고정 크기로 나누어 항목 수를 유추하는 배열, 집합 또는 맵 직렬화기를 반환합니다. 예를 들어, 버퍼에 64바이트가 남아있고 배열의 각 항목이 16바이트 길이인 경우 배열은 4개 항목으로 역직렬화됩니다. 이 옵션은 고정 크기 항목에서만 사용할 수 있습니다. 맵의 경우 키 직렬화기와 값 직렬화기 모두 고정 크기여야 합니다.

```ts
// 배열
array(u8()) // u32 크기 접두사가 있는 u8 항목 배열
array(u8(), { size: 5 }) // 5개 u8 항목 배열
array(u8(), { size: 'remainder' }) // 가변 크기 u8 항목 배열

// 집합
set(u8()) // u32 크기 접두사가 있는 u8 항목 집합
set(u8(), { size: 5 }) // 5개 u8 항목 집합
set(u8(), { size: 'remainder' }) // 가변 크기 u8 항목 집합

// 맵
map(u8(), u8()) // u32 크기 접두사가 있는 (u8, u8) 항목 맵
map(u8(), u8(), { size: 5 }) // 5개 (u8, u8) 항목 맵
map(u8(), u8(), { size: 'remainder' }) // 가변 크기 (u8, u8) 항목 맵
```

### 옵션과 널러블

Umi는 선택적 값을 직렬화하는 두 가지 함수를 제공합니다:
- `nullable`: null일 수 있는 값을 직렬화합니다. `Serializer<T>`를 인수로 받아 `Serializer<Nullable<T>>`를 반환하며, 여기서 `Nullable<T>`는 `T | null`의 타입 별칭입니다.
- `option`: `Option` 인스턴스를 직렬화합니다([문서 참조](helpers#options)). `Serializer<T>`를 인수로 받아 `Serializer<OptionOrNullable<T>, Option<T>>`를 반환합니다. 이는 역직렬화된 값이 항상 `Option` 타입으로 래핑되지만 직렬화된 값은 `Option<T>` 또는 `Nullable<T>`일 수 있음을 의미합니다.

두 함수 모두 값이 존재하는지 여부를 나타내는 불린 값을 접두사로 붙여 선택적 값을 직렬화합니다. 접두사 불린이 `false`인 경우 값은 `null`(널러블의 경우) 또는 `None`(옵션의 경우)이며 실제 값 역직렬화를 건너뛸 수 있습니다. 그렇지 않으면 제공된 직렬화기를 사용하여 값을 역직렬화하고 반환합니다.

두 함수 모두 생성된 직렬화기의 동작을 구성하는 동일한 옵션을 제공합니다:
- `prefix`: 불린 접두사를 직렬화하고 역직렬화하는 데 사용할 `NumberSerializer`. 기본적으로 리틀 엔디안의 `u8` 접두사를 사용합니다.
- `fixed`: 이것이 `true`인 경우 값이 비어있을 때 직렬화 로직을 변경하여 고정 크기 직렬화기를 반환합니다. 이 경우 직렬화된 값은 빈 값과 채워진 값이 동일한 바이트 수를 사용하여 직렬화되도록 0으로 패딩됩니다. 이는 항목 직렬화기가 고정 크기인 경우에만 작동합니다.

```ts
// 옵션
option(publicKey()) // u8 접두사가 있는 Option<PublicKey>
option(publicKey(), { prefix: u16() }) // u16 접두사가 있는 Option<PublicKey>
option(publicKey(), { fixed: true }) // 고정 크기 Option<PublicKey>

// 널러블
nullable(publicKey()) // u8 접두사가 있는 Nullable<PublicKey>
nullable(publicKey(), { prefix: u16() }) // u16 접두사가 있는 Nullable<PublicKey>
nullable(publicKey(), { fixed: true }) // 고정 크기 Nullable<PublicKey>
```

### 구조체

`struct` 직렬화기는 일반 타입 `T`의 JavaScript 객체를 직렬화하고 역직렬화할 수 있게 해줍니다.

첫 번째 인수에 각 필드의 이름과 직렬화기를 배열로 전달해야 합니다. 이 `fields` 배열은 각 필드가 첫 번째 항목이 필드 이름이고 두 번째 항목이 필드의 직렬화기인 튜플이 되도록 구조화됩니다. 필드의 순서는 필드가 직렬화되고 역직렬화되는 순서를 결정하므로 중요합니다. 다음은 예시입니다.

```ts
type Person = {
  name: string;
  age: number;
}

struct<Person>([
  ['name', string()],
  ['age', u32()],
]);
```

`struct` 함수는 일부 필드가 다른 `From`과 `To` 타입 매개변수를 가진 경우를 위해 두 번째 타입 매개변수 `U`도 허용합니다. 이를 통해 `Serializer<T, U>` 타입의 직렬화기를 만들 수 있습니다.

예를 들어, `Person` 타입의 `age` 필드에 기본값을 제공하는 구조체 직렬화기를 만드는 방법은 다음과 같습니다.

```ts
type Person = { name: string; age: number; }
type PersonArgs = { name: string; age?: number; }

const ageOr42 = mapSerializer(
  u32(),
  (age: number | undefined): number => age ?? 42,
);

struct<PersonArgs, Person>([
  ['name', string()],
  ['age', ageOr42],
]);
```

### 튜플

Umi는 튜플을 직렬화하고 역직렬화하는 데 사용할 수 있는 `tuple` 직렬화기를 제공합니다. 튜플은 JavaScript에서 네이티브가 아니지만 각 항목이 자체 정의된 타입을 갖는 배열을 사용하여 TypeScript에서 표현할 수 있습니다. 예를 들어, Rust의 `(String, u8)` 튜플은 TypeScript에서 `[string, number]`로 표현할 수 있습니다.

`tuple` 함수는 튜플의 항목과 동일한 순서로 일치해야 하는 직렬화기 배열을 첫 번째 인수로 받습니다. 다음은 몇 가지 예시입니다.

```ts
tuple([bool()]); // Serializer<[bool]>
tuple([string(), u8()]); // Serializer<[string, number]>
tuple([publicKey(), u64()]); // Serializer<[PublicKey, number | bigint], [PublicKey, bigint]>
```

### 스칼라 열거형

`scalarEnum` 함수는 변형의 값(또는 인덱스)을 `u8` 숫자로 저장하여 스칼라 열거형에 대한 직렬화기를 만드는 데 사용할 수 있습니다.

첫 번째 인수로 열거형 생성자가 필요합니다. 예를 들어, 열거형이 `enum Direction { Left }`로 정의된 경우 생성자 `Direction`을 첫 번째 인수로 전달해야 합니다. 생성된 직렬화기는 열거형의 모든 변형과 그 값 또는 이름을 입력으로 받습니다. 다음은 예시입니다.

```ts
enum Direction { Left, Right, Up, Down };

const directionSerializer = scalarEnum(Direction); // Serializer<Direction>
directionSerializer.serialize(Direction.Left); // -> 0x00
directionSerializer.serialize(Direction.Right); // -> 0x01
directionSerializer.serialize('Left'); // -> 0x00
directionSerializer.serialize('Right'); // -> 0x01
directionSerializer.serialize(0); // -> 0x00
directionSerializer.serialize(1); // -> 0x01

// 역직렬화된 값은 항상 열거형의 인스턴스입니다.
directionSerializer.deserialize(new Uint8Array([1])); // -> [Direction.Right, 1]
```

직렬화된 값이 기본적으로 `u8` 숫자 직렬화기를 사용하여 저장되지만, 이 동작을 변경하기 위해 사용자 정의 `NumberSerializer`를 `size` 옵션으로 제공할 수 있습니다.

```ts
scalarEnum(Direction, { size: u32() }).serialize(Direction.Right); // -> 0x01000000
```

문자열 열거형(예: `enum Direction { Left = 'LEFT' }`)과 함께 `scalarEnum` 함수를 사용하면 텍스트 값을 무시하고 변형의 인덱스만 사용한다는 점에 주목하세요.

```ts
enum Direction { Left = 'LEFT', Right = 'RIGHT', Up = 'UP', Down = 'DOWN' };

const directionSerializer = scalarEnum(Direction); // Serializer<Direction>
directionSerializer.serialize(Direction.Left); // -> 0x00
directionSerializer.serialize('Left'); // -> 0x00

// 열거형 문자열 값을 입력으로 사용할 수 있습니다.
directionSerializer.serialize('LEFT'); // -> 0x00
```

### 데이터 열거형

Rust에서 열거형은 변형이 다음 중 하나일 수 있는 강력한 데이터 타입입니다:
- 빈 변형 — 예: `enum Message { Quit }`
- 튜플 변형 — 예: `enum Message { Write(String) }`
- 구조체 변형 — 예: `enum Message { Move { x: i32, y: i32 } }`

JavaScript에서는 이러한 강력한 열거형이 없지만 각 객체가 특정 필드로 구분되는 객체의 합집합을 사용하여 TypeScript에서 에뮬레이트할 수 있습니다. 이를 데이터 열거형이라고 합니다.

Umi에서는 `__kind` 필드를 사용하여 데이터 열거형의 다른 변형을 구분합니다. 또한 모든 변형이 객체이므로 `fields` 속성을 사용하여 튜플 변형의 배열을 래핑합니다. 다음은 예시입니다.

```ts
type Message =
  | { __kind: 'Quit' } // 빈 변형
  | { __kind: 'Write'; fields: [string] } // 튜플 변형
  | { __kind: 'Move'; x: number; y: number }; // 구조체 변형
```

`dataEnum` 함수는 데이터 열거형에 대한 직렬화기를 만들 수 있게 해줍니다. 첫 번째 인수로 각 변형의 이름과 직렬화기가 필요합니다. `struct` 직렬화기와 마찬가지로 이들은 첫 번째 항목이 변형의 이름이고 두 번째 항목이 변형의 직렬화기인 변형 튜플의 배열로 정의됩니다. 빈 변형은 직렬화할 데이터가 없으므로 단순히 `unit` 직렬화기를 사용합니다. 이전 예시에 대한 데이터 열거형 직렬화기를 만드는 방법은 다음과 같습니다.

```ts
const messageSerializer = dataEnum<Message>([
  // 빈 변형
  ['Quit', unit()],
  // 튜플 변형
  ['Write', struct<{ fields: [string] }>([
    ['fields', tuple([string()])]
  ])],
  // 구조체 변형
  ['Move', struct<{ x: number; y: number }>([
    ['x', i32()],
    ['y', i32()]
  ])],
]);
```

이 직렬화는 Rust 열거형의 borsh 직렬화와 호환됩니다. 먼저 리틀 엔디안의 `u32` 숫자를 사용하여 변형의 인덱스를 저장합니다. 선택된 변형이 빈 변형인 경우 여기서 멈춥니다. 그렇지 않으면 변형의 직렬화기를 사용하여 데이터를 직렬화합니다.

```ts
messageSerializer.serialize({ __kind: 'Quit' }); // -> 0x00000000
messageSerializer.serialize({ __kind: 'Write', fields: ['Hi'] }); // -> 0x01000000020000004869
messageSerializer.serialize({ __kind: 'Move', x: 5, y: 6 }); // -> 0x020000000500000006000000
```

`dataEnum` 함수는 위에서 언급한 기본 `u32` 대신 변형 인덱스에 대한 사용자 정의 숫자 직렬화기를 선택할 수 있는 `prefix` 옵션도 허용합니다. 다음은 `u32` 대신 `u8`을 사용하는 예시입니다.

```ts
const messageSerializer = dataEnum<Message>([...], {
  prefix: u8()
});

messageSerializer.serialize({ __kind: 'Quit' }); // -> 0x00
messageSerializer.serialize({ __kind: 'Write', fields: ['Hi'] }); // -> 0x01020000004869
messageSerializer.serialize({ __kind: 'Move', x: 5, y: 6 }); // -> 0x020500000006000000
```

데이터 열거형을 다룰 때 Rust의 열거형 처리 방식에 더 가깝게 느껴지도록 개발자 경험을 개선하는 헬퍼 메서드를 제공하고 싶을 수 있습니다. 이는 [Kinobi](kinobi)가 생성된 JavaScript 클라이언트에 기본적으로 제공하는 것입니다.

```ts
// 헬퍼 메서드 예시
message('Quit'); // -> { __kind: 'Quit' }
message('Write', ['Hi']); // -> { __kind: 'Write', fields: ['Hi'] }
message('Move', { x: 5, y: 6 }); // -> { __kind: 'Move', x: 5, y: 6 }
isMessage('Quit', message('Quit')); // -> true
isMessage('Write', message('Quit')); // -> false
```

### 비트 배열

`bitArray` 직렬화기는 각 불린이 단일 비트로 표현되는 불린 배열을 직렬화하고 역직렬화하는 데 사용할 수 있습니다. 직렬화기의 `size`를 바이트 단위로 요구하며 비트의 순서를 역순으로 하는 데 사용할 수 있는 선택적 `backward` 플래그가 있습니다.

```ts
const booleans = [true, false, true, false, true, false, true, false];
bitArray(1).serialize(booleans); // -> Uint8Array.from([0b10101010]);
bitArray(1).deserialize(Uint8Array.from([0b10101010])); // -> [booleans, 1];
```