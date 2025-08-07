---
title: Premade Configurations
metaTitle: Pre Made Configurations | Amman
description: A set of premade configurations from Metaplex Amman local validator toolkit.
---

Here are a few basic examples of Amman configurations for working with different Metaplex programs. You may need to modify these files to suite your needs.

## Bubblegum

This setup is designed to test and work with Metaplex Bubblegum.

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

This setup is designed to test and work with Metaplex Candy Machine.

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

This setup is designed to test and work with Metaplex Core Candy Machine. Compared to the Candy Machine example above different Candy Machine program id and Candy Guard program id are used and the MPL-Core program is added.

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