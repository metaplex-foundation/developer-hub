---
title: Overview
metaTitle: Genesis Overview | Metaplex CLI
description: Overview of Genesis CLI commands for launching tokens using the Metaplex CLI (mplx).
keywords:
  - Genesis CLI
  - token launch CLI
  - mplx genesis
  - Solana token launch
  - Metaplex CLI
about:
  - Genesis token launches
  - Metaplex CLI
  - token distribution
  - launch pools
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: What is the mplx genesis command?
    a: The mplx genesis command group lets you run a full Genesis token launch from your terminal — creating accounts, configuring buckets, depositing, claiming, and revoking authorities.
  - q: What are the different bucket types in Genesis?
    a: Genesis has three bucket types — launch pool (proportional distribution based on deposits), presale (fixed-price token sale), and unlocked (team/treasury allocations that can claim directly).
  - q: Do I need to wrap SOL before depositing?
    a: Yes. If using SOL as the quote token, wrap it first with mplx toolbox sol wrap before depositing into any bucket.
  - q: Can I undo finalization?
    a: No. Finalization is irreversible. Once finalized, no more buckets can be added and the configuration is locked.
  - q: How are token amounts specified?
    a: All amounts are in base units. With 9 decimals, 1,000,000 tokens = 1000000000000000 base units. Deposit amounts use quote token base units (lamports for SOL).
---

{% callout title="What This Covers" %}
The complete CLI reference for Genesis token launches:
- **API flow**: Create and register launches with a single command via the Genesis API
- **Manual flow**: Creating Genesis accounts, configuring buckets, depositing, claiming, and revoking
{% /callout %}

## Summary

The `mplx genesis` commands let you run a full Genesis token launch from your terminal — creating accounts, configuring buckets, depositing, claiming, and revoking authorities.

- **Tool**: Metaplex CLI (`mplx`) with the `genesis` command group
- **Bucket types**: Launch pool (proportional), presale (fixed-price), unlocked (treasury)
- **Quote token (manual flow)**: Wrapped SOL by default, any SPL token mint address supported
- **Quote token (API flow)**: Currently supports SOL or USDC only
- **Irreversible actions**: `finalize` and `revoke` cannot be undone

**Jump to:** [Prerequisites](#prerequisites) · [General Flow](#general-flow) · [Command Reference](#command-reference) · [Common Errors](#common-errors) · [FAQ](#faq) · [Glossary](#glossary)


## Prerequisites

- The Metaplex CLI installed and on your `PATH`
- A Solana keypair file (e.g., `~/.config/solana/id.json`)
- SOL for transaction fees
- An RPC endpoint configured via `mplx config rpc add` or passed with `-r`

Check your setup:

```bash {% title="Check CLI" %}
mplx genesis --help
```

## General Flow

There are two ways to launch a token with the Genesis CLI:

### API Flow (Recommended)

Use `genesis launch create` for an all-in-one flow that calls the Genesis API, builds and signs transactions, and registers your launch on the Metaplex platform — all in a single command. Two launch types are available: **launchpool** (default, 48h deposit window) and **bonding-curve** (instant trading). Launches created through the API are compatible with [metaplex.com](https://metaplex.com) and will appear on the platform with a public launch page.

```bash {% title="Launchpool (default)" %}
mplx genesis launch create \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

```bash {% title="Bonding curve (instant)" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

Both launch types support linking to a registered [agent](/agents/mint-agent) with `--agentMint` and `--agentSetToken`.

See [Launch (API)](/dev-tools/cli/genesis/launch) for full details.

### Manual Flow

For full control over every step:

1. **Create** — `genesis create` sets up the Genesis account and token mint.
2. **Add Buckets** — Add one or more buckets to define how tokens are distributed. Use `bucket add-launch-pool` for proportional distribution, `bucket add-presale` for fixed-price sales, or `bucket add-unlocked` for team/treasury allocations.
3. **Finalize** — `genesis finalize` locks the configuration. No more buckets can be added after this step.
4. **Deposit** — Users deposit quote tokens (e.g. wrapped SOL) into buckets during the deposit window using `genesis deposit` or `genesis presale deposit`.
5. **Withdraw** (optional) — Users can withdraw from launch pools during the deposit period with `genesis withdraw`.
6. **Transition** (optional) — If a launch pool has end behaviors, call `genesis transition` after deposits close to forward collected tokens to destination buckets.
7. **Claim** — After the claim period opens, users claim their base tokens with `genesis claim` or `genesis presale claim`. Treasury wallets use `genesis claim-unlocked`.
8. **Revoke** (optional) — `genesis revoke` permanently revokes mint and/or freeze authority on the token.

If you used the manual flow and want a public launch page, use `genesis launch register` to register your genesis account on the Metaplex platform.

You can check the state of your launch at any point with `genesis fetch` and `genesis bucket fetch`.

## Command Reference

| Command | Description |
|---------|-------------|
| `genesis launch create` | Create and register a launch via the Genesis API (all-in-one) |
| `genesis launch register` | Register an existing genesis account on the Metaplex platform |
| `genesis create` | Create a new Genesis account and token |
| `genesis finalize` | Lock configuration and activate the launch |
| `genesis fetch` | Fetch Genesis account details |
| `genesis revoke` | Revoke mint/freeze authority |
| `genesis bucket add-launch-pool` | Add a launch pool bucket |
| `genesis bucket add-presale` | Add a presale bucket |
| `genesis bucket add-unlocked` | Add an unlocked (treasury) bucket |
| `genesis bucket fetch` | Fetch bucket details by type |
| `genesis bucket index` | List and index buckets for a Genesis account |
| `genesis deposit` | Deposit into a launch pool |
| `genesis withdraw` | Withdraw from a launch pool |
| `genesis transition` | Execute end behaviors after deposit period |
| `genesis claim` | Claim tokens from a launch pool |
| `genesis claim-unlocked` | Claim from an unlocked bucket |
| `genesis presale deposit` | Deposit into a presale bucket |
| `genesis presale claim` | Claim tokens from a presale bucket |

## Notes

- `totalSupply` and `allocation` are in base units — with 9 decimals, `1000000000000000` = 1,000,000 tokens
- Deposit and withdraw amounts are in quote token base units (lamports for SOL, where 1 SOL = 1,000,000,000 lamports)
- If using SOL as the quote token, wrap it first with `mplx toolbox sol wrap <amount>`
- Finalization is irreversible — double-check all bucket configurations before running `genesis finalize`
- Run `mplx genesis <command> --help` for full flag documentation on any command
- See the [Genesis documentation](/smart-contracts/genesis) for concepts, lifecycle details, and SDK guides

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Account not found | Wrong Genesis address or wrong network | Verify the address and check your RPC endpoint with `mplx config rpc list` |
| Genesis already finalized | Trying to add buckets after `finalize` | Finalization is irreversible — create a new Genesis account if the configuration is wrong |
| Allocation exceeds total supply | Sum of bucket allocations exceeds `totalSupply` | Reduce allocations so they sum to at most `totalSupply` |
| Deposit period not active | Depositing outside the deposit window | Check timestamps with `genesis bucket fetch` — deposits only work between `depositStart` and `depositEnd` |
| Claim period not active | Claiming before the claim window opens | Wait until after `claimStart` timestamp |
| Insufficient funds | Not enough SOL or quote tokens in wallet | Fund your wallet and wrap SOL if needed with `mplx toolbox sol wrap` |
| No wrapped SOL | Depositing unwrapped SOL | Wrap SOL first: `mplx toolbox sol wrap <amount>` |

## FAQ

**What is the mplx genesis command?**
The `mplx genesis` command group lets you run a full Genesis token launch from your terminal — creating accounts, configuring buckets, depositing, claiming, and revoking authorities.

**What are the different bucket types in Genesis?**
Genesis has three bucket types: **launch pool** (proportional distribution based on deposits), **presale** (fixed-price token sale), and **unlocked** (team/treasury allocations that can claim directly).

**Do I need to wrap SOL before depositing?**
Yes. If using SOL as the quote token, wrap it first with `mplx toolbox sol wrap <amount>` before depositing into any bucket.

**Can I undo finalization?**
No. Finalization is irreversible. Once finalized, no more buckets can be added and the configuration is locked. Double-check everything before running `genesis finalize`.

**How are token amounts specified?**
All amounts are in base units. With 9 decimals, 1,000,000 tokens = `1000000000000000` base units. Deposit amounts use quote token base units (lamports for SOL, where 1 SOL = 1,000,000,000 lamports).

**Can I have multiple buckets of the same type?**
Yes. Use the `--bucketIndex` flag to specify different indices for each bucket of the same type.

## Glossary

| Term | Definition |
|------|------------|
| **Genesis Account** | The PDA that manages an entire token launch — holds configuration, bucket references, and mint authority |
| **Bucket** | A distribution channel within a Genesis launch that defines how a portion of tokens is allocated and distributed |
| **Launch Pool** | Bucket type that collects deposits during a window and distributes tokens proportionally to depositors |
| **Presale** | Bucket type that sells tokens at a fixed price determined by `quoteCap / allocation` |
| **Unlocked Bucket** | Bucket type for team/treasury — the designated recipient can claim tokens or forwarded quote tokens directly |
| **Quote Token** | The token deposited by users (usually wrapped SOL) in exchange for base tokens |
| **Base Token** | The token being launched and distributed to depositors |
| **Base Units** | The smallest denomination of a token — with 9 decimals, 1 token = 1,000,000,000 base units |
| **End Behavior** | Rules that forward collected quote tokens from a launch pool to destination buckets after the deposit period |
| **Finalize** | Irreversible action that locks the Genesis configuration and activates the launch |
| **Claim Schedule** | Vesting rules that control how tokens are released over time after the claim period opens |
| **Allocation** | The amount of base tokens assigned to a specific bucket, specified in base units |
