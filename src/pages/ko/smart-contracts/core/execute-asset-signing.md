---
title: Execute 및 Asset 서명
metaTitle: Execute 및 Asset 서명 | Core
description: MPL Core Asset이 Execute 명령을 사용하여 명령과 트랜잭션에 서명하는 방법을 알아봅니다.
updated: '01-31-2026'
keywords:
  - asset signer
  - execute instruction
  - NFT as signer
  - asset PDA
about:
  - Asset signing
  - Execute instruction
  - Advanced operations
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - JavaScript
---
MPL Core Execute 명령은 MPL Core Asset에 **Asset Signer** 개념을 도입합니다.
이러한 **Asset Signer**는 Asset 자체를 대신하여 서명자 역할을 수행하며, MPL Core Asset이 다음을 수행할 수 있게 합니다:

- Solana 및 SPL 토큰을 전송
- 다른 계정의 authority가 되기
- 트랜잭션/명령/CPI 서명이 필요한 `assetSignerPda`에 할당된 기타 작업 및 검증 수행
MPL Core Asset은 블록체인에 트랜잭션/CPI를 서명하고 제출할 수 있습니다. 이는 Core Asset에 `assetSigner` 형태의 자체 지갑을 효과적으로 제공합니다.

## Asset Signer PDA

Asset은 이제 `assetSignerPda` 계정/주소에 액세스할 수 있으며, 이를 통해 MPL Core 프로그램의 `execute` 명령이 전송된 추가 명령을 통과시켜 `assetSignerPda`로 CPI 명령에 서명할 수 있습니다.
이를 통해 `assetSignerPda` 계정은 현재 자산 소유자를 대신하여 계정 명령을 효과적으로 소유하고 실행할 수 있습니다.
`assetSignerPda`를 Core Asset에 연결된 지갑으로 생각할 수 있습니다.

### findAssetSignerPda()

```ts
const assetId = publickey('11111111111111111111111111111111')
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
```

## Execute 명령

### 개요

`execute` 명령을 통해 사용자는 Core Asset과 함께 체인상의 MPL Core 프로그램의 `execute` 명령에 도달할 때 AssetSigner가 서명할 통과 명령을 전달할 수 있습니다.
`execute` 명령과 인수에 대한 개요입니다.

```ts
const executeIx = await execute(umi, {
    {
        // 트랜잭션에 서명하는 `fetchAsset()`을 통한 asset
        asset: AssetV1,
        // `fetchCollection()`을 통한 collection
        collection?: CollectionV1,
        // TransactionBuilder | Instruction[] 중 하나
        instructions: ExecuteInput,
        // 트랜잭션/명령에 필요한 추가 서명자
        signers?: Signer[]
    }
})
```

### 검증

{% callout title="assetSignerPda 검증" %}
MPL Core Execute 명령은 **현재 Asset 소유자**도 트랜잭션에 서명했는지 검증합니다. 이는 현재 Asset 소유자만 `execute` 명령으로 `assetSignerPda`를 사용하여 트랜잭션을 실행할 수 있도록 보장합니다.
{% /callout %}

### Execute 작업 제어

execute 기능은 [Freeze Execute 플러그인](/smart-contracts/core/plugins/freeze-execute)을 사용하여 제어할 수 있습니다. 이 플러그인을 사용하면 자산의 execute 작업을 동결하여 동결이 해제될 때까지 execute 명령이 처리되지 않도록 할 수 있습니다.
Freeze Execute 플러그인은 특히 다음에 유용합니다:

- **담보 NFT**: 필요할 때 기초 자산의 인출 방지
- **에스크로 없는 프로토콜**: 프로토콜 작업 중 execute 기능을 일시적으로 잠금
- **보안 조치**: 복잡한 작업을 실행할 수 있는 자산에 추가 보호 계층 추가
Freeze Execute 플러그인이 활성화되어 `frozen: true`로 설정되면 플러그인이 `frozen: false`로 업데이트될 때까지 execute 명령 사용 시도가 차단됩니다.

## 예제

### Asset Signer에서 SOL 전송

다음 예제에서는 `assetSignerPda`로 전송된 SOL을 원하는 대상으로 전송합니다.

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
// 선택 사항 - Asset이 컬렉션의 일부인 경우 컬렉션 객체를 가져옴
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
// Asset signer 계정에 1 SOL 잔액이 있음
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// SOL을 전송하려는 대상 계정
const destination = publickey('2222222222222222222222222222222222')
// 표준 `transferSol()` transactionBuilder
const transferSolIx = transferSol(umi, {
  // assetSigner가 나중에 CPI 중에 서명하므로 noopSigner 생성
  source: createNoopSigner(publicKey(assetSigner)),
  // 대상 주소
  destination,
  // 전송하려는 금액
  amount: sol(0.5),
})
// `execute` 명령을 호출하고 체인에 전송
const res = await execute(umi, {
  // 이 asset으로 명령 실행
  asset,
  // Asset이 컬렉션의 일부인 경우 `fetchCollection()`을 통해 컬렉션 객체 전달
  collection,
  // 실행할 transactionBuilder/instruction[]
  instructions: transferSolIx,
}).sendAndConfirm(umi)
console.log({ res })
```

### Asset Signer에서 SPL 토큰 전송

다음 예제에서는 `assetSignerPda` 계정의 SPL 토큰 잔액 일부를 대상으로 전송합니다.
이 예제는 기본 지갑 주소에 대한 파생 토큰 계정에 관한 모범 사례를 기반으로 합니다. 토큰이 `assetSignerPda` 주소를 기반으로 올바르게 파생된 토큰 계정에 없으면 이 예제를 조정해야 합니다.

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
// 선택 사항 - Asset이 컬렉션의 일부인 경우 컬렉션 객체를 가져옴
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
const splTokenMint = publickey('2222222222222222222222222222222222')
// Asset signer에 토큰 잔액이 있음
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// SOL을 전송하려는 대상 지갑
const destinationWallet = publickey('3333333333333333333333333333333')
// 표준 `transferTokens()` transactionBuilder
const transferTokensIx = transferTokens(umi, {
  // Source는 `assetSignerPda` 파생 토큰 계정
  source: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: assetSignerPda,
  }),
  // Destination은 `destinationWallet` 파생 토큰 계정
  destination: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: destinationWallet,
  }),
  // lamport 단위로 전송할 금액
  amount: 5000,
})
// `execute` 명령을 호출하고 체인에 전송
const res = await execute(umi, {
  // 이 asset으로 명령 실행
  asset,
  // Asset이 컬렉션의 일부인 경우 `fetchCollection()`을 통해 컬렉션 객체 전달
  collection,
  // 실행할 transactionBuilder/instruction[]
  instructions: transferTokensIx,
}).sendAndConfirm(umi)
console.log({ res })
```

### Asset 소유권을 다른 Asset으로 전송

다음 예제에서는 다른 Core Asset이 소유한 Core Asset을 또 다른 Asset으로 전송합니다.

```js
import {
  execute,
  fetchAsset,
  fetchCollection,
  findAssetSignerPda,
  transfer,
} from '@metaplex-foundation/mpl-core'
import { publickey } from '@metaplex-foundation/umi'
// 전송하려는 Asset
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(assetId)
// 선택 사항 - Asset이 컬렉션의 일부인 경우 컬렉션 객체를 가져옴
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
// 전송하려는 Asset을 소유하는 Asset ID
const sourceAssetId = publickey('2222222222222222222222222222222222')
// 소스 Asset 객체
const sourceAsset = fetchAsset(umi, sourceAssetId)
// Asset signer 계정에 1 SOL 잔액이 있음
const sourceAssetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// SOL을 전송하려는 대상 계정
const destinationAssetId = publickey('33333333333333333333333333333333')
// Asset을 전송하려는 대상 Asset signer
const destinationAssetSignerPda = findAssetSignerPda(umi, {
  asset: destinationAssetId,
})
const transferAssetIx = transfer(umi, {
  // `fetchAsset()`을 통한 Asset 객체
  asset,
  // 선택 사항 - `fetchCollection()`을 통한 Collection 객체
  collection,
  // Asset의 새 소유자
  newOwner: destinationAssetSignerPda,
}).sendAndConfirm(umi)
const res = await execute(umi, {
  // 이 asset으로 명령 실행
  asset,
  // Asset이 컬렉션의 일부인 경우 `fetchCollection()`을 통해 컬렉션 객체 전달
  collection,
  // 실행할 transactionBuilder/instruction[]
  instructions: transferAssetIx,
}).sendAndConfirm(umi)
console.log({ res })
```
