---
title: Launch (API)
metaTitle: Launch Commands | Metaplex CLI
description: Create and register token launches via the Genesis API using the Metaplex CLI (mplx).
keywords:
  - Genesis launch
  - token launch CLI
  - mplx genesis launch
  - Genesis API
  - Metaplex CLI
about:
  - Genesis API token launches
  - one-command token launch
  - launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: What is the difference between genesis launch create and the manual flow?
    a: The genesis launch create command is an all-in-one flow that calls the Genesis API to build transactions, signs and sends them, and registers the launch on the Metaplex platform — all in a single command. The manual flow requires separate create, bucket, finalize, and register steps.
  - q: When should I use genesis launch register?
    a: Use genesis launch register when you've already created a genesis account using the low-level CLI commands (genesis create, bucket add-launch-pool, etc.) and want to register it on the Metaplex platform to get a public launch page.
  - q: What network does the launch command use?
    a: The network is auto-detected from your configured RPC endpoint. You can override it with the --network flag (solana-mainnet or solana-devnet).
---

{% callout title="What You'll Do" %}
Use the Genesis API to create and register token launches in a single command:
- Create a complete token launch with `genesis launch create`
- Register an existing genesis account with `genesis launch register`
{% /callout %}

## Summary

The `genesis launch` commands provide a streamlined way to launch tokens using the Genesis API. Instead of manually creating a genesis account, adding buckets, finalizing, and registering separately, the API handles the full flow.

- **`genesis launch create`**: All-in-one command — builds transactions via the API, signs and sends them, and registers the launch
- **`genesis launch register`**: Registers an existing genesis account on the Metaplex platform to get a public launch page
- **metaplex.com compatible**: Launches created or registered through the API appear on [metaplex.com](https://metaplex.com) with a public launch page
- **Total supply**: Fixed at 1,000,000,000 tokens
- **Deposit period**: 48 hours

## Out of Scope

Manual genesis account creation, individual bucket configuration, presale setup, frontend development.

**Jump to:** [Launch Create](#launch-create) · [Launch Register](#launch-register) · [Locked Allocations](#locked-allocations) · [Common Errors](#common-errors) · [FAQ](#faq)

## Launch Create

The `mplx genesis launch create` command creates a new token launch via the Genesis API. It handles the entire flow:

1. Calls the Genesis API to build the on-chain transactions
2. Signs and sends them to the network
3. Registers the launch on the Metaplex platform

```bash {% title="Create a token launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

### Required Flags

| Flag | Description |
|------|-------------|
| `--name <string>` | Token name (1–32 characters) |
| `--symbol <string>` | Token symbol (1–10 characters) |
| `--image <string>` | Token image URL (must start with `https://gateway.irys.xyz/`) |
| `--tokenAllocation <integer>` | Launch pool token allocation (portion of 1B total supply) |
| `--depositStartTime <string>` | Deposit start time (ISO date string or unix timestamp) |
| `--raiseGoal <integer>` | Raise goal in whole units (e.g. 200 for 200 SOL) |
| `--raydiumLiquidityBps <integer>` | Raydium liquidity in basis points (2000–10000, i.e. 20%–100%) |
| `--fundsRecipient <string>` | Funds recipient wallet address |

### Optional Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--description <string>` | Token description (max 250 characters) | — |
| `--website <string>` | Project website URL | — |
| `--twitter <string>` | Project Twitter URL | — |
| `--telegram <string>` | Project Telegram URL | — |
| `--lockedAllocations <path>` | Path to JSON file with locked allocation configs | — |
| `--quoteMint <string>` | Quote mint: `SOL` or `USDC` | `SOL` |
| `--network <string>` | Network override: `solana-mainnet` or `solana-devnet` | Auto-detected |
| `--apiUrl <string>` | Genesis API base URL | `https://api.metaplex.com` |

### Examples

1. Basic launch with SOL:
```bash {% title="Basic launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

2. With USDC as quote mint:
```bash {% title="Launch with USDC" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 1709251200 \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --quoteMint USDC
```

3. With metadata and locked allocations:
```bash {% title="Full launch with metadata and allocations" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --description "A community token for builders" \
  --website "https://example.com" \
  --twitter "https://x.com/myproject" \
  --telegram "https://t.me/myproject" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --lockedAllocations allocations.json
```

### Output

On success, the command prints:
- **Genesis Account** address
- **Mint Address** of the new token
- **Launch ID** and **Launch Link** on the Metaplex platform
- **Token ID**
- Transaction signatures with explorer links

## Launch Register

The `mplx genesis launch register` command registers an existing genesis account with the Metaplex platform. Use this when you created a genesis account using the low-level CLI commands (`genesis create`, `bucket add-launch-pool`, etc.) and want a public launch page.

```bash {% title="Register a genesis account" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `genesisAccount` | Genesis account address to register | Yes |

### Flags

| Flag | Description | Required | Default |
|------|-------------|----------|---------|
| `--launchConfig <path>` | Path to JSON file with the launch configuration | Yes | — |
| `--network <string>` | Network override: `solana-mainnet` or `solana-devnet` | No | Auto-detected |
| `--apiUrl <string>` | Genesis API base URL | No | `https://api.metaplex.com` |

### Launch Config Format

The launch config JSON file uses the same format as the `launch create` input:

```json {% title="launch.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "My Token",
    "symbol": "MTK",
    "image": "https://gateway.irys.xyz/abc123",
    "description": "Optional description",
    "externalLinks": {
      "website": "https://example.com",
      "twitter": "https://x.com/myproject"
    }
  },
  "launchType": "project",
  "launch": {
    "launchpool": {
      "tokenAllocation": 500000000,
      "depositStartTime": "2025-03-01T00:00:00Z",
      "raiseGoal": 200,
      "raydiumLiquidityBps": 5000,
      "fundsRecipient": "<WALLET_ADDRESS>"
    }
  },
  "quoteMint": "SOL"
}
```

### Examples

1. Register with default network detection:
```bash {% title="Register launch" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

2. Register on devnet:
```bash {% title="Register on devnet" %}
mplx genesis launch register <GENESIS_ACCOUNT> \
  --launchConfig launch.json \
  --network solana-devnet
```

### Output

On success, the command prints:
- **Launch ID** and **Launch Link** on the Metaplex platform
- **Token ID** and **Mint Address**

If the account was already registered, the command reports that and shows the existing launch details.

## Locked Allocations

Locked allocations let you reserve a portion of the token supply with vesting schedules. Provide them as a JSON array file via `--lockedAllocations`.

```json {% title="allocations.json" %}
[
  {
    "name": "Team",
    "recipient": "<WALLET_ADDRESS>",
    "tokenAmount": 200000000,
    "vestingStartTime": "2025-04-01T00:00:00Z",
    "vestingDuration": { "value": 1, "unit": "YEAR" },
    "unlockSchedule": "MONTH",
    "cliff": {
      "duration": { "value": 3, "unit": "MONTH" },
      "unlockAmount": 50000000
    }
  }
]
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Name for this allocation |
| `recipient` | string | Wallet address of the recipient |
| `tokenAmount` | number | Number of tokens to allocate |
| `vestingStartTime` | string | ISO date string for when vesting begins |
| `vestingDuration` | object | Duration with `value` (number) and `unit` |
| `unlockSchedule` | string | How often tokens unlock |
| `cliff` | object | Optional cliff with `duration` and `unlockAmount` |

### Valid Time Units

`SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `TWO_WEEKS`, `MONTH`, `QUARTER`, `YEAR`

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| API request failed | Network issue or invalid input | Check the error response details — the command shows the API response body on validation errors |
| Locked allocations file not found | Wrong file path | Verify the path to your allocations JSON file |
| Must contain a JSON array | Allocations file is not an array | Ensure the JSON file contains an array `[...]`, not an object |
| raydiumLiquidityBps out of range | Value outside 2000–10000 | Use a value between 2000 (20%) and 10000 (100%) |
| Launch config missing required fields | Incomplete config for register | Ensure your launch config JSON has `token`, `launch`, and `launchType: "project"` |

## FAQ

**What is the difference between `genesis launch create` and the manual flow?**
The `genesis launch create` command is an all-in-one flow that calls the Genesis API to build transactions, signs and sends them, and registers the launch on the Metaplex platform — all in a single command. The manual flow requires separate `create`, `bucket add-launch-pool`, `finalize`, and register steps.

**When should I use `genesis launch register`?**
Use `genesis launch register` when you've already created a genesis account using the low-level CLI commands (`genesis create`, `bucket add-launch-pool`, etc.) and want to register it on the Metaplex platform to get a public launch page.

**What network does the launch command use?**
The network is auto-detected from your configured RPC endpoint. You can override it with the `--network` flag (`solana-mainnet` or `solana-devnet`).

**Can I use a custom quote mint?**
The API supports `SOL` (default) and `USDC`. Pass `--quoteMint USDC` to use USDC. Arbitrary mint addresses are not supported.

**What is the total token supply?**
The total supply is fixed at 1,000,000,000 tokens when using the API flow.
