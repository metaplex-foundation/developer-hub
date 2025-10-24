---
title: RPC와 DAS
metaTitle: Solana 블록체인의 RPC와 DAS | 가이드
description: Solana 블록체인의 RPC와 Metaplex의 DAS가 Solana에서 데이터를 저장하고 읽는 데 어떻게 도움이 되는지 알아보세요.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '04-19-2025'
---

## Solana 블록체인에서 RPC의 역할
원격 프로시저 호출(RPC)은 Solana 블록체인 인프라의 중요한 부분입니다. 이들은 사용자(또는 애플리케이션)와 블록체인 사이의 다리 역할을 하며, 상호작용과 데이터 검색을 용이하게 합니다.

#### RPC의 주요 역할
1. **네트워크 통신 촉진**:
RPC 서버는 클라이언트(사용자 또는 애플리케이션)의 요청을 처리하고 블록체인과 상호작용하여 해당 요청을 충족합니다. 이들은 외부 엔티티가 전체 노드를 실행하지 않고도 블록체인과 통신할 수 있는 표준화된 방법을 제공합니다.

2. **트랜잭션 제출**:
RPC를 통해 클라이언트는 트랜잭션을 Solana 블록체인에 제출할 수 있습니다. 사용자가 토큰 전송이나 스마트 컨트랙트 호출과 같은 블록체인에서의 작업을 수행하고자 할 때, 트랜잭션이 RPC 서버로 전송되고, 이후 네트워크로 전파되어 처리되고 블록에 포함됩니다.

3. **블록체인 데이터 검색**:
RPC 서버를 통해 클라이언트는 다음과 같은 다양한 유형의 데이터를 블록체인에 요청할 수 있습니다:
- **계정 정보**: 잔액, 토큰 보유량 및 기타 메타데이터와 같은 특정 계정에 대한 세부정보.
- **트랜잭션 기록**: 계정 또는 특정 트랜잭션 서명과 관련된 과거 트랜잭션.
- **블록 정보**: 블록 높이, 블록 해시, 블록에 포함된 트랜잭션을 포함한 특정 블록의 세부정보.
- **프로그램 로그**: 실행된 프로그램(스마트 컨트랙트)의 로그 및 출력에 대한 액세스.

4. **네트워크 상태 모니터링**:
RPC는 다음과 같은 네트워크와 노드의 상태를 확인하기 위한 엔드포인트를 제공합니다:
- **노드 상태**: 노드가 온라인 상태이며 올바르게 작동하는지 확인.
- **네트워크 지연시간**: 요청이 처리되고 응답을 받는 데 걸리는 시간 측정.
- **동기화 상태**: 노드가 나머지 네트워크와 동기화되어 있는지 확인.

5. **개발 및 디버깅 지원**:
RPC 엔드포인트는 Solana에서 구축하는 개발자에게 필수적인 도구입니다. 이들은 다음과 같은 기능을 제공합니다:
- **트랜잭션 시뮬레이션**: 트랜잭션을 네트워크에 제출하기 전에 시뮬레이션하여 잠재적인 효과를 확인.
- **프로그램 계정 가져오기**: 특정 프로그램과 관련된 모든 계정을 검색하여 프로그램 상태 관리에 유용.
- **로그 가져오기**: 트랜잭션과 프로그램의 상세한 로그를 통해 애플리케이션을 디버그하고 최적화.

### RPC 엔드포인트 예제
다음은 일반적인 RPC 엔드포인트와 그 기능들입니다:
- **getBalance**: 지정된 계정의 잔액을 검색합니다.
- **sendTransaction**: 트랜잭션을 네트워크에 제출합니다.
- **getTransaction**: 서명을 사용하여 특정 트랜잭션에 대한 세부정보를 가져옵니다.
- **getBlock**: 슬롯 번호별로 특정 블록에 대한 정보를 검색합니다.
- **simulateTransaction**: 체인에서 실행하지 않고 트랜잭션을 시뮬레이션하여 결과를 예측합니다.

### 사용 예제
다음은 JavaScript를 사용하여 Solana의 RPC 엔드포인트와 상호작용하는 간단한 예제입니다:

```javascript
const solanaWeb3 = require('@solana/web3.js');

// Solana 클러스터에 연결
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

// 계정 잔액 가져오기
async function getBalance(publicKey) {
  const balance = await connection.getBalance(publicKey);
  console.log(`Balance: ${balance} lamports`);
}

// 트랜잭션 전송
async function sendTransaction(transaction, payer) {
  const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log(`Transaction signature: ${signature}`);
}

// 예제 공개 키 (실제 Solana 주소 형식)
const publicKey = new solanaWeb3.PublicKey('7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp');

// 잔액 가져오기
getBalance(publicKey);
```

## Metaplex DAS

Metaplex DAS(Digital Asset Standard)는 Solana 블록체인에서 NFT와 토큰의 읽기 레이어를 표준화하도록 설계된 프로토콜 또는 프레임워크로, 개발자가 다양한 표준과 레이아웃의 디지털 자산을 가져올 때 코드를 표준화할 수 있게 해줍니다.

### 디지털 자산 인덱싱
모든 디지털 자산(NFT와 토큰)을 인덱싱함으로써, 사용자는 정보가 블록체인에서 직접 가져오는 것이 아닌 최적화된 데이터베이스에 저장되므로 이러한 자산에 대한 훨씬 빠른 데이터 읽기에 액세스할 수 있습니다.

### 동기화
DAS는 블록체인에 전송되는 특정 생명주기 지시사항 중에 데이터 재인덱싱을 동기화할 수 있는 능력을 가지고 있습니다. 생성, 업데이트, 소각 및 전송과 같은 이러한 지시사항을 감시함으로써, DAS 인덱싱된 데이터가 항상 최신 상태임을 보장할 수 있습니다.

현재 Core, Token Metadata, Bubblegum이 모두 DAS에 의해 인덱싱됩니다.

Metaplex DAS에 대해 더 알아보려면 다음 페이지를 방문하세요:

- [Metaplex DAS API](/das-api)
- [Metaplex DAS API Github](https://github.com/metaplex-foundation/digital-asset-standard-api)
- [Metaplex Digital Asset RPC Infrastructure Github](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)

## RPC와 DAS 통합

RPC와 DAS는 Solana 생태계에서 서로를 보완합니다. 표준 RPC가 온체인 데이터에 대한 직접 액세스를 제공하는 반면, Metaplex DAS는 디지털 자산을 위해 특별히 최적화된 인덱싱된 레이어를 제공합니다. 두 서비스를 적절히 활용함으로써, 개발자는 RPC를 통해 일반적인 블록체인 데이터를 검색하고 DAS를 통해 디지털 자산 정보에 액세스하는 더 효율적인 애플리케이션을 구축할 수 있으며, 이는 더 나은 성능과 사용자 경험을 제공합니다.