---
title: 事前作成済み設定
metaTitle: 事前作成済み設定 | Amman
description: Metaplex Ammanローカルバリデータツールキットからの事前作成済み設定セット。
---

異なるMetaplexプログラムで動作するAmman設定の基本的な例をいくつか紹介します。ニーズに合わせてこれらのファイルを変更する必要がある場合があります。

## Bubblegum

この設定は、Metaplex Bubblegumでテストと作業を行うために設計されています。

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

この設定は、Metaplex Candy Machineでテストと作業を行うために設計されています。

```json
const { LOCALHOST, tmpLedgerDir } = require("@metaplex-foundation/amman");

module.exports = {
  validator: {
    killRunningValidators: true,
    accountsCluster: "https://api.devnet.solana.com	",
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

この設定は、Metaplex Core Candy Machineでテストと作業を行うために設計されています。上記のCandy Machineの例と比較して、異なるCandy MachineプログラムIDとCandy GuardプログラムIDが使用され、MPL-Coreプログラムが追加されています。

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