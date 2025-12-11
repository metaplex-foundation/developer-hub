---
title: 자산 서명 실행
metaTitle: 실행 및 자산 서명자 | Core
description: MPL Core 자산이 Execute 명령어를 사용하여 명령어와 트랜잭션에 서명하는 방법을 알아보세요.
---

MPL Core Execute 명령어는 MPL Core 자산에 **자산 서명자**의 개념을 도입합니다.

이러한 **자산 서명자**는 자산 자체를 대신하여 서명자 역할을 하며, 이를 통해 MPL Core 자산이 다음을 수행할 수 있게 됩니다:

- Solana 및 SPL 토큰을 전송합니다.
- 다른 계정의 권한이 됩니다.
- 트랜잭션/명령어/CPI 서명이 필요한 `assetSignerPda`에 할당된 다른 작업 및 검증을 수행합니다.

MPL Core 자산은 블록체인에 트랜잭션/CPI를 서명하고 제출할 수 있는 능력을 가지고 있습니다. 이는 Core 자산에게 `assetSigner` 형태의 자체 지갑을 효과적으로 제공합니다.

## 자산 서명자 PDA

자산은 이제 `assetSignerPda` 계정/주소에 액세스할 수 있으며, 이를 통해 MPL Core 프로그램의 `execute` 명령어가 전송된 추가 명령어를 통과시켜 `assetSignerPda`로 CPI 명령어에 서명할 수 있습니다.

이를 통해 `assetSignerPda` 계정이 현재 자산 소유자를 대신하여 계정 명령어를 효과적으로 소유하고 실행할 수 있습니다.

`assetSignerPda`를 Core 자산에 연결된 지갑으로 생각할 수 있습니다.

### findAssetSignerPda()

```ts
const assetId = publickey('11111111111111111111111111111111')

const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
```

## Execute 명령어

### 개요

`execute` 명령어를 통해 사용자는 Core 자산을 전달하고 MPL Core 프로그램의 `execute` 명령어가 온체인에서 실행될 때 AssetSigner에 의해 서명될 통과 명령어들을 전달할 수 있습니다.

`execute` 명령어와 그 인수에 대한 개요입니다.

```ts
const executeIx = await execute(umi, {
    {
        // `fetchAsset()`를 통한 트랜잭션에 서명하는 자산.
        asset: AssetV1,
        // `fetchCollection()`을 통한 컬렉션
        collection?: CollectionV1,
        // TransactionBuilder | Instruction[] 중 하나
        instructions: ExecuteInput,
        // 트랜잭션/명령어에 필요한 추가 서명자들.
        signers?: Signer[]
    }
})
```

### 검증

{% callout title="assetSignerPda 검증" %}
MPL Core Execute 명령어는 **현재 자산 소유자**도 트랜잭션에 서명했는지 검증합니다. 이는 현재 자산 소유자만이 `execute` 명령어와 함께 `assetSignerPda`를 사용하여 트랜잭션을 실행할 수 있도록 보장합니다.
{% /callout %}

### Execute 작업 제어

execute 기능은 [Freeze Execute Plugin](/core/plugins/freeze-execute)을 사용하여 제어할 수 있습니다. 이 플러그인을 사용하면 자산의 execute 작업을 동결하여 동결이 해제될 때까지 모든 execute 명령어 처리를 방지할 수 있습니다.

Freeze Execute Plugin은 특히 다음과 같은 경우에 유용합니다:

- **백업된 NFT**: 필요할 때 기본 자산의 인출을 방지
- **에스크로 없는 프로토콜**: 프로토콜 작업 중 execute 기능을 일시적으로 잠금
- **보안 조치**: 복잡한 작업을 실행할 수 있는 자산에 대한 추가 보호 계층 추가

Freeze Execute Plugin이 활성화되고 `frozen: true`로 설정되면, execute 명령어를 사용하려는 모든 시도는 플러그인이 `frozen: false`로 업데이트될 때까지 차단됩니다.

## 예제

### 자산 서명자로부터 SOL 전송

다음 예제에서는 `assetSignerPda`로 전송된 SOL을 우리가 선택한 목적지로 전송합니다.

```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { publickey, createNoopSigner, sol } from '@metaplex-foundation/umi'

const assetId = publickey('11111111111111111111111111111111')

const asset = await fetchAsset(umi, assetId)

// 선택사항 - 자산이 컬렉션의 일부인 경우 컬렉션 객체를 가져옴
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// 자산 서명자가 계정에 1 SOL의 잔액을 가지고 있음.
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// SOL을 전송하고자 하는 목적지 계정.
const destination = publickey('2222222222222222222222222222222222')

// 표준 `transferSol()` transactionBuilder.
const transferSolIx = transferSol(umi, {
  // assetSigner가 나중에 CPI 중에 서명할 것이므로 noopSigner를 생성
  source: createNoopSigner(publicKey(assetSigner)),
  // 목적지 주소
  destination,
  // 전송하고자 하는 금액
  amount: sol(0.5),
})

// `execute` 명령어를 호출하고 체인에 전송.
const res = await execute(umi, {
  // 이 자산으로 명령어들을 실행
  asset,
  // 자산이 컬렉션의 일부인 경우 `fetchCollection()`을 통해 컬렉션 객체 전달
  collection,
  // 실행할 transactionBuilder/instruction[]
  instructions: transferSolIx,
}).sendAndConfirm(umi)

console.log({ res })
```

### 자산 서명자로부터 SPL 토큰 전송

다음 예제에서는 `assetSignerPda` 계정에서 목적지로 SPL 토큰 잔액의 일부를 전송합니다.

이 예제는 기본 지갑 주소에 대한 파생 토큰 계정에 관한 모범 사례를 기반으로 합니다. 토큰이 `assetSignerPda` 주소를 기반으로 올바르게 파생된 토큰 계정에 있지 않다면 이 예제를 조정해야 합니다.

```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import {
  transferTokens,
  findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-toolbox'
import { publickey } from '@metaplex-foundation/umi'

const assetId = publickey('11111111111111111111111111111111')

const asset = await fetchAsset(umi, assetId)

// 선택사항 - 자산이 컬렉션의 일부인 경우 컬렉션 객체를 가져옴
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

const splTokenMint = publickey('2222222222222222222222222222222222')

// 자산 서명자가 토큰 잔액을 가지고 있음.
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// SOL을 전송하고자 하는 목적지 지갑.
const destinationWallet = publickey('3333333333333333333333333333333')

// 표준 `transferTokens()` transactionBuilder.
const transferTokensIx = transferTokens(umi, {
  // 소스는 `assetSignerPda` 파생 토큰 계정
  source: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: assetSignerPda,
  }),
  // 목적지는 `destinationWallet` 파생 토큰 계정
  destination: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: destinationWallet,
  }),
  // 라이트 단위로 보낼 금액.
  amount: 5000,
})

// `execute` 명령어를 호출하고 체인에 전송.
const res = await execute(umi, {
  // 이 자산으로 명령어들을 실행
  asset,
  // 자산이 컬렉션의 일부인 경우 `fetchCollection()`을 통해 컬렉션 객체 전달
  collection,
  // 실행할 transactionBuilder/instruction[]
  instructions: transferTokensIx,
}).sendAndConfirm(umi)

console.log({ res })
```

### 다른 자산에서 다른 자산으로 자산 소유권 전송

다음 예제에서는 다른 Core 자산이 소유한 Core 자산을 다른 자산으로 전송합니다.

```js
import {
  execute,
  fetchAsset,
  fetchCollection,
  findAssetSignerPda,
  transfer,
} from '@metaplex-foundation/mpl-core'
import { publickey } from '@metaplex-foundation/umi'

// 전송하고자 하는 자산.
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(assetId)

// 선택사항 - 자산이 컬렉션의 일부인 경우 컬렉션 객체를 가져옴
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// 전송하고자 하는 자산을 소유한 자산 ID.
const sourceAssetId = publickey('2222222222222222222222222222222222')
// 소스 자산 객체.
const sourceAsset = fetchAsset(umi, sourceAssetId)
// 자산 서명자가 계정에 1 SOL의 잔액을 가지고 있음.
const sourceAssetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// SOL을 전송하고자 하는 목적지 계정.
const destinationAssetId = publickey('33333333333333333333333333333333')
// 자산을 전송하고자 하는 목적지 자산 서명자.
const destinationAssetSignerPda = findAssetSignerPda(umi, {
  asset: destinationAssetId,
})

const transferAssetIx = transfer(umi, {
  // `fetchAsset()`를 통한 자산 객체.
  asset,
  // 선택사항 - `fetchCollection()`을 통한 컬렉션 객체
  collection,
  // 자산의 새 소유자.
  newOwner: destinationAssetSignerPda,
}).sendAndConfirm(umi)

const res = await execute(umi, {
  // 이 자산으로 명령어들을 실행
  asset,
  // 자산이 컬렉션의 일부인 경우 `fetchCollection()`을 통해 컬렉션 객체 전달
  collection,
  // 실행할 transactionBuilder/instruction[]
  instructions: transferAssetIx,
}).sendAndConfirm(umi)

console.log({ res })
```