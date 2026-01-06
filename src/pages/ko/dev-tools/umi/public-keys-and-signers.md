---
title: 공개 키와 서명자
metaTitle: 공개 키와 서명자 | Umi
description: Metaplex Umi에서 공개 키와 서명자
---
이 페이지에서는 EdDSA 인터페이스를 통해 부분적으로 가능해진 Umi에서 공개 키와 서명자를 관리하는 방법을 살펴보겠습니다.

[EdDSA 인터페이스](https://umi.typedoc.metaplex.com/interfaces/umi.EddsaInterface.html)는 EdDSA 알고리즘을 사용하여 키페어를 생성하고, PDA를 찾고, 메시지에 서명/검증하는 데 사용됩니다. 이 인터페이스를 직접 사용하거나, 더 나은 개발자 경험을 제공하기 위해 이 인터페이스에 위임하는 헬퍼 메서드를 사용할 수 있습니다.

사용 사례별로 이를 다뤄보겠습니다.

{% callout type="note" %}
Wallet Adapter나 파일시스템 지갑을 사용하는 스니펫을 찾고 계신가요? [시작하기 페이지](/ko/dev-tools/umi/getting-started)를 확인해보세요!
{% /callout %}

## 공개 키

Umi에서 공개 키는 32바이트 배열을 나타내는 간단한 base58 `string`입니다. 주어진 공개 키가 검증되었고 유효하다는 것을 TypeScript에 알리기 위해 불투명 타입을 사용합니다. 또한 더 세밀한 타입 안전성을 제공하기 위해 타입 매개변수를 사용합니다.

```ts
// 간단히 말하면:
type PublicKey = string;

// 실제로는:
type PublicKey<TAddress extends string = string> = TAddress & { __publicKey: unique symbol };
```

`publicKey` 헬퍼 메서드를 사용하여 다양한 입력으로부터 새로운 유효한 공개 키를 생성할 수 있습니다. 제공된 입력이 유효한 공개 키로 변환될 수 없는 경우 오류가 발생합니다.

```ts
// base58 문자열로부터
publicKey('LorisCg1FTs89a32VSrFskYDgiRbNQzct1WxyZb7nuA');

// 32바이트 버퍼로부터
publicKey(new Uint8Array(32));

// PublicKey 또는 Signer 타입으로부터
publicKey(someWallet as PublicKey | Signer);
```

`publicKeyBytes` 헬퍼 메서드를 사용하여 공개 키를 `Uint8Array`로 변환할 수 있습니다.

```ts
publicKeyBytes(myPublicKey);
// -> Uint8Array(32)
```

공개 키 관리를 도와주는 추가 헬퍼 메서드들도 사용할 수 있습니다.

```ts
// 제공된 값이 유효한 공개 키인지 확인
isPublicKey(myPublicKey);

// 제공된 값이 유효한 공개 키라고 단언하고 그렇지 않으면 실패
assertPublicKey(myPublicKey);

// 공개 키 배열 중복 제거
uniquePublicKeys(myPublicKeys);

// 기본 공개 키(32바이트 0 배열) 생성
defaultPublicKey();
```

## PDA

PDA(Program-Derived Address)는 프로그램 ID와 미리 정의된 시드 배열로부터 파생된 공개 키입니다. PDA가 EdDSA 타원 곡선 위에 위치하지 않도록 하여 암호학적으로 생성된 공개 키와 충돌하지 않도록 보장하기 위해 0에서 255 범위의 `bump` 번호가 필요합니다.

Umi에서 PDA는 파생된 공개 키와 bump 번호로 구성된 튜플로 표현됩니다. 공개 키와 마찬가지로 불투명 타입과 타입 매개변수를 사용합니다.

```ts
// 간단히 말하면:
type Pda = [PublicKey, number];

// 실제로는:
export type Pda<
  TAddress extends string = string,
  TBump extends number = number
> = [PublicKey<TAddress>, TBump] & { readonly __pda: unique symbol };
```

새로운 PDA를 파생하려면 EdDSA 인터페이스의 `findPda` 메서드를 사용할 수 있습니다.

```ts
const pda = umi.eddsa.findPda(programId, seeds);
```

각 시드는 `Uint8Array`로 직렬화되어야 합니다. 직렬화기에 대한 자세한 내용은 [직렬화기 페이지](serializers)에서 확인할 수 있으며, 다음은 주어진 민트 주소의 메타데이터 PDA를 찾는 방법을 보여주는 간단한 예시입니다.

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { publicKey as publicKeySerializer, string } from '@metaplex-foundation/umi/serializers';

const tokenMetadataProgramId = publicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const metadata = umi.eddsa.findPda(tokenMetadataProgramId, [
  string({ size: 'variable' }).serialize('metadata'),
  publicKeySerializer().serialize(tokenMetadataProgramId),
  publicKeySerializer().serialize(mint),
]);
```

대부분의 경우 프로그램은 특정 PDA를 찾기 위한 헬퍼 메서드를 제공한다는 점에 주목하세요. 예를 들어, 위의 코드 스니펫은 [`@metaplex-foundation/mpl-token-metadata`](https://github.com/metaplex-foundation/mpl-token-metadata) [Kinobi](kinobi) 생성 라이브러리의 `findMetadataPda` 메서드를 사용하여 다음과 같이 단순화할 수 있습니다.

```ts
import { findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';

const metadata = findMetadataPda(umi, { mint })
```

PDA 관리를 도와주는 다음 헬퍼 메서드들도 사용할 수 있습니다.

```ts
// 제공된 값이 Pda인지 확인
isPda(myPda);

// 제공된 공개 키가 EdDSA 타원 곡선 위에 있는지 확인
umi.eddsa.isOnCurve(myPublicKey);
```

## 서명자

서명자는 트랜잭션과 메시지에 서명할 수 있는 공개 키입니다. 이를 통해 필요한 계정에서 트랜잭션에 서명하고 지갑이 메시지에 서명하여 신원을 증명할 수 있습니다. Umi에서는 다음 인터페이스로 표현됩니다.

```ts
interface Signer {
  publicKey: PublicKey;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}
```

`generateSigner` 헬퍼 메서드를 사용하여 암호학적으로 새로운 서명자를 생성할 수 있습니다. 내부적으로 이 메서드는 다음 섹션에서 설명하는 EdDSA 인터페이스의 `generateKeypair` 메서드를 사용합니다.

```ts
const mySigner = generateSigner(umi);
```

서명자를 관리하는 데 사용할 수 있는 다음 헬퍼 함수들도 있습니다.

```ts
// 제공된 값이 Signer인지 확인
isSigner(mySigner);

// 공개 키별로 서명자 배열 중복 제거
uniqueSigners(mySigners);
```

[Umi 인터페이스 페이지](interfaces)에서 언급했듯이 `Umi` 인터페이스는 두 개의 `Signer` 인스턴스를 저장합니다: 앱을 사용하는 `identity`와 트랜잭션 및 스토리지 수수료를 지불하는 `payer`입니다. Umi는 이러한 속성에 새로운 서명자를 빠르게 할당할 수 있는 플러그인을 제공합니다. 이를 위해 `signerIdentity`와 `signerPayer` 플러그인을 사용할 수 있습니다. 기본적으로 `signerIdentity` 메서드는 대부분의 경우 신원이 지불자이기도 하므로 `payer` 속성도 업데이트합니다.

```ts
umi.use(signerIdentity(mySigner));
// 다음과 동일:
umi.identity = mySigner;
umi.payer = mySigner;

umi.use(signerIdentity(mySigner, false));
// 다음과 동일:
umi.identity = mySigner;

umi.use(signerPayer(mySigner));
// 다음과 동일:
umi.payer = mySigner;
```

새로운 서명자를 생성하고 즉시 `identity` 및/또는 `payer` 속성에 할당하는 `generatedSignerIdentity`와 `generatedSignerPayer` 플러그인을 사용할 수도 있습니다.

```ts
umi.use(generatedSignerIdentity());
umi.use(generatedSignerPayer());
```

경우에 따라 라이브러리에서 `Signer`를 제공해야 하지만 현재 환경에서 이 지갑에 서명자로 액세스할 수 없는 경우가 있습니다. 예를 들어, 트랜잭션이 클라이언트에서 생성되지만 나중에 개인 서버에서 서명되는 경우입니다. 이러한 이유로 Umi는 주어진 공개 키에서 새로운 서명자를 생성하고 단순히 모든 서명 요청을 무시하는 `createNoopSigner` 헬퍼를 제공합니다. 트랜잭션이 블록체인에 전송되기 전에 서명되도록 하는 것은 사용자의 책임입니다.

```ts
const mySigner = createNoopSigner(myPublicKey);
```

## 키페어

Umi는 지갑에서 서명을 요청하기 위해 `Signer` 인터페이스에만 의존하지만, 비밀 키를 명시적으로 인식하는 `Keypair` 타입과 `KeypairSigner` 타입도 정의합니다.

```ts
type KeypairSigner = Signer & Keypair;
type Keypair = {
  publicKey: PublicKey;
  secretKey: Uint8Array;
};
```

EdDSA 인터페이스의 `generateKeypair`, `createKeypairFromSeed`, `createKeypairFromSecretKey` 메서드를 사용하여 새로운 `Keypair` 객체를 생성할 수 있습니다.

```ts
// 새로운 무작위 키페어 생성
const myKeypair = umi.eddsa.generateKeypair();

// 시드를 사용하여 키페어 복원
const myKeypair = umi.eddsa.createKeypairFromSeed(mySeed);

// 비밀 키를 사용하여 키페어 복원
const myKeypair = umi.eddsa.createKeypairFromSecretKey(mySecretKey);
```

애플리케이션 전체에서 이러한 키페어를 서명자로 사용하려면 `createSignerFromKeypair` 헬퍼 메서드를 사용할 수 있습니다. 이 메서드는 필요할 때 비밀 키에 액세스할 수 있도록 `KeypairSigner` 인스턴스를 반환합니다.

```ts
const myKeypair = umi.eddsa.generateKeypair();
const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);
```

위의 코드 스니펫은 이전 섹션에서 설명한 `generateSigner` 헬퍼 메서드를 사용하는 것과 동일합니다.

키페어를 관리하는 헬퍼 함수와 플러그인도 존재합니다.

```ts
// 제공된 서명자가 KeypairSigner 객체인지 확인
isKeypairSigner(mySigner);

// 새로운 키페어를 신원과 지불자로 등록
umi.use(keypairIdentity(myKeypair));

// 새로운 키페어를 지불자로만 등록
umi.use(keypairPayer(myKeypair));
```

## 메시지 서명

`Signer` 객체와 EdDSA 인터페이스를 함께 사용하여 다음과 같이 메시지에 서명하고 검증할 수 있습니다.

```ts
const myMessage = utf8.serialize('Hello, world!');
const mySignature = await mySigner.signMessage(myMessage)
const mySignatureIsCorrect = umi.eddsa.verify(myMessage, mySignature, mySigner.publicKey);
```

## 트랜잭션 서명

`Signer` 인스턴스가 있으면 트랜잭션 또는 트랜잭션 세트에 서명하는 것은 `signTransaction` 또는 `signAllTransactions` 메서드를 호출하는 것만큼 간단합니다.

```ts
const mySignedTransaction = await mySigner.signTransaction(myTransaction);
const mySignedTransactions = await mySigner.signAllTransactions(myTransactions);
```

여러 서명자가 모두 동일한 트랜잭션에 서명해야 하는 경우 다음과 같이 `signTransaction` 헬퍼 메서드를 사용할 수 있습니다.

```ts
const mySignedTransaction = await signTransaction(myTransaction, mySigners);
```

한 단계 더 나아가, 각각 하나 이상의 서명자가 서명해야 하는 여러 트랜잭션이 있는 경우 `signAllTransactions` 함수가 도움이 될 수 있습니다. 서명자가 둘 이상의 트랜잭션에 서명해야 하는 경우 모든 트랜잭션에 대해 `signer.signAllTransactions` 메서드를 한 번에 사용하도록 보장합니다.

```ts
// 이 예시에서 mySigner2는 signAllTransactions 메서드를 사용하여
// 두 트랜잭션 모두에 서명합니다.
const mySignedTransactions = await signAllTransactions([
  { transaction: myFirstTransaction, signers: [mySigner1, mySigner2] },
  { transaction: mySecondTransaction, signers: [mySigner2, mySigner3] }
]);
```

`Signer`를 수동으로 생성하여 `signTransaction` 메서드를 구현하는 경우 `addTransactionSignature` 헬퍼 함수를 사용하여 트랜잭션에 서명을 추가할 수 있습니다. 이는 제공된 서명이 트랜잭션에 필요하고 트랜잭션의 `signatures` 배열의 올바른 인덱스에 푸시되도록 보장합니다.

```ts
const mySignedTransaction = addTransactionSignature(myTransaction, mySignature, myPublicKey);
```