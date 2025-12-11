---
title: MPL Core의 소울바운드 자산
metaTitle: MPL Core의 소울바운드 자산 | Core 가이드
description: 이 가이드는 MPL Core에서 소울바운드 자산을 위한 다양한 옵션들을 탐구합니다
---


소울바운드 NFT는 특정 지갑 주소에 영구적으로 바인딩되어 다른 소유자에게 전송될 수 없는 대체 불가능한 토큰입니다. 특정 신원에 연결되어야 하는 업적, 자격증명 또는 멤버십을 나타내는 데 유용합니다.  {% .lead %}

## 개요

이 가이드에서는 MPL Core와 Umi 프레임워크를 사용하여 소울바운드 자산을 생성하는 방법을 탐구합니다. TypeScript로 소울바운드 NFT를 구현하려는 개발자이거나 단순히 작동 방식을 이해하고 싶다면, 기본 개념부터 실제 구현까지 모든 것을 다룰 것입니다. 자산을 소울바운드로 만드는 다양한 접근 방식을 살펴보고 컬렉션 내에서 첫 번째 소울바운드 NFT를 생성하는 과정을 안내합니다.

Solana 및 Eclipse 블록체인에서 Metaplex Aura 네트워크에 액세스하려면 [여기](https://aura-app.metaplex.com/)에서 Aura 앱을 방문하여 엔드포인트와 API 키를 얻을 수 있습니다.

MPL Core에서는 소울바운드 NFT를 생성하는 두 가지 주요 접근 방식이 있습니다:

### 1. Permanent Freeze Delegate 플러그인
- 자산을 완전히 전송 및 소각 불가능하게 만듭니다
- 다음 중 하나에 적용할 수 있습니다:
  - 개별 자산 레벨
  - 컬렉션 레벨 (더 효율적인 임대료)
- 컬렉션 레벨 구현은 단일 트랜잭션으로 모든 자산의 동결을 해제할 수 있습니다

### 2. Oracle 플러그인
- 자산을 전송 불가능하게 만들지만 여전히 소각 가능합니다
- 다음에도 적용할 수 있습니다:
  - 개별 자산 레벨
  - 컬렉션 레벨 (더 효율적인 임대료)
- 컬렉션 레벨 구현은 단일 트랜잭션으로 모든 자산의 동결을 해제할 수 있습니다

## Permanent Freeze Delegate 플러그인으로 소울바운드 NFT 생성하기

Permanent Freeze Delegate 플러그인은 자산을 동결시켜 전송 불가능하게 만드는 기능을 제공합니다. 소울바운드 자산을 생성할 때 다음을 수행합니다:

1. 자산 생성 중에 Permanent Freeze 플러그인 포함
2. 초기 상태를 동결로 설정
3. 권한을 None으로 설정하여 동결 상태를 영구적이고 불변으로 만듭니다

이것은 전송되거나 해동될 수 없는 영구적으로 소울바운드된 자산을 효과적으로 생성합니다. 다음 코드 스니펫에서 이 세 가지 옵션을 추가하는 위치를 보여줍니다:

```js
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        type: 'PermanentFreezeDelegate', // Permanent Freeze 플러그인 포함
        frozen: true, // 초기 상태를 동결로 설정
        authority: { type: "None" }, // 권한을 None으로 설정
      },
    ],
  })
```


### 자산 레벨 구현
Permanent Freeze Delegate 플러그인은 개별 자산에 연결되어 소울바운드로 만들 수 있습니다. 이는 더 세분화된 제어를 제공하지만 더 많은 임대료와 더 이상 소울바운드가 아니어야 하는 경우 자산당 별도의 해동 트랜잭션이 필요합니다.

{% totem %}
{% totem-accordion title="코드 예제" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// 전송 제한을 테스트하기 위한 더미 대상 지갑 정의
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // 1단계: devnet RPC 엔드포인트로 Umi 초기화
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // 2단계: 테스트 지갑 생성 및 자금 조달
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 3단계: 동결된 자산을 보관할 새 컬렉션 생성
  console.log("부모 컬렉션 생성 중...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);

  // 트랜잭션 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 컬렉션이 생성되었는지 가져와서 확인
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("컬렉션이 성공적으로 생성됨:", collectionSigner.publicKey);

  // 4단계: 컬렉션 내에 동결된 자산 생성
  console.log("동결된 자산 생성 중...");
  const assetSigner = generateSigner(umi);

  // PermanentFreezeDelegate 플러그인을 사용하여 영구 동결로 자산 생성
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // PermanentFreezeDelegate 플러그인은 자산을 영구적으로 동결시킵니다
        type: 'PermanentFreezeDelegate',
        frozen: true, // 자산을 동결로 설정
        authority: { type: "None" }, // 권한이 없으면 동결을 해제할 수 없습니다
      },
    ],
  }).sendAndConfirm(umi);

  // 트랜잭션 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 자산이 생성되었는지 가져와서 확인
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("동결된 자산이 성공적으로 생성됨:", assetSigner.publicKey);

  // 5단계: 자산이 실제로 동결되었음을 입증
  console.log(
    "전송을 시도하여 동결 속성 테스트 중 (실패해야 함)..."
  );

  // 자산 전송 시도 (동결로 인해 실패함)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // 실패한 전송 시도 서명 기록
  console.log(
    "전송 시도 서명:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accordion  %}
{% /totem %}

### 컬렉션 레벨 구현
모든 자산이 소울바운드되어야 하는 컬렉션의 경우, 컬렉션 레벨에서 플러그인을 적용하는 것이 더 효율적입니다. 이는 더 적은 임대료가 필요하고 한 번의 트랜잭션으로 전체 컬렉션의 동결을 해제할 수 있습니다.

{% totem %}
{% totem-accordion title="코드 예제" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// 전송 제한을 테스트하기 위한 더미 대상 지갑 정의
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // 1단계: devnet RPC 엔드포인트로 Umi 초기화
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // 2단계: 테스트 지갑 생성 및 자금 조달
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 에어드롭 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 3단계: 새로운 동결된 컬렉션 생성
  console.log("동결된 컬렉션 생성 중...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Frozen Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // PermanentFreezeDelegate 플러그인은 컬렉션을 영구적으로 동결시킵니다
        type: 'PermanentFreezeDelegate',
        frozen: true, // 컬렉션을 동결로 설정
        authority: { type: "None" }, // 권한이 없으면 동결을 해제할 수 없습니다
      },
    ],
  }).sendAndConfirm(umi);

  // 컬렉션 생성 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 컬렉션이 생성되었는지 가져와서 확인
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("동결된 컬렉션이 성공적으로 생성됨:", collectionSigner.publicKey);

  // 4단계: 동결된 컬렉션 내에 자산 생성
  console.log("동결된 컬렉션에 자산 생성 중...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Frozen Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);

  // 자산 생성 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 자산이 생성되었는지 가져와서 확인
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("동결된 컬렉션에 자산이 성공적으로 생성됨:", assetSigner.publicKey);

  // 5단계: 자산이 컬렉션에 의해 동결되었음을 입증
  console.log(
    "전송을 시도하여 동결 속성 테스트 중 (실패해야 함)..."
  );

  // 자산 전송 시도 (컬렉션 동결로 인해 실패함)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // 실패한 전송 시도 서명 기록
  console.log(
    "전송 시도 서명:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accordion  %}
{% /totem %}

## Oracle 플러그인으로 소울바운드 NFT 생성하기

Oracle 플러그인은 자산의 다양한 라이프사이클 이벤트를 승인하거나 거부하는 방법을 제공합니다. 소울바운드 NFT를 생성하기 위해, 소각과 같은 다른 작업은 여전히 허용하면서 전송 이벤트를 항상 거부하는 Metaplex에서 배포한 특별한 Oracle을 사용할 수 있습니다. 이는 자산이 전송될 수 없더라도 여전히 소각 가능하므로 Permanent Freeze Delegate 플러그인 접근 방식과 다릅니다.

Oracle 플러그인을 사용하여 소울바운드 자산을 생성할 때, 플러그인을 자산에 연결합니다. 이는 생성 시 또는 이후에 수행할 수 있습니다. 이 예제에서는 항상 거부하고 Metaplex에서 배포한 [기본 Oracle](/core/external-plugins/oracle#default-oracles-deployed-by-metaplex)을 사용합니다.

이것은 전송될 수 없지만 소각될 수 있는 영구적으로 소울바운드된 자산을 효과적으로 생성합니다. 다음 코드 스니펫에서 방법을 보여줍니다:

```js
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: "My Soulbound Asset",
  uri: "https://example.com/my-asset.json",
  plugins: [
    {
      // Oracle 플러그인은 전송 권한을 제어할 수 있게 해줍니다
      type: "Oracle",
      resultsOffset: {
        type: "Anchor",
      },
      baseAddress: ORACLE_ACCOUNT,
      lifecycleChecks: {
        // 모든 전송 시도를 거부하도록 Oracle 구성
        transfer: [CheckResult.CAN_REJECT],
      },
      baseAddressConfig: undefined,
    },
  ],
})
```

### 자산 레벨 구현
Oracle 플러그인은 개별 자산을 소각 능력을 보존하면서 전송 불가능하게 만들 수 있습니다. 이는 자산이 파괴되어야 할 수 있는 경우에 유연성을 제공합니다.

{% totem %}
{% totem-accordion title="코드 예제" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  CheckResult,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// 전송 권한을 제어할 Oracle 계정 정의
// 이것은 항상 전송을 거부하는 Metaplex에서 배포한 Oracle입니다
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

// 전송 제한을 테스트하기 위한 더미 대상 지갑 정의
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // 1단계: devnet RPC 엔드포인트로 Umi 초기화
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // 2단계: 테스트 지갑 생성 및 자금 조달
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 3단계: 소울바운드 자산을 보관할 새 컬렉션 생성
  console.log("부모 컬렉션 생성 중...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);

  // 트랜잭션 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 컬렉션이 생성되었는지 가져와서 확인
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("컬렉션이 성공적으로 생성됨:", collectionSigner.publicKey);

  // 4단계: 컬렉션 내에 소울바운드 자산 생성
  console.log("소울바운드 자산 생성 중...");
  const assetSigner = generateSigner(umi);

  // Oracle 플러그인을 사용하여 전송 제한으로 자산 생성
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Soulbound Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // Oracle 플러그인은 전송 권한을 제어할 수 있게 해줍니다
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // 모든 전송 시도를 거부하도록 Oracle 구성
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);

  // 트랜잭션 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 자산이 생성되었는지 가져와서 확인
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("소울바운드 자산이 성공적으로 생성됨:", assetSigner.publicKey);

  // 5단계: 자산이 실제로 소울바운드되었음을 입증
  console.log(
    "전송을 시도하여 소울바운드 속성 테스트 중 (실패해야 함)..."
  );

  // 자산 전송 시도 (Oracle 제한으로 인해 실패함)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // 실패한 전송 시도 서명 기록
  console.log(
    "전송 시도 서명:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accordion  %}
{% /totem %}

### 컬렉션 레벨 구현
컬렉션 레벨에서 Oracle 플러그인을 적용하면 컬렉션의 모든 자산이 전송 불가능하지만 소각 가능하게 됩니다. 이는 더 효율적인 임대료이며 전체 컬렉션의 권한을 한 번에 관리할 수 있습니다.

{% totem %}
{% totem-accordion title="코드 예제" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  CheckResult,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// 전송 권한을 제어할 Oracle 계정 정의
// 이것은 항상 전송을 거부하는 Metaplex에서 배포한 Oracle입니다
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

// 전송 제한을 테스트하기 위한 더미 대상 지갑 정의
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // 1단계: devnet RPC 엔드포인트로 Umi 초기화
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // 2단계: 테스트 지갑 생성 및 자금 조달
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 에어드롭 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 3단계: 전송 제한이 있는 새로운 컬렉션 생성
  console.log("소울바운드 컬렉션 생성 중...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Soulbound Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // Oracle 플러그인은 전송 권한을 제어할 수 있게 해줍니다
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // 모든 전송 시도를 거부하도록 Oracle 구성
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);

  // 컬렉션 생성 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 컬렉션이 생성되었는지 가져와서 확인
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("소울바운드 컬렉션이 성공적으로 생성됨:", collectionSigner.publicKey);

  // 4단계: 컬렉션 내에 소울바운드 자산 생성
  console.log("소울바운드 자산 생성 중...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Soulbound Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);

  // 자산 생성 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 자산이 생성되었는지 가져와서 확인
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("소울바운드 자산이 성공적으로 생성됨:", assetSigner.publicKey);

  // 5단계: 자산이 실제로 소울바운드되었음을 입증
  console.log(
    "전송을 시도하여 소울바운드 속성 테스트 중 (실패해야 함)..."
  );

  // 자산 전송 시도 (Oracle 제한으로 인해 실패함)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // 실패한 전송 시도 서명 기록
  console.log(
    "전송 시도 서명:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accordion  %}
{% /totem %}