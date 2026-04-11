# Metaplex Genesis

Use this file when the user asks about Genesis token launches, launch mechanisms, bonding curves, launch pools, presales, swaps, or the Genesis CLI/SDK flow.

Human docs: https://metaplex.com/docs/smart-contracts/genesis

## Agent Routing

- **Prefer CLI** for operational tasks — an agent creating a launch, executing swaps, or depositing should use `mplx` commands.
- **Prefer SDK** when the user is building an app, backend, script, or reusable integration that needs to send transactions programmatically.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

---

## Common Questions

Use this section to match what the user is asking to the right steps.

---

**"I want to launch a token"**

Choose the launch type that fits:

| Launch Type      | How it works                                                            | Best for                              |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------- |
| **Bonding Curve** | Trading starts immediately on an AMM curve, graduates to Raydium at ~85 SOL | Fast launch, no deposit window needed |
| **Launch Pool**  | 48-hour deposit window, proportional distribution, graduates to Raydium | Fair launch with a raise goal         |
| **Presale**      | Fixed-price sale during a deposit window                                | Known price, controlled distribution  |

Then follow the relevant flow below.

---

**"I want to launch a bonding curve token"**

1. [Initial Setup](#initial-setup) — verify CLI, RPC, and wallet
2. [Bonding Curve Launch](#bonding-curve-launch) — image prep instructions are in this section

---

**"I want to launch a bonding curve token linked to my agent"**

1. [Initial Setup](#initial-setup)
2. [Bonding Curve Launch](#bonding-curve-launch) — use `--agentMint` and `--agentSetToken` flags

---

**"I want to launch a launch pool token"**

1. [Initial Setup](#initial-setup)
2. [Launch Pool](#launch-pool) — image prep instructions are in this section

---

**"I want to buy or sell a bonding curve token"**

1. [Bonding Curve Swaps](#bonding-curve-swaps)

---

**"I want to integrate Genesis into my app or backend"**

1. [Initial Setup](#initial-setup) — SDK path
2. [SDK / API Client](#sdk--api-client) — use `createAndRegisterLaunch()`

---

**"I want to register an existing Genesis launch"**

1. [Register an Existing Launch](#register-an-existing-launch)

---

## Initial Setup

Before running any Genesis operation, verify the environment is ready.

### 1. Check CLI Installation

```bash
mplx --version
```

If the command is not found, install it:

```bash
npm install -g @metaplex-foundation/cli
```

### 2. Configure RPC Endpoint

```bash
mplx config rpcs list
```

If no RPC is configured, set one:

```bash
# Devnet (testing)
mplx config rpcs set devnet

# Mainnet (requires a custom RPC endpoint)
mplx config rpcs add mainnet <RPC_ENDPOINT>
mplx config rpcs set mainnet
```

### 3. Configure Wallet

```bash
mplx config wallets list
```

If no wallet is configured, create one:

```bash
mplx config wallets new --name main
```

Fund the wallet with enough SOL to cover the launch transaction and fees.

### 4. SDK Setup (for code paths)

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi-bundle-defaults
```

---

## Launch Types

### Bonding Curve Launch

The `--image` flag requires a publicly accessible URL. Use an existing URL if you have one, or upload a local file first:

```bash
mplx toolbox storage upload ./token-image.png
# Returns: https://gateway.irys.xyz/<HASH>
```

The CLI signs the upload with the active wallet keypair — the wallet must have SOL.

Trading starts immediately on a constant-product AMM. Price rises as buyers purchase. When the curve fills (~85 SOL), 100% of proceeds graduate to a Raydium LP — LP tokens are locked forever. No deposit window, no raise goal required.

- ~718M tokens allocated to the curve
- Virtual reserves: ~464.6M tokens and 55 SOL (sets initial price)
- Only SOL is supported as the quote token

**CLI:**

```bash
mplx genesis launch create \
  --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTKN" \
  --image "https://gateway.irys.xyz/<HASH>"
```

Optional flags:

| Flag               | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `--description`    | Token description (max 250 characters)                          |
| `--firstBuyAmount` | SOL amount for an initial buy at launch (max 85, fee-free)      |
| `--creatorFeeWallet` | Wallet to receive creator fees (defaults to active wallet)    |
| `--agentMint`      | Agent Asset Address — links this launch as the agent token      |
| `--agentSetToken`  | Permanently links launch to the agent (irreversible, one-time)  |
| `--website`        | Project website URL                                             |
| `--twitter`        | Project Twitter URL                                             |
| `--telegram`       | Project Telegram URL                                            |

**SDK:**

```ts
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis'

await createAndRegisterLaunch(umi, {}, {
  launchType: 'bonding-curve',
  name: 'My Token',
  symbol: 'MTKN',
  image: 'https://gateway.irys.xyz/<HASH>',
  network: 'solana-mainnet',
})
```

Use `createLaunch()` instead of `createAndRegisterLaunch()` for custom signing or Jito bundles. Then call `signAndSendLaunchTransactions()` and `registerLaunch()` manually after on-chain confirmation.

---

### Launch Pool

The `--image` flag requires a publicly accessible URL. Use an existing URL if you have one, or upload a local file first with `mplx toolbox storage upload ./token-image.png`.

Opens a 48-hour deposit window. Participants deposit SOL (or USDC) toward a raise goal. Distribution is proportional — each depositor receives tokens proportional to their share of total deposits. After the window closes and the goal is met, the token graduates to Raydium. LP tokens are locked for 1 year (quarterly unlock).

**CLI:**

```bash
mplx genesis launch create \
  --launchType launchpool \
  --name "My Token" \
  --symbol "MTKN" \
  --image "https://gateway.irys.xyz/<HASH>" \
  --tokenAllocation 500000000 \
  --depositStartTime "2026-06-01T00:00:00Z" \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

Required flags:

| Flag                    | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `--name`                | Token name (1-32 characters)                                                                  |
| `--symbol`              | Token symbol (1-10 characters)                                                                |
| `--image`               | Publicly accessible image URL. Use an existing URL or upload with `mplx toolbox storage upload` |
| `--depositStartTime`    | Deposit window start (ISO date string or Unix timestamp)                                      |
| `--tokenAllocation`     | Tokens allocated to the pool (50M–500M of 1B total supply)                                    |
| `--raiseGoal`           | Raise goal in whole units. Minimum: 250 SOL or 25,000 USDC                                    |
| `--raydiumLiquidityBps` | Percentage of raised funds going to Raydium LP, in basis points (2000–10000, i.e. 20%–100%)   |
| `--fundsRecipient`      | Wallet that receives the unlocked portion of raised funds                                     |

Optional flags: `--description`, `--quoteMint` (`SOL`, `USDC`, or mint address), `--lockedAllocations`, `--website`, `--twitter`, `--telegram`.

Early depositors receive a bonus (up to 25%). Late withdrawers pay a penalty.

**Manual flow (low-level SDK):**

```ts
import {
  initializeV2,
  addLaunchPoolBucketV2,
  addUnlockedBucketV2,
  finalizeV2,
} from '@metaplex-foundation/genesis'

await initializeV2(umi, { name, symbol, totalSupply }).sendAndConfirm(umi)
await addLaunchPoolBucketV2(umi, { genesis, allocation, depositStart, depositEnd, claimStart, claimEnd }).sendAndConfirm(umi)
await addUnlockedBucketV2(umi, { genesis, recipient }).sendAndConfirm(umi)
await finalizeV2(umi, { genesis }).sendAndConfirm(umi)   // irreversible
```

Notes:
- Low-level commands use base units and Unix timestamps
- `finalizeV2` / `mplx genesis finalize` is irreversible
- Full supply must be allocated before finalizing — use unlocked buckets for the remainder
- Wrap SOL before manual deposits when the quote token is SOL

---

### Presale

Fixed-price sale during a deposit window. Price is determined by `quoteCap / allocation`. After the window, participants claim their tokens proportionally up to the cap.

**CLI (manual bucket flow):**

```bash
mplx genesis create --name <NAME> --symbol <SYMBOL> --totalSupply <AMOUNT>

mplx genesis bucket add-presale <GENESIS> \
  --allocation <AMOUNT> \
  --quoteCap <AMOUNT> \
  --depositStart <UNIX_TS> \
  --depositEnd <UNIX_TS> \
  --claimStart <UNIX_TS> \
  --bucketIndex <N>

mplx genesis finalize <GENESIS>
mplx genesis presale deposit <GENESIS> --amount <AMOUNT> --bucketIndex <N>
mplx genesis presale claim <GENESIS> --bucketIndex <N>
```

**SDK:**

```ts
import {
  addPresaleBucketV2,
  depositPresaleV2,
  claimPresaleV2,
} from '@metaplex-foundation/genesis'
```

Use `--minimumDeposit` and `--depositLimit` for deposit constraints.

---

## Bonding Curve Swaps

Buy or sell tokens on an active bonding curve.

**CLI:**

```bash
# Inspect curve state
mplx genesis swap <GENESIS_ADDRESS> --info

# Quote without swapping
mplx genesis swap <GENESIS_ADDRESS> --info --buyAmount <QUOTE_AMOUNT>
mplx genesis swap <GENESIS_ADDRESS> --info --sellAmount <BASE_AMOUNT>

# Execute swaps
mplx genesis swap <GENESIS_ADDRESS> --buyAmount <QUOTE_AMOUNT> --slippage <BPS>
mplx genesis swap <GENESIS_ADDRESS> --sellAmount <BASE_AMOUNT> --slippage <BPS>

# Inspect the bonding curve bucket
mplx genesis bucket fetch <GENESIS_ADDRESS> --type bonding-curve
```

Notes:
- CLI buy amounts are in quote-token base units — for SOL, `100000000` = 0.1 SOL
- `--slippage` is in basis points — `200` = 2%
- CLI buys can auto-wrap SOL; SDK swaps require explicit wSOL handling

**SDK:**

```ts
import {
  findBondingCurveBucketV2Pda,
  isSwappable,
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
} from '@metaplex-foundation/genesis'

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesis })
const swappable = await isSwappable(umi, bucketPda)
const quote = await getSwapResult(umi, { genesis, isBuy: true, amount })
const minOut = applySlippage(quote.amountOut, 200) // 2% slippage

await swapBondingCurveV2(umi, { genesis, isBuy: true, amount, minAmountOutScaled: minOut }).sendAndConfirm(umi)
```

---

## SDK / API Client

Use `createAndRegisterLaunch()` for the standard one-call integration. Use the lower-level functions when custom signing, Jito bundles, retries, or server-side transaction senders are needed.

```ts
import { createAndRegisterLaunch, createLaunch, signAndSendLaunchTransactions, registerLaunch } from '@metaplex-foundation/genesis'

// One-call flow
const result = await createAndRegisterLaunch(umi, {}, launchParams)

// Custom signing flow
const { transactions, launchConfig } = await createLaunch(umi, {}, launchParams)
await signAndSendLaunchTransactions(umi, transactions)
await registerLaunch(umi, {}, launchConfig)
```

The REST API endpoints used under the hood:
- `POST /v1/launches/create` — returns unsigned transactions
- `POST /v1/launches/register` — registers after on-chain confirmation

Prefer the SDK over direct REST calls unless the user specifically needs raw HTTP access.

---

## Register an Existing Launch

For a Genesis account created outside the CLI or SDK (e.g., manually on-chain):

```bash
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig <PATH_TO_JSON>
```

**SDK:**

```ts
await registerLaunch(umi, {}, { genesisAccount, launchConfig })
```

---

## CLI Quick Reference

```bash
# Image upload (required before launch)
mplx toolbox storage upload ./token-image.png

# Bonding curve launch
mplx genesis launch create --launchType bonding-curve --name <NAME> --symbol <SYMBOL> --image <IRYS_URL>

# Launch pool
mplx genesis launch create --launchType launchpool --name <NAME> --symbol <SYMBOL> --image <IRYS_URL> \
  --tokenAllocation <AMOUNT> --depositStartTime <ISO_DATE> --raiseGoal <SOL> \
  --raydiumLiquidityBps <BPS> --fundsRecipient <ADDR>

# Swaps
mplx genesis swap <GENESIS> --info
mplx genesis swap <GENESIS> --buyAmount <AMOUNT> --slippage <BPS>
mplx genesis swap <GENESIS> --sellAmount <AMOUNT> --slippage <BPS>

# Inspect
mplx genesis fetch <GENESIS>
mplx genesis bucket fetch <GENESIS> --type bonding-curve

# Register existing
mplx genesis launch register <GENESIS> --launchConfig <PATH>
```

---

## Notes

- `--image` accepts any publicly accessible URL. Use an existing URL if you have one, or upload a local file first with `mplx toolbox storage upload ./image.png`.
- `--agentSetToken` is irreversible — it permanently links the launch to the agent identity.
- `--agentMint` auto-derives the creator fee wallet from the agent's Asset Signer PDA.
- `finalize` / `finalizeV2` is irreversible — all buckets must be added first.
- LaunchPool `--raiseGoal` minimum is 250 SOL or 25,000 USDC.
- LaunchPool `--raydiumLiquidityBps` range: 2000–10000 (20%–100%).
- Bonding curves only support SOL as the quote token.
- Low-level manual flows use base units and Unix timestamps — not human-readable amounts or ISO dates.

---

## Troubleshooting

| Problem                                    | Solution                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `mplx: command not found`                  | Run `npm install -g @metaplex-foundation/cli`                                               |
| Image upload fails                         | Ensure wallet has SOL; the CLI signs Irys uploads with the active keypair                   |
| Launch fails — image URL rejected          | Use a publicly accessible URL; if uploading locally run `mplx toolbox storage upload` first |
| `raiseGoal` too low                        | Minimum is 250 SOL or 25,000 USDC                                                           |
| Agent not owned by connected wallet        | Wait ~30 seconds for on-chain propagation, then retry                                       |
| `finalize` fails — supply not fully allocated | Add unlocked buckets to account for the remainder before finalizing                      |

---

## Further Reading

| Resource              | Link                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| Genesis docs          | [metaplex.com/docs/smart-contracts/genesis](https://metaplex.com/docs/smart-contracts/genesis)   |
| Metaplex Skill        | [github.com/metaplex-foundation/skill](https://github.com/metaplex-foundation/skill)             |
| Agents (agent token)  | [metaplex.com/docs/agents](https://metaplex.com/docs/agents)                                     |
| Core (NFT standard)   | [metaplex.com/docs/smart-contracts/core](https://metaplex.com/docs/smart-contracts/core)         |
