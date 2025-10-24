---
title: Kinobi를 통한 Umi 클라이언트 생성
metaTitle: Kinobi를 통한 Umi 클라이언트 생성 | Umi
description: Kinobi를 통한 Umi 클라이언트 생성
---
Umi 프레임워크는 JavaScript에서 Solana 클라이언트를 구축하는 기반을 제공합니다. 프로그램이 Umi 호환 라이브러리를 제공할 때 훨씬 더 강력해집니다. 이를 통해 최종 사용자는 자신의 Umi 인스턴스를 제공하는 헬퍼 함수에 간단히 연결할 수 있습니다. Umi 호환 라이브러리 생성 프로세스를 단순화하고 자동화하기 위해 Umi는 Kinobi라는 강력한 코드 생성기를 제공합니다.

[Kinobi](https://github.com/metaplex-foundation/kinobi)는 하나 또는 여러 프로그램으로 구성될 수 있는 Solana 클라이언트의 언어에 구애받지 않는 표현을 도입합니다. 이는 `Visitor` 클래스가 방문할 수 있는 노드 트리를 사용하여 이를 수행합니다. 방문자는 트리의 모든 측면을 업데이트하는 데 사용할 수 있어 개발자가 자신의 요구에 맞게 클라이언트를 조정할 수 있습니다. 트리가 개발자의 취향에 맞으면 언어별 방문자를 사용하여 대상 언어나 프레임워크용 코드를 생성할 수 있습니다.

좋은 소식은 Kinobi가 우리를 위해 Umi 호환 라이브러리를 생성하는 `RenderJavaScriptVisitor`와 함께 제공된다는 것입니다.

다음은 Kinobi와 Umi를 사용하여 Solana 프로그램용 JavaScript 클라이언트를 생성하는 방법에 대한 간단한 개요입니다. [이 다이어그램을 단계별로 설명하는 스레드](https://twitter.com/lorismatic/status/1637890024992833536)에 관심이 있을 수 있습니다.

![](https://pbs.twimg.com/media/Frr0StQaIAAc16a?format=jpg&name=4096x4096)

## Kinobi 시작하기

자세한 내용은 [Kinobi 문서](https://github.com/metaplex-foundation/kinobi)를 확인하고 싶을 수 있지만, Kinobi를 시작하는 방법에 대한 간단한 개요는 다음과 같습니다.

먼저 Kinobi를 설치해야 합니다:

```sh
npm install @metaplex-foundation/kinobi
```

그런 다음 Kinobi 트리를 생성하고 렌더링하는 JavaScript 파일(예: `kinobi.js`)을 생성해야 합니다. 이는 `Kinobi` 인스턴스를 생성하고 IDL 파일 경로 배열을 전달하여 수행됩니다. IDL 파일을 생성하려면 [Shank JS 라이브러리](https://github.com/metaplex-foundation/shank-js)를 확인해보고 싶을 수 있습니다. 그런 다음 방문자를 사용하여 트리를 업데이트하고 `RenderJavaScriptVisitor`를 통해 Umi 호환 라이브러리로 렌더링할 수 있습니다. 다음은 예시입니다.

```ts
import { createFromIdls, RenderJavaScriptVisitor } from "@metaplex-foundation/kinobi";

// Kinobi를 인스턴스화합니다.
const kinobi = createFromIdls([
  path.join(__dirname, "idls", "my_idl.json"),
  path.join(__dirname, "idls", "my_other_idl.json"),
]);

// 방문자를 사용하여 Kinobi 트리를 업데이트합니다...

// JavaScript를 렌더링합니다.
const jsDir = path.join(__dirname, "clients", "js", "src", "generated");
kinobi.accept(new RenderJavaScriptVisitor(jsDir));
```

이제 다음과 같이 Node.js로 이 파일을 실행하기만 하면 됩니다.

```sh
node ./kinobi.js
```

JS 클라이언트를 처음 생성할 때는 필요에 따라 라이브러리를 준비해야 합니다. 최소한 `package.json` 파일을 생성하고, 의존성을 설치하고, 생성된 폴더를 가져오는 최상위 `index.ts` 파일을 제공해야 합니다.

## Kinobi 생성 클라이언트의 기능

이제 Kinobi를 통해 Umi 호환 라이브러리를 생성하는 방법을 알았으니, 이들이 무엇을 할 수 있는지 살펴보겠습니다.

### 타입과 직렬화기

Kinobi 생성 라이브러리는 프로그램에 정의된 각 타입, 계정 및 명령어에 대한 직렬화기를 제공합니다. 또한 직렬화기를 생성하는 데 필요한 두 개의 TypeScript 타입(즉, `From`과 `To` 타입 매개변수)을 내보냅니다. 두 타입을 구별하기 위해 `From` 타입에 `Args` 접미사를 붙입니다. 예를 들어, IDL에 `MyType` 타입이 정의되어 있다면 다음 코드를 사용하여 직렬화 및 역직렬화할 수 있습니다.

```ts
const serializer: Serializer<MyTypeArgs, MyType> = getMyTypeSerializer();
serializer.serialize(myType);
serializer.deserialize(myBuffer);
```

명령어의 경우 타입 이름에 `InstructionData` 접미사가 붙고, 계정의 경우 `AccountData` 접미사가 붙습니다. 이를 통해 접미사가 없는 계정 이름을 `Account<T>` 타입으로 사용할 수 있습니다. 예를 들어, 프로그램에 `Token` 계정과 `Transfer` 명령어가 있다면 다음과 같은 타입과 직렬화기를 얻게 됩니다.

```ts
// 계정의 경우
type Token = Account<TokenAccountData>;
type TokenAccountData = {...};
type TokenAccountDataArgs = {...};
const tokenDataSerializer = getTokenAccountDataSerializer();

// 명령어의 경우
type TransferInstructionData = {...};
type TransferInstructionDataArgs = {...};
const transferDataSerializer = getTransferInstructionDataSerializer();
```

### 데이터 열거형 헬퍼

생성된 타입이 [데이터 열거형](serializers#data-enums)으로 식별되면 개발자 경험을 개선하는 데 도움이 되는 추가 헬퍼 메서드가 생성됩니다. 예를 들어, 다음과 같은 데이터 열거형 타입이 생성되었다고 가정해보겠습니다.

```ts
type Message =
  | { __kind: 'Quit' } // 빈 변형
  | { __kind: 'Write'; fields: [string] } // 튜플 변형
  | { __kind: 'Move'; x: number; y: number }; // 구조체 변형
```

그러면 타입과 `getMessageSerializer` 함수를 생성하는 것 외에도 새로운 데이터 열거형을 생성하고 각각의 변형 타입을 확인하는 데 사용할 수 있는 `message`와 `isMessage` 함수도 생성됩니다.

```ts
message('Quit'); // -> { __kind: 'Quit' }
message('Write', ['Hi']); // -> { __kind: 'Write', fields: ['Hi'] }
message('Move', { x: 5, y: 6 }); // -> { __kind: 'Move', x: 5, y: 6 }
isMessage('Quit', message('Quit')); // -> true
isMessage('Write', message('Quit')); // -> false
```

### 계정 헬퍼

Kinobi는 또한 계정에 대한 추가 헬퍼 메서드를 제공하여 쉽게 가져와서 역직렬화할 수 있는 방법을 제공합니다. 계정 이름이 `Metadata`라고 가정하면 다음과 같은 추가 헬퍼 메서드를 사용할 수 있습니다.

```ts
// 원시 계정을 파싱된 계정으로 역직렬화합니다.
deserializeMetadata(rawAccount); // -> Metadata

// 공개 키에서 역직렬화된 계정을 가져옵니다.
await fetchMetadata(umi, publicKey); // -> Metadata 또는 실패
await safeFetchMetadata(umi, publicKey); // -> Metadata 또는 null

// 공개 키로 모든 역직렬화된 계정을 가져옵니다.
await fetchAllMetadata(umi, publicKeys); // -> Metadata[], 계정이 누락되면 실패
await safeFetchAllMetadata(umi, publicKeys) // -> Metadata[], 누락된 계정은 필터링

// 계정에 대한 getProgramAccount 빌더를 생성합니다.
await getMetadataGpaBuilder()
  .whereField('updateAuthority', updateAuthority)
  .selectField('mint')
  .getDataAsPublicKeys() // -> PublicKey[]

// 고정 크기가 있는 경우 계정 데이터의 바이트 크기를 가져옵니다.
getMetadataSize() // -> number

// 시드에서 계정의 PDA 주소를 찾습니다.
findMetadataPda(umi, seeds) // -> Pda
```

`GpaBuilder`가 무엇을 할 수 있는지 자세히 알아보려면 [`GpaBuilder`에 대한 문서](helpers#gpabuilders)를 확인해보고 싶을 수 있습니다.

### 트랜잭션 빌더

각 생성된 명령어는 또한 해당 명령어를 포함하는 트랜잭션 빌더를 생성하는 데 사용할 수 있는 자체 함수를 갖게 됩니다. 예를 들어, `Transfer` 명령어가 있다면 `TransactionBuilder`를 반환하는 `transfer` 함수를 생성합니다.

```ts
await transfer(umi, { from, to, amount }).sendAndConfirm();
```

트랜잭션 빌더는 함께 결합될 수 있기 때문에 다음과 같이 여러 명령어를 포함하는 트랜잭션을 쉽게 생성할 수 있습니다.

```ts
await transfer(umi, { from, to: destinationA, amount })
  .add(transfer(umi, { from, to: destinationB, amount }))
  .add(transfer(umi, { from, to: destinationC, amount }))
  .sendAndConfirm();
```

### 오류와 프로그램

Kinobi는 또한 클라이언트에 정의된 각 프로그램에 대한 `Program` 타입을 반환하는 함수와 이에 접근하는 일부 헬퍼를 생성합니다. 예를 들어, 클라이언트가 `MplTokenMetadata` 프로그램을 정의한다면 다음 헬퍼가 생성됩니다.

```ts
// 상수 변수로서의 프로그램 공개 키
MPL_TOKEN_METADATA_PROGRAM_ID; // -> PublicKey

// 프로그램 저장소에 등록할 수 있는 프로그램 객체를 생성합니다.
createMplTokenMetadataProgram(); // -> Program

// 프로그램 저장소에서 프로그램 객체를 가져옵니다.
getMplTokenMetadataProgram(umi); // -> Program

// 프로그램 저장소에서 프로그램의 공개 키를 가져옵니다.
getMplTokenMetadataProgramId(umi); // -> PublicKey
```

Kinobi는 클라이언트에 대한 Umi 플러그인을 자동 생성하지 않으므로 원하는 대로 사용자 정의할 수 있습니다. 즉, 플러그인을 직접 생성해야 하며 최소한 클라이언트에서 정의한 프로그램을 등록해야 합니다. 다음은 `MplTokenMetadata` 프로그램을 사용한 예시입니다.

```ts
export const mplTokenMetadata = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplTokenMetadataProgram(), false);
  },
});
```

또한 각 프로그램은 발생할 수 있는 각 오류에 대한 사용자 정의 `ProgramError`를 생성합니다. 예를 들어, 프로그램이 `UpdateAuthorityIncorrect` 오류를 정의한다면 다음 클래스를 생성합니다.

```ts
export class UpdateAuthorityIncorrectError extends ProgramError {
  readonly name: string = 'UpdateAuthorityIncorrect';

  readonly code: number = 0x7; // 7

  constructor(program: Program, cause?: Error) {
    super('Update Authority given does not match', program, cause);
  }
}
```

각 생성된 오류는 또한 `codeToErrorMap`과 `nameToErrorMap`에 등록되어 라이브러리가 이름이나 코드에서 모든 오류 클래스를 찾을 수 있는 두 개의 헬퍼 메서드를 제공할 수 있게 합니다.

```ts
getMplTokenMetadataErrorFromCode(0x7, program); // -> UpdateAuthorityIncorrectError
getMplTokenMetadataErrorFromName('UpdateAuthorityIncorrect', program); // -> UpdateAuthorityIncorrectError
```

이러한 메서드는 `createMplTokenMetadataProgram` 함수에서 `Program` 객체의 `getErrorFromCode`와 `getErrorFromName` 함수를 채우는 데 사용됩니다.