---
title: Bonding Curve — Indexing & Events
metaTitle: Genesis Bonding Curve Indexing and Events | Metaplex
description: How to index the Genesis Bonding Curve lifecycle — GPA discovery, decoding BondingCurveSwapEvent, tracking price from events, and account discriminators.
updated: '04-09-2026'
keywords:
  - bonding curve
  - indexing
  - swap events
  - BondingCurveSwapEvent
  - genesis
  - GPA
  - lifecycle events
  - price tracking
  - Solana
about:
  - Bonding Curve
  - Indexing
  - Swap Events
  - Genesis
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: How do I decode a BondingCurveSwapEvent from a transaction?
    a: Find the inner instruction on the Genesis program (GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B) with discriminator byte 255, slice off that first byte, and pass the remaining bytes to getBondingCurveSwapEventSerializer().deserialize(). The event contains swapDirection, quoteTokenAmount, baseTokenAmount, fee, creatorFee, and post-swap reserve state (baseTokenBalance, quoteTokenDepositTotal, virtualSol, virtualTokens).
  - q: What is the difference between isSoldOut and isGraduated?
    a: isSoldOut is a synchronous check on the bucket's baseTokenBalance — it returns true the moment all tokens are purchased. isGraduated is an async RPC call that checks whether the Raydium CPMM pool has been created and funded. There is a window between sell-out and graduation where isSoldOut is true but isGraduated is false.
---

Index the complete Genesis Bonding Curve lifecycle — discover curves via GPA, decode per-swap events, and track price and state changes without polling. {% .lead %}

## Summary

The Genesis program emits a `BondingCurveSwapEvent` inner instruction on every confirmed swap. Indexers can combine this with GPA queries and lifecycle instruction tracking to reconstruct full curve state without fetching accounts after every trade.

- **GPA discovery** — find all `BondingCurveBucketV2` accounts across the program
- **Swap events** — discriminator byte `255` on inner instructions; contains direction, amounts, fees, and post-swap reserves
- **Price from events** — derive current price from event data without additional RPC calls
- **Lifecycle tracking** — eight distinct events from token creation through Raydium graduation

**Program ID:** `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

## Discovering All Bonding Curves (GPA)

Use the GPA builder to retrieve every `BondingCurveBucketV2` account on the program — useful for dashboards, aggregators, and indexers.

```typescript {% title="discover-all-curves.ts" showLineNumbers=true %}
import { getBondingCurveBucketV2GpaBuilder } from '@metaplex-foundation/genesis';

const allCurves = await getBondingCurveBucketV2GpaBuilder(umi)
  .whereField('discriminator', /* BondingCurveBucketV2 discriminator */)
  .get();

for (const curve of allCurves) {
  console.log('Bucket PDA:         ', curve.publicKey.toString());
  console.log('Base token balance: ', curve.data.baseTokenBalance.toString());
}
```

## Decoding Swap Events

Every confirmed swap emits a `BondingCurveSwapEvent` as an inner instruction with discriminator byte `255`. Decode it from the transaction to get exact post-swap reserve state, fee breakdown, and direction.

### BondingCurveSwapEvent Fields

| Field | Type | Description |
|-------|------|-------------|
| `swapDirection` | `SwapDirection` | `SwapDirection.Buy` (SOL in, tokens out) or `SwapDirection.Sell` (tokens in, SOL out) |
| `quoteTokenAmount` | `bigint` | SOL amount on the swap (input for buys, gross output for sells), in lamports |
| `baseTokenAmount` | `bigint` | Token amount on the swap (output for buys, input for sells) |
| `fee` | `bigint` | Protocol fee charged, in lamports |
| `creatorFee` | `bigint` | Creator fee charged, in lamports (0 if no creator fee configured) |
| `baseTokenBalance` | `bigint` | `baseTokenBalance` after the swap |
| `quoteTokenDepositTotal` | `bigint` | `quoteTokenDepositTotal` after the swap |
| `virtualSol` | `bigint` | Virtual SOL reserve (immutable — useful for price calculation without fetching the account) |
| `virtualTokens` | `bigint` | Virtual token reserve (immutable — same as above) |
| `blockTime` | `bigint` | Unix timestamp of the block containing the swap |

### Decoding from a Confirmed Transaction

```typescript {% title="decode-swap-event.ts" showLineNumbers=true %}
import { getBondingCurveSwapEventSerializer, SwapDirection } from '@metaplex-foundation/genesis';

const GENESIS_PROGRAM_ID = 'GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B';
const SWAP_EVENT_DISCRIMINATOR = 255;

async function decodeSwapEvent(signature: string) {
  const tx = await umi.rpc.getTransaction(signature, {
    commitment: 'confirmed',
  });

  if (!tx) throw new Error('Transaction not found');

  const serializer = getBondingCurveSwapEventSerializer();

  for (const innerIx of tx.meta?.innerInstructions ?? []) {
    for (const ix of innerIx.instructions) {
      const programId = tx.transaction.message.accountKeys[ix.programIdIndex];

      if (programId.toString() !== GENESIS_PROGRAM_ID) continue;

      const data = ix.data; // Uint8Array
      if (data[0] !== SWAP_EVENT_DISCRIMINATOR) continue;

      // Slice off the discriminator byte, then deserialize.
      const [event] = serializer.deserialize(data.slice(1));

      const isBuy = event.swapDirection === SwapDirection.Buy;
      console.log('Direction:            ', isBuy ? 'buy' : 'sell');
      console.log('Quote token amount:   ', event.quoteTokenAmount.toString(), 'lamports');
      console.log('Base token amount:    ', event.baseTokenAmount.toString());
      console.log('Protocol fee:         ', event.fee.toString(), 'lamports');
      console.log('Creator fee:          ', event.creatorFee.toString(), 'lamports');
      console.log('Base balance:         ', event.baseTokenBalance.toString());
      console.log('Quote deposit total:  ', event.quoteTokenDepositTotal.toString());

      return event;
    }
  }

  return null; // No swap event found in this transaction.
}
```

## Tracking Current Price from Events

Derive the current price from the post-swap reserve state included in each `BondingCurveSwapEvent` rather than fetching the account after every trade:

```typescript {% title="price-from-event.ts" showLineNumbers=true %}
function getPriceFromEvent(event: BondingCurveSwapEvent, bucket: BondingCurveBucketV2) {
  // totalTokens = virtualTokens + post-swap baseTokenBalance (included in the event)
  const totalTokens = bucket.virtualTokens + event.baseTokenBalance;
  // totalSol = virtualSol + post-swap quoteTokenDepositTotal (included in the event)
  const totalSol = bucket.virtualSol + event.quoteTokenDepositTotal;
  // Price: tokens per SOL (lamports per base token unit as bigint)
  return totalSol > 0n ? totalTokens / totalSol : 0n;
}
```

{% callout type="note" %}
`virtualSol` and `virtualTokens` are included in every `BondingCurveSwapEvent` — no separate account fetch is needed to compute price from an event. They are immutable after curve creation.
{% /callout %}

## Lifecycle Events

Track the full lifecycle of a bonding curve by listening for Genesis program instructions and inner instruction events.

| Event | Description | Key Fields |
|-------|-------------|------------|
| Token Created | SPL token minted, genesis account initialized | `baseMint`, `genesisAccount` |
| Bonding Curve Added | `BondingCurveBucketV2` account created | `bucketPda`, `baseTokenAllocation`, `virtualSol`, `virtualTokens` |
| Finalized | Launch configuration locked, buckets activated | `genesisAccount` |
| Goes Live | `swapStartCondition` met, trading open | `bucketPda`, timestamp |
| Swap | Buy or sell executed | `BondingCurveSwapEvent` (discriminator `255`) |
| Sold Out | `baseTokenBalance === 0` | `bucketPda`, `quoteTokenDepositTotal` |
| Graduation Crank | Liquidity migration instruction submitted | `bucketPda`, `raydiumCpmmPool` |
| Graduated | Raydium CPMM pool funded, bonding curve closed | `cpmmPoolPda`, accumulated SOL |

## Account Discriminators and PDA Derivation

### Discriminators

| Account | Discriminator | Description |
|---------|---------------|-------------|
| `GenesisAccountV2` | Unique per account type | Master coordination account |
| `BondingCurveBucketV2` | Unique per account type | Bonding curve AMM state |
| `BondingCurveSwapEvent` | `255` (inner instruction) | Per-swap event emitted by the program |

### PDA Seeds

| PDA | Seeds |
|-----|-------|
| `GenesisAccountV2` | `["genesis_account_v2", baseMint, genesisIndex (u8)]` |
| `BondingCurveBucketV2` | `["bonding_curve_bucket_v2", genesisAccount, bucketIndex (u8)]` |

Derive PDAs in TypeScript with `findGenesisAccountV2Pda` and `findBondingCurveBucketV2Pda` from the Genesis SDK.

## Notes

- `virtualSol` and `virtualTokens` are included in every `BondingCurveSwapEvent` — no separate account fetch is required to compute price from events; they are immutable after curve creation
- The `BondingCurveSwapEvent` discriminator is always byte `255` — any inner instruction on the Genesis program with this leading byte is a swap event
- Between `isSoldOut` returning `true` and `isGraduated` returning `true`, the curve is sold out but the Raydium CPMM pool is not yet funded; do not redirect users to Raydium until `isGraduated` confirms the pool exists
- `isGraduated` makes an RPC call on every invocation — cache the result in your indexer rather than calling it on every render

## FAQ

### How do I decode a BondingCurveSwapEvent?
Find inner instructions on the Genesis program (`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`) where the first data byte is `255`. Slice off that byte and pass the remainder to `getBondingCurveSwapEventSerializer().deserialize(data.slice(1))`. The returned object contains `swapDirection`, `quoteTokenAmount`, `baseTokenAmount`, `fee`, `creatorFee`, and post-swap reserve state (`baseTokenBalance`, `quoteTokenDepositTotal`, `virtualSol`, `virtualTokens`, `blockTime`).

### What is the difference between isSoldOut and isGraduated?
`isSoldOut` is a synchronous local check — it returns `true` as soon as `baseTokenBalance` is `0n`. `isGraduated` is an async RPC call that verifies whether the Raydium CPMM pool has been created and funded onchain. There is a window between sell-out and graduation where `isSoldOut` is `true` but `isGraduated` is `false`. Do not redirect users to Raydium until `isGraduated` confirms the pool exists.
