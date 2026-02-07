---
title: 봇 방지 보호 모범 사례
metaTitle: 봇 방지 보호 모범 사례 | 코어 캔디 머신
description: 악성 행위자를 방지하고 공정한 분배를 보장하기 위해 코어 캔디 머신 민팅에 봇 방지 보호 및 보안 조치를 구현하는 포괄적인 가이드입니다.
---

봇과 악성 행위자로부터 코어 캔디 머신 런칭을 보호하는 것은 커뮤니티에 공정한 분배를 보장하는 데 중요합니다. 이 가이드는 합법적인 사용자에게 투명성을 제공하면서 민팅 무결성을 유지하기 위해 성공한 프로젝트들이 사용하는 검증된 전략과 구현 패턴을 다룹니다. {% .lead %}

## 봇 방지 보호가 중요한 이유

적절한 보호 없이는 봇이 다음을 수행할 수 있습니다:
- 실제 사용자가 참여하기 전에 대량으로 민팅
- 예측 가능한 패턴을 사용하여 희귀 아이템 스나이핑
- 자동화된 요청으로 인프라를 압도
- 진정한 커뮤니티 구성원에 대해 불공정한 이점 생성

이 가이드에서 설명하는 전략들은 함께 작동하여 자동화된 시스템이 합법적인 사용자에게는 원활한 경험을 유지하면서 민팅을 조작하는 것을 극도로 어렵게 만드는 여러 보호 계층을 생성합니다.

## 메타데이터 준비 및 업로드 전략

#### 실제 메타데이터 생성 및 업로드

먼저 예측 가능한 패턴 대신 트랜잭션 ID 기반 URI로 완전한 컬렉션 메타데이터를 생성합니다.

##### 예측 가능한 URI의 문제점

많은 프로젝트가 메타데이터에 예측 가능하고 순차적인 URI를 사용하는 실수를 저지릅니다:

```
https://yourproject.com/metadata/0.json
https://yourproject.com/metadata/1.json
https://yourproject.com/metadata/2.json
```

이 패턴은 봇이 다음을 수행할 수 있게 합니다:
- 민팅 전에 모든 메타데이터 미리 가져오기
- 희귀한 특성 식별 및 특정 인덱스 타겟팅
- 알려진 메타데이터 분배를 기반으로 공격 계획 수립

##### 해결책: 트랜잭션 ID 기반 URI를 사용하는 업로드 서비스

파일을 업로드할 때 트랜잭션 ID 기반 URI를 자동으로 생성하는 다양한 업로드 서비스와 SDK를 사용할 수 있습니다. 이를 통해 무작위 식별자를 수동으로 생성할 필요가 없어지고 진정한 예측 불가능성이 보장됩니다.

**UMI 업로더 예시 (Irys/ArDrive Turbo 래퍼)**
UMI의 내장 업로더는 **Irys**와 **ArDrive Turbo**와 같은 서비스의 래퍼입니다. 이러한 서비스와 직접 작업하는 복잡성을 추상화하면서 자동으로 트랜잭션 ID 기반 URI를 생성합니다.

**UMI 업로더 사용 예시:**
```typescript
import fs from "fs";
import mime from "mime";
import { createGenericFile } from "@metaplex-foundation/umi";

const umi = // umi 인스턴스를 가져오거나 생성합니다.

// 파일 업로드 - UMI가 자동으로 예측 불가능한 트랜잭션 ID 생성
async function uploadFiles(filePaths: string[]): Promise<string[]> {
  const files = filePaths.map((filePath) => {
    const file = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath);
    return createGenericFile(file, "file", {
      tags: mimeType ? [{ name: "content-type", value: mimeType }] : [],
    });
  });

  const uploadedUris = await umi.uploader.upload(files);

  // 추적을 위해 업로드된 각 URI를 인덱스와 함께 로그
  uploadedUris.forEach((uri, index) => {
    console.log(`Uploaded file #${index} -> ${uri}`);
  });

  return uploadedUris;
}

// 중요: 반환된 모든 URI 저장 - 리빌 매핑에 필요합니다!
const uploadedUris = await uploadFiles(allFilePaths);

// 결과: 저장해야 하는 자동으로 예측 불가능한 URI
// uploadedUris[0] = "https://arweave.net/BrG44HdsEhzapvs8bEqzvkq4egwevS3fRE6kLuCyOdCd"
// uploadedUris[1] = "https://arweave.net/9jK3LpM7NqR5xY8vZ2BwC4tE6gH9sF1D3a7Q8eR2nM4K"
// uploadedUris[2] = "https://arweave.net/5tH8GpN3MqL7wV9xB2CeD4yR6kJ1sK3F8gQ7eP5nL9M2"
// ... 모든 파일에 대해 등등

// 이것들을 안전하게 저장하세요 - 재생성할 수 없습니다!
// 이 URI들은 UMI를 통한 기본 서비스(Irys/ArDrive Turbo)에서 제공됩니다
fs.writeFileSync("./uploaded-uris.json", JSON.stringify(uploadedUris, null, 2));
await securelyStoreUris(uploadedUris);
```

**탐색할 다른 업로드 서비스:**
- **Irys**: 트랜잭션 ID를 사용한 Arweave 업로드를 위한 직접 SDK
- **ArDrive**: 내장된 트랜잭션 ID 생성을 포함한 Arweave 기반 저장소
- **IPFS**: Pinata, Infura 또는 Web3.Storage와 같은 서비스
- **AWS S3**: 커스텀 트랜잭션 ID 생성 포함
- **커스텀 솔루션**: 무작위 ID 생성을 포함한 자체 업로드 서비스 구축

{% callout %}
**UMI 업로더 기능에 대한 더 자세한 정보는 [UMI 저장소 문서](/ko/dev-tools/umi/storage)를 참조하세요.**
{% /callout %}

#### 플레이스홀더 메타데이터 생성

처음에 모든 민팅에 사용될 단일 플레이스홀더 메타데이터 파일을 생성합니다:

```json
{
  "name": "미스터리 자산",
  "description": "이 자산은 민팅 완료 후 공개됩니다. 각 자산은 고유하며 곧 실제 특성과 희귀도와 함께 공개될 예정입니다!",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "상태",
      "value": "미공개"
    },
    {
      "trait_type": "컬렉션",
      "value": "프로젝트 이름"
    }
  ]
}
```

이를 단일하고 예측 가능한 URI에 업로드합니다(모든 업로드 서비스 사용 가능):
```
https://yourproject.com/metadata/placeholder.json
```

**모든 업로드 솔루션의 핵심 요구사항:**
- **트랜잭션 ID 기반 URI**: 예측 불가능하고 비순차적인 식별자 보장
- **영구 저장소**: 불변 저장소를 제공하는 서비스 사용(Arweave, IPFS 등)
- **URI 저장**: 리빌 매핑을 위해 반환된 URI를 순서대로 항상 저장
- **배치 기능**: 여러 파일을 효율적으로 업로드하는 지원

{% callout type="warning" %}
**중요한 저장 요구사항:** 리빌 메타데이터를 업로드할 때는 메타데이터 파일에 해당하는 정확한 순서대로 반환된 모든 URI를 저장해야 합니다. 이러한 URI는 재생성할 수 없으며 리빌 매핑 프로세스에 필수적입니다. 이 없이는 자산을 리빌할 수 없습니다!
{% /callout %}

## 보안 매핑 생성

#### 무작위화된 매핑 생성

캔디 머신을 설정하기 전에 어떤 민트 인덱스가 어떤 최종 메타데이터에 해당하는지 결정할 보안 매핑을 생성합니다. 이것이 공정한 분배를 보장하는 중요한 단계입니다.

```typescript
// 캔디 머신 생성 전에 보안 매핑 생성
function generateSecureMapping(totalSupply: number): number[] {
  // 인덱스 배열 생성 [0, 1, 2, ..., totalSupply-1]
  const indices = Array.from({ length: totalSupply }, (_, i) => i);

  // 암호학적으로 안전한 섞기 사용 (Fisher-Yates)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2**32) * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

// 예시: 4000개의 NFT 컬렉션
const secureMapping = generateSecureMapping(4000);
// 결과: [2847, 91, 3756, 128, 2904, 567, ...]
// 의미:
// - 민트 인덱스 0은 메타데이터 인덱스 2847로 리빌됩니다
// - 민트 인덱스 1은 메타데이터 인덱스 91로 리빌됩니다
// - 민트 인덱스 2는 메타데이터 인덱스 3756으로 리빌됩니다
// 등등.

// 이 매핑을 안전하게 저장 - 리빌 키입니다!
await storeMapping(secureMapping);
```

#### 매핑 보안 요구사항

- **민트 런칭 전에 생성** - 나중에 변경할 수 없습니다
- **리빌 시까지 매핑을 완전히 비밀로 유지**
- **저장을 위한 암호화 사용** (데이터베이스 암호화, 환경 변수)
- **매핑 검색을 위한 엄격한 액세스 제어 구현**
- **여러 위치에 보안 백업 생성**
- **감사 목적을 위한 모든 액세스 로그**

{% callout type="warning" %}
**중요**: 매핑은 민트 런칭 전에 생성되고 보안이 확보되어야 합니다. 이 매핑이 손상되거나 손실되면 전체 리빌 프로세스가 손상됩니다.
{% /callout %}

## 투명한 검증 설정

#### 런칭 전 해시 생성

런칭 전에 매핑을 공개하지 않고 매핑의 공정성을 증명하는 검증 해시를 생성합니다:

```typescript
// 민트 런칭 전 검증 해시 생성
async function generateVerificationHashes(
  mapping: number[],
  metadataFiles: string[],
  uploadedUris: string[]
): Promise<{masterHash: string, metadataHashes: string[]}> {

  // 1. 각 개별 메타데이터 파일 해시
  const metadataHashes = metadataFiles.map(metadata =>
    crypto.createHash('sha256').update(metadata).digest('hex')
  );

  // 2. 업로드된 URI에서 트랜잭션 ID 추출
  const transactionIds = uploadedUris.map(uri => {
    // URI에서 트랜잭션 ID 추출 (예: https://arweave.net/[ID])
    return uri.split('/').pop();
  });

  // 3. 검증 데이터 구조 생성
  const verificationData = mapping.map((finalIndex, mintIndex) => ({
    mintIndex,
    finalIndex,
    transactionId: transactionIds[finalIndex],
    metadataUri: uploadedUris[finalIndex],
    metadataHash: metadataHashes[finalIndex],
  }));

  // 4. 전체 매핑의 마스터 해시 생성
  const masterHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(verificationData))
    .digest('hex');

  return { masterHash, metadataHashes };
}

const { masterHash, metadataHashes } = await generateVerificationHashes(
  secureMapping,
  allMetadataFiles,
  uploadedUris
);
```

#### 검증 데이터 공개

**민팅이 시작되기 전에** 이 검증 데이터를 공개적으로 발표합니다:

```json
{
  "projectName": "프로젝트 이름",
  "totalSupply": 4000,
  "masterMappingHash": "a7b9c3d2e8f4g5h6i1j0k9l8m7n6o5p4q3r2s1t0u9v8w7x6y5z4",
  "metadataHashes": [
    "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6",
    "c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7",
    // ... 4000개의 모든 메타데이터 해시
  ],
  "publishedAt": "2024-01-15T10:00:00Z",
  "verificationInstructions": "리빌 후, 메타데이터 해시가 공개된 인덱스에 대한 공개된 해시와 일치하는지 확인하세요"
}
```

다음에 발표:
- 웹사이트
- 영구 저장을 위한 IPFS
- 투명성을 위한 소셜 미디어
- Discord/커뮤니티 채널

## 플레이스홀더를 사용한 구성 라인 설정

#### 캔디 머신 데이터가 공개적이고 보이는 이유

{% callout type="warning" %}
**중요한 보안 통찰력:** 모든 캔디 머신 데이터는 블록체인에서 공개적으로 볼 수 있습니다. 누구나 캔디 머신을 조회하고 로드한 모든 메타데이터 URI를 볼 수 있습니다. 이것이 플레이스홀더 메타데이터 사용이 보안에 절대적으로 필수적인 이유입니다.
{% /callout %}

캔디 머신에 아이템을 로드할 때:
- **모든 메타데이터 URI가 즉시 보입니다** 온체인 데이터를 조회하는 누구에게나
- **봇이 즉시 스크래핑할 수 있습니다** 직접 로드하면 모든 실제 메타데이터를
- **악성 행위자에게 특성 분석이 사소해집니다**
- **민팅이 시작되기도 전에 희귀도 스나이핑이 가능해집니다**

이러한 공개 가시성이 바로 플레이스홀더 전략이 보호에 중요한 이유입니다.

#### 구성 라인 vs 숨겨진 설정

캔디 머신에 아이템을 로드하는 방법은 두 가지가 있으며, 올바른 방법을 선택하는 것이 보안에 영향을 줍니다:

**숨겨진 설정:**
- 순차적으로 민팅: 인덱스 0, 그 다음 1, 그 다음 2, 등등
- 사용자는 예측 가능한 플레이스홀더 민트 순서를 얻습니다
- 매핑이 여전히 최종 리빌을 무작위화할 수 있지만, 민트 순서 자체는 예측 가능합니다

**구성 라인 (권장):**
- 예측 불가능한 플레이스홀더 민트 인덱스 결과로 더 나은 사용자 경험

#### 플레이스홀더 메타데이터를 사용한 구성 라인 사용

초기 민팅 단계에서 플레이스홀더 메타데이터를 사용하도록 코어 캔디 머신을 구성하며, 잠재적으로 사전 무작위화된 순서로:

```typescript
// 옵션 1: 간단한 플레이스홀더 접근법
const items = Array.from({ length: 4000 }, (_, index) => ({
  name: `미스터리 자산 #${index + 1}`,
  uri: "https://yourproject.com/placeholder.json"
}));

// 옵션 2: 추가 예측 불가능성을 위한 사전 무작위화된 플레이스홀더 순서
function createRandomizedPlaceholders(totalSupply: number): ConfigLine[] {
  const indices = Array.from({ length: totalSupply }, (_, i) => i);

  // 무작위 민트 순서를 위한 인덱스 섞기
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.map((randomIndex, position) => ({
    name: `미스터리 자산 #${position + 1}`,
    uri: "https://yourproject.com/placeholder.json"
  }));
}

const randomizedItems = createRandomizedPlaceholders(4000);

// 플레이스홀더 아이템을 캔디 머신에 삽입
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: randomizedItems,
}).sendAndConfirm(umi);
```

**플레이스홀더 메타데이터 구조:**
```json
{
  "name": "미스터리 자산",
  "description": "이 자산은 민팅 완료 후 공개됩니다. 각 자산은 고유하며 곧 실제 특성과 희귀도와 함께 공개될 예정입니다!",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "상태",
      "value": "미공개"
    },
    {
      "trait_type": "컬렉션",
      "value": "프로젝트 이름"
    }
  ]
}
```

#### 이 접근법의 이점

1. **완전한 메타데이터 프라이버시**: 실제 메타데이터 URI가 캔디 머신에 절대 나타나지 않음
2. **봇 보호**: 봇이 리빌 전에 특성을 분석할 방법이 없음
3. **공정한 분배**: 민트 순서조차 무작위화될 수 있음
4. **공개 검증 가능성**: 플레이스홀더 메타데이터가 프로젝트의 합법성을 보여줌
5. **커뮤니티 흥미**: 미스터리 측면이 기대감 조성

{% callout %}
**참고:** 플레이스홀더는 매력적이고 전문적이어야 신뢰를 구축하지만, 최종 특성, 희귀도 또는 실제 자산의 식별 특성에 대한 정보는 전혀 포함해서는 안 됩니다.
{% /callout %}

## 백엔드 제어 민트 트랜잭션

#### 제3자 서명자 전략

프론트엔드 클라이언트가 자체적인 민트 트랜잭션을 생성하도록 허용하지 마세요. 대신 필수 가드와 함께 모든 민트 트랜잭션을 생성하고 부분적으로 서명하는 백엔드 서비스를 구현하세요.

#### 백엔드 서비스를 위한 플랫폼 권장사항

**Next.js (대부분의 프로젝트에 권장):**
Next.js는 단일 프레임워크에서 프론트엔드와 백엔드 기능을 모두 제공하기 때문에 NFT 민트 사이트를 만드는 데 가장 인기 있는 플랫폼입니다. 내장된 API 라우트를 통해 보안 민트 엔드포인트를 구현하기가 매우 쉽습니다.

```typescript
// pages/api/mint.ts 또는 app/api/mint/route.ts
// 내장 백엔드 - 별도의 서버가 필요 없습니다!
```

**다른 플랫폼 옵션:**

- **AWS Lambda**: 인프라 관리 없이 민트 버스트를 처리하기에 완벽한 서버리스 함수
- **Vercel Functions**: Next.js 배포와 원활하게 통합
- **Netlify Functions**: 작은 프로젝트를 위한 간단한 서버리스 옵션
- **Railway/Render**: 쉬운 배포가 가능한 풀스택 호스팅
- **VPS의 Express.js**: 최대 제어를 위한 전통적인 서버 접근법
- **Cloudflare Workers**: 글로벌 저지연 민팅을 위한 엣지 컴퓨팅

**Next.js가 민트 사이트에 이상적인 이유:**
- **통합 백엔드**: API 라우트 내장, 별도 서버 불필요
- **쉬운 배포**: Vercel, Netlify 등에 원클릭 배포
- **React 프론트엔드**: 지갑 연결과 민트 UI에 완벽
- **대규모 커뮤니티**: 광범위한 NFT 프로젝트 예시와 리소스
- **성능**: 빠른 로딩 민트 페이지를 위한 내장 최적화

##### 보안을 위한 필수 가드

백엔드에서 생성된 트랜잭션에 항상 다음 가드들을 포함하세요:

**1. 제3자 서명자 가드**: 백엔드만이 민팅을 승인할 수 있도록 보장
```typescript
const guards = {
  thirdPartySigner: {
    signerKey: backendSignerWallet.publicKey,
  },
  botTax: {
    lamports: sol(0.01), // 실패한 시도에 대한 세금
    lastInstruction: true,
  },
  solPayment: {
    lamports: sol(0.1), // 민트 가격
    destination: treasuryWallet.publicKey,
  },
};
```

**2. 봇 택스 가드**: 실패한 트랜잭션에 요금을 부과하여 스팸 시도 억제

##### 백엔드 민트 엔드포인트 구현

**Next.js API 라우트 예시:**
```typescript
// pages/api/mint.ts (Pages Router) 또는 app/api/mint/route.ts (App Router)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. 사용자 검증 (속도 제한, 캡차 등)
    const { userWallet } = req.body;

    // 2. 필수 가드와 함께 민트 트랜잭션 생성.
    // 프론트엔드에서 추가 가드 인수를 제공해야 할 수 있습니다.
    const mintTransaction = await mintV1(umi, {
      candyMachine: candyMachine.publicKey,
      asset: generateSigner(umi),
      minter: createNoopSigner(userWallet),
      mintArgs: {
        thirdPartySigner: {
          signer: backendSigner,
        },
      },
    }).buildWithLatestBlockhash(umi);;

    // 3. 백엔드 서명자로 부분적으로 서명
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);

    // 4. 사용자가 프론트엔드에서 서명할 트랜잭션 반환
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: 'Mint failed' });
  }
}
```

**대안: Express.js/AWS Lambda 예시:**
```typescript
// 전통적인 Express 또는 서버리스 함수
app.post('/api/mint', async (req, res) => {
  try {
    // 1. 사용자 검증 (속도 제한, 캡차 등)
    const { userWallet, captchaToken } = req.body;

    // 2. 필수 가드와 함께 민트 트랜잭션 생성
    const mintTransaction = await mintV1(umi, {
      candyMachine: candyMachine.publicKey,
      asset: generateSigner(umi),
      minter: createNoopSigner(userWallet),
      mintArgs: {
        thirdPartySigner: {
          signer: backendSigner,
        },
      },
    }).buildWithLatestBlockhash(umi);

    // 3. 백엔드 서명자로 부분적으로 서명
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);

    // 4. 사용자가 완료할 트랜잭션 반환
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: 'Mint failed' });
  }
});
```

#### 플랫폼별 배포 고려사항

**Next.js 배포:**
- **Vercel**: 무설정 배포, Next.js에 완벽
- **Netlify**: 유사한 사용 편의성을 가진 훌륭한 대안
- **Railway**: 데이터베이스가 포함된 풀스택 호스팅

**서버리스 배포:**
- **AWS Lambda**: Serverless Framework 또는 AWS CDK 사용
- **Cloudflare Workers**: 글로벌 엣지 배포
- **Vercel Functions**: Next.js 배포와 함께 자동

**전통적인 서버:**
- **Railway/Render**: 쉬운 컨테이너 배포
- **DigitalOcean/Linode**: Docker와 함께 VPS
- **AWS EC2**: 완전한 제어이지만 더 많은 설정 필요

{% callout type="warning" %}
**중요한 보안 참고사항:** 트랜잭션이 서명되면 수정할 수 없습니다. 제3자 서명자 가드는 백엔드 제어 밖에서 아무도 유효한 민트 트랜잭션을 생성할 수 없도록 보장합니다.
{% /callout %}

## 민트 후 메타데이터 업데이트 (리빌)

#### 리빌 프로세스

민팅 완료 후, 보안 매핑을 사용하여 각 자산의 메타데이터를 플레이스홀더에서 최종 메타데이터로 업데이트하는 리빌 메커니즘을 구현합니다. 리빌 프로세스를 처리하는 세 가지 주요 전략이 있습니다:

##### 전략 1: 즉시 리빌

즉시 리빌에서는 각 NFT가 민트 트랜잭션 완료 직후 최종 메타데이터로 업데이트됩니다. 이는 사용자에게 즉각적인 만족을 제공하지만 더 복잡한 백엔드 인프라가 필요합니다.

**프로세스:**
1. 사용자가 자산을 민팅 (플레이스홀더 메타데이터 획득)
2. 백엔드가 즉시 보안 매핑에서 민트 인덱스를 찾음
3. 백엔드가 저장된 업로드 목록에서 최종 메타데이터 URI로 자산을 업데이트
4. 사용자가 즉시 리빌된 자산을 받음

**장점:**
- 즉각적인 사용자 만족
- 리빌 대기 기간 없음
- 더 간단한 사용자 경험

**단점:**
- 더 복잡한 백엔드 구현
- 실패한 리빌에 대한 강력한 오류 처리 필요

##### 전략 2: 이벤트 리빌 (프로젝트 제어)

이벤트 리빌에서는 모든 자산이 민팅 후 플레이스홀더로 남아있고, 프로젝트가 미리 정해진 시간에 모든 NFT를 한 번에 리빌합니다. 이는 사용자 상호작용 없이 커뮤니티 전체 리빌 이벤트를 만듭니다.

**프로세스:**
1. 사용자가 자산을 민팅 (플레이스홀더 메타데이터 획득)
2. 프로젝트 리빌 이벤트까지 자산이 플레이스홀더로 남아있음
3. 예약된 시간에 프로젝트 백엔드가 보안 매핑을 사용하여 모든 자산을 처리
4. 모든 자산이 동시에 최종 메타데이터로 업데이트됨

**장점:**
- 더 간단한 민팅 프로세스
- 커뮤니티 전체 리빌 흥미 생성
- 최적의 타이밍에 예약 가능 (예: 커뮤니티 이벤트 중)
- 사용자 상호작용 불필요

**단점:**
- 사용자가 리빌을 기다려야 함
- 별도의 리빌 인프라 필요
- 리빌 기대 관리 필요

##### 전략 3: 사용자 트리거 리빌

사용자 트리거 리빌에서는 사용자가 대화형 UI를 통해 자신의 NFT를 리빌할 수 있습니다. 각 사용자가 자산이 리빌되는 시기를 제어하지만, 리빌은 여전히 보안 매핑을 사용합니다.

**프로세스:**
1. 사용자가 자산을 민팅 (플레이스홀더 메타데이터 획득)
2. 사용자가 리빌을 선택할 때까지 자산이 플레이스홀더로 남아있음
3. 사용자가 리빌 웹사이트를 방문하고 특정 자산에 대한 리빌을 트리거
4. 백엔드가 보안 매핑에서 자산의 민트 인덱스를 찾음
5. 자산이 최종 메타데이터로 업데이트됨

**장점:**
- 사용자가 자체 리빌 타이밍을 제어
- 대화형 커뮤니티 참여 생성
- 사용자에게 선택권을 주면서 기대감 조성 가능
- 더 낮은 즉각적인 트랜잭션 비용

**단점:**
- 더 복잡한 UI/UX 구현
- 리빌 완료를 위한 사용자 행동 필요
- 사용자가 참여하지 않으면 불완전한 리빌 가능

##### 전략 선택

**즉시 리빌을 선택하는 경우:**
- 즉각적인 사용자 만족을 원할 때
- 백엔드가 복잡성을 처리할 수 있을 때
- 리빌 관련 지원 문제를 피하고 싶을 때

**이벤트 리빌을 선택하는 경우:**
- 커뮤니티 전체 리빌 흥미를 만들고 싶을 때
- 더 간단한 민팅 인프라를 선호할 때
- 리빌 타이밍을 제어하고 싶을 때
- 커뮤니티 이벤트 중 리빌을 예약하고 싶을 때

**사용자 트리거 리빌을 선택하는 경우:**
- 사용자에게 리빌 타이밍 제어권을 주고 싶을 때
- 대화형 커뮤니티 참여를 만들고 싶을 때
- 리빌 UI/UX를 위한 리소스가 있을 때
- 사용자에게 선택권을 주면서 기대감을 조성하고 싶을 때

세 가지 전략 모두 동일한 보안 이점을 제공합니다 - 주요 차이점은 사용자 경험, 구현 복잡성, 커뮤니티 참여 접근법입니다.

##### 구현 참조

실제 자산 업데이트 구현의 경우 UMI를 사용하여 자산 메타데이터, 이름, URI를 업데이트하는 방법을 다루는 [코어 자산 업데이트 문서](/ko/smart-contracts/core/update)를 참조하세요.

리빌 프로세스는 보안 매핑을 사용하여 어떤 최종 메타데이터 URI가 각 민팅된 자산에 해당하는지 결정한 다음 코어의 업데이트 기능을 사용하여 자산을 업데이트합니다.

##### 리빌 후 검증

리빌이 완료된 후, 커뮤니티가 프로세스의 공정성을 확인할 수 있도록 완전한 매핑을 발표하세요:

```typescript
// 리빌 후 완전한 매핑 발표
const fullMappingData = {
  projectName: "프로젝트 이름",
  totalSupply: 4000,
  revealDate: "2024-01-20T15:30:00Z",
  mapping: secureMapping.map((finalIndex, mintIndex) => ({
    mintIndex,
    finalIndex,
    transactionId: uploadedUris[finalIndex].split('/').pop(),
    metadataUri: uploadedUris[finalIndex]
  })),
  masterHash: masterHash, // 사전 런칭 검증에서
  verificationInstructions: "아래 검증 함수를 사용하여 자산을 확인하세요"
};

// IPFS, 웹사이트, 커뮤니티 채널에 발표
await publishMapping(fullMappingData);
```

**커뮤니티를 위한 검증 함수:**
```typescript
// 사용자가 자산을 확인하기 위해 실행할 수 있는 검증 함수
function verifyAssetMapping(
  mintIndex: number,
  finalIndex: number,
  receivedMetadata: string,
  publishedHashes: string[]
): boolean {
  // 1. 받은 메타데이터 해시
  const metadataHash = crypto
    .createHash('sha256')
    .update(receivedMetadata)
    .digest('hex');

  // 2. 발표된 해시와 확인
  const expectedHash = publishedHashes[finalIndex];

  // 3. 매핑이 올바른지 확인
  return metadataHash === expectedHash;
}

// 사용자를 위한 사용 예시
const isValid = verifyAssetMapping(
  0, // 민트 인덱스
  2847, // 리빌된 최종 인덱스
  theirMetadataJson, // 받은 메타데이터
  publishedMetadataHashes // 민팅 전 발표된 해시
);

console.log(`자산 검증: ${isValid ? '유효' : '유효하지 않음'}`);
```

## 추가 보안 고려사항

#### 속도 제한 및 모니터링

```typescript
// 지갑당 속도 제한 구현
const mintAttempts = new Map<string, number>();

function checkRateLimit(wallet: string): boolean {
  const attempts = mintAttempts.get(wallet) || 0;
  return attempts < MAX_ATTEMPTS_PER_HOUR;
}

// 의심스러운 패턴 모니터링
function detectSuspiciousActivity(requests: MintRequest[]): boolean {
  // 동일한 타이밍 패턴 확인
  // 여러 지갑에서 연속적인 요청 탐지
  // 동일한 메타데이터를 가진 요청 플래그
  return false; // 탐지 로직 구현
}
```

#### 인프라 보호

- 메타데이터 엔드포인트에 **CDN 보호 사용**
- 모든 민트 요청에 **CAPTCHA 구현** (hCaptcha, reCAPTCHA)
- 백엔드 서비스에 **DDoS 보호 설정**
- 비정상적인 활동에 대한 **트랜잭션 패턴 모니터링**
- 고트래픽 이벤트를 위한 **백업 인프라 준비**
- 모든 민감한 키와 엔드포인트에 **환경 변수 사용**
- API 엔드포인트에 **적절한 CORS 정책 구현**

#### 플랫폼별 보안 팁

**Next.js 보안:**
```typescript
// express-rate-limit으로 속도 제한 구현
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 각 IP를 windowMs당 5개 요청으로 제한
});

// API 라우트에 미들웨어 사용
export default limiter(handler);
```

**서버리스 보안:**
- **AWS Lambda**: 하드코딩된 자격 증명이 아닌 IAM 역할 사용
- **Vercel**: 환경 변수와 엣지 설정 사용
- **Cloudflare Workers**: 속도 제한을 위한 KV 저장소 활용

{% callout type="warning" %}
**기억하세요**: 단일 보안 조치는 완벽하지 않습니다. 이러한 모든 전략의 조합이 커뮤니티에게 공정한 경험을 유지하면서 자동화된 악용에 대한 강력한 방어를 만듭니다.
{% /callout %}

## 완전한 프로세스 요약

완전한 봇 방지 보호 워크플로우를 순서대로 정리하면:

1. **📁 메타데이터 준비**: 실제 메타데이터 파일 생성 및 트랜잭션 ID URI를 위한 선택된 서비스를 통한 업로드 + 플레이스홀더 메타데이터 생성
2. **🎯 매핑 생성**: 민트 인덱스를 최종 메타데이터 인덱스에 연결하는 보안 무작위 매핑 생성
3. **🔒 검증 설정**: 매핑을 공개하지 않고 공정성을 증명하는 해시 생성 및 발표
4. **⚙️ 캔디 머신 설정**: 구성 라인에서 플레이스홀더 메타데이터로 배포
5. **🛡️ 백엔드 보호**: 필수 제3자 서명자 및 봇 택스 가드와 함께 백엔드를 통한 모든 민팅 제어
6. **🎭 리빌 프로세스**: 보안 매핑을 사용하여 모든 자산을 플레이스홀더에서 실제 메타데이터로 업데이트
7. **✅ 커뮤니티 검증**: 완전한 매핑을 발표하고 사용자가 자산을 확인할 수 있는 도구 제공

## 결론

포괄적인 봇 방지 보호 구현은 민팅 인프라의 여러 계층에서 신중한 계획과 실행이 필요합니다. 이 가이드에서 설명하는 시간 순 접근법은 각 단계가 이전 단계를 기반으로 하여 강력한 방어 시스템을 만들도록 보장합니다.

**핵심 성공 요인:**
- **준비가 전부**: 런칭 전에 매핑과 검증 해시를 생성
- **백엔드 제어가 중요**: 클라이언트가 자체 민트 트랜잭션을 생성하도록 허용하지 마세요
- **투명성이 신뢰 구축**: 민팅 전 검증 데이터와 리빌 후 완전한 매핑 발표
- **철저한 테스트**: 메인넷 런칭 전에 데브넷에서 전체 플로우 검증

이 구조화된 접근법을 따름으로써 합법적인 커뮤니티 구성원에게는 완전한 투명성과 공정성을 유지하면서 자동화된 시스템이 민팅을 조작하는 것을 극도로 어렵게 만드는 여러 보호 계층을 만들 수 있습니다.

결연한 공격자들은 항상 약점을 찾으려 할 것이므로, 새로운 공격 벡터에 대한 정보를 유지하고 방어를 지속적으로 개선하는 것이 장기적인 성공에 필수적임을 기억하세요.
