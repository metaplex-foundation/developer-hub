---
title: 토큰 관리
metaTitle: 토큰 관리 | Toolbox
description: Umi로 토큰을 관리하는 방법.
---

다음 인스트럭션들은 Token Program, Associated Token Program, MPL Token Extras Program의 일부입니다. Token Program과 Associated Token 프로그램은 Mint 계정, Token 계정, Associated Token PDA 생성, 토큰 민팅, 토큰 전송, 토큰 위임 등을 가능하게 하므로 Solana에서 토큰을 관리하는 데 필수적입니다. 이러한 프로그램에 대한 자세한 내용은 [Solana의 공식 문서](https://spl.solana.com/token)에서 확인할 수 있습니다.

## 민트 생성

이 인스트럭션을 사용하면 새로운 Mint 계정을 생성할 수 있습니다.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createMint } from '@metaplex-foundation/mpl-toolbox'

const mint = generateSigner(umi)

await createMint(umi, {
  mint,
  decimals: 0,
  mintAuthority,
  freezeAuthority,
}).sendAndConfirm(umi)
```

## 토큰 계정 생성

이 인스트럭션은 특정 소유자를 위해 특정 민트의 토큰을 보유하는 데 사용되는 새로운 토큰 계정을 생성합니다.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createToken } from '@metaplex-foundation/mpl-toolbox'

const token = generateSigner(umi)

await createToken(umi, { token, mint, owner }).sendAndConfirm(umi)
```

## Associated Token 계정 생성

이 인스트럭션은 소유자와 민트의 공개 키에서 파생된 결정론적 토큰 계정인 Associated Token 계정을 생성합니다.

```ts
import { createAssociatedToken } from '@metaplex-foundation/mpl-toolbox'

await createAssociatedToken(umi, { mint, owner }).sendAndConfirm(umi)
```

## 토큰 민팅

이 인스트럭션을 사용하면 지정된 토큰 계정에 새로운 토큰을 민팅할 수 있습니다.

```ts
import { mintTokensTo } from '@metaplex-foundation/mpl-toolbox'

await mintTokensTo(umi, {
  mintAuthority,
  mint,
  token,
  amount: 42,
}).sendAndConfirm(umi)
```

## Associated Token 계정이 포함된 민트 생성

이 헬퍼는 주어진 민트와 소유자를 위해 민트 계정과 Associated Token 계정을 생성합니다. 0보다 큰 양이 제공되면 해당 계정에 토큰도 민팅합니다.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createMintWithAssociatedToken } from '@metaplex-foundation/mpl-toolbox'

const mint = generateSigner(umi)

await createMintWithAssociatedToken(umi, {
  mint,
  owner,
  amount: 1,
}).sendAndConfirm(umi)
```

## 토큰 전송

이 인스트럭션을 사용하면 한 토큰 계정에서 다른 토큰 계정으로 토큰을 전송할 수 있습니다.

```ts
import { transferTokens } from '@metaplex-foundation/mpl-toolbox'

await transferTokens(umi, {
  source: sourceTokenAccount,
  destination: destinationTokenAccount,
  authority: ownerOrDelegate,
  amount: 30,
}).sendAndConfirm(umi)
```

## 권한 설정

이 인스트럭션을 사용하면 토큰 또는 민트 계정의 권한을 변경할 수 있습니다.

```ts
import { setAuthority, AuthorityType } from '@metaplex-foundation/mpl-toolbox'

await setAuthority(umi, {
  owned: tokenAccount,
  owner,
  authorityType: AuthorityType.CloseAccount,
  newAuthority: newCloseAuthority.publicKey,
}).sendAndConfirm(umi)
```

## 민트 및 토큰 계정 가져오기

이러한 함수들을 사용하면 민트 및 토큰 계정에 대한 정보를 가져올 수 있습니다.

```ts
import {
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  fetchAllTokenByOwner,
  fetchAllMintByOwner,
  fetchAllMintPublicKeyByOwner,
} from '@metaplex-foundation/mpl-toolbox'

// 민트 계정 가져오기
const mintAccount = await fetchMint(umi, mint)

// 토큰 계정 가져오기
const tokenAccount = await fetchToken(umi, token)

// Associated Token 계정 가져오기
const [associatedToken] = findAssociatedTokenPda(umi, { owner, mint })
const associatedTokenAccount = await fetchToken(umi, associatedToken)

// 소유자별로 가져오기
const tokensFromOwner = await fetchAllTokenByOwner(umi, owner)
const mintsFromOwner = await fetchAllMintByOwner(umi, owner)
const mintKeysFromOwner = await fetchAllMintPublicKeyByOwner(umi, owner)
```

## 누락된 경우 토큰 생성

이 인스트럭션은 토큰 계정이 아직 존재하지 않는 경우에만 새로운 토큰 계정을 생성합니다. 후속 인스트럭션에서 토큰 계정이 필요하지만 이미 존재하는지 확실하지 않을 때 특히 유용합니다. 이 인스트럭션은 클라이언트 측에서 가져올 필요 없이 토큰 계정의 존재를 보장합니다.

작동 방식:
- 계정이 존재하면 인스트럭션이 성공하고 아무것도 하지 않습니다.
- 계정이 존재하지 않으면 인스트럭션이 성공하고 associated token 계정을 생성합니다.

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { createTokenIfMissing } from '@metaplex-foundation/mpl-toolbox'

// 토큰 계정이 associated token 계정인 경우
await transactionBuilder()
  .add(createTokenIfMissing(umi, { mint, owner }))
  .add(...) // 후속 인스트럭션들은 Associated Token 계정이 존재한다고 확신할 수 있습니다.
  .sendAndConfirm(umi)
```
