---
title: Launch (API)
metaTitle: Launch Commands | Metaplex CLI
description: Create and register token launches via the Genesis API using the Metaplex CLI (mplx) — launchpool and bonding curve, with optional agent integration.
keywords:
  - Genesis launch
  - token launch CLI
  - mplx genesis launch
  - Genesis API
  - Metaplex CLI
  - bonding curve
  - agent token
about:
  - Genesis API token launches
  - one-command token launch
  - launch registration
  - bonding curve launch
  - agent token launch
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
  - q: What is the difference between launchpool and bonding-curve?
    a: Launchpool has a 48-hour deposit window where users deposit SOL and receive tokens proportionally. Bonding curve starts trading immediately with a constant product AMM — price rises as SOL flows in, and the curve auto-graduates to Raydium CPMM when all tokens are sold.
  - q: Can I link an agent to a token launch?
    a: Yes. Pass --agentMint with the agent's Core asset address. This auto-derives the creator fee wallet from the agent's PDA. Add --agentSetToken to permanently link the token to the agent (irreversible).
---

{% callout title="What You'll Do" %}
Use the Genesis API to create and register token launches in a single command:
- Create a **launchpool** (48h deposit window, proportional distribution)
- Create a **bonding curve** (instant trading, auto-graduates to Raydium)
- Optionally link a launch to an [agent](/agents/mint-agent) with `--agentMint`
- Register an existing genesis account with `genesis launch register`
{% /callout %}

## Summary

The `genesis launch` commands provide a streamlined way to launch tokens using the Genesis API. Instead of manually creating a genesis account, adding buckets, finalizing, and registering separately, the API handles the full flow.

- **`genesis launch create`**: All-in-one command — builds transactions via the API, signs and sends them, and registers the launch
- **`genesis launch register`**: Registers an existing genesis account on the Metaplex platform to get a public launch page
- **Two launch types**: `launchpool` (default, 48h deposit, configurable allocations) and `bonding-curve` (instant bonding curve, no deposit window)
- **Agent support**: Link a launch to a registered agent with `--agentMint` and optionally `--agentSetToken`
- **metaplex.com compatible**: Launches created or registered through the API appear on [metaplex.com](https://metaplex.com) with a public launch page
- **Total supply**: Currently fixed at 1,000,000,000 tokens

## Out of Scope

Manual genesis account creation, individual bucket configuration, presale setup, frontend development.

**Jump to:** [Launch Create](#launch-create) · [Bonding Curve](#bonding-curve) · [Agent Launches](#agent-launches) · [Launch Register](#launch-register) · [Locked Allocations](#locked-allocations) · [Common Errors](#common-errors) · [FAQ](#faq)

## Launch Create

The `mplx genesis launch create` command creates a new token launch via the Genesis API. It handles the entire flow:

1. Calls the Genesis API to build the on-chain transactions
2. Signs and sends them to the network
3. Registers the launch on the Metaplex platform

Two launch types are available:

- **`launchpool`** (default): 48-hour deposit window, proportional token distribution, configurable allocations. Requires `--tokenAllocation`, `--depositStartTime`, `--raiseGoal`, `--raydiumLiquidityBps`, and `--fundsRecipient`.
- **`bonding-curve`**: Instant bonding curve (constant product AMM). Trading starts immediately — no deposit window. Auto-graduates to Raydium CPMM when all tokens are sold. Only requires `--name`, `--symbol`, and `--image`.

### Launchpool Example

```bash {% title="Create a launchpool launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

### All Flags

| Flag | Description | Required | Default |
|------|-------------|----------|---------|
| `--launchType <string>` | `launchpool` or `bonding-curve` | No | `launchpool` |
| `--name <string>` | Token name (1–32 characters) | Yes | — |
| `--symbol <string>` | Token symbol (1–10 characters) | Yes | — |
| `--image <string>` | Token image URL (must start with `https://gateway.irys.xyz/`) | Yes | — |
| `--tokenAllocation <integer>` | Launch pool token allocation (portion of 1B total supply) | Launchpool only | — |
| `--depositStartTime <string>` | Deposit start time (ISO date string or unix timestamp) | Launchpool only | — |
| `--raiseGoal <integer>` | Raise goal in whole units (e.g. 250 = 250 SOL) | Launchpool only | — |
| `--raydiumLiquidityBps <integer>` | Raydium liquidity in basis points (2000–10000, i.e. 20%–100%) | Launchpool only | — |
| `--fundsRecipient <string>` | Wallet receiving unlocked portion of raised funds | Launchpool only | — |
| `--creatorFeeWallet <string>` | Wallet to receive creator fees from swaps | No (bonding-curve only) | Launching wallet |
| `--firstBuyAmount <number>` | SOL amount for fee-free initial purchase at launch | No (bonding-curve only) | — |
| `--agentMint <string>` | Agent's Core asset address — auto-derives creator fee wallet from agent PDA | No | — |
| `--agentSetToken` | Permanently link the launched token to the agent (**irreversible**). Requires `--agentMint` | No | `false` |
| `--description <string>` | Token description (max 250 characters) | No | — |
| `--website <string>` | Project website URL | No | — |
| `--twitter <string>` | Project Twitter URL | No | — |
| `--telegram <string>` | Project Telegram URL | No | — |
| `--lockedAllocations <path>` | Path to JSON file with locked allocation configs (launchpool only) | No | — |
| `--quoteMint <string>` | Quote mint (`SOL` or `USDC`) | No | `SOL` |
| `--network <string>` | Network override: `solana-mainnet` or `solana-devnet` | No | Auto-detected |
| `--apiUrl <string>` | Genesis API base URL | No | `https://api.metaplex.com` |

### Launchpool Examples

1. Basic launch with SOL:
```bash {% title="Basic launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
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
  --raiseGoal 5000 \
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
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --lockedAllocations allocations.json
```

## Bonding Curve

A bonding curve launch creates a constant product AMM where trading starts immediately. Price rises as SOL flows into the curve. When all tokens are sold, the curve auto-graduates to a Raydium CPMM pool.

```bash {% title="Basic bonding curve launch" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

Only `--name`, `--symbol`, and `--image` are required — all protocol parameters use defaults.

### With Creator Fee

Direct a portion of swap fees to a specific wallet:

```bash {% title="Bonding curve with creator fee" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --creatorFeeWallet <FEE_WALLET_ADDRESS>
```

### With First Buy

Reserve a fee-free initial purchase for the launching wallet:

```bash {% title="Bonding curve with first buy" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --firstBuyAmount 0.1
```

The first buy amount is in SOL (e.g. `0.1` = 0.1 SOL). No protocol or creator fee is charged on the first buy.

## Agent Launches

Link a token launch to a registered [agent](/agents/mint-agent) by passing `--agentMint`. This works with both launchpool and bonding curve launch types.

When `--agentMint` is provided:
- The **creator fee wallet** is auto-derived from the agent's Core asset signer PDA
- For bonding curves, the **first buy buyer** defaults to the agent PDA (if `--firstBuyAmount` is set)

```bash {% title="Bonding curve with agent" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

{% callout title="agentSetToken is irreversible" type="warning" %}
`--agentSetToken` permanently links the launched token to the agent. This cannot be undone. Omit it to launch without linking, then link later with `mplx agents set-agent-token`.
{% /callout %}

### End-to-End: Register Agent + Launch Token

```bash {% title="Register agent then launch token" %}
# 1. Register a new agent
mplx agents register --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
# Note the asset address from the output (e.g. 7BQj...)

# 2. Launch a bonding curve token linked to the agent
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <ASSET_ADDRESS> --agentSetToken

# 3. (Optional) Verify the agent has a token linked
mplx agents fetch <ASSET_ADDRESS>
```

{% callout title="RPC propagation delay" type="note" %}
If step 2 fails with "Agent is not owned by the connected wallet", the API backend hasn't indexed the new agent yet. The on-chain token creation may still have succeeded — check with `mplx agents fetch <ASSET>`. If the agent already shows a token set, only the platform registration failed; complete it with `mplx genesis launch register`. When scripting both steps, add a ~30 second delay between agent registration and the launch command.
{% /callout %}

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

The launch config JSON file uses the same format as the `launch create` input.

**Launchpool config:**

```json {% title="launch-launchpool.json" %}
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
  "launchType": "launchpool",
  "launch": {
    "launchpool": {
      "tokenAllocation": 500000000,
      "depositStartTime": "2025-03-01T00:00:00Z",
      "raiseGoal": 250,
      "raydiumLiquidityBps": 5000,
      "fundsRecipient": "<WALLET_ADDRESS>"
    }
  },
  "quoteMint": "SOL"
}
```

**Bonding curve config:**

```json {% title="launch-bonding-curve.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "My Token",
    "symbol": "MTK",
    "image": "https://gateway.irys.xyz/abc123"
  },
  "launchType": "bondingCurve",
  "launch": {
    "creatorFeeWallet": "<FEE_WALLET_ADDRESS>",
    "firstBuyAmount": 0.1
  },
  "quoteMint": "SOL"
}
```

**Bonding curve with agent config:**

```json {% title="launch-agent.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "Agent Token",
    "symbol": "AGT",
    "image": "https://gateway.irys.xyz/abc123"
  },
  "launchType": "bondingCurve",
  "agent": {
    "mint": "<AGENT_CORE_ASSET_ADDRESS>",
    "setToken": true
  },
  "launch": {},
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
| Agent is not owned by the connected wallet | API backend hasn't indexed a freshly registered agent | Wait ~30 seconds and retry, or check `mplx agents fetch` — the on-chain launch may have succeeded even if registration failed |
| Agent already has a different agent token set | `--agentSetToken` was used on a prior launch for this agent | Agent token linking is irreversible and one-time only. Launch without `--agentSetToken` or use a different agent |
| Locked allocations file not found | Wrong file path | Verify the path to your allocations JSON file |
| Must contain a JSON array | Allocations file is not an array | Ensure the JSON file contains an array `[...]`, not an object |
| raydiumLiquidityBps out of range | Value outside 2000–10000 | Use a value between 2000 (20%) and 10000 (100%) |
| Launch config missing required fields | Incomplete config for register | Ensure your launch config JSON has `token`, `launch`, and a valid `launchType` |

## FAQ

**What is the difference between `genesis launch create` and the manual flow?**
The `genesis launch create` command is an all-in-one flow that calls the Genesis API to build transactions, signs and sends them, and registers the launch on the Metaplex platform — all in a single command. The manual flow requires separate `create`, `bucket add-launch-pool`, `finalize`, and register steps.

**What is the difference between launchpool and bonding-curve?**
Launchpool has a 48-hour deposit window where users deposit SOL and receive tokens proportionally. Bonding curve starts trading immediately with a constant product AMM — price rises as SOL flows in, and the curve auto-graduates to Raydium CPMM when all tokens are sold.

**Can I link an agent to a token launch?**
Yes. Pass `--agentMint` with the agent's Core asset address. This auto-derives the creator fee wallet from the agent's PDA. Add `--agentSetToken` to permanently link the token to the agent (irreversible). Works with both launchpool and bonding curve.

**When should I use `genesis launch register`?**
Use `genesis launch register` when you've already created a genesis account using the low-level CLI commands (`genesis create`, `bucket add-launch-pool`, etc.) and want to register it on the Metaplex platform to get a public launch page.

**What network does the launch command use?**
The network is auto-detected from your configured RPC endpoint. You can override it with the `--network` flag (`solana-mainnet` or `solana-devnet`).

**Can I use a custom quote mint?**
The API currently supports `SOL` (default) and `USDC`. Pass `--quoteMint USDC` to use USDC.

**What is the total token supply?**
The total supply is currently fixed at 1,000,000,000 tokens when using the API flow.
