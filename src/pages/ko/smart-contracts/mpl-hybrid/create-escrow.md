---
title: MPL 404 하이브리드 에스크로 생성
metaTitle: MPL 404 하이브리드 에스크로 생성 | MPL-Hybrid
description: 404 스왑을 가능하게 하는 MPL 404 하이브리드 에스크로 계정을 생성하는 방법을 배우세요.
---

## 전제 조건

- MPL Core 컬렉션 - [링크](/core/guides/javascript/how-to-create-a-core-collection-with-javascript)
- 컬렉션에 민팅된 Core NFT 자산 - [링크](/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)
- 필요한 토큰 수량으로 생성된 SPL 토큰 - [링크](/guides/javascript/how-to-create-a-solana-token)
- 일관된 게이트웨이/URI에서의 순차적 메타데이터 JSON 파일의 온라인 저장소.

에스크로 초기화는 NFT 컬렉션과 대체 가능한 토큰을 연결하는 필수 단계입니다. 이 단계를 시작하기 전에 Core 컬렉션 주소, 대체 가능한 토큰 민트 주소, 숫자로 명명된 순차적 파일을 사용하는 오프체인 메타데이터 URI 범위를 준비해야 합니다. Base URI 문자열 일관성의 필요성으로 인해 일부 오프체인 메타데이터 옵션이 제한됩니다. 에스크로의 권한은 메타데이터 업데이트를 수행하기 위해 컬렉션의 권한과 일치해야 합니다. 또한 에스크로가 자금을 지원받기 때문에 토큰 권한이 될 필요가 없어 컬렉션이 기존 밈코인이나 다른 대체 가능한 자산으로 뒷받침될 수 있습니다.

## MPL-Hybrid 에스크로 계정 구조

MPL Hybrid 에스크로는 프로젝트에 관한 모든 정보를 저장하는 프로그램의 핵심입니다.

{% totem %}
{% totem-accordion title="온체인 MPL-404 에스크로 데이터 구조" %}

MPL-404 에스크로의 온체인 계정 구조 [링크](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/escrow.rs)

| 이름           | 타입   | 크기 | 설명                                      |     |
| -------------- | ------ | ---- | ----------------------------------------- | --- |
| collection     | Pubkey | 32   | 컬렉션 계정                               |     |
| authority      | Pubkey | 32   | 에스크로의 권한                           |     |
| token          | Pubkey | 32   | 분배될 대체 가능한 토큰                   |     |
| fee_location   | Pubkey | 32   | 토큰 수수료를 보낼 계정                   |     |
| name           | String | 4    | NFT 이름                                  |     |
| uri            | String | 8    | NFT 메타데이터의 기본 URI                 |     |
| max            | u64    | 8    | URI에 추가할 NFT의 최대 인덱스            |     |
| min            | u64    | 8    | URI에 추가할 NFT의 최소 인덱스            |     |
| amount         | u64    | 8    | 스왑하는 토큰 비용                        |     |
| fee_amount     | u64    | 8    | NFT를 획득하기 위한 토큰 수수료           |     |
| sol_fee_amount | u64    | 8    | NFT를 획득하기 위한 솔 수수료             |     |
| count          | u64    | 8    | 총 스왑 수                                |     |
| path           | u16    | 1    | 온체인/오프체인 메타데이터 업데이트 경로  |     |
| bump           | u8     | 1    | 에스크로 범프                             |     |

{% /totem-accordion %}
{% /totem %}

## 에스크로 생성

### 인수

#### name

에스크로의 이름입니다. 이 데이터는 UI에서 에스크로의 이름을 보여주는 데 사용될 수 있습니다.

```ts
name: 'My Test Escrow'
```

#### uri

메타데이터 풀의 기본 URI입니다. 이는 순차적 목적지에 메타데이터 JSON 파일도 포함하는 정적 URI여야 합니다. 예:

```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: 'https://shdw-drive.genesysgo.net/<bucket-id>/'
```

#### escrow

에스크로 주소는 다음 두 시드 `["escrow", collectionAddress]`의 PDA입니다.

```ts
const collectionAddress = publicKey('11111111111111111111111111111111')

const escrowAddress = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(collectionAddress),
])
```

#### collection

MPL Hybrid 404 프로젝트에서 사용되는 컬렉션 주소입니다.

```ts
collection: publicKey('11111111111111111111111111111111')
```

#### token

MPL Hybrid 404 프로젝트에서 사용되는 토큰 민트 주소입니다.

```ts
token: publicKey('11111111111111111111111111111111')
```

#### feeLocation

스왑으로부터 수수료를 받을 지갑 주소입니다.

```ts
feeLocation: publicKey('11111111111111111111111111111111')
```

#### feeAta

토큰을 받을 지갑의 토큰 계정입니다.

```ts
feeAta: findAssociatedTokenPda(umi, {
  mint: publicKey('111111111111111111111111111111111'),
  owner: publicKey('22222222222222222222222222222222'),
})
```

#### min과 max

min과 max는 메타데이터 풀에서 사용 가능한 최소 및 최대 인덱스를 나타냅니다.

```
최소 인덱스: 0.json
...
최고 인덱스: 4999.json
```

이는 min과 max 인수로 변환됩니다.

```ts
min: 0,
max: 4999
```

#### 수수료

설정할 수 있는 3가지 별도의 수수료가 있습니다.

```ts
// NFT를 토큰으로 스왑할 때 받을 토큰의 양.
// 이 값은 라모포트 단위이며 토큰의 소수점 자릿수를 고려해야 합니다.
// 토큰이 5자리 소수점을 가지고 있고 1개의 완전한 토큰을 청구하려면
// feeAmount는 `100000`이 됩니다.

amount: swapToTokenValueReceived,
```

```ts
// 토큰을 NFT로 스왑할 때 지불할 수수료 금액. 이 값은
// 라모포트 단위이며 토큰의 소수점 자릿수를 고려해야 합니다.
// 토큰이 5자리 소수점을 가지고 있고 1개의 완전한 토큰을 청구하려면
// feeAmount는 `100000`이 됩니다.

feeAmount: swapToNftTokenFee,
```

```ts
// 토큰을 NFT로 스왑할 때 지불할 선택적 수수료.
// 이는 라모포트 단위이므로 `sol()`을 사용하여
// 라모포트를 계산할 수 있습니다.

solFeeAmount: sol(0.5).basisPoints,
```

#### path

`path` 인수는 mpl-hybrid 프로그램에서 메타데이터 리롤링 기능을 활성화하거나 비활성화합니다.

```ts
// 스왑 시 메타데이터 리롤 0 = true, 1 = false
path: rerollEnabled,
```

#### associatedTokenProgram

`SPL_ASSOCIATED_TOKEN_PROGRAM_ID`는 `mpl-toolbox` 패키지에서 가져올 수 있습니다.

```ts
import { SPL_ASSOCIATED_TOKEN_PROGRAM_ID } from @metaplex/mpl-toolbox
```

```ts
// Associated Token Program ID
associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
```

### 코드

```ts
const initTx = await initEscrowV1(umi, {
  // 에스크로 이름
  name: escrowName,
  // 메타데이터 풀 기본 URI
  uri: baseMetadataPoolUri,
  // "escrow" + 컬렉션 주소 시드를 기반으로 한 에스크로 주소
  escrow: escrowAddress,
  // 컬렉션 주소
  collection: collectionAddress,
  // 토큰 민트
  token: tokenMint,
  // 수수료 지갑
  feeLocation: feeWallet,
  // 수수료 토큰 계정
  feeAta: feeTokenAccount,
  // 풀에서 NFT의 최소 인덱스
  min: minAssetIndex,
  // 풀에서 NFT의 최대 인덱스
  max: maxAssetIndex,
  // 스왑할 대체 가능한 토큰의 양
  amount: swapToTokenValueReceived,
  // NFT로 스왑할 때 지불할 수수료 금액
  feeAmount: swapToNftTokenFee,
  // NFT로 스왑할 때 지불할 선택적 추가 수수료
  solFeeAmount: sol(0.5).basisPoints,
  // 스왑 시 메타데이터 리롤 0 = true, 1 = false
  path: rerollEnabled,
  // Associated Token Program ID
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}).sendAndConfirm(umi)
```