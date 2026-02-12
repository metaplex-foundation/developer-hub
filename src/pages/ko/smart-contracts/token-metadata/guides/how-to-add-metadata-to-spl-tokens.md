---
title: Solana 토큰에 메타데이터를 추가하는 방법
metaTitle: Solana 토큰에 메타데이터를 추가하는 방법 | 가이드
description: 이미 존재하는 Solana 토큰에 메타데이터를 추가하는 방법을 알아보세요.
created: '10-01-2024'
updated: '10-01-2024'
keywords:
  - SPL Token metadata
  - add metadata to Solana token
  - Token Metadata program
  - Metaplex Umi
about:
  - SPL Token metadata
  - Token Metadata program
  - Metaplex Umi
proficiencyLevel: Beginner
programmingLanguage:
  - TypeScript
howToSteps:
  - Set up a new project and install required Metaplex packages
  - Configure Umi with a signer and the Token Metadata plugin
  - Prepare off-chain token metadata with name, symbol, and URI
  - Derive the metadata PDA for your existing token mint
  - Add metadata using the createV1 helper from mpl-token-metadata
  - Confirm the transaction on a Solana explorer
howToTools:
  - Metaplex Umi
  - mpl-token-metadata
---

이 가이드는 Metaplex Token Metadata 프로토콜을 사용하여 이미 초기화된 Solana 토큰(SPL 토큰)에 메타데이터를 추가하는 과정을 안내합니다.

{% callout %}
따로 하는 대신 사용 가능한 [create helper](https://developers.metaplex.com/token-metadata/mint#create-helpers) 함수를 사용하여 토큰을 생성하고 초기화하는 것이 권장됩니다. 이를 수행하는 방법을 찾고 있다면 대신 이 가이드를 확인하세요 [`How to create a Solana Token`](https://developers.metaplex.com/guides/javascript/how-to-create-a-solana-token).

{% /callout %}

## 전제조건

- 선택한 코드 에디터 (Visual Studio Code 권장)
- Node 18.x.x 이상.

## 초기 설정

이 가이드는 메타데이터를 추가하고자 하는 SPL 토큰이 이미 초기화되어 있다고 가정합니다. 필요에 따라 함수를 수정하고 이동해야 할 수 있습니다.

## 초기화

선택한 JS/TS 패키지 매니저(npm, yarn, pnpm, bun, deno)를 사용하여 새로운 빈 프로젝트를 초기화하는 것부터 시작하세요.

```bash
npm init -y
```

### 필수 패키지

이 가이드에 필요한 패키지를 설치하세요.

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata"] type="npm" /%}

```bash
npm i @metaplex-foundation/umi
```

```bash
npm i @metaplex-foundation/umi-bundle-defaults
```

```bash
npm i @metaplex-foundation/mpl-token-metadata
```

### 임포트 및 래퍼 함수

필요한 임포트와 래퍼 함수를 나열합니다.

1. `addMetadata`

```typescript
import {
 createV1,
 findMetadataPda,
 mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, signerIdentity, sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

///
/// umi 인스턴스화
///


// 기존 SPL 토큰에 메타데이터를 추가하는 래퍼 함수
async function addMetadata() {
 ///
 ///
 ///  코드가 여기에 들어갑니다
 ///
 ///
}

// 함수 실행
addMetadata();
```

## Umi 설정

이 예시는 `generatedSigner()`로 Umi를 설정하는 과정을 다룹니다. 지갑이나 서명자를 다르게 설정하려면 [**Connecting to Umi**](/ko/dev-tools/umi/getting-started) 가이드를 확인할 수 있습니다.

코드 블록 내부나 외부에 Umi 인스턴스화 코드를 배치할 수 있지만, 코드 중복을 줄이기 위해 외부에 유지하겠습니다.

### 새 지갑 생성

```ts
const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// 새 키페어 서명자를 생성합니다.
const signer = generateSigner(umi);

// umi에게 새 서명자를 사용하도록 지시합니다.
umi.use(signerIdentity(signer));

// 신원에 2 SOL을 에어드롭합니다
// 429 too many requests 오류가 발생하면
// 제공된 기본 무료 rpc 대신 다른 rpc를 사용해야 할 수 있습니다.
await umi.rpc.airdrop(umi.identity.publicKey, sol(2));
```

### 로컬에 저장된 기존 지갑 사용

```ts
const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// fs를 사용하고 파일시스템을 탐색하여
// 상대 경로를 통해 사용하고자 하는 지갑을 로드해야 합니다.
const walletFile = fs.readFileSync('./keypair.json')

// walletFile을 키페어로 변환합니다.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// 키페어를 umi에 로드합니다.
umi.use(keypairIdentity(umiSigner));
```

## 메타데이터 추가

메타데이터를 추가하는 것도 SPL 토큰을 생성하는 것만큼 간단합니다. `mpl-token-metadata` 라이브러리의 `createV1` 헬퍼 메서드를 활용할 것입니다.

또한 이 가이드는 오프체인 토큰 메타데이터를 미리 준비했다고 가정합니다. 이름, 오프체인 uri 주소 및 심볼이 필요합니다

```json
name: "Solana Gold",
symbol: "GOLDSOL",
uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
```

```typescript
// 토큰의 샘플 메타데이터
const tokenMetadata = {
 name: "Solana Gold",
 symbol: "GOLDSOL",
 uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// 기존 SPL 토큰에 메타데이터를 추가하는 래퍼 함수
async function addMetadata() {
    const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");

    // 메타데이터 데이터를 온체인에 저장할 메타데이터 계정을 도출합니다
 const metadataAccountAddress = await findMetadataPda(umi, {
  mint: mint,
 });

   // `createV1` 헬퍼를 사용하여 이미 초기화된 토큰에 메타데이터를 추가합니다
 const tx = await createV1(umi, {
  mint,
  authority: umi.identity,
  payer: umi.identity,
  updateAuthority: umi.identity,
  name: tokenMetadata.name,
  symbol: tokenMetadata.symbol,
  uri: tokenMetadata.uri,
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  tokenStandard: TokenStandard.Fungible,
 }).sendAndConfirm(umi);

 let txSig = base58.deserialize(tx.signature);
 console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}
```

creators와 같은 null 가능한 필드는 Non Fungible에 비해 SPL 토큰에서는 필요하지 않을 수 있으므로 제외되었습니다.

민트 주소를 주의하세요. 다른 인스턴스에서 함수를 호출할 경우, `generateSigner`는 각 호출마다 새로운 키페어를 반환하므로 `findMetadataPda` 함수의 `mint` 필드 주소를 설정해야 합니다.

## 전체 코드 예시

```typescript
import {
 createV1,
 findMetadataPda,
 mplTokenMetadata,
 TokenStandard
} from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import {
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// 새 키페어 서명자를 생성합니다.
const signer = generateSigner(umi);

// umi에게 새 서명자를 사용하도록 지시합니다.
umi.use(signerIdentity(signer));

// SPL 토큰 민트 주소
const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");


// 토큰의 샘플 메타데이터
const tokenMetadata = {
 name: "Solana Gold",
 symbol: "GOLDSOL",
 uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// 기존 SPL 토큰에 메타데이터를 추가하는 래퍼 함수
async function addMetadata() {
 // 신원에 2 SOL을 에어드롭합니다
    // 429 too many requests 오류가 발생하면
    // 제공된 기본 무료 rpc 대신 다른 rpc를 사용해야 할 수 있습니다.
    await umi.rpc.airdrop(umi.identity.publicKey, sol(2));

    // 메타데이터 데이터를 온체인에 저장할 메타데이터 계정을 도출합니다
 const metadataAccountAddress = await findMetadataPda(umi, {
  mint: mint,
 });

 const tx = await createV1(umi, {
  mint,
  authority: umi.identity,
  payer: umi.identity,
  updateAuthority: umi.identity,
  name: tokenMetadata.name,
  symbol: tokenMetadata.symbol,
  uri: tokenMetadata.uri,
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  tokenStandard: TokenStandard.Fungible,
 }).sendAndConfirm(umi);

 let txSig = base58.deserialize(tx.signature);
 console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}

// 함수 실행
addMetadata();
```

## 다음 단계는?

이 가이드는 Solana 토큰에 메타데이터를 추가하는 데 도움을 주었습니다. 여기서 [Token Metadata Program](/ko/smart-contracts/token-metadata)로 이동하여 한 번에 토큰을 초기화하고 메타데이터를 추가하는 헬퍼 함수, non-fungible 작업 및 Token Metadata 프로그램과 상호작용하는 다양한 방법을 확인할 수 있습니다.
