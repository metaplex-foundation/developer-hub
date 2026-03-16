---
title: Core Candy Machine 가져오기
metaTitle: Core Candy Machine 가져오기 | Core Candy Machine
description: mpl-core-candy-machine SDK를 사용하여 Solana 블록체인에서 Core Candy Machine 계정의 온체인 데이터를 가져오는 방법입니다.
keywords:
  - core candy machine
  - fetch candy machine
  - fetchCandyMachine
  - Solana blockchain
  - on-chain data
  - candy machine account
  - mpl-core-candy-machine
  - UMI SDK
  - candy machine items
  - safeFetchCandyGuard
about:
  - Fetching Core Candy Machine account data
  - Reading on-chain Candy Machine state with UMI
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## 요약

`fetchCandyMachine` 함수는 구성, 권한, 로드된 아이템을 포함한 [Core Candy Machine](/ko/smart-contracts/core-candy-machine)의 전체 온체인 계정 데이터를 가져옵니다. {% .lead %}

- 아이템 수, 민팅된 아이템, 로드된 모든 구성 라인 항목을 포함한 전체 Candy Machine 계정 상태를 반환합니다
- Candy Machine 공개 키와 `mplCoreCandyMachine` 플러그인이 구성된 [UMI](/ko/dev-tools/umi) 인스턴스만 필요합니다
- 가드 구성은 별도의 계정에 저장되며 `safeFetchCandyGuard`를 사용하여 독립적으로 가져와야 합니다

## Core Candy Machine 계정 데이터 가져오기

`fetchCandyMachine` 함수는 Solana 블록체인에서 전체 Candy Machine 계정을 읽고 모든 구성 필드, 로드된 아이템, 현재 민트 진행 상황을 포함하는 타입이 지정된 객체로 역직렬화합니다.

{% dialect-switcher title="Core Candy Machine 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCandyMachine, mplCandyMachine as mplCoreCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const mainnet = "https://api.mainnet-beta.solana.com"
const devnet = "https://api.devnet.solana.com"

const umi = createUmi(mainnet)
.use(mplCoreCandyMachine())

const candyMachineId = "11111111111111111111111111111111"

const candyMachine = await fetchCandyMachine( umi, publicKey(candyMachineId));

console.log({ candyMachine });
```

{% /dialect %}
{% /dialect-switcher %}

## 참고사항

- 반환된 객체에는 로드된 구성 라인 아이템의 전체 목록, 아이템 수, 민팅된 아이템, 모든 Candy Machine 설정이 포함됩니다.
- 가드 구성은 별도의 Candy Guard 계정에 저장됩니다. 주어진 Candy Machine에 대한 가드 설정을 가져오려면 `safeFetchCandyGuard`를 사용하세요.
- 플레이스홀더 공개 키(`11111111111111111111111111111111`)를 실제 Candy Machine 주소로 교체하세요.
- 메인넷 사용의 경우 속도 제한을 피하기 위해 공개 `api.mainnet-beta.solana.com` 엔드포인트 대신 전용 RPC 제공자를 사용하는 것이 좋습니다.

