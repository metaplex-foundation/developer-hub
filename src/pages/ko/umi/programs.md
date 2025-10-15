---
title: 프로그램 등록
metaTitle: 프로그램 등록 | Umi
description: Metaplex Umi에 프로그램 등록하기
---
Solana 프로그램과 상호작용하는 클라이언트를 생성하려면 클러스터 내에서 어떤 프로그램이 사용 가능하고 어떤 주소에 있는지 알아야 합니다. Umi는 클라이언트를 위한 하나의 큰 프로그램 레지스트리 역할을 하는 `ProgramRepositoryInterface`를 제공합니다.

이를 통해 다음과 같은 작업이 가능합니다:
- 다른 라이브러리의 프로그램 등록
- 자체 프로그램 등록 및 기존 프로그램 재정의
- 현재 클러스터 또는 특정 클러스터에서 이름이나 공개 키로 프로그램 가져오기
- 이름이나 코드로 프로그램 오류 해결

## 프로그램 정의

Umi는 Solana 프로그램을 나타내는 `Program` 타입을 제공합니다. 이 타입에는 프로그램의 이름, 공개 키, 그리고 오류를 해결하고 배포된 클러스터를 확인하는 데 사용할 수 있는 몇 가지 함수가 포함되어 있습니다.

```ts
export type Program = {
  name: string;
  publicKey: PublicKey;
  getErrorFromCode: (code: number, cause?: Error) => ProgramError | null;
  getErrorFromName: (name: string, cause?: Error) => ProgramError | null;
  isOnCluster: (cluster: Cluster) => boolean;
};
```

[API 레퍼런스를 통해 `Program` 타입의 속성에 대해 자세히 알아볼 수 있습니다](https://umi.typedoc.metaplex.com/types/umi.Program.html). 단, `name` 속성은 고유해야 하며 관례적으로 camelCase 형식을 사용해야 합니다. 다른 조직과의 충돌을 피하기 위해 프로그램 이름 앞에 조직 고유의 네임스페이스를 붙이는 것이 권장됩니다. 예를 들어, Metaplex 프로그램은 `mplTokenMetadata` 또는 `mplCandyMachine`과 같이 `mpl`로 접두사를 붙입니다.

## 프로그램 추가

프로그램 저장소에 새 프로그램을 등록하려면 `ProgramRepositoryInterface`의 `add` 메서드를 다음과 같이 사용할 수 있습니다.

```ts
umi.programs.add(myProgram);
```

이 프로그램이 저장소에 이미 존재하는 경우(즉, 적어도 하나의 충돌하는 클러스터에 대해 동일한 이름 또는 공개 키를 가진 경우) 새로 추가된 프로그램으로 재정의됩니다. 이 동작을 변경하려면 두 번째 인수 `override`를 `false`로 설정할 수 있습니다. 아래 예시에서 이 프로그램은 등록된 다른 프로그램이 사용자의 쿼리와 일치하지 않는 경우에만 검색됩니다.

```ts
umi.programs.add(myProgram, false);
```

## 프로그램 가져오기

프로그램이 등록되면 `get` 메서드를 통해 이름이나 공개 키로 가져올 수 있습니다. 저장소에 프로그램이 존재하면 해당 프로그램을 반환합니다. 그렇지 않으면 오류를 발생시킵니다.

```ts
// 이름으로 프로그램 가져오기
const myProgram = umi.programs.get('myProgram');

// 공개 키로 프로그램 가져오기
const myProgram = umi.programs.get(publicKey('...'));
```

기본적으로 `get` 메서드는 현재 클러스터에 배포된 프로그램만 반환합니다(즉, `isOnCluster` 메서드가 현재 클러스터에 대해 `true`를 반환하는 경우). [`ClusterFilter`](https://umi.typedoc.metaplex.com/types/umi.ClusterFilter.html)를 허용하는 두 번째 인수를 통해서만 다른 클러스터를 지정할 수 있습니다.

`ClusterFilter`는 명시적인 [`Cluster`](https://umi.typedoc.metaplex.com/types/umi.Cluster.html), 현재 클러스터를 선택하는 `"current"`, 또는 모든 클러스터에 배포된 프로그램을 선택하는 `"all"`이 될 수 있습니다.

```ts
// 현재 클러스터에서 프로그램 가져오기
umi.programs.get('myProgram');
umi.programs.get('myProgram', 'current');

// 특정 클러스터에서 프로그램 가져오기
umi.programs.get('myProgram', 'mainnet-beta');
umi.programs.get('myProgram', 'devnet');

// 모든 클러스터에서 프로그램 가져오기
umi.programs.get('myProgram', 'all');
```

또한 `get` 메서드는 제네릭이며 `Program` 타입의 상위 집합을 반환할 수 있다는 점도 주목할 가치가 있습니다. 예를 들어, 해당 프로그램의 `availableGuards`를 저장하기 위해 `Program` 타입을 확장하는 `CandyGuardProgram` 타입이 있다고 가정해봅시다. 가져오는 프로그램이 해당 타입이어야 한다는 것을 알고 있다면, 타입 매개변수를 `CandyGuardProgram`으로 설정하여 `get` 메서드에 알려줄 수 있습니다.

```ts
umi.programs.get<CandyGuardProgram>('mplCandyGuard');
```

또한 `ProgramRepositoryInterface`는 프로그램이 저장소에 존재하는지 확인하는 데 사용할 수 있는 `has` 메서드와 저장소의 모든 프로그램을 검색하는 `all` 메서드를 제공합니다. 이 두 메서드 모두 `get` 메서드와 동일한 `ClusterFilter` 인수를 허용합니다.

```ts
// 프로그램이 저장소에 존재하는지 확인
umi.programs.has('myProgram');
umi.programs.has(publicKey('...'));
umi.programs.has('myProgram', 'mainnet-beta');
umi.programs.has('myProgram', 'all');

// 저장소의 모든 프로그램 검색
umi.programs.all();
umi.programs.all('mainnet-beta');
umi.programs.all('all');
```

마지막으로 프로그램의 공개 키를 가져오는 것은 일반적인 작업이므로 `ProgramRepositoryInterface`는 프로그램의 공개 키를 직접 가져오는 데 사용할 수 있는 `getPublicKey` 메서드를 제공합니다. 프로그램이 저장소에 존재하지 않는 경우 오류를 발생시키지 않고 대신 주어진 공개 키를 반환하도록 `fallback` 공개 키를 제공할 수 있습니다.

```ts
// 프로그램의 공개 키 가져오기
umi.programs.getPublicKey('myProgram');

// fallback과 함께 프로그램의 공개 키 가져오기
const fallback = publicKey('...');
umi.programs.getPublicKey('myProgram', fallback);

// 특정 클러스터에서 프로그램의 공개 키 가져오기
umi.programs.getPublicKey('myProgram', fallback, 'mainnet-beta');
```

## 프로그램 오류 해결

`ProgramRepositoryInterface`는 트랜잭션 오류에서 사용자 정의 프로그램 오류를 해결하는 데 사용할 수 있는 `resolveError` 메서드를 제공합니다. 이 메서드는 `logs` 속성이 있는 모든 `Error`와 이 오류를 발생시킨 `Transaction` 인스턴스를 허용합니다. 그런 다음 오류 로그에서 사용자 정의 프로그램 오류가 식별되면 `ProgramError` 인스턴스를 반환합니다. 그렇지 않으면 `null`을 반환합니다.

```ts
umi.programs.resolveError(error, transaction);
```