---
title: MPL Core의 소울바운드 Asset
metaTitle: MPL Core의 소울바운드 Asset | Core 가이드
description: 이 가이드에서는 MPL Core에서 소울바운드 Asset의 다양한 옵션을 살펴봅니다
updated: '01-31-2026'
keywords:
  - soulbound NFT
  - non-transferable NFT
  - bound token
  - SBT
about:
  - Soulbound tokens
  - Non-transferable NFTs
  - Identity tokens
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Permanent Freeze Delegate 또는 Oracle Plugin 접근 방식 중 선택
  - 컬렉션 수준에 소울바운드 플러그인이 있는 Collection 생성
  - frozen 상태를 true로, authority를 None으로 설정하여 플러그인 추가
  - Collection에 Asset 민팅 - 소울바운드 동작 상속
howToTools:
  - Node.js
  - Umi 프레임워크
  - mpl-core SDK
---
소울바운드 NFT는 특정 지갑 주소에 영구적으로 묶여 있고 다른 소유자에게 전송할 수 없는 대체 불가능한 토큰입니다. 특정 신원에 연결되어야 하는 업적, 자격증 또는 멤버십을 나타내는 데 유용합니다. {% .lead %}
## 개요
이 가이드에서는 MPL Core와 Umi 프레임워크를 사용하여 소울바운드 에셋을 생성하는 방법을 살펴봅니다. TypeScript에서 소울바운드 NFT를 구현하려는 개발자이든 작동 방식을 이해하고 싶은 분이든, 기본 개념부터 실제 구현까지 모든 것을 다룹니다. 에셋을 소울바운드로 만드는 다양한 접근 방식을 살펴보고 컬렉션 내에서 첫 번째 소울바운드 NFT를 생성하는 방법을 안내합니다.
MPL Core에서 소울바운드 NFT를 생성하는 두 가지 주요 접근 방식이 있습니다:
### 1. Permanent Freeze Delegate Plugin
- 에셋을 완전히 전송 불가능하고 소각 불가능하게 만듭니다
- 다음 수준에서 적용할 수 있습니다:
  - 개별 에셋 수준
  - 컬렉션 수준 (더 렌트 효율적)
- 컬렉션 수준 구현은 단일 트랜잭션으로 모든 에셋 해동 가능
### 2. Oracle Plugin
- 에셋을 전송 불가능하게 만들지만 여전히 소각 가능합니다
- 다음 수준에서도 적용할 수 있습니다:
  - 개별 에셋 수준
  - 컬렉션 수준 (더 렌트 효율적)
- 컬렉션 수준 구현은 단일 트랜잭션으로 모든 에셋 해동 가능
## Permanent Freeze Delegate Plugin으로 소울바운드 NFT 생성
Permanent Freeze Delegate Plugin은 에셋을 동결하여 전송 불가능하게 만드는 기능을 제공합니다. 소울바운드 에셋을 생성할 때:
1. 에셋 생성 시 Permanent Freeze 플러그인 포함
2. 초기 상태를 frozen으로 설정
3. authority를 None으로 설정하여 frozen 상태를 영구적이고 변경 불가능하게 만듦
이렇게 하면 전송하거나 해동할 수 없는 영구적으로 소울바운드된 에셋이 효과적으로 생성됩니다. 다음 코드 스니펫에서 이 세 가지 옵션을 추가하는 위치를 보여줍니다:
```js
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        type: 'PermanentFreezeDelegate', // Permanent Freeze 플러그인 포함
        frozen: true, // 초기 상태를 frozen으로 설정
        authority: { type: "None" }, // authority를 None으로 설정
      },
    ],
  })
```
### Asset 수준 구현
Permanent Freeze Delegate Plugin은 개별 에셋에 첨부하여 소울바운드로 만들 수 있습니다. 이는 더 세분화된 제어를 제공하지만 더 많은 렌트가 필요하고 소울바운드가 아니어야 할 경우 에셋별로 별도의 해동 트랜잭션이 필요합니다.
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
// 전송 제한 테스트를 위한 더미 대상 지갑 정의
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
(async () => {
  // 1단계: devnet RPC 엔드포인트로 Umi 초기화
  const umi = createUmi(
    "https://api.devnet.solana.com"
  ).use(mplCore());
  // 2단계: 테스트 지갑 생성 및 자금 조달
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));
  console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));
  // 3단계: frozen 에셋을 담을 새 컬렉션 생성
  console.log("부모 컬렉션 생성 중...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);

  // 트랜잭션 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 컬렉션 생성 확인을 위해 가져오기
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("컬렉션이 성공적으로 생성됨:", collectionSigner.publicKey);
  // 4단계: 컬렉션 내에 frozen 에셋 생성
  console.log("frozen 에셋 생성 중...");
  const assetSigner = generateSigner(umi);

  // PermanentFreezeDelegate 플러그인을 사용하여 영구 동결된 에셋 생성
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // PermanentFreezeDelegate 플러그인은 에셋을 영구적으로 동결
        type: 'PermanentFreezeDelegate',
        frozen: true, // 에셋을 frozen으로 설정
        authority: { type: "None" }, // 어떤 authority도 해동 불가
      },
    ],
  }).sendAndConfirm(umi);

  // 트랜잭션 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 에셋 생성 확인을 위해 가져오기
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Frozen 에셋이 성공적으로 생성됨:", assetSigner.publicKey);
  // 5단계: 에셋이 정말로 frozen인지 시연
  console.log(
    "전송 시도로 frozen 속성 테스트 (실패해야 함)..."
  );

  // 에셋 전송 시도 (freeze로 인해 실패)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  // 실패한 전송 시도 서명 로그
  console.log(
    "전송 시도 서명:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();
```
{% /totem-accordion  %}
{% /totem %}
### Collection 수준 구현
모든 에셋이 소울바운드되어야 하는 컬렉션의 경우 컬렉션 수준에서 플러그인을 적용하는 것이 더 효율적입니다. 이는 더 적은 렌트가 필요하고 하나의 트랜잭션으로 전체 컬렉션을 해동할 수 있습니다.
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
// 전송 제한 테스트를 위한 더미 대상 지갑 정의
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
(async () => {
  // 1단계: devnet RPC 엔드포인트로 Umi 초기화
  const umi = createUmi(
    "https://api.devnet.solana.com"
  ).use(mplCore());
  // 2단계: 테스트 지갑 생성 및 자금 조달
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));
  console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 에어드롭 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 3단계: 새 frozen 컬렉션 생성
  console.log("frozen 컬렉션 생성 중...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Frozen Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // PermanentFreezeDelegate 플러그인은 컬렉션을 영구적으로 동결
        type: 'PermanentFreezeDelegate',
        frozen: true, // 컬렉션을 frozen으로 설정
        authority: { type: "None" }, // 어떤 authority도 해동 불가
      },
    ],
  }).sendAndConfirm(umi);
  // 컬렉션 생성 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 컬렉션 생성 확인을 위해 가져오기
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Frozen 컬렉션이 성공적으로 생성됨:", collectionSigner.publicKey);
  // 4단계: frozen 컬렉션 내에 에셋 생성
  console.log("frozen 컬렉션에 에셋 생성 중...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Frozen Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);
  // 에셋 생성 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 에셋 생성 확인을 위해 가져오기
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("frozen 컬렉션에 에셋이 성공적으로 생성됨:", assetSigner.publicKey);
  // 5단계: 에셋이 컬렉션에 의해 frozen되었는지 시연
  console.log(
    "전송 시도로 frozen 속성 테스트 (실패해야 함)..."
  );

  // 에셋 전송 시도 (컬렉션 freeze로 인해 실패)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  // 실패한 전송 시도 서명 로그
  console.log(
    "전송 시도 서명:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();
```
{% /totem-accordion  %}
{% /totem %}
## Oracle Plugin으로 소울바운드 NFT 생성
Oracle Plugin은 에셋에 대한 다양한 라이프사이클 이벤트를 승인하거나 거부하는 방법을 제공합니다. 소울바운드 NFT를 생성하기 위해 Metaplex가 배포한 특별한 Oracle을 사용할 수 있습니다. 이 Oracle은 소각과 같은 다른 작업은 허용하면서 전송 이벤트는 항상 거부합니다. 이는 에셋이 전송할 수 없지만 여전히 소각 가능하기 때문에 Permanent Freeze Delegate Plugin 접근 방식과 다릅니다.
Oracle Plugin을 사용하여 소울바운드 에셋을 생성할 때 플러그인을 에셋에 첨부합니다. 이는 생성 시 또는 이후에 수행할 수 있습니다. 이 예에서는 항상 거부하고 Metaplex에 의해 배포된 [기본 Oracle](/smart-contracts/core/external-plugins/oracle#default-oracles-deployed-by-metaplex)을 사용합니다.
이렇게 하면 전송할 수 없지만 소각 가능한 영구적으로 소울바운드된 에셋이 효과적으로 생성됩니다. 다음 코드 스니펫에서 방법을 보여줍니다:
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
      // Oracle 플러그인으로 전송 권한 제어 가능
      type: "Oracle",
      resultsOffset: {
        type: "Anchor",
      },
      baseAddress: ORACLE_ACCOUNT,
      lifecycleChecks: {
        // Oracle이 모든 전송 시도를 거부하도록 구성
        transfer: [CheckResult.CAN_REJECT],
      },
      baseAddressConfig: undefined,
    },
  ],
})
```
### Asset 수준 구현
Oracle Plugin은 개별 에셋을 전송 불가능하게 만들면서 소각 기능은 유지합니다. 이는 에셋을 파괴해야 할 수 있는 경우에 유연성을 제공합니다.
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
// 항상 전송을 거부하는 Metaplex가 배포한 Oracle
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);
// 전송 제한 테스트를 위한 더미 대상 지갑 정의
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
(async () => {
  // 1단계: devnet RPC 엔드포인트로 Umi 초기화
  const umi = createUmi(
    "https://api.devnet.solana.com"
  ).use(mplCore());
  // 2단계: 테스트 지갑 생성 및 자금 조달
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));
  console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));
  // 3단계: 소울바운드 에셋을 담을 새 컬렉션 생성
  console.log("부모 컬렉션 생성 중...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);

  // 트랜잭션 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 컬렉션 생성 확인을 위해 가져오기
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("컬렉션이 성공적으로 생성됨:", collectionSigner.publicKey);
  // 4단계: 컬렉션 내에 소울바운드 에셋 생성
  console.log("소울바운드 에셋 생성 중...");
  const assetSigner = generateSigner(umi);

  // Oracle 플러그인을 사용하여 전송 제한이 있는 에셋 생성
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Soulbound Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // Oracle 플러그인으로 전송 권한 제어 가능
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // Oracle이 모든 전송 시도를 거부하도록 구성
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);

  // 트랜잭션 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 에셋 생성 확인을 위해 가져오기
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("소울바운드 에셋이 성공적으로 생성됨:", assetSigner.publicKey);
  // 5단계: 에셋이 정말로 소울바운드인지 시연
  console.log(
    "전송 시도로 소울바운드 속성 테스트 (실패해야 함)..."
  );

  // 에셋 전송 시도 (Oracle 제한으로 인해 실패)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  // 실패한 전송 시도 서명 로그
  console.log(
    "전송 시도 서명:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();
```
{% /totem-accordion  %}
{% /totem %}
### Collection 수준 구현
컬렉션 수준에서 Oracle Plugin을 적용하면 컬렉션의 모든 에셋을 전송 불가능하지만 소각 가능하게 만듭니다. 이는 더 렌트 효율적이며 전체 컬렉션의 권한을 한 번에 관리할 수 있습니다.
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
// 항상 전송을 거부하는 Metaplex가 배포한 Oracle
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);
// 전송 제한 테스트를 위한 더미 대상 지갑 정의
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
(async () => {
  // 1단계: devnet RPC 엔드포인트로 Umi 초기화
  const umi = createUmi(
    "https://api.devnet.solana.com"
  ).use(mplCore());
  // 2단계: 테스트 지갑 생성 및 자금 조달
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));
  console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 에어드롭 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 3단계: 전송 제한이 있는 새 컬렉션 생성
  console.log("소울바운드 컬렉션 생성 중...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Soulbound Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // Oracle 플러그인으로 전송 권한 제어 가능
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // Oracle이 모든 전송 시도를 거부하도록 구성
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);
  // 컬렉션 생성 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 컬렉션 생성 확인을 위해 가져오기
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("소울바운드 컬렉션이 성공적으로 생성됨:", collectionSigner.publicKey);
  // 4단계: 컬렉션 내에 소울바운드 에셋 생성
  console.log("소울바운드 에셋 생성 중...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Soulbound Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);
  // 에셋 생성 확인 대기
  await new Promise(resolve => setTimeout(resolve, 15000));
  // 에셋 생성 확인을 위해 가져오기
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("소울바운드 에셋이 성공적으로 생성됨:", assetSigner.publicKey);
  // 5단계: 에셋이 정말로 소울바운드인지 시연
  console.log(
    "전송 시도로 소울바운드 속성 테스트 (실패해야 함)..."
  );

  // 에셋 전송 시도 (Oracle 제한으로 인해 실패)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  // 실패한 전송 시도 서명 로그
  console.log(
    "전송 시도 서명:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();
```
{% /totem-accordion  %}
{% /totem %}
