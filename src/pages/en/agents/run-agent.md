---
title: Read Agent Data
metaTitle: Read Agent Data on Solana | Metaplex Agent Registry
description: Read and verify agent identity data on Solana.
created: '02-25-2026'
updated: '02-25-2026'
---

Read and verify agent identity data on-chain after an agent has been [registered](/agents/register-agent). {% .lead %}

## What You'll Learn
This guide shows you how to:

- Check if an agent is registered
- Fetch agent identity data by asset
- Verify the on-chain AppData plugin

## Check Registration

```typescript
import { safeFetchAgentIdentityV1, findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
const identity = await safeFetchAgentIdentityV1(umi, pda);

console.log('Registered:', identity !== null);
```

## Fetch from Seeds

If you only have the asset's public key:

```typescript
import { fetchAgentIdentityV1FromSeeds } from '@metaplex-foundation/mpl-agent-registry';

const identity = await fetchAgentIdentityV1FromSeeds(umi, {
  asset: assetPublicKey,
});
```

## Verify the AppData Plugin

Registration attaches an `AppData` plugin to the MPL Core asset. You can verify by fetching the asset directly:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';
import { findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const assetData = await fetchAsset(umi, assetPublicKey);
const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });

const appData = assetData.appDatas?.find(
  (ad) => ad.dataAuthority.type === 'Address'
    && ad.dataAuthority.address === publicKey(pda)
);

console.log('Has identity plugin:', !!appData);
```

For more details on accounts, PDAs, and error codes, see the [MPL Agent Registry](/smart-contracts/mpl-agent) smart contract docs.
