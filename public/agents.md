# Metaplex Agents

Use this file when the user asks about creating, registering, reading, running, or managing agents on Solana using the Metaplex Agent Registry.

Human docs: https://metaplex.com/docs/agents

## Agent Routing

- **Prefer CLI** for operational tasks — an agent performing actions (registering, funding, launching, transferring) should use `mplx` commands.
- **Prefer SDK** when the user is building an app, backend, script, or reusable integration that needs to send transactions programmatically.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

---

## Common Questions

Use this section to match what the user is asking to the right steps. For compound tasks, follow each step in order.

---

**"I want to create / register an agent"**

1. [Initial Setup](#initial-setup) — verify CLI, RPC, and wallet
2. [Register a New Agent](#register-a-new-agent)
3. [Activate the Agent Wallet](#activate-the-agent-wallet) — fund and switch to the agent PDA

---

**"I want to create an agent with an agent token"**

An agent token is a Genesis token launch permanently linked to the agent. Both can be created in a single command.

1. [Initial Setup](#initial-setup) — verify CLI, RPC, and wallet
2. [Register a New Agent](#register-a-new-agent) — get your Asset Address
3. [Activate the Agent Wallet](#activate-the-agent-wallet) — fund and switch to the agent PDA
4. [Agent Token: Link a Genesis Token Launch to Your Agent](#agent-token-link-a-genesis-token-launch-to-your-agent-optional-irreversible) — use `mplx genesis launch create --agentMint <ASSET_ADDRESS> --agentSetToken` to create the launch and link it in one command

---

**"I want to check if my agent is registered"**

1. [Read Agent Data](#read-agent-data) — run `mplx agents fetch <ASSET_ADDRESS>`

---

**"I want another wallet to run transactions on behalf of my agent"**

1. [Initial Setup](#initial-setup) — verify CLI, RPC, and wallet
2. [Register a New Agent](#register-a-new-agent) — if not already registered
3. [Activate the Agent Wallet](#activate-the-agent-wallet)
4. [Delegate Execution](#delegate-execution) — register the executor profile and delegate

---

**"I want to launch a token as my agent"** (without linking it as the agent token)

1. [Initial Setup](#initial-setup)
2. [Activate the Agent Wallet](#activate-the-agent-wallet) — the agent PDA will be the launch creator
3. [Launch a Token](#launch-a-token) under Agent Wallet Operations

---

**"I want to create a regular SPL token"**

This is not an agent token. Use `mplx toolbox token create` — see [Manage Tokens and SOL](#manage-tokens-and-sol).

---

**"I want to transfer SOL or tokens as my agent"**

1. [Activate the Agent Wallet](#activate-the-agent-wallet) — switch to the agent PDA first
2. [Manage Tokens and SOL](#manage-tokens-and-sol)

---

## Initial Setup

Before running any agent operation, verify the environment is ready. Work through each check in order and resolve any gaps before proceeding.

### 1. Check CLI Installation

```bash
mplx --version
```

If the command is not found, install it:

```bash
npm install -g @metaplex-foundation/cli
```

Then verify:

```bash
mplx --version
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

The CLI outputs the wallet's public key. Fund it with at least **0.1 SOL** to cover registration fees and transaction costs. Do not use the faucet on devnet — it is almost always drained.

### 4. SDK Setup (for code paths)

Install the required packages:

```bash
npm install @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core @metaplex-foundation/mpl-agent-registry
```

Initialize Umi:

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import pkg from '@metaplex-foundation/mpl-agent-registry'

const { mplAgentIdentity, mplAgentTools } = pkg

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplCore())
  .use(mplAgentIdentity())
  .use(mplAgentTools())
```

The package ships as CommonJS. In ESM files, import the default export and destructure named exports from it.

---

## What Is a Metaplex Agent

A Metaplex agent is an **MPL Core asset** with an on-chain agent identity attached to it.

- The **Core asset** is a lightweight single-account NFT on Solana. It stores the agent's name, description, and metadata URI.
- The **Agent Identity** is a PDA record and `AgentIdentity` plugin attached to the Core asset. It links the asset to an off-chain registration document (EIP-8004) that describes the agent's capabilities and services.
- The **Agent Wallet** (Asset Signer PDA) is a wallet address derived from the Core asset. It has no private key — outgoing actions use Core Execute through delegated execution.
- The **Executive** is an off-chain operator wallet authorized to execute transactions on behalf of the agent via Core Execute.
- The **Registration URI** points to a public JSON document describing the agent's type, services, and trust models.

### Program IDs

| Program              | ID                                             |
| -------------------- | ---------------------------------------------- |
| Agent Identity       | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| Agent Tools          | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |

---

## Operations

### Register a New Agent

Creates a new Core asset and registers agent identity in one flow. Use this when the user does not yet have a Core asset.

**CLI:**

```bash
mplx agents register --new \
  --name "My Agent" \
  --description "What my agent does" \
  --image "./avatar.png" \
  --services '[{"name":"MCP","endpoint":"https://myagent.com/mcp"}]'
```

Required flags: `--name`, `--description`, `--image`.

Optional flags:

| Flag                | Description                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| `--services`        | JSON array of service endpoints (name, endpoint, version, skills, domains) |
| `--supported-trust` | JSON array of trust models, e.g. `'["reputation","tee-attestation"]'`      |
| `--collection`      | Collection address if this agent belongs to a collection                   |
| `--save-document`   | Save the generated registration JSON to a local file                       |

Interactive wizard:

```bash
mplx agents register --new --wizard
```

From a pre-built JSON document:

```bash
mplx agents register --new --from-file "./agent-registration.json"
```

`--wizard`, `--from-file`, and inline `--name` modes are mutually exclusive.

After the command completes, the CLI outputs your **Asset Address**. Save it — every subsequent step (activating the agent wallet, linking a token, delegating execution) requires it.

**SDK:**

```ts
import pkg from '@metaplex-foundation/mpl-agent-registry'

const { mintAndSubmitAgent } = pkg

const { signature, assetAddress } = await mintAndSubmitAgent(
  umi,
  {},
  {
    wallet: umi.identity.publicKey,
    name: 'My Agent',
    uri: 'https://example.com/core-asset.json',
    agentMetadata: {
      type: 'AI Agent',
      name: 'My Agent',
      description: 'What my agent does',
      image: 'https://example.com/agent.png',
      services: [{ type: 'MCP', endpoint: 'https://example.com/mcp' }],
      supportedTrust: ['reputation'],
    },
    network: 'solana-devnet',
  }
)
```

Supported networks: `solana-mainnet`, `solana-devnet`, `localnet`, `eclipse-mainnet`, `sonic-mainnet`, `sonic-devnet`, `fogo-mainnet`, `fogo-testnet`.

Use `mintAgent()` instead of `mintAndSubmitAgent()` to get the unsigned transaction for custom signing. Use `isAgentApiError`, `isAgentApiNetworkError`, and `isAgentValidationError` to classify failures.

---

### Register on an Existing Core Asset

Use when the user already has a Core asset and wants to attach an agent identity to it.

**CLI:**

```bash
# Direct instruction mode on an existing Core asset
mplx agents register <ASSET_ADDRESS> --use-ix --from-file ./agent-doc.json
```

**SDK:**

```ts
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry'

await registerIdentityV1(umi, {
  asset: assetPublicKey,
  collection: collectionPublicKey,           // omit if no collection
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi)
```

Registration is one-time per asset. Attempting to register a second time fails.

#### Registration Document Format (EIP-8004)

The registration URI must point to a public JSON document:

```json
{
  "type": "AI Agent",
  "name": "Example Agent",
  "description": "Autonomous agent description",
  "image": "https://example.com/agent.png",
  "services": [
    { "type": "MCP", "endpoint": "https://example.com/mcp" }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

Required fields: `type`, `name`, `description`, `image`.

Common service types: `web`, `A2A`, `MCP`, `OASF`, `DID`, `email`, and custom names.

Supported trust models: `reputation`, `crypto-economic`, `tee-attestation`.

---

### Read Agent Data

Use to verify a registration or read agent identity data.

**CLI:**

```bash
mplx agents fetch <ASSET_ADDRESS>
mplx agents fetch <ASSET_ADDRESS> --json
```

**SDK:**

```ts
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import {
  findAgentIdentityV2Pda,
  safeFetchAgentIdentityV2,
  findAssetSignerPda,
} from '@metaplex-foundation/mpl-agent-registry'

const [agentIdentityPda] = findAgentIdentityV2Pda(umi, { asset })
const identity = await safeFetchAgentIdentityV2(umi, agentIdentityPda)
// identity is null if not registered

const assetData = await fetchAsset(umi, asset)
const plugin = assetData.agentIdentities?.[0]

const [agentWallet] = findAssetSignerPda(umi, { asset })
```

Prefer V2 helpers for new reads. Fall back to `fetchAgentIdentityV1FromSeeds()` only for legacy identity accounts.

#### PDA Reference

| Account                  | Seeds                                                   | Size     |
| ------------------------ | ------------------------------------------------------- | -------- |
| `AgentIdentityV2`        | `["agent_identity", <asset_pubkey>]`                    | 104 bytes |
| `AgentIdentityV1`        | `["agent_identity", <asset_pubkey>]`                    | 40 bytes  |
| `Asset Signer PDA`       | Derived via `findAssetSignerPda()`                      | —        |

---

### Activate the Agent Wallet

After registering, register the agent's Signer PDA as a CLI wallet, fund it, and switch to it so all subsequent commands run as the agent.

```bash
# Add the agent PDA as a wallet
mplx config wallets add agent --asset <ASSET_ADDRESS>

# Fund the PDA from your main wallet
mplx toolbox sol transfer 0.5 <AGENT_PDA_ADDRESS>

# Switch the active wallet to the agent PDA
mplx config wallets set agent
```

Verify:

```bash
mplx toolbox sol balance
mplx core asset execute info <ASSET_ADDRESS>
```

Override the active wallet for a single command:

```bash
mplx toolbox sol balance -k /path/to/wallet.json
mplx toolbox sol transfer 0.01 <dest> -p /path/to/payer.json
```

---

### Delegate Execution

Use when another wallet (e.g., a separate executor service) needs to submit transactions on behalf of the agent.

**CLI:**

```bash
# One-time: register the executor's profile
mplx agents executive register

# Link the agent to the executor
mplx agents executive delegate <ASSET_ADDRESS> --executive <EXECUTIVE_WALLET_ADDRESS>

# Revoke delegation
mplx agents executive revoke <ASSET_ADDRESS> --executive <EXECUTIVE_WALLET_ADDRESS>
mplx agents executive revoke <ASSET_ADDRESS>    # revoke all
```

**SDK:**

```ts
import {
  registerExecutiveV1,
  delegateExecutionV1,
  revokeExecutionV1,
} from '@metaplex-foundation/mpl-agent-registry'

// Run with the executive wallet as signer
await registerExecutiveV1(umi, {}).sendAndConfirm(umi)

// Run with the asset owner as signer
await delegateExecutionV1(umi, {
  asset,
  executive: executivePublicKey,
}).sendAndConfirm(umi)

// Either the owner or executive can revoke
await revokeExecutionV1(umi, {
  asset,
  executive: executivePublicKey,
}).sendAndConfirm(umi)
```

The executive must register a profile before an agent can be delegated to it. Only the asset owner can delegate. Either the owner or executive can revoke.

PDA seeds:
- `ExecutiveProfileV1`: `["executive_profile", <authority>]`
- `ExecutionDelegateRecordV1`: `["execution_delegate_record", <executive_profile>, <agent_asset>]`

---

### Agent Token: Link a Genesis Token Launch to Your Agent (Optional, Irreversible)

An **agent token** is not a token the agent creates or holds — it is a permanent, one-time link between the agent's identity and a specific **Genesis token launch account**. Once set, it cannot be changed or unset.

This operation routes creator fees from that Genesis launch to the agent's Asset Signer PDA and associates the launch with the agent's on-chain identity. It is entirely optional and completely separate from agent registration.

**Do not confuse this with:**
- Creating fungible tokens (`mplx toolbox token create`) — use that to mint a new SPL token.
- General agent wallet operations — the agent PDA can hold and transfer any token without this step.

**Prerequisites:** a Genesis token launch must already exist (or be created in the same command) before this link can be made.

**CLI — one-step (recommended):**

`mplx genesis launch create` with `--agentMint` and `--agentSetToken` creates the Genesis token launch and links it to the agent in a single command — no separate `set-agent-token` call needed.

```bash
mplx genesis launch create \
  --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTKN" \
  --image "https://gateway.irys.xyz/<HASH>" \
  --agentMint <AGENT_ASSET_ADDRESS> \
  --agentSetToken
```

**CLI — two-step (existing launch only):**

Use `set-agent-token` only when the Genesis launch already exists and was not linked at creation time.

Switch to asset-signer mode first:

```bash
mplx config wallets add --name my-agent --type asset-signer --asset <AGENT_ASSET>
mplx config wallets set my-agent
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
```

**SDK:**

```ts
// Option A: create and link in one call
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis'

await createAndRegisterLaunch(umi, {
  // ... launch params ...
  agent: {
    mint: agentAssetAddress,
    setToken: true,
  },
})

// Option B: link to an existing Genesis account
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry'

await setAgentTokenV1(umi, {
  asset: agentAssetAddress,
  genesisAccount,
  authority: assetSignerPda,   // must be the Asset Signer PDA
}).sendAndConfirm(umi)
```

---

## Agent Wallet Operations

With the agent PDA set as the active wallet, all `mplx` commands execute as the agent:

```bash
mplx toolbox sol balance                          # PDA balance
mplx toolbox sol transfer 0.01 <dest>             # send SOL from PDA
mplx toolbox token transfer <mint> 100 <dest>     # send tokens from PDA
mplx core asset create --name "NFT" --uri "..."   # PDA is the creator
mplx core asset transfer <assetId> <newOwner>     # transfer PDA-owned assets
```

### Launch a Token

Upload the image first (Irys requires a signing keypair):

```bash
mplx toolbox storage upload ./token-image.png
# Returns: https://gateway.irys.xyz/<HASH>
```

**LaunchPool** — 48-hour deposit window, graduates to Raydium when the raise goal is met:

```bash
mplx genesis launch create \
  --launchType launchpool \
  --name "My Token" \
  --symbol "MTKN" \
  --image "https://gateway.irys.xyz/<HASH>" \
  --tokenAllocation 500000000 \
  --depositStartTime "2026-04-01T00:00:00Z" \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <AGENT_PDA_ADDRESS>
```

Required flags: `--name`, `--symbol`, `--image`, `--depositStartTime`, `--tokenAllocation`, `--raiseGoal`, `--raydiumLiquidityBps`, `--fundsRecipient`.

`--raiseGoal` minimum: 250 SOL or 25,000 USDC. `--raydiumLiquidityBps` range: 2000–10000 (20%–100%). Set `--fundsRecipient` to the agent PDA so raised funds flow directly to the operational wallet.

**Bonding Curve** — starts trading immediately, graduates to Raydium when the curve fills (~85 SOL):

```bash
mplx genesis launch create \
  --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTKN" \
  --image "https://gateway.irys.xyz/<HASH>"
```

Optional: `--firstBuyAmount <SOL>` (max 85) to execute the first buy atomically at launch.

Bonding curves only support SOL as the quote token. ~718M tokens are allocated to the curve; virtual reserves are ~464.6M tokens and 55 SOL.

### Create an NFT Collection

```bash
mplx core collection create --name "My Collection" --uri <METADATA_URI>
mplx core asset create --name "NFT #1" --uri <URI> --collection <COLLECTION_ADDRESS>

# Or mint from local files (image + metadata uploaded automatically)
mplx core asset create --files --image ./image.png --offchain ./metadata.json --collection <COLLECTION_ADDRESS>
```

For larger drops with allowlists, pricing, and start dates, use Candy Machine:

```bash
mplx cm create --wizard
```

### Manage Tokens and SOL

```bash
# Create a fungible token
mplx toolbox token create --name "My Token" --symbol "TKN" --decimals 9 --amount 1000000

# Transfer tokens
mplx toolbox token transfer <MINT> 100 <DESTINATION>

# Transfer SOL
mplx toolbox sol transfer 0.1 <DESTINATION>

# Check balances
mplx toolbox sol balance
```

### Manage NFTs

```bash
mplx core asset transfer <ASSET_ADDRESS> <NEW_OWNER>
mplx core asset update <ASSET_ADDRESS> --name "New Name" --uri <NEW_URI>
mplx core asset burn <ASSET_ADDRESS>
```

---

## CLI Quick Reference

```bash
# Setup
mplx config rpcs set devnet
mplx config rpcs add mainnet <RPC_ENDPOINT>
mplx config wallets new --name main
mplx config wallets list

# Agent identity
mplx agents register --new --name <NAME> --description <DESC> --image <PATH_OR_URI>
mplx agents fetch <ASSET_ADDRESS>
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>

# Agent wallet
mplx config wallets add agent --asset <ASSET_ADDRESS>
mplx config wallets set agent

# Executive delegation
mplx agents executive register
mplx agents executive delegate <AGENT_ASSET> --executive <EXECUTIVE_WALLET>
mplx agents executive revoke <AGENT_ASSET>

# Toolbox
mplx toolbox sol balance
mplx toolbox sol transfer <AMOUNT> <DESTINATION>
mplx toolbox token transfer <MINT> <AMOUNT> <DESTINATION>
mplx toolbox storage upload <FILE>
```

---

## Concepts

### Main Wallet

A standard Solana keypair that owns the agent's Core asset. It signs the execute instructions that authorize the PDA to act, and pays transaction fees.

### Agent Wallet (Asset Signer PDA)

Each Core asset has a derived **Asset Signer PDA** — a wallet address that only the asset's owner can authorize via CPI. When the asset-signer wallet is active in the CLI, all commands automatically build transactions with the PDA as the authority and wrap them in execute instructions signed by the main wallet.

### mpl-core Asset

A Metaplex Core asset is a lightweight, single-account NFT on Solana. It stores the agent's name, description, and metadata URI on-chain. Agent identity, delegation, and token linking all build on top of this.

### Agent Identity PDA

The `AgentIdentityV1` / `AgentIdentityV2` account is a PDA created by the `mpl-agent-registry` program. It links the Core asset to the `agentRegistrationUri`, making the agent's identity discoverable on-chain.

### EIP-8004

The [EIP-8004 Agent Registration](https://eips.ethereum.org/EIPS/eip-8004) standard defines a common JSON format for describing agent capabilities, services, and trust mechanisms. The registration URI must point to a document following this spec for interoperability with other agents and platforms.

---

## Notes

- If a Genesis API call reports the agent is not owned by the connected wallet immediately after registration, the on-chain write may still be propagating. Run `mplx agents fetch <ASSET_ADDRESS>` and wait ~30 seconds before retrying.
- "Agent token" specifically means a Genesis launch account linked to the agent identity — not any token the agent holds or creates. Setting it (`--agentSetToken` / `setAgentTokenV1`) is a one-time, irreversible operation.
- `--wizard`, `--from-file`, and inline `--name` registration modes are mutually exclusive.
- Asset owner must already be a saved wallet before adding an asset-signer wallet with `mplx config wallets add`.
- Bubblegum compressed NFT reads require a DAS-enabled RPC endpoint.
- Candy Machine CLI handles setup and item insertion; minting requires the SDK.

---

## Troubleshooting

| Problem                                 | Solution                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| `mplx: command not found`               | Run `npm install -g @metaplex-foundation/cli`                                         |
| Transaction failed — insufficient funds | Ensure the main wallet has enough SOL (0.1+ recommended)                              |
| Agent not appearing in registry         | Wait ~30 seconds for on-chain confirmation, then retry `mplx agents fetch`            |
| Asset owner not in wallets              | Add the asset owner wallet first before running `mplx config wallets add agent`       |
| Named imports fail for SDK package      | Package is CommonJS — import the default export and destructure named exports from it |

---

## Further Reading

| Resource                      | Link                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------- |
| Metaplex Skill (full CLI + SDK refs) | [github.com/metaplex-foundation/skill](https://github.com/metaplex-foundation/skill) |
| Metaplex Docs                 | [metaplex.com/docs](https://metaplex.com/docs)                                |
| Core (NFT standard)           | [metaplex.com/docs/smart-contracts/core](https://metaplex.com/docs/smart-contracts/core) |
| Genesis (token launches)      | [metaplex.com/docs/smart-contracts/genesis](https://metaplex.com/docs/smart-contracts/genesis) |
| Candy Machine (NFT drops)     | [metaplex.com/docs/smart-contracts/core-candy-machine](https://metaplex.com/docs/smart-contracts/core-candy-machine) |
