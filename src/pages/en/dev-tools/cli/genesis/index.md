---
title: Overview
metaTitle: Genesis Overview | Metaplex CLI
description: Overview of Genesis CLI commands for launching tokens using the Metaplex CLI (mplx).
---

The `mplx genesis` commands let you run a full Genesis token launch from your terminal — creating accounts, configuring buckets, depositing, claiming, and revoking authorities.

## Prerequisites

- The Metaplex CLI installed and on your `PATH`
- A Solana keypair file (e.g., `~/.config/solana/id.json`)
- SOL for transaction fees
- An RPC endpoint configured via `mplx config rpc add` or passed with `-r`

Check your setup:

```bash
mplx genesis --help
```

## General Flow

Every Genesis launch follows the same high-level sequence:

1. **Create** — `genesis create` sets up the Genesis account and token mint.
2. **Add Buckets** — Add one or more buckets to define how tokens are distributed. Use `bucket add-launch-pool` for proportional distribution, `bucket add-presale` for fixed-price sales, or `bucket add-unlocked` for team/treasury allocations.
3. **Finalize** — `genesis finalize` locks the configuration. No more buckets can be added after this step.
4. **Deposit** — Users deposit quote tokens (e.g. wrapped SOL) into buckets during the deposit window using `genesis deposit` or `genesis presale deposit`.
5. **Withdraw** (optional) — Users can withdraw from launch pools during the deposit period with `genesis withdraw`.
6. **Transition** (optional) — If a launch pool has end behaviors, call `genesis transition` after deposits close to forward collected tokens to destination buckets.
7. **Claim** — After the claim period opens, users claim their base tokens with `genesis claim` or `genesis presale claim`. Treasury wallets use `genesis claim-unlocked`.
8. **Revoke** (optional) — `genesis revoke` permanently revokes mint and/or freeze authority on the token.

You can check the state of your launch at any point with `genesis fetch` and `genesis bucket fetch`.

## Command Reference

| Command | Description |
|---------|-------------|
| `genesis create` | Create a new Genesis account and token |
| `genesis finalize` | Lock configuration and activate the launch |
| `genesis fetch` | Fetch Genesis account details |
| `genesis revoke` | Revoke mint/freeze authority |
| `genesis bucket add-launch-pool` | Add a launch pool bucket |
| `genesis bucket add-presale` | Add a presale bucket |
| `genesis bucket add-unlocked` | Add an unlocked (treasury) bucket |
| `genesis bucket fetch` | Fetch bucket details by type |
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
