---
title: Solana 트랜잭션 오류를 진단하는 방법
metaTitle: Solana 트랜잭션 오류를 진단하는 방법 | Metaplex Guides
description: Solana에서 트랜잭션 오류를 진단하고 이러한 오류에 대한 논리적 해결책을 찾는 방법을 알아보세요.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-21-2024'
---

## 지원 네트워크에 오류 공유하기

이해할 수 없는 오류를 받고 다른 사람에게 보여주고 싶을 때, 상황을 설명하는 것이 때로는 어려울 수 있습니다. 이는 Metaplex Umi, Solana SDK, Solana Web3js와 같은 SDK 형태를 사용하여 트랜잭션을 보낼 때 자주 발생합니다. 이러한 클라이언트들은 트랜잭션이 성공할지 여부를 확인하기 위해 RPC에 **프리플라이트 트랜잭션** 또는 시뮬레이션이라고 불리는 것을 보내는 경우가 많습니다. 트랜잭션이 실패할 것으로 판단되면 트랜잭션이 체인에 전송되지 않고 대신 오류 메시지를 던집니다. 이는 네트워크 측면에서 좋은 동작이지만, 논리적으로 도움을 받을 수 있는 것을 제공하지 않습니다. 여기서 시뮬레이션/프리플라이트를 건너뛰고 실패한 트랜잭션이 체인에 등록되도록 강제하여 다른 사람들과 공유할 수 있게 만드는 것이 중요합니다.

## 프리플라이트 건너뛰기

트랜잭션을 보내는 데 사용하는 대부분의 SDK는 트랜잭션을 보낼 때 `skipPreflight` 기능을 제공합니다. 이는 시뮬레이션과 프리플라이트를 건너뛰고 체인이 트랜잭션을 등록하도록 강제합니다. 이것이 도움이 되는 이유는 보내려고 하는 정확한 트랜잭션이 체인에 등록되고 저장되기 때문입니다. 여기에는 다음이 포함됩니다:

- 사용된 모든 계정
- 제출된 모든 지침
- 오류 메시지를 포함한 모든 로그

그러면 이 실패한 트랜잭션을 누군가에게 보내어 트랜잭션의 세부 사항을 검사하고 트랜잭션이 실패하는 이유를 진단하는 데 도움을 받을 수 있습니다.

이는 **메인넷**과 **데브넷** 모두에서 작동합니다. **로컬넷**에서도 작동하지만 더 복잡하고 세부 사항을 공유하는 것이 더 어렵습니다.

### umi

Metaplex Umi의 `skipPreflight`는 `sendAndConfirm()` 및 `send()` 함수 인수에서 찾을 수 있으며 다음과 같이 활성화할 수 있습니다:

#### sendAndConfirm()
```ts
const tx = createV1(umi, {
    ...args
}).sendAndConfirm(umi, {send: { skipPreflight: true}})

// 서명을 문자열로 변환
const signature = base58.deserialize(tx.signature);

// 트랜잭션 서명 로그
console.log(signature)
```

#### send()
```ts
const tx = createV1(umi, {
    ...args
}).send(umi, {skipPreflight: true})

// 서명을 문자열로 변환
const signature = base58.deserialize(tx);

// 트랜잭션 서명 로그
console.log(signature)
```

### web3js

```ts
// 연결 생성
const connection = new Connection("https://api.devnet.solana.com", "confirmed",);

// 트랜잭션 생성
const transaction = new VersionedTransaction()

// sendTransaction() 함수에 skipPreflight 추가
const res = await connection.sendTransaction(transaction, [...signers], {skipPreflight: true})

// 트랜잭션 서명 로그 출력
console.log(res)
```

### solana-client (rust)

```rust
// 연결 생성
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

// 트랜잭션 생성
let transaction = new Transaction()

// sendTransaction() 함수에 skipPreflight 추가
let res = rpc_client
    .send_transaction_with_config(&create_asset_tx, RpcSendTransactionConfig {
        skip_preflight: true,
        preflight_commitment: Some(CommitmentConfig::confirmed().commitment),
        encoding: None,
        max_retries: None,
        min_context_slot: None,
    })
    .await
    .unwrap();

// 트랜잭션 서명 로그 출력
println!("Signature: {:?}", res)
```

트랜잭션 ID를 로그로 출력하면 Solana 블록체인 탐색기를 방문하여 트랜잭션 ID를 검색할 수 있으며, 이는 실패한 트랜잭션을 표시합니다.

- SolanaFM
- Solscan
- Solana Explorer

그러면 이 트랜잭션 ID 또는 탐색기 링크를 도움을 줄 수 있는 누군가와 공유할 수 있습니다.

## 일반적인 오류 유형

자주 발생하는 몇 가지 일반적인 오류가 있습니다.

### 오류 코드 xx (23)

일반적으로 오류를 설명하는 추가 텍스트와 함께 제공되지만, 이러한 코드가 때때로 설명적이지 않은 방식으로 단독으로 나타날 수 있습니다. 이런 일이 발생하고 오류를 던진 프로그램을 알고 있다면, 때때로 Github에서 프로그램을 찾을 수 있으며, 프로그램의 모든 가능한 오류를 나열하는 errors.rs 페이지가 있을 것입니다.

0의 인덱스에서 시작하여 목록에서 오류의 위치를 계산/찾을 수 있습니다.

다음은 Metaplex Core 프로그램의 error.rs 페이지 예시입니다.

[https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs)

보시다시피 실패한 트랜잭션에서 20의 오류 코드를 받는다면 이는 다음과 같이 번역됩니다:

```rust
/// 20 - Missing update authority
    #[error("Missing update authority")]
    MissingUpdateAuthority,
```

### 오류 코드 6xxx (6002)

6xxx 오류 코드는 사용자 정의 프로그램 Anchor 오류 코드입니다. 위와 같이, github에서 프로그램을 찾을 수 있다면 일반적으로 프로그램의 오류와 코드를 나열하는 errors.rs 파일이 있을 것입니다. Anchor 사용자 정의 프로그램 오류 코드는 6000에서 시작하므로 목록의 첫 번째 오류는 6000, 두 번째는 6001 등이 됩니다. 이론적으로 오류 코드의 마지막 자릿수를 가져와서, 6026의 경우 26이며 인덱스 0에서 시작하여 이전과 같이 오류를 찾을 수 있습니다.

Mpl Core Candy Machine 프로그램을 예로 들면, 이는 Anchor 프로그램이므로 오류 코드가 6xxx에서 시작됩니다.

[https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs](https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs)

트랜잭션이 `6006` 오류를 반환하는 경우 숫자의 끝, 이 경우 `6`을 가져와서 인덱스 0부터 시작하여 error.rs 목록을 찾을 수 있습니다.

```rust
#[msg("Candy machine is empty")]
CandyMachineEmpty,
```

### 16진수 오류

드문 경우에 `0x1e`와 같은 16진수 형식으로 오류가 반환될 수 있습니다.

이 경우 [16진수를 10진수 변환기](https://www.rapidtables.com/convert/number/hex-to-decimal.html)를 사용하여 오류를 우리가 사용할 수 있는 형식으로 올바르게 포맷할 수 있습니다.

- 오류가 xx 형식인 경우 [오류 코드 xx](#error-codes-xx-23)를 참조하세요
- 오류가 6xxx 형식인 경우 [오류 코드 6xxx](#error-codes-6xxx-6002)를 참조하세요

### 잘못된 소유자

이 오류는 일반적으로 계정 목록에 전달된 계정이 예상된 프로그램에 의해 소유되지 않아 실패한다는 것을 의미합니다. 예를 들어 Token Metadata Account는 Token Metadata Program에 의해 소유되어야 하며, 트랜잭션 계정 목록의 특정 위치에 있는 계정이 해당 기준을 충족하지 않으면 트랜잭션이 실패합니다.

이러한 유형의 오류는 PDA가 잘못된 시드로 생성되거나 계정이 아직 초기화/생성되지 않았을 때 자주 발생합니다.

### Assert 오류

Assert 오류는 일치 오류입니다. Assert는 일반적으로 2개의 변수(대부분의 경우 주소/공개키)를 가져와서 동일한 예상 값인지 확인합니다. 그렇지 않으면 두 값이 예상대로 일치하지 않는다는 세부 사항과 함께 `Assert left='value' right='value'` 오류가 던져집니다.

### 0x1 차변 시도

이는 `Attempt to debit an account but found no record of a prior credit`라고 읽히는 일반적인 오류입니다. 이 오류는 기본적으로 계정 내에 SOL이 없다는 것을 의미합니다.
