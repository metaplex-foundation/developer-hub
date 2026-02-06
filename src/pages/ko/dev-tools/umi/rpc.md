---
title: RPC와 연결하기
metaTitle: RPC와 연결하기 | Umi
description: Metaplex Umi를 사용하여 RPC와 연결하기
---
RPC를 통해 Solana 블록체인과 통신하는 것은 모든 탈중앙화 애플리케이션의 중요한 부분입니다. Umi는 이를 위한 [RpcInterface](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html)를 제공합니다.

## RPC 엔드포인트 구성

기본 번들을 통해 새로운 Umi 인스턴스를 생성할 때 첫 번째 인수로 RPC의 엔드포인트 또는 `@solana/web3.js`의 `Connection` 클래스 인스턴스를 전달해야 합니다. 앞으로 RPC 인터페이스에서 메서드를 호출할 때마다 이 엔드포인트 또는 `Connection`이 사용됩니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { Connection } from '@solana/web3.js';

// RPC 엔드포인트를 전달
const umi = createUmi("https://api.mainnet-beta.solana.com");

// 또는 web3.js의 명시적 Connection 인스턴스
const umi = createUmi(new Connection("https://api.mainnet-beta.solana.com"));
```

또는 제공되는 플러그인을 사용하여 RPC 구현을 명시적으로 설정하거나 업데이트할 수 있습니다. 예를 들어, `web3JsRpc` 플러그인은 RPC 구현을 `@solana/web3.js` 라이브러리를 사용하도록 설정합니다.

```ts
import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';
import { Connection } from '@solana/web3.js';

umi.use(web3JsRpc("https://api.mainnet-beta.solana.com"));
umi.use(web3JsRpc(new Connection("https://api.mainnet-beta.solana.com")));
```

## RPC의 엔드포인트와 클러스터 가져오기

RPC 구현이 설정되면 다음 메서드를 통해 엔드포인트와 클러스터에 액세스할 수 있습니다:

```ts
const endpoint = umi.rpc.getEndpoint();
const cluster = umi.rpc.getCluster();
```

여기서 `cluster`는 다음 중 하나입니다:

```ts
type Cluster = "mainnet-beta" | "devnet" | "testnet" | "localnet" | "custom"
```

## 트랜잭션 전송

다음 메서드를 사용하여 트랜잭션을 전송, 확인 및 가져올 수 있습니다:

```ts
const signature = await umi.rpc.sendTransaction(myTransaction);
const confirmResult = await umi.rpc.confirmTransaction(signature, { strategy });
const transaction = await umi.rpc.getTransaction(signature);
```

트랜잭션은 Solana 클라이언트의 중요한 구성 요소이므로 [트랜잭션 전송](/ko/dev-tools/umi/transactions) 문서 페이지에서 더 자세히 다룹니다.

## 계정 가져오기

다음 메서드를 사용하여 계정을 가져오거나 존재 여부를 확인할 수 있습니다:

```ts
const accountExists = await umi.rpc.accountExists(myPublicKey);
const maybeAccount = await umi.rpc.getAccount(myPublicKey);
const maybeAccounts = await umi.rpc.getAccounts(myPublicKeys);
const accounts = await umi.rpc.getProgramAccounts(myProgramId, { filters });
```

계정 가져오기는 가장 일반적인 작업 중 하나이므로 [계정 가져오기](accounts) 문서 페이지에서 더 자세히 다룹니다.

## 지원되는 클러스터에서 SOL 에어드롭

사용되는 클러스터가 에어드롭을 지원하는 경우 다음 메서드를 사용하여 계정에 SOL을 전송하고 요청을 확인할 수 있습니다.

```ts
// "myPublicKey"에 1.5 SOL을 전송하고 트랜잭션이 확인될 때까지 대기
await umi.rpc.airdrop(myPublicKey, sol(1.5));
```

## 계정 잔액 가져오기

다음 메서드를 사용하여 모든 계정의 SOL 잔액을 가져올 수 있습니다. 이는 [여기에 문서화된](helpers#amounts) `SolAmount` 객체를 반환합니다.

```ts
const balance = await umi.rpc.getBalance(myPublicKey);
```

## 최신 블록해시 가져오기

다음 메서드를 통해 만료 블록 높이와 함께 최신 블록해시를 가져올 수 있습니다:

```ts
const { blockhash, lastValidBlockHeight } = await umi.rpc.getLatestBlockhash();
```

## 가장 최근 슬롯 가져오기

다음 메서드를 통해 가장 최근 슬롯을 숫자로 가져올 수 있습니다:

```ts
const recentSlot = await umi.rpc.getSlot();
```

## 임대료 면제 가져오기

계정의 스토리지 수수료를 알아야 하는 경우 `getRent` 메서드를 사용하고 계정의 데이터가 필요로 하는 바이트 양을 전달할 수 있습니다. 이는 임대료 면제 수수료(스토리지 수수료)를 `SolAmount`로 반환합니다.

```ts
const rent = await umi.rpc.getRent(100);
```

이는 계정 헤더의 크기를 자동으로 고려하므로 계정 데이터의 바이트만 전달하면 됩니다.

이제 각각 100바이트의 데이터를 가진 3개 계정의 임대료 면제 수수료를 가져오고 싶다고 가정해봅시다. `umi.rpc.getRent(100 * 3)`을 실행하면 한 계정의 계정 헤더만 추가하고 세 개가 아니므로 정확한 응답을 제공하지 않습니다. 이것이 Umi가 `includesHeaderBytes` 옵션을 `true`로 설정하여 계정 헤더 크기를 명시적으로 전달할 수 있게 하는 이유입니다.

```ts
const rent = await umi.rpc.getRent((ACCOUNT_HEADER_SIZE + 100) * 3, {
  includesHeaderBytes: true
});
```

## 사용자 정의 RPC 요청 전송

각 RPC 엔드포인트가 자체적인 사용자 정의 메서드를 제공할 수 있기 때문에 Umi는 `call` 메서드를 통해 RPC에 사용자 정의 요청을 전송할 수 있게 합니다. 첫 번째 인수로 메서드 이름을, 두 번째 인수로 선택적 매개변수 배열을 받습니다.

```ts
const rpcResult = await umi.rpc.call("myCustomMethod", [myFirstParam, mySecondParam]);
```
