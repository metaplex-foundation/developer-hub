---
title: Launch a Token on Solana
metaTitle: Launch a Token on Solana — Genesis Fair Launch Guide | Metaplex
description: Step-by-step TypeScript guide to launching an SPL token on Solana using Genesis Launch Pools. Fair, on-chain token distribution with transparent price discovery.
cli: /dev-tools/cli/genesis/launch
---

Launch an SPL token on Solana using [Genesis](/smart-contracts/genesis) Launch Pools. This guide walks you through a fair launch where users deposit SOL during a window and receive tokens proportional to their share of total deposits — all handled transparently on-chain. {% .lead %}

{% callout type="note" title="No-Code Option" %}
Don't want to write code? Use the [Metaplex token launchpad](https://www.metaplex.com) to launch a token with no coding required. This guide is for developers who want to build their own token launch experience or host a token sale on their own website using the Genesis SDK.
{% /callout %}

{% callout type="note" title="Other Launch Methods" %}
This guide covers the **Launch Pool** fair launch method, but Genesis also supports **[Presale](/smart-contracts/genesis/presale)** token sales where tokens are sold at a fixed price. Check the [Genesis overview](/smart-contracts/genesis) to compare methods and choose the best fit for your project.
{% /callout %}

## Overview

Genesis is a Solana token launchpad that provides fair, on-chain token launch mechanisms. Unlike a centralized token sale platform where tokens are sold at a fixed price, a Launch Pool lets the market determine token distribution — every participant receives tokens proportional to their deposit, ensuring a fair and transparent token generation event (TGE). All SPL token creation, fundraising, and distribution happens on-chain with no intermediaries.

A Launch Pool token launch has three phases:

1. **Setup** (you run once) - Create the token, configure the launch, and activate it
2. **Deposit Period** (users interact) - Users deposit SOL during the window you configured
3. **Post-Launch** (you + users) - Crank the state machine, users claim tokens, you revoke authorities

This guide walks you through creating **four separate scripts** that you'll run at different stages:

| Script | When to Run | Purpose |
|--------|-------------|---------|
| `launch.ts` | Once, to start | Creates your token and activates the launch |
| `crank.ts` | After deposits close | Triggers conditions and behaviors to move SOL to your unlocked bucket |
| `claim.ts` | After crank | Users run this to claim their tokens |
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

{% code-tabs-imported from="genesis/launch_token_launch" frameworks="umi" filename="launch" /%}

Run the script:

```bash
npx ts-node launch.ts
```

**Save the addresses that are printed!** You'll need them for the next steps.

## What Happens Next

After running the launch script, your launch is live. Here's what happens during each phase:

### During the Deposit Period

Users deposit SOL using your frontend or directly via the SDK. Each deposit:
- Has a fee applied
- Is tracked in a deposit PDA
- Can be partially or fully withdrawn (with fee)

### After Deposits Close

Once the deposit period ends, run `triggerBehaviorsV2` to execute the end behaviors configured on the bucket — in this case, moving collected SOL to the unlocked bucket. Create a file called `crank.ts`:

{% code-tabs-imported from="genesis/launch_token_crank" frameworks="umi" filename="crank" /%}

Run after the deposit period ends:

```bash
npx ts-node crank.ts
```

### Users Claim Tokens

After the crank, users can claim their tokens. Each user receives tokens proportional to their share of total deposits:

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

Users can claim via your frontend or using this script (create `claim.ts`):

{% code-tabs-imported from="genesis/launch_token_claim" frameworks="umi" filename="claim" /%}

### Finalize: Revoke Authorities

After the launch is complete, revoke mint and freeze authorities. This signals to holders that no additional tokens can ever be minted.

{% callout type="warning" %}
**This is irreversible.** Once revoked, you can never mint additional tokens or freeze accounts. Only do this when you're certain the launch is complete.
{% /callout %}

Create `revoke.ts`:

{% code-tabs-imported from="genesis/launch_token_revoke" frameworks="umi" filename="revoke" /%}

## Next Steps

- [Genesis Overview](/smart-contracts/genesis) - Learn more about the Solana token launchpad
- [Launch Pool](/smart-contracts/genesis/launch-pool) - Detailed fair launch documentation
- [Presale](/smart-contracts/genesis/presale) - Run a token presale at a fixed price
- [Metaplex API](/api) - Query launch and token sale data via API
