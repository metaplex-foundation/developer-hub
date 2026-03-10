---
title: Fetching a Core Candy Machine
metaTitle: Fetching a Core Candy Machine | Core Candy Machine
description: How to fetch the on-chain data of a Core Candy Machine account from the Solana blockchain using the mpl-core-candy-machine SDK.
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

## Summary

The `fetchCandyMachine` function retrieves the full on-chain account data for a [Core Candy Machine](/smart-contracts/core-candy-machine), including its configuration, authority, and loaded items. {% .lead %}

- Returns the complete Candy Machine account state including item count, items minted, and all loaded config line entries
- Requires only the Candy Machine public key and a configured [UMI](/dev-tools/umi) instance with the `mplCoreCandyMachine` plugin
- Guard configuration is stored in a separate account and must be fetched independently using `safeFetchCandyGuard`

## Fetching Core Candy Machine Account Data

The `fetchCandyMachine` function reads the full Candy Machine account from the Solana blockchain and deserializes it into a typed object containing all configuration fields, loaded items, and current mint progress.

{% dialect-switcher title="Fetch a Core Candy Machine" %}
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

## Notes

- The returned object includes the full list of loaded config line items, item count, items minted, and all Candy Machine settings.
- Guard configuration is stored in a separate Candy Guard account. Use `safeFetchCandyGuard` to retrieve guard settings for a given Candy Machine.
- Replace the placeholder public key (`11111111111111111111111111111111`) with your actual Candy Machine address.
- For mainnet usage, consider using a dedicated RPC provider rather than the public `api.mainnet-beta.solana.com` endpoint to avoid rate limits.

