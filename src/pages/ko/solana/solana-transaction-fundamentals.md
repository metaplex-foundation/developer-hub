---
title: Solana 트랜잭션 기초
metaTitle: Solana 트랜잭션 기초 | 트랜잭션 작동 방식
description: 구조, 서명, 전송, 확인을 포함하여 Solana 트랜잭션이 작동하는 방식을 알아봅니다. 안정적인 애플리케이션을 구축하기 위한 필수 지식입니다.
# remember to update dates also in /components/products/guides/index.js
created: '02-04-2026'
updated: '09-21-2026'
---

구조부터 확인까지 Solana 트랜잭션의 작동 방식을 이해하기 위한 종합 가이드입니다. {% .lead %}

## 학습 내용

- Solana 트랜잭션의 구성
- 트랜잭션에 서명하고 전송하는 방법
- 트랜잭션 확인과 최종성
- 버전 트랜잭션과 레거시 트랜잭션의 차이
- 일반적인 트랜잭션 오류와 그 의미

## 사전 요구 사항

- [Solana CLI 설치](/solana/solana-cli-essentials)
- [Solana 계정 이해](/solana/understanding-solana-accounts)

## 트랜잭션 구성

Solana 트랜잭션은 여러 구성 요소로 이루어집니다.

```
┌─────────────────────────────────────────────────────────────┐
│                      Transaction                             │
├─────────────────────────────────────────────────────────────┤
│  Signatures: [sig1, sig2, ...]                              │
│                                                             │
│  Message:                                                   │
│    ├── Header                                               │
│    │     ├── num_required_signatures                        │
│    │     ├── num_readonly_signed_accounts                   │
│    │     └── num_readonly_unsigned_accounts                 │
│    │                                                        │
│    ├── Account Keys: [pubkey1, pubkey2, ...]               │
│    │                                                        │
│    ├── Recent Blockhash                                     │
│    │                                                        │
│    └── Instructions: [                                      │
│          { program_id_index, accounts, data },              │
│          { program_id_index, accounts, data },              │
│        ]                                                    │
└─────────────────────────────────────────────────────────────┘
```

### 핵심 구성 요소

| 구성 요소 | 설명 |
|-----------|-------------|
| **Signatures** | 필수 서명자의 Ed25519 서명 |
| **Recent Blockhash** | 최근 블록 해시(약 60~90초 동안 유효) |
| **Instructions** | 수행할 작업 |
| **Account Keys** | 트랜잭션에 관련된 모든 계정 |

## 인스트럭션

인스트럭션은 트랜잭션에서 실제로 수행되는 작업입니다. 각 인스트럭션은 다음을 지정합니다.

- **Program ID** - 실행할 프로그램
- **Accounts** - 프로그램에 필요한 계정
- **Data** - 프로그램에 전달할 직렬화된 인수

```
Instruction:
  ├── program_id: 11111111111111111111111111111111  (System Program)
  ├── accounts:
  │     ├── sender    (signer, writable)
  │     └── recipient (not signer, writable)
  └── data: [encoded transfer amount]
```

### 여러 인스트럭션

트랜잭션은 원자적으로 실행되는 여러 인스트럭션을 포함할 수 있습니다.

```javascript
import { transactionBuilder } from '@metaplex-foundation/umi'

// All instructions succeed or all fail (atomic)
const builder = transactionBuilder()
  .add(createAccountInstruction)
  .add(initializeMintInstruction)
  .add(mintTokensInstruction)

await builder.sendAndConfirm(umi)
```

이 원자성은 강력한 특성입니다. 인스트럭션 하나라도 실패하면 전체 트랜잭션이 되돌려집니다.

## Recent Blockhash

모든 트랜잭션에는 다음 역할을 하는 **recent blockhash**가 필요합니다.
- 트랜잭션이 최근에 생성되었음을 증명합니다.
- 재생 공격을 방지합니다.
- 약 60~90초(약 150슬롯) 후 만료됩니다.

```javascript
// UMI handles blockhash automatically when sending transactions.
// To fetch it manually:
const { blockhash, lastValidBlockHeight } = await umi.rpc.getLatestBlockhash()
```

{% callout title="Blockhash 만료" type="warning" %}
blockhash가 만료되기 전에 트랜잭션이 확인되지 않으면 해당 트랜잭션은 폐기됩니다. 오래 실행되는 작업에서는 전송 전에 새로운 blockhash를 가져오세요.
{% /callout %}

## 트랜잭션 서명

트랜잭션은 `isSigner`로 표시된 모든 계정의 서명을 받아야 합니다.

```javascript
// UMI signs automatically with the identity signer when sending.
// For additional signers, pass them during the build:
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// For partial signing (multi-sig workflows), you can sign
// and serialize the transaction, then pass it to another party:
import { base64 } from '@metaplex-foundation/umi/serializers'

const serialized = umi.transactions.serialize(tx)
const encoded = base64.deserialize(serialized)[0]
// ... send encoded string to another party for additional signing ...
```

## 트랜잭션 전송

### 기본 전송

```javascript
// Send and wait for confirmation (recommended)
const result = await myBuilder.sendAndConfirm(umi)

// Or just send without waiting
const signature = await myBuilder.send(umi)
```

### 옵션을 사용한 전송

```javascript
const result = await myBuilder.sendAndConfirm(umi, {
  send: { skipPreflight: false },
  confirm: { commitment: 'confirmed' },
})
```

## 트랜잭션 확인

Solana에는 트랜잭션 최종성을 나타내는 여러 **commitment 레벨**이 있습니다.

| Commitment | 설명 | 사용 사례 |
|------------|-------------|----------|
| `processed` | 리더가 트랜잭션을 수신함 | 실시간 업데이트 |
| `confirmed` | 초다수의 투표를 받음 | 대부분의 애플리케이션 |
| `finalized` | 31개 이상의 블록 깊이로 되돌릴 수 없음 | 금융 작업 |

### 확인 상태 조회

```javascript
// sendAndConfirm waits for confirmation automatically.
// To check a signature status manually:
const result = await umi.rpc.getSignatureStatuses([signature])
```

### 실제 commitment 사용

```javascript
// For most operations, 'confirmed' is the right default
const result = await myBuilder.sendAndConfirm(umi, {
  confirm: { commitment: 'confirmed' },
})

// For financial operations where you need full finality
const result = await myBuilder.sendAndConfirm(umi, {
  confirm: { commitment: 'finalized' },
})
```

## 버전 트랜잭션

Solana는 세 가지 트랜잭션 형식을 지원합니다.

### 레거시 트랜잭션

레거시 트랜잭션은 Address Lookup Tables가 없는 Solana의 원래 트랜잭션 형식을 사용합니다.

- 원래 형식
- 계정 35개로 제한
- 더 단순한 구조

### V0 트랜잭션

V0 트랜잭션은 더 많은 계정이 필요한 트랜잭션을 위해 Address Lookup Table 지원을 추가합니다.

- **Address Lookup Tables**(ALT) 지원
- 최대 256개 계정 참조 가능
- 복잡한 DeFi 작업에 필요

### V1 트랜잭션

V1 트랜잭션은 트랜잭션 크기 제한을 늘리고 컴퓨트 구성을 메시지에 저장합니다.

- 최대 4,096바이트의 트랜잭션 지원
- 컴퓨트 예산 구성을 트랜잭션 메시지에 저장
- Address Lookup Tables를 지원하지 않음

```javascript
// Umi uses V0 transactions by default. Opt in to V1 explicitly.
const result = await myBuilder
  .useV1()
  .sendAndConfirm(umi)

// To use legacy transactions instead
const result = await myBuilder
  .useLegacyVersion()
  .sendAndConfirm(umi)

// With Address Lookup Tables
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const [lutBuilder, lut] = createLut(umi, {
  recentSlot: await umi.rpc.getSlot({ commitment: 'finalized' }),
  addresses: [addressA, addressB, addressC],
})
await lutBuilder.sendAndConfirm(umi)

// Address Lookup Tables require V0.
await myBuilder
  .useV0()
  .setAddressLookupTables([lut])
  .sendAndConfirm(umi)
```

{% callout title="트랜잭션 버전 선택" %}
- 지갑이 트랜잭션 버전 `1`을 지원하고 트랜잭션이 1,232바이트보다 클 때 V1을 사용하세요.
- 트랜잭션에 Address Lookup Table이 필요하면 V0을 사용하세요.
- 호환성을 위해 원래 형식이 필요한 경우에만 레거시 트랜잭션을 사용하세요.

Umi는 이전 버전과의 호환성을 위해 V0을 기본값으로 사용합니다. 애플리케이션 전체의 기본값을 변경하기 전에 [V0에서 V1 트랜잭션으로 마이그레이션](/dev-tools/umi/guides/migrate-to-transaction-v1)을 참조하세요.
{% /callout %}

## 트랜잭션 크기 제한

Solana 트랜잭션에는 엄격한 크기 제한이 있습니다.

| 제한 | 값 |
|-------|-------|
| 레거시 및 V0 트랜잭션 크기 | 1,232바이트 |
| V1 트랜잭션 크기 | 4,096바이트 |
| Address Lookup Tables | V0에서만 지원 |
| 최대 인스트럭션 수 | 크기에 따라 제한 |

### 크기 제한에 대처하는 방법

트랜잭션이 너무 크면 다음 방법을 사용하세요.

1. **V1 사용** - Address Lookup Table이 필요하지 않을 때 크기 제한을 4,096바이트로 늘립니다.
2. **V0에서 Address Lookup Tables 사용** - 계정 참조를 압축합니다.
3. **여러 트랜잭션으로 분할** - 순차적으로 실행합니다.
4. **인스트럭션 데이터 최적화** - 직렬화된 데이터를 최소화합니다.

## 시뮬레이션

전송 전에 트랜잭션을 시뮬레이션하여 오류를 발견하세요.

```javascript
// Build the transaction without sending
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// Simulate it
const simulation = await umi.rpc.simulateTransaction(tx, {
  commitment: 'confirmed',
})
console.log('Simulation result:', simulation)
```

시뮬레이션은 다음 작업에 도움이 됩니다.
- 수수료를 지불하기 전에 오류 발견
- 컴퓨트 유닛 추정
- 프로그램 로직 디버깅

## 일반적인 트랜잭션 오류

### "Blockhash not found"

**원인**: 확인 전에 blockhash가 만료되었습니다.

**해결 방법**:
1. 새로운 blockhash로 재시도합니다(UMI는 전송할 때마다 새로운 blockhash를 자동으로 가져옵니다).
2. 네트워크가 혼잡할 때 blockhash에 `'finalized'` commitment를 사용합니다.
3. 애플리케이션에 재시도 로직을 구현합니다.

### "Insufficient funds"

**원인**: 계정에 트랜잭션 수수료와 rent를 지불할 SOL이 충분하지 않습니다.

**해결 방법**: 수수료 지불자에게 충분한 잔액이 있는지 확인하세요.
```bash
solana balance
solana airdrop 1  # On devnet
```

### "Transaction simulation failed"

**원인**: 프로그램 로직 오류입니다.

**해결 방법**: 익스플로러에서 시뮬레이션 로그를 확인하거나([Solana 익스플로러 사용](/solana/using-solana-explorers) 참조), 트랜잭션을 전송하기 전에 시뮬레이션하여 오류 출력을 살펴보세요.

### "Account not found"

**원인**: 트랜잭션의 계정이 존재하지 않습니다.

**해결 방법**: 먼저 계정을 생성하거나 주소를 확인하세요.

### "Invalid account owner"

**원인**: 예상한 프로그램이 아닌 다른 프로그램이 계정을 소유하고 있습니다.

**해결 방법**: 계정 소유권이 호출하는 프로그램과 일치하는지 확인하세요.

## 실전 예시: 전체 흐름

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { signerIdentity, generateSigner, sol, publicKey } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

// 1. Create UMI instance
const umi = createUmi('https://api.devnet.solana.com')

// 2. Set up signer (your wallet)
const signer = generateSigner(umi)
umi.use(signerIdentity(signer))

// 3. Build and send the transaction
const result = await transferSol(umi, {
  source: umi.identity,
  destination: publicKey('RecipientAddressHere...'),
  amount: sol(1),
}).sendAndConfirm(umi)

// 4. Get the transaction signature
const signature = base58.deserialize(result.signature)[0]
console.log('Transaction confirmed:', signature)
console.log(`Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

## 다음 단계

- [컴퓨트 유닛과 우선순위 수수료](/solana/compute-units-and-priority-fees) - 트랜잭션 랜딩 최적화
- [devnet 및 testnet 사용](/solana/working-with-devnet-and-testnet) - 트랜잭션 테스트
- [트랜잭션 오류 진단](/solana/general/how-to-diagnose-solana-transaction-errors) - 실패한 트랜잭션 디버깅

## FAQ

### 트랜잭션을 확인하는 데 주어진 시간은 얼마인가요?

트랜잭션의 blockhash는 약 60~90초(약 150슬롯) 동안 유효합니다. 이 시간이 지나도록 확인되지 않으면 트랜잭션이 폐기됩니다.

### 트랜잭션을 취소할 수 있나요?

아니요. 한 번 제출된 트랜잭션은 취소할 수 없습니다. 다만 아직 확인되지 않았다면 동일한 nonce를 사용하는 새 트랜잭션을 제출하여(durable nonce 사용) 사실상 기존 트랜잭션을 "대체"할 수 있습니다.

### "processed"와 "confirmed"의 차이점은 무엇인가요?

"processed"는 검증자가 트랜잭션을 수신했다는 의미입니다. "confirmed"는 검증자 초다수(66% 이상)가 해당 트랜잭션을 포함하는 블록에 투표했다는 의미입니다. 중요한 작업에는 항상 "confirmed" 또는 "finalized"를 사용하세요.

### 시뮬레이션은 성공했는데 트랜잭션이 실패한 이유는 무엇인가요?

시뮬레이션과 실행 사이에 상태가 변경될 수 있습니다. 다른 트랜잭션이 계정을 수정했을 수 있습니다. NFT 민팅과 같은 경쟁이 치열한 상황에서 흔히 발생합니다.
