---
title: MPL Hybrid 404 에스크로의 구성 업데이트하기
metaTitle: MPL Hybrid 404 에스크로의 구성 업데이트하기 | MPL-Hybrid
description: MPL 404 Hybrid 에스크로 계정의 구성을 업데이트하는 방법을 학습합니다.
---

에스크로 구성은 `updateEscrowV1` 플러그인을 통해 업그레이드 가능합니다.

작업을 더 쉽게 하기 위해 `mpl-hybrid` 패키지의 `fetchEscrowV1()`을 사용하여 에스크로 계정을 가져오고 전개 연산자를 사용하여 모든 현재 필드 값을 업데이트 명령에 제공하고 변경하고자 하는 값만 조정할 수 있습니다. 변경되지 않은 원래 값들은 전개 연산자에 의해 처리됩니다.

## 에스크로 업데이트

```ts
const escrowConfigurationAddress = publicKey("11111111111111111111111111111111");

// 에스크로 구성 계정을 가져옵니다.
const escrowConfigurationData = await fetchEscrowV1(umi, escrowConfigurationAddress);

// 전개 연산자 `...`를 사용하여 `escrowConfigurationData` 필드를 객체에 전개하고
// 업데이트하려는 필드를 조정합니다.
const res = await updateEscrowV1(umi, {
    ...escrowConfigurationData,
    // 에스크로 구성 주소.
    escrow: escrowConfigurationAddress,
    authority: umi.identity,
    // 변경하고 업데이트하려는 필드를 아래에 추가합니다.
    feeAmount: 100000,
}).sendAndConfirm(umi);

```

## 업데이트 가능한 필드

`updateEscrowV1`의 arg 객체에 전달할 수 있는 업데이트 가능한 필드들입니다.

```ts
{
    name,
    uri,
    max,
    min,
    amount,
    feeAmount,
    solFeeAmount,
    path
}

```

### name

에스크로의 이름입니다.

```ts
name: "My Test Escrow"
```

### uri

메타데이터 풀의 기본 uri입니다. 이는 순차적인 목적지에서 메타데이터 json 파일들도 포함하는 정적 uri여야 합니다. 예:
```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: "https://shdw-drive.genesysgo.net/<bucket-id>/"
```

### token

MPL Hybrid 404 프로젝트에서 사용되는 토큰 민트 주소입니다.

```ts
token: publicKey("11111111111111111111111111111111")
```

### feeLocation

스왑에서 수수료를 받을 지갑 주소입니다.

```ts
feeLocation: publicKey("11111111111111111111111111111111")
```

### feeAta

토큰을 받을 지갑의 토큰 계정입니다.

```ts
feeAta: findAssociatedTokenPda(umi, {
    mint: publicKey("111111111111111111111111111111111"),
    owner: publicKey("22222222222222222222222222222222"),
  });
```

### min과 max

min과 max는 메타데이터 풀에서 사용 가능한 최소 및 최대 인덱스를 나타냅니다.

```
최저 인덱스: 0.json
...
최고 인덱스: 4999.json
```

이는 min과 max args로 변환됩니다.
```ts
min: 0,
max: 4999
```

### fees

업데이트할 수 있는 3가지 별도의 수수료가 있습니다.

```ts
// NFT를 토큰으로 스왑할 때 받을 토큰의 양.
// 이 값은 lamports 단위이며 토큰이 가진 소수점 자릿수를
// 고려해야 합니다. 토큰이 5 소수점을 가지고 있고
// 1개의 온전한 토큰을 청구하려면 feeAmount는 `100000`이 됩니다

amount: 100000,
```

```ts
// 토큰을 NFT로 스왑할 때 지불할 수수료 금액.
// 이 값은 lamports 단위이며 토큰이 가진 소수점 자릿수를
// 고려해야 합니다.
// 토큰이 5 소수점을 가지고 있고 1개의 온전한 토큰을
// 청구하려면 feeAmount는 `100000`이 됩니다

feeAmount: 100000,
```

```ts
// 토큰을 NFT로 스왑할 때 지불할 선택적 수수료.
// 이는 lamports 단위이므로 `sol()`을 사용하여
// lamports를 계산할 수 있습니다.

solFeeAmount: sol(0.5).basisPoints,
```

### path

`path` arg는 mpl-hybrid 프로그램에서 메타데이터 재롤링 기능을 활성화하거나 비활성화합니다.

```ts
// 스왑 시 메타데이터 재롤 0 = true, 1 = false
path: 0,
```
