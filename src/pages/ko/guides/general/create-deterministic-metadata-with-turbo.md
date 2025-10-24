---
title: Turbo를 사용하여 결정적 메타데이터 생성하기
metaTitle: Turbo를 사용하여 결정적 메타데이터 생성하기 | 일반 가이드
description: Arweave 기반 업로드를 위한 Turbo SDK를 활용하여 결정적 메타데이터를 생성하는 방법을 알아보세요.
# remember to update dates also in /components/guides/index.js
created: '10-19-2024'
updated: '10-19-2024'
---

MPL-Hybrid 프로그램의 메타데이터 랜덤화 기능을 활용하려면, 오프체인 메타데이터 URI가 일관성 있고 순차적인 구조를 따라야 합니다. 이를 위해 Arweave의 [path manifest](https://cookbook.arweave.dev/concepts/manifests.html) 기능과 Turbo SDK를 사용할 것입니다. **이 가이드에서는 이를 설정하는 방법을 보여드립니다!**

{% callout title="Turbo란 무엇인가요" %}

Turbo는 Arweave에서 데이터의 자금 조달, 인덱싱, 전송을 간소화하는 초고처리량 Permaweb 서비스입니다. 신용카드나 직불카드를 통한 법정화폐 결제 옵션뿐만 아니라 ETH, SOL, AR과 같은 암호화폐 결제를 위한 그래픽 및 프로그래매틱 인터페이스를 제공합니다.

{% /callout %}

## 전제조건

### 필수 패키지

{% packagesUsed packages=[ "@ardrive/turbo-sdk" ] type="npm" /%}

이 가이드에 필요한 패키지를 설치하세요.

```js
npm i @ardrive/turbo-sdk
```

### 메타데이터 폴더

이 예시에서는 결정적인 방식으로 메타데이터를 업로드하는 방법을 보여드립니다. 이를 위해서는 시작하기 전에 모든 자산을 준비해야 합니다.

메타데이터를 생성하려면 [이러한 방법 중 하나](/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine#image-and-metadata-generators)를 사용하고 다음과 같이 0부터 시작하는 순차적 명명 규칙에 따라 메타데이터를 저장할 수 있습니다:

```
metadata/
├─ 0.json
├─ 1.json
├─ 2.json
├─ ...
```

**참고**: 메타데이터를 생성할 때 [NFT용 적절한 JSON 스키마](/token-metadata/token-standard#the-non-fungible-standard)를 따라야 합니다!

## Turbo 설정하기

Turbo는 여러 토큰과 체인과 호환되므로, 이 가이드에서는 Solana를 토큰으로 사용하도록 Turbo 인스턴스를 구성해야 합니다. `TurboFactory.authenticated()` 메서드를 호출하고 Solana 관련 구성 옵션을 전달하여 이를 수행합니다.

```javascript
import { TurboFactory } from '@ardrive/turbo-sdk';

// 업로드 비용을 지불하는 데 사용할
// keypair.json 파일을 여기에 가져오세요
import secretKey from "/path/to/your/keypair.json";

const turbo = TurboFactory.authenticated({
  privateKey: bs58.encode(Uint8Array.from(secretKey)),
  token: 'solana',
  gatewayUrl: `https://api.devnet.solana.com`,
  paymentServiceConfig: { url: "https://payment.ardrive.dev" },
  uploadServiceConfig: { url: "https://upload.ardrive.dev" },
});
```

**참고**: 이 예시에서는 devnet에서 작동하도록 환경을 구성하기 위해 `gatewayUrl`, `paymentServiceConfig`, `uploadServiceConfig`를 명시적으로 제공합니다. 메인넷 사용의 경우 이러한 필드를 비워두면 Turbo가 기본적으로 메인넷 엔드포인트를 사용합니다.
Solana와 Eclipse 블록체인의 Metaplex Aura 네트워크에 액세스하려면 [여기](https://aura-app.metaplex.com/)의 Aura App을 방문하여 엔드포인트와 API 키를 받으세요.

## 메타데이터 업로드

Turbo는 `TurboAuthenticatedClient.uploadFolder()` 함수를 사용하여 전체 메타데이터 폴더를 업로드하는 과정을 간소화합니다. 이 함수는 기본적으로 Manifests를 지원하며, `metadataUploadResponse.manifestResponse?.id`를 통해 Manifest ID를 반환하여 메타데이터 생성 및 에스크로 설정에 사용할 수 있습니다.

과정을 간소화하기 위해, 이 가이드는 전체 워크플로를 처리하는 `uploadMetadata()`라는 도우미 함수를 제공합니다.

```javascript
const metadataUploadResponse = await uploadMetadata(turbo);
```

**`uploadMetadata()` 도우미의 단계**

1. `calculateRequiredLamportsForUpload()`를 호출하여 업로드에 필요한 램포트 수를 결정합니다. 이는 Winc(Turbo의 토큰)로 업로드 비용을 계산하고 `TurboAuthenticatedClient.getWincForToken()`을 사용하여 이를 램포트로 변환합니다.

2. 지갑에 충분한 Winc가 없는 경우, 함수는 `TurboAuthenticatedClient.topUpWithTokens()`를 사용하여 램포트를 Winc로 변환하여 필요한 양을 충전합니다.

3. 지갑에 충분한 Winc가 있으면 `TurboAuthenticatedClient.uploadFolder()`를 사용하여 메타데이터 폴더를 업로드하고, 이는 메타데이터에 대한 Manifest ID를 반환합니다.

### 필요한 램포트 계산

```javascript
const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
  turbo,
  calculateFolderSize(metadataFolderPath)
);
```

폴더의 총 크기를 바이트로 계산하는 것부터 시작합니다. 다음 함수는 폴더 구조를 재귀적으로 탐색하여 모든 파일의 크기를 합계합니다:

```javascript
function calculateFolderSize(folderPath: string): number {
  return fs.readdirSync(folderPath).reduce((totalSize, item) => {
    const fullPath = path.join(folderPath, item);

    const stats = fs.statSync(fullPath);

    return stats.isFile()
        ? totalSize + stats.size
        : totalSize + calculateFolderSize(fullPath);
  }, 0);
}
```

폴더 크기가 결정되면, 다음 단계는 업로드에 필요한 램포트 수를 계산하는 것입니다. 이는 Winc 비용을 결정하고 이를 램포트로 변환하는 `calculateRequiredLamportsForUpload()` 함수를 사용하여 수행됩니다:

```javascript
async function calculateRequiredLamportsForUpload(turbo: TurboAuthenticatedClient, fileSize: number): Promise<number> {
    /// 파일 크기가 105 KiB 미만이면 비용을 지불할 필요가 없습니다
    if (fileSize < 107_520) { return 0; }

    /// 파일을 업로드하는 데 얼마나 많은 winc가 필요한지 확인합니다
    const uploadPrice = new BigNumber((await turbo.getUploadCosts({ bytes: [fileSize]}))[0].winc);

    /// 현재 Winc 잔액을 확인합니다
    const currentBalance = new BigNumber((await turbo.getBalance()).winc);

    /// 파일을 업로드하는 데 필요한 Winc 양을 계산합니다
    const requiredWinc = uploadPrice.isGreaterThan(currentBalance)
        ? uploadPrice.minus(currentBalance)
        : new BigNumber(0); // 잔액이 충분하면 Winc가 필요하지 않습니다

    /// 필요한 Winc가 0이면 파일을 업로드할 수 있는 충분한 잔액이 있습니다
    if (requiredWinc.isEqualTo(0)) { return 0; }

    /// 1 SOL의 Winc 가치를 계산합니다 (1 SOL = 1_000_000_000 Lamports)
    const wincForOneSol = new BigNumber((await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc);

    /// 파일을 업로드하는 데 필요한 SOL 양을 계산합니다 (SOL로 반환)
    const requiredSol = requiredWinc.dividedBy(wincForOneSol).toNumber();

    /// 램포트로 필요한 SOL 양을 반환합니다
    return Math.floor(requiredSol * 1_000_000_000)
}
```

### 지갑 충전 및 메타데이터 업로드

지갑을 충전하기 위해 `TurboAuthenticatedClient.topUpWithTokens()` 메서드를 사용하여 이전 단계에서 계산된 램포트 양을 지정합니다. 이 양은 업로드 프로세스에 필요한 Winc(Turbo의 토큰)로 변환됩니다.

**참고**: 충전 프로세스는 조건부입니다. 지갑에 이미 충분한 Winc가 있으면 `calculateRequiredLamportsForUpload()` 함수가 0을 반환하고 충전이 필요하지 않습니다.

```javascript
// 필요한 경우 지갑 충전
await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});
```

지갑에 충분한 Winc가 있는지 확인한 후, 이미지 폴더 업로드를 진행할 수 있습니다. 이는 `TurboAuthenticatedClient.uploadFolder()` 메서드를 사용하여 수행됩니다. 업로드는 업로드된 파일에 액세스할 수 있는 매니페스트 ID를 반환하며, 다음과 같은 형식으로 구성됩니다: `https://arweave.net/${manifestID}/${nameOfTheFile.extension}.`

**참고**: 업로드하는 동안 각 파일에 대해 올바른 [MIME 타입](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)을 설정하는 것이 중요합니다. MIME 타입이 올바르게 설정되지 않으면 URI를 통해 액세스할 때 파일이 제대로 표시되지 않을 수 있습니다.

```javascript
// 이미지 폴더 업로드
const metadataUploadResponse = await turbo.uploadFolder({
    folderPath: metadataFolderPath,
    dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
});
```

## 전체 코드 예시

쉽게 사용할 수 있도록 복사하여 붙여넣을 수 있는 전체 코드 예시입니다

{% totem %}

{% totem-accordion title="전체 코드 예시" %}

```javascript
import {
    TurboFactory,
    TurboAuthenticatedClient,
    lamportToTokenAmount,
    TurboUploadFolderResponse
} from '@ardrive/turbo-sdk';

import bs58 from 'bs58';
import path from 'path';
import fs from 'fs';
import BigNumber from 'bignumber.js';

import secretKey from "/path/to/your/keypair.json";

const imageFolderPath = path.join(__dirname, './assets');
const metadataFolderPath = path.join(__dirname, './metadata');

(async () => {
    try {
        /// 1단계: Turbo 설정
        const turbo = TurboFactory.authenticated({
            privateKey: bs58.encode(Uint8Array.from(secretKey)),
            token: 'solana',
            gatewayUrl: `https://api.devnet.solana.com`,
            paymentServiceConfig: { url: "https://payment.ardrive.dev" },
            uploadServiceConfig: { url: "https://upload.ardrive.dev" },
        });

        /// 2단계: 메타데이터 업로드
        const metadataUploadResponse = await uploadMetadata(turbo);
    } catch (error) {
        console.error("실행 중 오류:", error);
    }
})();

async function uploadMetadata(turbo: TurboAuthenticatedClient): Promise<TurboUploadFolderResponse> {
    // 메타데이터 폴더 계산 및 업로드
    const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
        turbo,
        calculateFolderSize(metadataFolderPath)
    );

    // 필요한 경우 지갑 충전
    await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});

    // 메타데이터 폴더 업로드
    const metadataUploadResponse = await turbo.uploadFolder({
        folderPath: metadataFolderPath,
        dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
    });

    console.log('메타데이터 Manifest ID:', metadataUploadResponse.manifestResponse?.id);
    return metadataUploadResponse;
}

function calculateFolderSize(folderPath: string): number {
  return fs.readdirSync(folderPath).reduce((totalSize, item) => {
    const fullPath = path.join(folderPath, item);

    const stats = fs.statSync(fullPath);

    return stats.isFile()
        ? totalSize + stats.size
        : totalSize + calculateFolderSize(fullPath);
  }, 0);
}

async function calculateRequiredLamportsForUpload(turbo: TurboAuthenticatedClient, fileSize: number): Promise<number> {
    /// 파일 크기가 105 KiB 미만이면 비용을 지불할 필요가 없습니다
    if (fileSize < 107_520) { return 0; }

    /// 파일을 업로드하는 데 얼마나 많은 winc가 필요한지 확인합니다
    const uploadPrice = new BigNumber((await turbo.getUploadCosts({ bytes: [fileSize]}))[0].winc);

    /// 현재 Winc 잔액을 확인합니다
    const currentBalance = new BigNumber((await turbo.getBalance()).winc);

    /// 파일을 업로드하는 데 필요한 Winc 양을 계산합니다
    const requiredWinc = uploadPrice.isGreaterThan(currentBalance)
        ? uploadPrice.minus(currentBalance)
        : new BigNumber(0); // 잔액이 충분하면 Winc가 필요하지 않습니다

    /// 필요한 Winc가 0이면 파일을 업로드할 수 있는 충분한 잔액이 있습니다
    if (requiredWinc.isEqualTo(0)) { return 0; }

    /// 1 SOL의 Winc 가치를 계산합니다 (1 SOL = 1_000_000_000 Lamports)
    const wincForOneSol = new BigNumber((await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc);

    /// 파일을 업로드하는 데 필요한 SOL 양을 계산합니다 (SOL로 반환)
    const requiredSol = requiredWinc.dividedBy(wincForOneSol).toNumber();

    /// 램포트로 필요한 SOL 양을 반환합니다
    return Math.floor(requiredSol * 1_000_000_000)
}
```

{% /totem %}

{% /totem-accordion %}