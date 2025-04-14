---
titwe: Pwemade Configuwations
metaTitwe: Pwe Made Configuwations | Amman
descwiption: A set of pwemade configuwations fwom Metapwex Amman wocaw vawidatow toowkit.
---

Hewe awe a few basic exampwes of Amman configuwations fow wowking wid diffewent Metapwex pwogwams~ You may nyeed to modify dese fiwes to suite youw nyeeds.

## Bubbwegum

Dis setup is designyed to test and wowk wid Metapwex Bubbwegum.

```json
const { LOCALHOST, tmpLedgerDir } = require("@metaplex-foundation/amman");

module.exports = {
  validator: {
    killRunningValidators: true,
    accountsCluster: "https://api.metaplex.solana.com",
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

## Candy Machinye

Dis setup is designyed to test and wowk wid Metapwex Candy Machinye.

```json
const { LOCALHOST, tmpLedgerDir } = require("@metaplex-foundation/amman");

module.exports = {
  validator: {
    killRunningValidators: true,
    accountsCluster: "https://api.metaplex.solana.com",
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
