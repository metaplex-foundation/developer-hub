---
title: 첫 번째 하이브리드 컬렉션 만들기
metaTitle: 첫 번째 하이브리드 컬렉션 만들기 | Hybrid 가이드
description: 하이브리드 컬렉션을 처음부터 끝까지 완전히 만드는 방법을 학습하세요!
# remember to update dates also in /components/guides/index.js
created: '09-17-2024'
updated: '09-17-2024'
---

이 가이드는 **하이브리드 컬렉션**을 처음부터 끝까지 완전히 만드는 방법을 보여줍니다. 필요한 모든 자산을 만드는 방법부터 에스크로를 만들고 대체 가능한 토큰에서 대체 불가능한 토큰으로 그리고 그 반대로 스왑하기 위한 모든 매개변수를 설정하는 방법까지!

{% callout title="MPL-Hybrid란 무엇인가요?" %}

MPL-Hybrid는 디지털 자산, 웹3 게임, 온체인 커뮤니티를 위한 새로운 모델입니다. 이 모델의 핵심은 고정된 수의 대체 가능한 자산을 대체 불가능한 자산과 교환하고 그 반대도 가능한 스왁 프로그램입니다.

{% /callout %}

## 전제 조건

- 선택한 코드 에디터 (권장: **Visual Studio Code**)
- Node **18.x.x** 이상.

## 초기 설정

이 가이드는 JavaScript를 사용하여 하이브리드 컬렉션을 만드는 방법을 가르칩니다! 필요에 따라 함수를 수정하고 이동해야 할 수도 있습니다.

### 프로젝트 초기화

선택한 패키지 매니저(npm, yarn, pnpm, bun)로 새 프로젝트를 초기화하고(선택사항) 요구되는 세부사항을 입력합니다.

```js
npm init
```

### 필수 패키지

이 가이드에 필요한 패키지들을 설치합니다.

{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/mpl-hybrid", "tokenMetadata" ] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-core
```

```js
npm i @metaplex-foundation/mpl-hybrid
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

## 준비

대체 가능한 토큰을 대체 불가능한 토큰(NFT)으로 그리고 그 반대로 스왑을 가능하게 하는 MPL-Hybrid 프로그램의 에스크로를 설정하기 전에, Core NFT 컬렉션과 대체 가능한 토큰이 모두 이미 민팅되어 있어야 합니다.

이러한 전제 조건 중 하나라도 누락되어 있다면 걱정하지 마세요! 각 단계를 거치는 데 필요한 모든 리소스를 제공해드립니다.

**참고**: 작동하려면 에스크로에 NFT, 대체 가능한 토큰, 또는 둘의 조합으로 자금을 조달해야 합니다. 에스크로의 균형을 유지하는 가장 간단한 방법은 한 유형의 자산으로 완전히 채우면서 다른 유형을 배포하는 것입니다!

### NFT 컬렉션 만들기

MPL-Hybrid 프로그램에서 메타데이터 무작위화 기능을 활용하려면, 오프체인 메타데이터 URI가 일관되고 증분적인 구조를 따라야 합니다. 이를 위해 Turbo SDK와 함께 Arweave의 [path manifest](https://cookbook.arweave.dev/concepts/manifests.html) 기능을 사용합니다.

Manifest는 여러 트랜잭션을 단일 기본 트랜잭션 ID 하에 연결하고 사람이 읽을 수 있는 파일 이름을 할당할 수 있게 해줍니다:
- https://arweave.net/manifestID/0.json
- https://arweave.net/manifestID/1.json
- ...
- https://arweave.net/manifestID/9999.json

결정론적 URI 생성에 익숙하지 않다면, 자세한 안내를 위해 [이 가이드](/ko/guides/general/create-deterministic-metadata-with-turbo)를 따를 수 있습니다. 또한 Hybrid 프로그램이 작동하는 데 필요한 [컬렉션](/ko/smart-contracts/core/guides/javascript/how-to-create-a-core-collection-with-javascript)과 [자산](/ko/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript) 생성에 대한 지침도 찾을 수 있습니다.

**참고**: 현재 MPL-Hybrid 프로그램은 제공된 최소 및 최대 URI 인덱스 사이에서 무작위로 숫자를 선택하며 URI가 이미 사용되었는지 확인하지 않습니다. 따라서 스왑은 [생일 역설](https://betterexplained.com/articles/understanding-the-birthday-paradox/)의 영향을 받습니다. 프로젝트가 충분한 스왑 무작위화의 혜택을 받으려면, 무작위로 선택할 수 있는 최소 25만 개의 자산 메타데이터를 준비하고 업로드하는 것을 권장합니다. 사용 가능한 잠재적 자산이 많을수록 좋습니다!

### 대체 가능한 토큰 만들기

MPL-Hybrid 에스크로는 NFT의 해제를 상환하거나 지불하는 데 사용할 수 있는 관련 대체 가능한 토큰이 필요합니다. 이는 이미 민팅되어 유통되고 있는 기존 토큰이거나 완전히 새로운 토큰일 수 있습니다!

토큰 생성에 익숙하지 않다면, Solana에서 자신만의 대체 가능한 토큰을 민팅하는 방법을 학습하기 위해 [이 가이드](/ko/guides/javascript/how-to-create-a-solana-token)를 따를 수 있습니다.

## 에스크로 만들기

**NFT 컬렉션과 토큰을 모두 만든 후, 드디어 에스크로를 만들고 스왑을 시작할 준비가 되었습니다!**

하지만 MPL-Hybrid에 대한 관련 정보로 뛰어들기 전에, 가이드 동안 여러 번 설정할 예정이므로 Umi 인스턴스를 설정하는 방법을 배우는 것이 좋습니다.

### Umi 설정

Umi를 설정하는 동안 다양한 소스에서 키페어/지갑을 사용하거나 생성할 수 있습니다. 테스트용 새 지갑을 만들거나, 파일 시스템에서 기존 지갑을 가져오거나, 웹사이트/dApp을 만드는 경우 `walletAdapter`를 사용할 수 있습니다.

**참고**: 이 예제에서는 `generatedSigner()`로 Umi를 설정하지만 아래에서 모든 가능한 설정을 찾을 수 있습니다!

{% totem %}

{% totem-accordion title="새 지갑으로" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// 이것은 테스트용으로 devnet에서만 SOL을 에어드롭합니다.
console.log('Airdropping 1 SOL to identity')
umi.rpc.airdrop(umi.identity.publicKey, sol(1));
```

{% /totem-accordion %}

{% totem-accordion title="기존 지갑으로" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')

// fs를 사용하고 파일 시스템을 탐색하여
// 상대 경로를 통해 사용하려는 지갑을 로드해야 합니다.
const walletFile = fs.readFileSync('./keypair.json')


// walletFile을 키페어로 변환합니다.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// 키페어를 umi에 로드합니다.
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}

{% totem-accordion title="Wallet Adapter로" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
// Wallet Adapter를 Umi에 등록
.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**참고**: `walletAdapter` 섹션은 이미 `walletAdapter`를 설치하고 설정했다고 가정하고 Umi에 연결하는 데 필요한 코드만 제공합니다. 포괄적인 가이드는 [이것](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)을 참조하세요

### 매개변수 설정

Umi 인스턴스를 설정한 후, 다음 단계는 MPL-Hybrid 에스크로에 필요한 매개변수를 구성하는 것입니다.

먼저 에스크로 계약의 일반 설정을 정의하겠습니다:

```javascript
// 에스크로 설정 - 필요에 따라 변경하세요
const name = "MPL-404 Hybrid Escrow";
const uri = "https://arweave.net/manifestId";
const max = 15;
const min = 0;
const path = 0;
```

| 매개변수       | 설명                                                                 |
| ------------- | -------------------------------------------------------------------- |
| **Name**      | 에스크로 계약의 이름 (예: "MPL-404 Hybrid Escrow").                     |
| **URI**       | NFT 컬렉션의 기본 URI. 이는 결정론적 메타데이터 구조를 따라야 합니다.        |
| **Max & Min** | 컬렉션 메타데이터의 결정론적 URI 범위를 정의합니다.                        |
| **Path**      | 두 경로 중 선택: 스왑 시 NFT 메타데이터를 업데이트하려면 `0`, 스왑 후 메타데이터를 변경하지 않으려면 `1`. |

다음으로, 에스크로에 필요한 주요 계정들을 구성합니다:

```javascript
// 에스크로 계정 - 필요에 따라 변경하세요
const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');
const token = publicKey('<YOUR-TOKEN-ADDRESS>');
const feeLocation = publicKey('<YOUR-FEE-ADDRESS>');
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
]);
```

| 계정              | 설명                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| **Collection**    | 스왑할 컬렉션. NFT 컬렉션의 주소입니다.                                  |
| **Token**         | 스왑할 토큰. 대체 가능한 토큰의 주소입니다.                              |
| **Fee Location**  | 스왑에서 수수료가 전송될 주소입니다.                                    |
| **Escrow**        | 스왑 프로세스 동안 NFT와 토큰을 보유하는 파생된 에스크로 계정입니다.        |

마지막으로, 토큰 관련 매개변수를 정의하고 소수점을 위해 토큰 양을 조정하는 도우미 함수 `addZeros()`를 만듭니다:

```javascript
// 토큰 스왑 설정 - 필요에 따라 변경하세요
const tokenDecimals = 6;
const amount = addZeros(100, tokenDecimals);
const feeAmount = addZeros(1, tokenDecimals);
const solFeeAmount = addZeros(0, 9);

// 숫자에 0을 추가하는 함수, 올바른 소수점 자릿수를 추가하는 데 필요
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
```

| 매개변수           | 설명                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| **Amount**         | 스왑 동안 사용자가 받을 토큰의 양, 소수점으로 조정됨.                     |
| **Fee Amount**     | NFT로 스왑할 때 사용자가 지불할 토큰 수수료의 양.                        |
| **Sol Fee Amount** | NFT로 스왑할 때 청구될 추가 수수료(SOL 단위), Solana의 9 소수점으로 조정됨. |

### 에스크로 초기화

이제 설정한 모든 매개변수와 변수를 전달하여 `initEscrowV1()` 메서드를 사용해 에스크로를 초기화할 수 있습니다. 이것은 당신만의 MPL-Hybrid 에스크로를 만들 것입니다.

```javascript
const initEscrowTx = await initEscrowV1(umi, {
  name,
  uri,
  max,
  min,
  path,
  escrow,
  collection,
  token,
  feeLocation,
  amount,
  feeAmount,
  solFeeAmount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(initEscrowTx.signature)[0]
console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

**참고**: 앞서 말했듯이, 단순히 에스크로를 만드는 것만으로는 스왑을 위해 "준비"되지 않습니다. 에스크로에 NFT나 토큰(또는 둘 다)으로 채워야 합니다. **방법은 다음과 같습니다**:

{% totem %}

{% totem-accordion title="에스크로에 자산 보내기" %}

```javascript
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import {
  MPL_HYBRID_PROGRAM_ID,
  mplHybrid,
} from "@metaplex-foundation/mpl-hybrid";
import { readFileSync } from "fs";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";
import { transfer } from "@metaplex-foundation/mpl-core";

(async () => {
  const collection = publicKey("<COLLECTION>"); // 스왑할 컬렉션
  const asset = publicKey("<NFT MINT>"); // 보내려는 NFT의 민트 주소

  const umi = createUmi("<ENDPOINT>").use(mplHybrid()).use(mplTokenMetadata());

  const wallet = "<path to wallet>"; // 파일 시스템 지갑 경로
  const secretKey = JSON.parse(readFileSync(wallet, "utf-8"));

  // 개인 키에서 키페어 생성
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );
  umi.use(keypairIdentity(keypair));

  // 에스크로 파생
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ])[0];

  // 자산을 에스크로로 전송
  const transferAssetTx = await transfer(umi, {
    asset,
    collection,
    newOwner: escrow,
  }).sendAndConfirm(umi);
})();

```

{% /totem-accordion %}

{% totem-accordion title="에스크로에 대체 가능한 토큰 보내기" %}

```javascript
import {
  keypairIdentity,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  transferTokens,
} from "@metaplex-foundation/mpl-toolbox";
import {
  MPL_HYBRID_PROGRAM_ID,
  mplHybrid,
} from "@metaplex-foundation/mpl-hybrid";
import { readFileSync } from "fs";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";

(async () => {
  const collection = publicKey("<COLLECTION>"); // 스왑할 컬렉션
  const token = publicKey("<TOKEN MINT>"); // 스왑할 토큰

  const umi = createUmi("<ENDPOINT>").use(mplHybrid()).use(mplTokenMetadata());

  const wallet = "<path to wallet>"; // 파일 시스템 지갑 경로
  const secretKey = JSON.parse(readFileSync(wallet, "utf-8"));

  // 개인 키에서 키페어 생성
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );
  umi.use(keypairIdentity(keypair));

  // 에스크로 파생
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ])[0];

  // 대체 가능한 토큰을 에스크로로 전송 (필요한 경우 ATA 생성 후)
  const transferTokenTx = await transactionBuilder()
    .add(
      createTokenIfMissing(umi, {
        mint: token,
        owner: escrow,
      })
    )
    .add(
      transferTokens(umi, {
        source: findAssociatedTokenPda(umi, {
          mint: token,
          owner: umi.identity.publicKey,
        }),
        destination: findAssociatedTokenPda(umi, {
          mint: token,
          owner: escrow,
        }),
        amount: 300000000,
      })
    )
    .sendAndConfirm(umi);
})();

```
{% /totem-accordion %}

{% /totem %}

### 전체 코드 예제

에스크로를 만들기 위한 전체 코드를 단순히 복사하여 붙여넣고 싶다면, 여기 있습니다!

{% totem %}

{% totem-accordion title="전체 코드 예제" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey, signerIdentity, generateSigner, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, initEscrowV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { string, base58, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'

(async () => {
  /// 1단계: Umi 설정
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  /// 2단계: 에스크로 설정

  // 에스크로 설정 - 필요에 따라 변경하세요
  const name = "MPL-404 Hybrid Escrow";                       // 에스크로의 이름
  const uri = "https://arweave.net/manifestId";               // 컬렉션의 기본 URI
  const max = 15;                                             // 최대 URI
  const min = 0;                                              // 최소 URI
  const path = 0;                                             // 0: 스왑 시 NFT 업데이트, 1: 스왑 시 NFT 업데이트 안 함

  // 에스크로 계정 - 필요에 따라 변경하세요
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // 스왑할 컬렉션
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // 스왑할 토큰
  const feeLocation = publicKey('<YOUR-FEE-ADDRESS>');        // 수수료가 전송될 주소
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);                                                         // 파생된 에스크로 계정

  // 토큰 스왑 설정 - 필요에 따라 변경하세요
  const tokenDecimals = 6;                                    // 토큰의 소수점
  const amount = addZeros(100, tokenDecimals);                // 스왑 시 사용자가 받을 양
  const feeAmount = addZeros(1, tokenDecimals);               // NFT로 스왑 시 사용자가 수수료로 지불할 양
  const solFeeAmount = addZeros(0, 9);                        // NFT로 스왑 시 지불할 추가 수수료 (Sol은 9 소수점)

  /// 3단계: 에스크로 생성
  const initEscrowTx = await initEscrowV1(umi, {
    name,
    uri,
    max,
    min,
    path,
    escrow,
    collection,
    token,
    feeLocation,
    amount,
    feeAmount,
    solFeeAmount,
  }).sendAndConfirm(umi);

  const signature = base58.deserialize(initEscrowTx.signature)[0]
  console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})()

// 숫자에 0을 추가하는 함수, 올바른 소수점 자릿수를 추가하는 데 필요
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
```

{% /totem-accordion %}

{% /totem %}

## Capture & Release

### 계정 설정

Umi를 설정한 후 ([이전 섹션](#setting-up-umi)에서 했던 대로), 다음 단계는 `Capture` & `Release` 프로세스에 필요한 계정을 구성하는 것입니다. 이 계정들은 앞서 사용한 것과 유사하고 두 명령어 모두에 동일하므로 친숙할 것입니다:

```javascript
// 2단계: 에스크로 계정 - 필요에 따라 변경하세요
const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');
const token = publicKey('<YOUR-TOKEN-ADDRESS>');
const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
]);
```

**참고**: `feeProjectAccount`는 마지막 스크립트의 `feeLocation` 필드와 동일합니다.

### 캡처/릴리스할 자산 선택

캡처하고 릴리스할 자산을 선택하는 방법은 에스크로를 만들 때 선택한 경로에 따라 다릅니다:
- **Path 0**: 경로가 `0`으로 설정되면, 스왑 중에 NFT 메타데이터가 업데이트되므로, 이것은 중요하지 않기 때문에 에스크로에서 무작위 자산을 가져올 수 있습니다.
- **Path 1**: 경로가 `1`로 설정되면, 스왑 후에도 NFT 메타데이터가 동일하게 유지되므로, 사용자가 스왑하고 싶은 특정 NFT를 선택하게 할 수 있습니다.

**Capture의 경우**

NFT를 캡처하는 경우, 에스크로가 소유한 무작위 자산을 선택하는 방법은 다음과 같습니다:

```javascript
// 컬렉션의 모든 자산 가져오기
const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
})

// 에스크로가 소유한 자산 찾기
const asset = assetsListByCollection.filter(
    (a) => a.owner === publicKey(escrow)
)[0].publicKey
```

**Release의 경우**

NFT를 릴리스하는 경우, 일반적으로 사용자가 릴리스하고 싶은 것을 선택합니다. 하지만 이 예제에서는 사용자가 소유한 무작위 자산을 선택하겠습니다:

```javascript
// 컬렉션의 모든 자산 가져오기
const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
})

// 보통 사용자가 교환할 것을 선택합니다
const asset = assetsListByCollection.filter(
    (a) => a.owner === umi.identity.publicKey
)[0].publicKey
```

### Capture (대체 가능한 것에서 대체 불가능한 것으로)

이제 드디어 Capture 명령어에 대해 이야기해봅시다. 이는 대체 가능한 토큰을 NFT로 스왑하는 과정입니다 (스왑에 필요한 토큰의 양은 에스크로 생성 시 설정됩니다).

```javascript
// 대체 가능한 토큰을 스왑하여 NFT 캡처
const captureTx = await captureV1(umi, {
  owner: umi.identity.publicKey,
  escrow,
  asset,
  collection,
  token,
  feeProjectAccount,
  amount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(captureTx.signature)[0];
console.log(`Captured! Check it out: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

### Release (대체 불가능한 것에서 대체 가능한 것으로)

릴리스는 캡처의 반대입니다—여기서는 NFT를 대체 가능한 토큰으로 스왑합니다:

```javascript
// NFT를 릴리스하고 대체 가능한 토큰 받기
const releaseTx = await releaseV1(umi, {
  owner: umi.payer,
  escrow,
  asset,
  collection,
  token,
  feeProjectAccount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(releaseTx.signature)[0];
console.log(`Released! Check it out: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

### 전체 코드 예제

`Capture`와 `Release`를 위한 전체 코드입니다

{% totem %}

{% totem-accordion title="Capture" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, captureV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58, string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

(async () => {
  /// 1단계: Umi 설정
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  // 2단계: 에스크로 계정 - 필요에 따라 변경하세요
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // 스왑할 컬렉션
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // 스왑할 토큰
  const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');  // 수수료가 전송될 주소
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);

  // 컬렉션의 모든 자산 가져오기
  const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
  })

  // 에스크로가 소유한 자산 찾기
  const asset = assetsListByCollection.filter(
    (a) => a.owner === publicKey(escrow)
  )[0].publicKey

  /// 3단계: 자산을 "캡처"(대체 가능한 것에서 대체 불가능한 것으로 스왑)
  const captureTx = await captureV1(umi, {
    owner: umi.payer,
    escrow,
    asset,
    collection,
    token,
    feeProjectAccount,
  }).sendAndConfirm(umi)
  const signature = base58.deserialize(captureTx.signature)[0]
  console.log(`Captured! https://explorer.solana.com/tx/${signature}?cluster=devnet`)})();
```

{% /totem-accordion %}

{% totem-accordion title="Release" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, releaseV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58, string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

import walletFile from "/Users/leo/.config/solana/id.json";

(async () => {
  /// 1단계: Umi 설정
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  // 2단계: 에스크로 계정 - 필요에 따라 변경하세요
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // 스왑할 컬렉션
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // 스왑할 토큰
  const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');  // 수수료가 전송될 주소
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);

  // 컬렉션의 모든 자산 가져오기
  const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
  })

  // 보통 사용자가 교환할 것을 선택합니다
  const asset = assetsListByCollection.filter(
    (a) => a.owner === umi.identity.publicKey
  )[0].publicKey

  /// 3단계: 자산을 "캡처"(대체 가능한 것에서 대체 불가능한 것으로 스왑)
  const releaseTx = await releaseV1(umi, {
    owner: umi.payer,
    escrow,
    asset,
    collection,
    token,
    feeProjectAccount,
  }).sendAndConfirm(umi)

  const signature = base58.deserialize(releaseTx.signature)[0]
  console.log(`Released! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})();
```

{% /totem-accordion %}

{% /totem %}