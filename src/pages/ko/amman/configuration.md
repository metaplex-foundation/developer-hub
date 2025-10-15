---
title: 구성
metaTitle: 구성 | Amman
description: Amman 로컬 검증자 도구 키트 구성하기.
---

실행할 때 Amman은 프로젝트 루트에서 구성 파일 `.ammanrc.js`를 찾습니다. 이 파일이 없으면 Amman은 기본 구성으로 로드됩니다.

구성은 아래 속성 중 하나와 함께 'validator'를 내보내는 JavaScript 모듈이어야 합니다:

- **killRunningValidators**: true이면 시스템에서 현재 실행 중인 모든 solana-test-validators를 종료합니다.
- **programs**: 테스트 검증자에 로드되어야 하는 bpf 프로그램
- **accountsCluster**: 원격 계정을 복제할 기본 클러스터
- **accounts**: 테스트 검증자에 로드할 원격 계정 배열
- **jsonRpcUrl**: 테스트 검증자가 JSON RPC 요청을 수신할 URL
- **websocketUrl**: RPC 웹소켓용
- **ledgerDir**: solana 테스트 검증자가 원장을 쓰는 위치
- **resetLedger**: true이면 시작 시 원장이 제네시스로 재설정됩니다.
- **verifyFees**: true이면 트랜잭션 수수료를 청구할 때까지 검증자가 완전히 시작된 것으로 간주되지 않습니다.

## 구성 예제

### 기본값이 있는 검증자/릴레이/스토리지 구성

다음은 추가된 프로그램과 `relay` 및 `storage` 구성을 제외하고 모든 값이 기본값으로 설정된 구성 예제입니다.

_amman-explorer relay_는 _CI_ 환경에서 실행되지 않는 한 검증자와 함께 자동으로 시작되며, 알려진 _relay port_에서 릴레이가 이미 실행 중인 경우 먼저 종료됩니다.

_mock storage_는 `storage` 구성이 제공된 경우에만 시작됩니다. 알려진 _storage port_에서 스토리지 서버가 이미 실행 중인 경우 먼저 종료됩니다.

```js
import { LOCALHOST, tmpLedgerDir } from '@metaplex-foundation/amman'

module.exports = {
  validator: {
    killRunningValidators: true,
    programs: [
      {
        label: 'Token Metadata Program',
        programId: programIds.metadata,
        deployPath: localDeployPath('mpl_token_metadata'),
      },
    ],
    jsonRpcUrl: LOCALHOST,
    websocketUrl: '',
    commitment: 'confirmed',
    ledgerDir: tmpLedgerDir(),
    resetLedger: true,
    verifyFees: false,
    detached: process.env.CI != null,
  },
  relay: {
    enabled: process.env.CI == null,
    killRunningRelay: true,
  },
  storage: {
    enabled: process.env.CI == null,
    storageId: 'mock-storage',
    clearOnStart: true,
  },
}
```

### 원격 계정 및 프로그램이 있는 구성

Amman은 선택한 클러스터에서 로컬 사용 및 테스트를 위해 계정과 프로그램을 모두 가져올 수 있습니다.

```js
module.exports = {
  validator: {
    // 기본적으로 Amman은 accountsCluster에서 계정 데이터를 가져옵니다 (계정별로 재정의 가능)
    accountsCluster: 'https://api.metaplex.solana.com',
    accounts: [
      {
        label: 'Token Metadata Program',
        accountId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        // executable을 true로 표시하면 Amman이 실행 가능한 데이터 계정도 자동으로 가져옵니다
        executable: true,
      },
      {
        label: 'Random other account',
        accountId: '4VLgNs1jXgdciSidxcaLKfrR9WjATkj6vmTm5yCwNwui',
        // 기본적으로 executable은 false이며 구성에 포함될 필요가 없습니다
        // executable: false,

        // 여기에 클러스터를 제공하면 accountsCluster 필드를 재정의합니다
        cluster: 'https://metaplex.devnet.rpcpool.com',
      },
    ],
  },
}
```

### 테스트 검증자 기능 비활성화

_devnet_과 같은 다른 클러스터의 경우 일부 기능이 비활성화됩니다. 기본적으로 로컬에서 실행되는 solana-test-validator는 어떤 기능도 비활성화하지 않으므로 제공된 클러스터와 다르게 작동합니다.

특정 클러스터에 대해 실행될 방식에 더 가까운 시나리오에서 테스트를 실행하려면 _matchFeatures_ 구성 속성을 통해 해당 기능을 일치시킬 수 있습니다:

```js
module.exports = {
  validator: {
    ...
    // 아래는 `mainnet-beta` 클러스터에 대해 비활성화된 모든 기능을 비활성화합니다
    matchFeatures: 'mainnet-beta',
  }
}
```

기능 세트를 명시적으로 비활성화하려면 _deactivateFeatures_ 속성을 통해 그렇게 할 수 있습니다:

```js
module.exports = {
  validator: {
    ...
   deactivateFeatures: ['21AWDosvp3pBamFW91KB35pNoaoZVTM7ess8nr2nt53B'],
  }
}
```

**참고**: 위의 속성 중 하나만 설정할 수 있습니다

#### 리소스

- [test validator runtime features](https://docs.solana.com/developing/test-validator#appendix-ii-runtime-features)
- [runtime new features](https://docs.solana.com/developing/programming-model/runtime#new-features)