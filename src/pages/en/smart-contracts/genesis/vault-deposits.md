---
title: Vault Deposits
metaTitle: Genesis - Vault Deposits
description: Learn how to set up vault deposits for pre-sale token launches with Genesis.
---

# Vault Deposits

A Vault is an "inflow" bucket that collects quote tokens (typically SOL) from users during a pre-deposit or presale phase. It acts as a holding area where users commit funds before the main trading phase begins.

## Why Use a Vault?

Vaults enable powerful token launch mechanics that aren't possible with bonding curves alone:

- **Gamified Launches**: Rank users based on in-game performance, social engagement, or other criteria, then process their deposits in order
- **Fair Launch Mechanics**: Collect all deposits first, then distribute tokens fairly based on custom logic
- **Presale Functionality**: Allow early supporters to commit funds before public trading
- **Controlled Distribution**: Your backend decides who gets swapped first, letting high-priority users get better prices on the bonding curve

### How It Works

```
Vault Period (Deposits Open)
        │
        ▼
┌─────────────────────────────┐
│         VAULT               │
│   Collects SOL deposits     │
│   from users                │
└─────────────────────────────┘
        │
        ▼
Backend processes swaps (in ranked order)
        │
        ▼
┌─────────────────────────────┐
│     BONDING CURVE           │
│   Users receive tokens      │
│   Price increases           │
└─────────────────────────────┘
```

Users deposit SOL into the vault during the deposit window. After the window closes, your backend processes the deposits by swapping them into the bonding curve in whatever order you choose. Early swaps get better prices since the bonding curve price increases with each purchase.

## Add a Vault Bucket

The **Actions Authority** is a special wallet (typically controlled by your backend) that can perform privileged operations like processing swaps and refunds. This keypair must be kept secure.

```typescript
import {
  addVaultBucketV2,
  findVaultBucketV2Pda
} from "@metaplex-foundation/genesis";

const now = BigInt(Math.floor(Date.now() / 1000));

// Load actions authority keypair from environment
const actionsAuthority = createSignerFromSecretKeyString(
  umi,
  process.env.ACTIONS_AUTHORITY_KEYPAIR!
);

await addVaultBucketV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: quoteMint,
  bucketIndex: 0,
  actionsAuthority: actionsAuthority.publicKey,
  backendSigner: umi.identity,
  allowWithdrawals: true,
  depositStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: now,
    triggeredTimestamp: 0n,
  },
  depositEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: now + 86400n, // 24 hours
    triggeredTimestamp: 0n,
  },
}).sendAndConfirm(umi);
```

### Configuration Reference

| Parameter | Description |
|-----------|-------------|
| `bucketIndex` | Unique index for this bucket (typically 0 for vault) |
| `actionsAuthority` | Wallet that can swap deposits and process refunds |
| `backendSigner` | Required signer for all vault operations |
| `allowWithdrawals` | If `true`, users can withdraw before deposit period ends |
| `depositStartCondition` | When deposits can begin |
| `depositEndCondition` | When deposits stop being accepted |

### Choosing Withdrawal Settings

The `allowWithdrawals` parameter determines user flexibility:

- **`true`**: Users can withdraw their deposits anytime before the deposit period ends. Good for building trust with users who may want to change their minds.
- **`false`**: Deposits are locked once made. Use this when you need commitment certainty (e.g., for calculating prize pools or allocations).

{% callout type="warning" %}
**Security Note:** The actions authority keypair must remain on your backend and never be exposed to the frontend, as it has privileged access to perform admin operations.
{% /callout %}

## User Operations

### Deposit into Vault

Each user gets one deposit PDA per bucket that tracks their deposits. Users can deposit multiple times—amounts accumulate in the same PDA rather than creating new accounts.

```typescript
import {
  depositVaultV2,
  findVaultDepositV2Pda
} from "@metaplex-foundation/genesis";

const depositor = generateSigner(umi);

// Deposit SOL into vault
await depositVaultV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: quoteMint,
  bucketIndex: 0,
  depositor,
  backendSigner,
  amountQuoteToken: 10_000_000_000n, // 10 SOL
}).sendAndConfirm(umi);
```

**Important considerations:**
- The deposit will fail if called outside the deposit window (`depositStartCondition` to `depositEndCondition`)
- Users need enough SOL to cover both the deposit amount and transaction fees
- Each deposit creates or updates a PDA that tracks the user's total deposited amount

### Withdraw from Vault

Users can withdraw their deposits before the vault period ends (if `allowWithdrawals` is `true`):

```typescript
import { withdrawVaultV2 } from "@metaplex-foundation/genesis";

// Partial withdrawal
await withdrawVaultV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: quoteMint,
  bucketIndex: 0,
  payer: depositor,
  backendSigner,
  amountQuoteToken: 3_000_000_000n, // Withdraw 3 SOL
}).sendAndConfirm(umi);
```

**Withdrawal rules:**
- Only works if `allowWithdrawals` was set to `true` when creating the vault
- Users can only withdraw the unconsumed portion of their deposit
- Partial withdrawals are allowed—users don't have to withdraw everything
- Withdrawals are blocked after the deposit period ends

## Backend Operations

The actions authority (your backend) controls how deposits flow from the vault to the bonding curve. This is where the magic of ranked/gamified launches happens.

### Swap Vault Deposits to Bonding Curve

The `ordinal` parameter ensures swaps are processed in a specific order. This is critical for ranked launches where order determines who gets better prices.

```typescript
import { swapVaultToBondingCurveV2 } from "@metaplex-foundation/genesis";

async function swapVaultToBondingCurve(
  recipient: PublicKey,
  amountQuoteToken: bigint,
  ordinal: bigint
) {
  await swapVaultToBondingCurveV2(umi, {
    baseMint: baseMint.publicKey,
    quoteMint: quoteMint,
    actionsAuthority: actionsAuthority,
    recipient,
    vaultBucketIndex: 0,
    bondingCurveBucketIndex: 1,
    swapAmountQuoteToken: amountQuoteToken,
    ordinal,
  }).sendAndConfirm(umi);
}

// Example: Swap in ranked order based on game performance
// Player 1 (top rank) gets swapped first at lowest price
await swapVaultToBondingCurve(player1.publicKey, 5_000_000_000n, 0n);

// Player 2 gets swapped second, price is slightly higher
await swapVaultToBondingCurve(player2.publicKey, 3_000_000_000n, 1n);

// Player 3 gets swapped third, price is higher still
await swapVaultToBondingCurve(player3.publicKey, 2_000_000_000n, 2n);
```

### Understanding Ordinals

The ordinal system enforces processing order:

- Each ordinal must be unique and incrementing (0, 1, 2, 3...)
- You cannot skip ordinals or process them out of order
- The bonding curve price increases with each swap, so **order matters significantly**
- Early ordinals get more tokens for the same amount of SOL

**Example price impact:**
```
Ordinal 0: 5 SOL → 1000 tokens (price: 0.005 SOL/token)
Ordinal 1: 3 SOL → 545 tokens (price: 0.0055 SOL/token)
Ordinal 2: 2 SOL → 330 tokens (price: 0.006 SOL/token)
```

{% callout type="note" %}
Consider batching swap transactions for efficiency. You can process multiple swaps in a single transaction if they're sequential ordinals, reducing overall transaction costs.
{% /callout %}

### Partial Swaps

You can swap only a portion of a user's deposit:

```typescript
// User deposited 10 SOL, but only swap 5 SOL
await swapVaultToBondingCurve(user.publicKey, 5_000_000_000n, 0n);

// The remaining 5 SOL stays in their deposit and can be:
// - Swapped later with another ordinal
// - Refunded back to the user
```

This is useful for:
- Capping how much each user can swap
- Implementing tiered access (e.g., first 1 SOL at rank 1 prices, rest at rank 100)
- Reserving some deposits for refunds

### Refund Vault Deposits

The Actions Authority can refund any remaining (unconsumed) deposits back to users:

```typescript
import { refundVaultDepositV2 } from "@metaplex-foundation/genesis";

await refundVaultDepositV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: quoteMint,
  bucketIndex: 0,
  payer: depositor,
  actionsAuthority: actionsAuthority,
  recipient: depositor.publicKey,
}).sendAndConfirm(umi);
```

**Refund behavior:**
- Only refunds `amount_quote_token - amount_quote_token_consumed` (the unconsumed portion)
- If a user's entire deposit was swapped, there's nothing to refund
- The refund goes to the specified `recipient`, which can be different from the original depositor

### Batch Processing Example

Here's a complete example of processing a ranked launch:

```typescript
// Fetch all deposits and sort by your ranking criteria
const rankedUsers = await getRankedDepositors(); // Your ranking logic

// Process swaps in order
for (let i = 0; i < rankedUsers.length; i++) {
  const user = rankedUsers[i];

  try {
    await swapVaultToBondingCurve(
      user.publicKey,
      user.depositAmount,
      BigInt(i)  // Ordinal matches array index
    );
    console.log(`Swapped ${user.depositAmount} for user at rank ${i}`);
  } catch (error) {
    console.error(`Failed to swap for rank ${i}:`, error);
    // Handle failed swaps - maybe queue for refund
  }
}

// Refund any users who weren't swapped or had partial swaps
for (const user of usersToRefund) {
  await refundVaultDepositV2(umi, {
    baseMint: baseMint.publicKey,
    quoteMint: quoteMint,
    bucketIndex: 0,
    payer: user,
    actionsAuthority,
    recipient: user.publicKey,
  }).sendAndConfirm(umi);
}
```

## Fetch Vault Data

### Reading Vault Bucket State

```typescript
import {
  fetchVaultBucketV2,
  fetchVaultDepositV2,
  findVaultBucketV2Pda,
  findVaultDepositV2Pda,
} from "@metaplex-foundation/genesis";

// Fetch vault bucket data
const [vaultBucket] = findVaultBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const vaultData = await fetchVaultBucketV2(umi, vaultBucket);
console.log('Total deposits:', vaultData.quoteTokenDepositTotal);
console.log('Actions authority:', vaultData.actionsAuthority);
console.log('Withdrawals allowed:', vaultData.allowWithdrawals);
```

### Reading User Deposit State

```typescript
// Fetch a specific user's deposit
const [depositPda] = findVaultDepositV2Pda(umi, {
  bucket: vaultBucket,
  recipient: userPublicKey,
});

const depositData = await fetchVaultDepositV2(umi, depositPda);

console.log('Deposited:', depositData.amountQuoteToken);
console.log('Consumed:', depositData.amountQuoteTokenConsumed);
console.log('Remaining:', depositData.amountQuoteToken - depositData.amountQuoteTokenConsumed);
```

### Checking Deposit Status

```typescript
function getDepositStatus(depositData) {
  const total = depositData.amountQuoteToken;
  const consumed = depositData.amountQuoteTokenConsumed;
  const remaining = total - consumed;

  if (consumed === 0n) {
    return 'pending';  // Not swapped yet
  } else if (remaining === 0n) {
    return 'fully_swapped';  // Entire deposit converted to tokens
  } else {
    return 'partially_swapped';  // Some swapped, some remaining
  }
}
```

## Best Practices

### 1. Plan Your Deposit Window Carefully
- Give users enough time to deposit, but not so long that momentum is lost
- Consider time zones of your target audience
- Communicate the schedule clearly before launch

### 2. Design Fair Ranking Systems
- Be transparent about how rankings are determined
- Consider anti-gaming measures if rankings are based on user actions
- Document the ranking criteria before the deposit period starts

### 3. Handle Edge Cases
- What happens if someone deposits but doesn't qualify for a swap?
- How do you handle ties in rankings?
- Plan for refund scenarios before launch

### 4. Test Thoroughly on Devnet
- Simulate the complete flow: deposits → swaps → refunds
- Test with realistic numbers of users
- Verify ordinal processing works correctly

### 5. Monitor During Launch
- Track deposit totals in real-time
- Be ready to pause if issues arise
- Have a communication plan for users

## Next Steps

- Learn about [Bonding Curves](/smart-contracts/genesis/bonding-curves) for the trading phase
- Understand [Raydium Graduation](/smart-contracts/genesis/raydium-graduation) for DEX integration
- Review the [Overview](/smart-contracts/genesis) for the complete flow
