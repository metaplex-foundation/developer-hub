---
title: 에스크로 초기화
metaTitle: 에스크로 초기화 | MPL-Hybrid
description: MPL-Hybrid 에스크로 초기화
---

## MPL-Hybrid 에스크로

에스크로 초기화는 NFT 컬렉션과 대체 가능한 토큰을 연결하는 필수 단계입니다. 이 단계를 시작하기 전에 Core 컬렉션 주소, 대체 가능한 토큰 민트 주소, 숫자로 명명된 순차적 파일을 사용하는 오프체인 메타데이터 URI 범위를 준비해야 합니다. Base URI 문자열 일관성의 필요성으로 인해 일부 오프체인 메타데이터 옵션이 제한됩니다. 에스크로의 권한은 메타데이터 업데이트를 수행하기 위해 컬렉션의 권한과 일치해야 합니다. 또한 에스크로가 자금을 지원받기 때문에 토큰 권한이 될 필요가 없어 컬렉션이 기존 밈코인이나 다른 대체 가능한 자산으로 뒷받침될 수 있습니다.

## MPL-Hybrid 에스크로 계정 구조

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

## MPL-404 스마트 에스크로 초기화

```ts
import fs from 'fs'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import {
  mplHybrid,
  MPL_HYBRID_PROGRAM_ID,
  initEscrowV1,
} from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  string,
  publicKey as publicKeySerializer,
} from '@metaplex-foundation/umi/serializers'
import {
  findAssociatedTokenPda,
  SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@metaplex-foundation/mpl-toolbox'

const RPC = '<INSERT RPC>'
const umi = createUmi(RPC)

// THIS IS USING A LOCAL KEYPAIR
const parsed_wallet = JSON.parse(fs.readFileSync('<PATH TO KEYPAIR>', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(parsed_wallet)
)

umi.use(keypairIdentity(kp_wallet))
umi.use(mplHybrid())
umi.use(mplTokenMetadata())

const ESCROW_NAME = '<INSERT ESCROW NAME>'
const COLLECTION = publicKey('<INSERT COLLECTION ACCOUNT/NFT ADDRESS>')
const TOKEN = publicKey('<INSERT TOKEN ADDRESS>') // THE TOKEN TO BE DISPENSED

// METADATA POOL INFO
// EX. BASE_URI: https://shdw-drive.genesysgo.net/EjNJ6MKKn3mkVbWJL2NhJTyxne6KKZDTg6EGUtJCnNY3/
const BASE_URI = '<INSERT BASE_URI>' // required to support metadata updating on swap

// MIN & MAX DEFINE THE RANGE OF URI METADATA TO PICK BETWEEN
const MIN = 0 // I.E. https://shdw-drive.genesysgo.net/.../0.json
const MAX = 9999 // I.E. https://shdw-drive.genesysgo.net/.../9999.json

// FEE INFO
const FEE_WALLET = publicKey('<INSERT FEE WALLET>')
const FEE_ATA = findAssociatedTokenPda(umi, { mint: TOKEN, owner: FEE_WALLET })

const TOKEN_SWAP_BASE_AMOUNT = 1 // USERS RECEIVE THIS AMOUNT WHEN SWAPPING TO FUNGIBLE TOKENS
const TOKEN_SWAP_FEE_AMOUNT = 1 // USERS PAY THIS ADDITIONAL AMOUNT WHEN SWAPPING TO NFTS
const TOKEN_SWAP_FEE_DECIMALS = 9 // NUMBER OF DECIMALS IN YOUR TOKEN. DEFAULT ON TOKEN CREATION IS 9.
const SOL_SWAP_FEE_AMOUNT = 0 // OPTIONAL ADDITIONAL SOLANA FEE TO PAY WHEN SWAPPING TO NFTS

// CURRENT PATH OPTIONS:
// 0-- NFT METADATA IS UPDATED ON SWAP
// 1-- NFT METADATA IS NOT UPDATED ON SWAP
const PATH = 0

const ESCROW = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(COLLECTION),
])

const addZeros = (num: number, numZeros: number) => {
  return num * Math.pow(10, numZeros)
}

const escrowData = {
  escrow: ESCROW,
  collection: COLLECTION,
  token: TOKEN,
  feeLocation: FEE_WALLET,
  name: ESCROW_NAME,
  uri: BASE_URI,
  max: MAX,
  min: MIN,
  amount: addZeros(TOKEN_SWAP_BASE_AMOUNT, TOKEN_SWAP_FEE_DECIMALS),
  feeAmount: addZeros(TOKEN_SWAP_FEE_AMOUNT, TOKEN_SWAP_FEE_DECIMALS),
  solFeeAmount: addZeros(SOL_SWAP_FEE_AMOUNT, 9), // SOL HAS 9 DECIMAL PLACES
  path: PATH,
  feeAta: FEE_ATA,
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}

const initTx = await initEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(initTx.signature))
```

## 에스크로 자금 지원

스마트 스왑이 활성화되기 전의 다음 단계는 에스크로에 자금을 지원하는 것입니다. 일반적으로 프로젝트가 에스크로가 항상 자금을 지원받도록 하려는 경우, 모든 NFT 또는 토큰을 출시한 다음 다른 모든 자산을 에스크로에 배치하는 것으로 시작합니다. 이렇게 하면 모든 유통 자산이 에스크로의 카운터 자산으로 "뒷받침"됩니다. 에스크로는 PDA이기 때문에 지갑을 통한 로딩은 널리 지원되지 않습니다. 아래 코드를 사용하여 에스크로로 자산을 전송할 수 있습니다.

```ts
import { transferV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { keypairIdentity, publicKey, createSignerFromKeypair } from '@metaplex-foundation/umi'

... (SEE ABOVE CODE)

// THIS IS USING A LOCAL KEYPAIR
const parsed_wallet = JSON.parse(fs.readFileSync('< PATH TO KEYPAIR >', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(parsed_wallet))
const token_owner = createSignerFromKeypair(umi, kp_wallet)

const TOKEN_TRANSFER_AMOUNT = 10000
const TOKEN_DECIMALS = 9

const transferData = {
  mint: TOKEN,
  amount: addZeros(TOKEN_TRANSFER_AMOUNT, TOKEN_DECIMALS),
  authority: token_owner,
  tokenOwner: kp_wallet.publicKey,
  destinationOwner: ESCROW,
  tokenStandard: TokenStandard.NonFungible,
}

const transferIx = await transferV1(umi, transferData).sendAndConfirm(umi)

console.log(bs58.encode(transferIx.signature))

```

## 에스크로 업데이트

에스크로 업데이트는 본질적으로 초기화와 동일한 코드이지만 initEscrow 함수 대신 updateEscrow 함수를 사용하므로 쉽습니다.

```ts
import { mplHybrid, updateEscrowV1 } from '@metaplex-foundation/mpl-hybrid'

... (SEE ABOVE CODE)

const updateTx = await updateEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(updateTx.signature))
```