---
title: Oracle 외부 플러그인을 사용한 미국 시장 거래 경험 생성
metaTitle: Oracle 외부 플러그인을 사용한 미국 시장 거래 경험 생성 | Core 가이드
description: 이 가이드에서는 미국 시장 영업 시간 동안 Core Collection 거래 및 판매를 제한하는 방법을 보여줍니다.
updated: '01-31-2026'
keywords:
  - Oracle plugin
  - trading restrictions
  - market hours
  - transfer validation
about:
  - Oracle implementation
  - Trading restrictions
  - Time-based rules
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - JavaScript
howToSteps:
  - Initialize Oracle과 Crank Oracle 명령어가 있는 Solana 프로그램 생성
  - Oracle 프로그램 배포 후 Oracle 계정 초기화
  - Oracle 계정을 가리키는 Oracle 플러그인이 있는 Collection 생성
  - 시장 영업 시간에 따라 Oracle 상태를 업데이트하는 cron 작업 설정
howToTools:
  - Anchor 프레임워크
  - mpl-core SDK
  - Solana CLI
  - Cron 스케줄러
---
이 개발자 가이드에서는 새로운 Oracle 플러그인을 활용하여 **미국 시장 영업 시간 동안에만 거래할 수 있는 NFT 컬렉션을 만듭니다**.
## 소개
### 외부 플러그인
**외부 플러그인**은 동작이 *외부* 소스에 의해 제어되는 플러그인입니다. core 프로그램은 이러한 플러그인에 대한 어댑터를 제공하지만 개발자는 이 어댑터를 외부 데이터 소스로 지정하여 동작을 결정합니다.
각 외부 어댑터는 라이프사이클 이벤트에 라이프사이클 검사를 할당하는 기능이 있어 발생하는 라이프사이클 이벤트의 동작에 영향을 줍니다. 이는 create, transfer, update, burn과 같은 라이프사이클 이벤트에 다음 검사를 할당할 수 있음을 의미합니다:
- **Listen**: 라이프사이클 이벤트가 발생할 때 플러그인에 알리는 "web3" 웹훅. 데이터 추적이나 작업 수행에 특히 유용합니다.
- **Reject**: 플러그인이 라이프사이클 이벤트를 거부할 수 있습니다.
- **Approve**: 플러그인이 라이프사이클 이벤트를 승인할 수 있습니다.
외부 플러그인에 대해 더 알아보려면 [여기](/smart-contracts/core/external-plugins/overview)에서 자세히 읽어보세요.
### Oracle 플러그인
**Oracle 플러그인**은 외부 플러그인의 기능을 활용하여 외부 authority가 업데이트할 수 있는 데이터를 저장합니다. Core 에셋 외부의 **온체인 데이터** 계정에 액세스하여 에셋 authority가 설정한 라이프사이클 이벤트를 동적으로 거부할 수 있습니다. 외부 Oracle 계정은 라이프사이클 이벤트의 인가 동작을 변경하기 위해 언제든지 업데이트할 수 있어 유연하고 동적인 경험을 제공합니다.
Oracle 플러그인에 대해 더 알아보려면 [여기](/smart-contracts/core/external-plugins/oracle)에서 자세히 읽어보세요.
## 시작하기: 아이디어 뒤의 프로토콜 이해
미국 시장 영업 시간 동안에만 거래할 수 있는 NFT 컬렉션을 만들려면 시간에 따라 온체인 데이터를 업데이트하는 신뢰할 수 있는 방법이 필요합니다. 프로토콜 설계는 다음과 같습니다:
### 프로그램 개요
프로그램에는 두 가지 주요 명령어(Oracle 생성용과 값 업데이트용)와 구현을 용이하게 하는 두 가지 헬퍼 함수가 있습니다.
**주요 명령어**
- **Initialize Oracle 명령어**: 이 명령어는 oracle 계정을 생성하여 컬렉션에 이 시간 제한 기능을 사용하려는 사용자가 NFT Oracle 플러그인을 이 온체인 계정 주소로 리디렉션합니다.
- **Crank Oracle 명령어**: 이 명령어는 oracle 상태 데이터를 업데이트하여 항상 정확하고 최신 데이터를 갖도록 합니다.
**헬퍼 함수**
- **isUsMarketOpen**: 미국 시장이 열려 있는지 확인합니다.
- **isWithin15mOfMarketOpenOrClose**: 현재 시간이 시장 개장 또는 마감 15분 이내인지 확인합니다.
전체 구현 세부 사항은 영문 문서의 전체 가이드를 참조하세요.
### NFT 생성
Umi를 사용하여 환경을 설정하는 것부터 시작합니다. (Umi는 Solana 프로그램용 JavaScript 클라이언트를 구축하고 사용하기 위한 모듈식 프레임워크입니다. 자세한 내용은 [여기](/umi/getting-started)를 참조하세요)
```ts
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// 사용할 지갑의 SecretKey
import wallet from "../wallet.json";
const umi = createUmi("https://api.devnet.solana.com", "finalized")
let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));
```
다음으로 `CreateCollection` 명령어를 사용하여 Oracle 플러그인을 포함하는 컬렉션을 만듭니다:
```ts
// Collection PublicKey 생성
const collection = generateSigner(umi)
console.log("Collection Address: \n", collection.publicKey.toString())
const oracleAccount = publicKey("...")
// 컬렉션 생성
const collectionTx = await createCollection(umi, {
    collection: collection,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
    plugins: [
        {
            type: "Oracle",
            resultsOffset: {
                type: 'Anchor',
            },
            baseAddress: oracleAccount,
            authority: {
                type: 'UpdateAuthority',
            },
            lifecycleChecks: {
                transfer: [CheckResult.CAN_REJECT],
            },
            baseAddressConfig: undefined,
        }
    ]
}).sendAndConfirm(umi)
// 트랜잭션에서 서명 역직렬화
let signature = base58.deserialize(collectinTx.signature)[0];
console.log(signature);
```
## 결론
축하합니다! 이제 Oracle 플러그인을 사용하여 미국 시장 영업 시간 동안에만 거래할 수 있는 NFT 컬렉션을 만들 준비가 되었습니다. Core와 Metaplex에 대해 더 알아보려면 [개발자 허브](/smart-contracts/core/getting-started)를 확인하세요.
