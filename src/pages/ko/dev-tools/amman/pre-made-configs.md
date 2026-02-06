---
title: 미리 만들어진 구성
metaTitle: 미리 만들어진 구성 | Amman
description: Metaplex Amman 로컬 검증자 도구 키트의 미리 만들어진 구성 세트.
---

다음은 다양한 Metaplex 프로그램과 함께 작업하기 위한 Amman 구성의 몇 가지 기본 예제입니다. 필요에 맞게 이러한 파일을 수정해야 할 수 있습니다.

## Bubblegum

이 설정은 Metaplex Bubblegum을 테스트하고 작업하도록 설계되었습니다.

```json
const { LOCALHOST, tmpLedgerDir } = require("@metaplex-foundation/amman");

module.exports = {
  validator: {
    killRunningValidators: true,
    accountsCluster: "https://api.devnet.solana.com",
    accounts: [
       {
        label: "Bubblegum",
        accountId: "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
        executable: true,
      },
      {
        label: "Token Metadata Program",
        accountId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        executable: true,
      },
      {
        label: "Token Auth Rules",
        accountId: "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg",
        executable: true,
      },
      {
        label: "Spl ATA Program",
        accountId: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        executable: true,
      },
      {
        label: "SPL Token Program",
        accountId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        executable: true,
      },
      {
        label: "SPL Account Compression",
        accountId: "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK",
        executable: true
      },
      {
        label: "SPL Noop Program",
        accountId: "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV",
        executable: true
      },

    ],
    jsonRpcUrl: LOCALHOST,
    websocketUrl: "",
    commitment: "confirmed",
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
    storageId: "mock-storage",
    clearOnStart: true,
  },
};
```

## Candy Machine

이 설정은 Metaplex Candy Machine을 테스트하고 작업하도록 설계되었습니다.

```json
const { LOCALHOST, tmpLedgerDir } = require("@metaplex-foundation/amman");

module.exports = {
  validator: {
    killRunningValidators: true,
    accountsCluster: "https://api.devnet.solana.com ",
    accounts: [
       {
        label: "Candy Machine v3",
        accountId: "CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR",
        executable: true,
      },
      {
        label: "Candy Guard",
        accountId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g",
        executable: true,
      },
      {
        label: "Token Metadata Program",
        accountId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        executable: true,
      },
      {
        label: "Token Auth Rules",
        accountId: "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg",
        executable: true,
      },
      {
        label: "Spl ATA Program",
        accountId: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        executable: true,
      },
      {
        label: "SPL Token Program",
        accountId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        executable: true,
      },
    ],
    jsonRpcUrl: LOCALHOST,
    websocketUrl: "",
    commitment: "confirmed",
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
    storageId: "mock-storage",
    clearOnStart: true,
  },
};
```

## Core Candy Machine

이 설정은 Metaplex Core Candy Machine을 테스트하고 작업하도록 설계되었습니다. 위의 Candy Machine 예제와 비교하여 다른 Candy Machine 프로그램 ID와 Candy Guard 프로그램 ID가 사용되고 MPL-Core 프로그램이 추가됩니다.

```json
const { LOCALHOST, tmpLedgerDir } = require("@metaplex-foundation/amman");

module.exports = {
  validator: {
    killRunningValidators: true,
    accountsCluster: "https://api.devnet.solana.com",
    accounts: [
       {
        label: "Core Candy Machine",
        accountId: "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
        executable: true,
      },
      {
        label: "Core Candy Guard",
        accountId: "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
        executable: true,
      },
      {
        label: "mpl-core",
        accountId: "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
        executable: true,
      },      
      {
        label: "Token Metadata Program",
        accountId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        executable: true,
      },
      {
        label: "Token Auth Rules",
        accountId: "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg",
        executable: true,
      },
      {
        label: "Spl ATA Program",
        accountId: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        executable: true,
      },
      {
        label: "SPL Token Program",
        accountId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        executable: true,
      },
    ],
    jsonRpcUrl: LOCALHOST,
    websocketUrl: "",
    commitment: "confirmed",
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
    storageId: "mock-storage",
    clearOnStart: true,
  },
};
