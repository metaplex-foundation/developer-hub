---
title: Launch a Token
metaTitle: Launch a Token | Tokens
description: End-to-end guide for launching a token with Genesis Launch Pools on Solana.
---

Launch a token using Genesis Launch Pools, where users deposit SOL during a window and receive tokens proportional to their share of total deposits. {% .lead %}

## Overview

A Launch Pool token launch has three phases:

1. **Setup** (you run once) - Create the token, configure the launch, and activate it
2. **Deposit Period** (users interact) - Users deposit SOL during the window you configured
3. **Post-Launch** (you + users) - Execute the transition, users claim tokens, you revoke authorities

This guide walks you through creating **four separate scripts** that you'll run at different stages:

| Script | When to Run | Purpose |
|--------|-------------|---------|
| `launch.ts` | Once, to start | Creates your token and activates the launch |
| `transition.ts` | After deposits close | Moves collected SOL to your unlocked bucket |
| `claim.ts` | After transition | Users run this to claim their tokens |
| `revoke.ts` | When launch is complete | Permanently removes mint/freeze authorities |

## Prerequisites

Create a new project and install dependencies:

```bash
mkdir my-token-launch
cd my-token-launch
npm init -y
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## The Complete Launch Script

Below is a complete, runnable script. Each section is commented to explain what it does. You'll run this script **once** to set up your launch.

{% callout type="warning" title="Keypair Required" %}
You need a Solana keypair file on your machine to sign transactions. This is typically your Solana CLI wallet located at `~/.config/solana/id.json`. Update the `walletFile` path in the script to point to your keypair file. Make sure this wallet has SOL for transaction fees.
{% /callout %}

Create a file called `launch.ts`:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplGenesis,
  initializeV2,
  findGenesisAccountV2Pda,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  addLaunchPoolBucketV2,
  addUnlockedBucketV2,
  finalizeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  // ============================================
  // SETUP: Configure your connection and wallet
  // ============================================

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplGenesis());

  // Load your wallet keypair from a file on your machine
  // This is typically your Solana CLI wallet at ~/.config/solana/id.json
  // Or use any keypair file you have access to
  const walletFile = '/path/to/your/keypair.json'; // <-- UPDATE THIS PATH
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // ============================================
  // CONFIGURATION: Customize these values
  // ============================================

  // Token details
  const TOKEN_NAME = 'My Token';
  const TOKEN_SYMBOL = 'MTK';
  const TOKEN_URI = 'https://example.com/metadata.json'; // Your metadata JSON URL
  const TOTAL_SUPPLY = 1_000_000_000_000n; // 1 trillion tokens (adjust as needed)

  // Timing (in seconds from now)
  const DEPOSIT_DURATION = 24 * 60 * 60; // 24 hours
  const CLAIM_DURATION = 7 * 24 * 60 * 60; // 7 days

  // Calculate timestamps
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now;
  const depositEnd = now + BigInt(DEPOSIT_DURATION);
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + BigInt(CLAIM_DURATION);

  // ============================================
  // STEP 1: Create your token
  // ============================================
  console.log('Step 1: Creating token...');

  const baseMint = generateSigner(umi);

  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  });

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: TOTAL_SUPPLY,
    name: TOKEN_NAME,
    uri: TOKEN_URI,
    symbol: TOKEN_SYMBOL,
  }).sendAndConfirm(umi);

  console.log('✓ Token created!');
  console.log('  Token mint:', baseMint.publicKey);
  console.log('  Genesis account:', genesisAccount);

  // ============================================
  // STEP 2: Add Launch Pool bucket
  // This is where users will deposit SOL
  // ============================================
  console.log('\nStep 2: Adding Launch Pool bucket...');

  const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, {
    genesisAccount,
    bucketIndex: 0,
  });

  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, {
    genesisAccount,
    bucketIndex: 0,
  });

  const defaultSchedule = {
    slopeBps: 0n,
    interceptBps: 0n,
    maxBps: 0n,
    startTime: 0n,
    endTime: 0n,
  };

  await addLaunchPoolBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    depositStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositStart,
      triggeredTimestamp: 0n,
    },
    depositEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositEnd,
      triggeredTimestamp: 0n,
    },
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: 0n,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: 0n,
    },
    depositPenalty: defaultSchedule,
    withdrawPenalty: defaultSchedule,
    bonusSchedule: defaultSchedule,
    minimumDepositAmount: null,
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000, // 100% of collected SOL goes to unlocked bucket
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  console.log('✓ Launch Pool bucket added!');
  console.log('  Bucket address:', launchPoolBucket);

  // ============================================
  // STEP 3: Add Unlocked bucket
  // This receives the collected SOL for your team
  // ============================================
  console.log('\nStep 3: Adding Unlocked bucket...');

  const backendSigner = generateSigner(umi);

  await addUnlockedBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: 0n,
    recipient: umi.identity.publicKey,
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: 0n,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: 0n,
    },
    backendSigner: { signer: backendSigner.publicKey },
  }).sendAndConfirm(umi);

  console.log('✓ Unlocked bucket added!');
  console.log('  Bucket address:', unlockedBucket);

  // ============================================
  // STEP 4: Finalize - activates the launch
  // After this, no more changes can be made
  // ============================================
  console.log('\nStep 4: Finalizing...');

  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('✓ Launch is now ACTIVE!');

  // ============================================
  // SUMMARY: Save these addresses!
  // ============================================
  console.log('\n========================================');
  console.log('LAUNCH COMPLETE - SAVE THESE ADDRESSES:');
  console.log('========================================');
  console.log('Token mint:', baseMint.publicKey);
  console.log('Genesis account:', genesisAccount);
  console.log('Launch Pool bucket:', launchPoolBucket);
  console.log('Unlocked bucket:', unlockedBucket);
  console.log('');
  console.log('TIMING:');
  console.log('Deposits open:', new Date(Number(depositStart) * 1000).toISOString());
  console.log('Deposits close:', new Date(Number(depositEnd) * 1000).toISOString());
  console.log('Claims open:', new Date(Number(claimStart) * 1000).toISOString());
  console.log('Claims close:', new Date(Number(claimEnd) * 1000).toISOString());
}

main().catch(console.error);
```

Run the script:

```bash
npx ts-node launch.ts
```

**Save the addresses that are printed!** You'll need them for the next steps.

## What Happens Next

After running the launch script, your launch is live. Here's what happens during each phase:

### During the Deposit Period

Users deposit SOL using your frontend or directly via the SDK. Each deposit:
- Has a 2% fee applied
- Is tracked in a deposit PDA
- Can be partially or fully withdrawn (with 2% fee)

### After Deposits Close

Once the deposit period ends, you need to run the **transition** to move the collected SOL to the unlocked bucket. Create a file called `transition.ts`:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplGenesis,
  transitionV2,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplGenesis());

  // Load your wallet keypair (same wallet used for launch)
  const walletFile = '/path/to/your/keypair.json'; // <-- UPDATE THIS PATH
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // Fill in the addresses printed by your launch script
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');
  const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET');
  const unlockedBucket = publicKey('YOUR_UNLOCKED_BUCKET');

  const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
    owner: unlockedBucket,
    mint: WRAPPED_SOL_MINT,
  });

  console.log('Executing transition...');

  await transitionV2(umi, {
    genesisAccount,
    primaryBucket: launchPoolBucket,
    baseMint,
  })
    .addRemainingAccounts([
      {
        pubkey: unlockedBucket,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: publicKey(unlockedBucketQuoteTokenAccount),
        isSigner: false,
        isWritable: true,
      },
    ])
    .sendAndConfirm(umi);

  console.log('✓ Transition complete! SOL moved to unlocked bucket.');
}

main().catch(console.error);
```

Run after the deposit period ends:

```bash
npx ts-node transition.ts
```

### Users Claim Tokens

After the transition, users can claim their tokens. Each user receives tokens proportional to their share of total deposits:

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

Users can claim via your frontend or using this script (create `claim.ts`):

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplGenesis,
  claimLaunchPoolV2,
} from '@metaplex-foundation/genesis';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplGenesis());

  // Load the user's wallet keypair (whoever deposited SOL)
  const walletFile = '/path/to/your/keypair.json'; // <-- UPDATE THIS PATH
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // Fill in the addresses from the launch
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');
  const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET');

  console.log('Claiming tokens...');

  await claimLaunchPoolV2(umi, {
    genesisAccount,
    bucket: launchPoolBucket,
    baseMint,
    recipient: umi.identity.publicKey,
  }).sendAndConfirm(umi);

  console.log('✓ Tokens claimed!');
}

main().catch(console.error);
```

### Finalize: Revoke Authorities

After the launch is complete, revoke mint and freeze authorities. This signals to holders that no additional tokens can ever be minted.

{% callout type="warning" %}
**This is irreversible.** Once revoked, you can never mint additional tokens or freeze accounts. Only do this when you're certain the launch is complete.
{% /callout %}

Create `revoke.ts`:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplGenesis,
  revokeMintAuthorityV2,
  revokeFreezeAuthorityV2,
} from '@metaplex-foundation/genesis';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplGenesis());

  // Load your wallet keypair (same wallet used for launch)
  const walletFile = '/path/to/your/keypair.json'; // <-- UPDATE THIS PATH
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // Fill in your token mint address from the launch
  const baseMint = publicKey('YOUR_TOKEN_MINT');

  console.log('Revoking mint authority...');
  await revokeMintAuthorityV2(umi, {
    baseMint,
  }).sendAndConfirm(umi);
  console.log('✓ Mint authority revoked');

  console.log('Revoking freeze authority...');
  await revokeFreezeAuthorityV2(umi, {
    baseMint,
  }).sendAndConfirm(umi);
  console.log('✓ Freeze authority revoked');

  console.log('\n✓ Launch complete! Token is fully decentralized.');
}

main().catch(console.error);
```

## Next Steps

- [Genesis Overview](/smart-contracts/genesis) - Learn more about Genesis concepts
- [Launch Pool](/smart-contracts/genesis/launch-pool) - Detailed Launch Pool documentation
- [Aggregation API](/smart-contracts/genesis/aggregation) - Query launch data via API
