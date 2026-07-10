---
title: Read Agent Data
metaTitle: Read Agent Data on Solana | Metaplex Agent Registry
description: Verify agent registration, read identity and registration documents on-chain, or read indexed agent fields via the DAS API.
keywords:
  - read agent data
  - agent identity
  - AgentIdentity plugin
  - Asset Signer
  - agent wallet
  - DAS API
  - isAgent
  - agentToken
  - assetSigner
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Data
  - DAS API
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '07-08-2026'
faqs:
  - q: When does agentToken appear in a DAS response?
    a: The agentToken field is present only when the agent's AgentIdentityV2 PDA has a token mint set via setAgentTokenV1. Registered agents without a linked token omit the field. AgentIdentityV1 PDAs do not carry a token mint and never populate agentToken.
  - q: Is assetSigner the same as the agent wallet?
    a: Yes. assetSigner is the Core Asset Signer PDA — the same address returned by findAssetSignerPda in the SDK. DAS returns asset_signer on MplCoreAsset rows; agents use that PDA as their onchain wallet.
  - q: Can I filter non-Core assets with isAgent?
    a: No. isAgent, agentToken, and assetSigner apply only to MplCoreAsset rows. Token Metadata NFTs and other interfaces omit these fields entirely from DAS responses.
  - q: Do all DAS providers support agent token fields?
    a: Agent token indexing ships with the Metaplex DAS indexer (digital-asset-rpc-infrastructure). Third-party DAS providers must run a compatible indexer version that includes the agent registry transformer and database migration before these fields appear in responses.
---

Read and verify agent identity after [registration](/agents/register-agent) — directly on-chain with the SDK, or through the indexed [DAS API](/dev-tools/das-api). {% .lead %}

## Summary

Use the Agent Registry SDK for direct on-chain reads (identity PDA, registration document, wallet PDA), or use the DAS API when an indexer has already parsed agent fields for you.

- **On-chain (SDK)** — check registration, inspect the `AgentIdentity` plugin, fetch the ERC-8004 document, derive the Asset Signer PDA
- **Indexed (DAS)** — read `is_agent`, `asset_signer`, and `agent_token` from [`getAsset`](/dev-tools/das-api/methods/get-asset); discover agents with [`searchAssets`](/dev-tools/das-api/methods/search-assets)
- **Same wallet address** — `findAssetSignerPda` and DAS `asset_signer` return the same PDA

## Quick Start

**Jump to:** [Check Registration](#check-registration) · [Registration Document](#read-the-registration-document) · [Agent Wallet](#fetch-the-agents-wallet) · [Read via DAS](#read-agent-data-via-das-api)

1. **One agent, full detail** — use `safeFetchAgentIdentityV1` and `fetchAsset` (SDK sections below)
2. **One agent, indexed fields** — call `getAsset` with the Core asset address (DAS section below)
3. **Discover agents** — call `searchAssets` with `isAgent: true` or filter by `agentToken` / `assetSigner`

## Check Registration

The safe fetch method returns `null` instead of throwing if the identity doesn't exist, which is useful for checking whether an asset has been registered:

{% code-tabs-imported from="agents/read_agent_check_registration" frameworks="umi" defaultFramework="umi" /%}

## Fetch from Seeds

You can also fetch the identity directly from the asset's public key without manually deriving the PDA:

{% code-tabs-imported from="agents/read_agent_fetch_from_seeds" frameworks="umi" defaultFramework="umi" /%}

## Verify the AgentIdentity Plugin

Registration attaches an `AgentIdentity` plugin to the Core asset. You can read it directly off the fetched asset to inspect the registration URI and lifecycle hooks:

{% code-tabs-imported from="agents/read_agent_verify_plugin" frameworks="umi" defaultFramework="umi" /%}

## Read the Registration Document

The `uri` on the `AgentIdentity` plugin points to an off-chain JSON document with the agent's full profile — name, description, service endpoints, and more. Fetch it like any other URI:

{% code-tabs-imported from="agents/read_agent_registration_document" frameworks="umi" defaultFramework="umi" /%}

The document follows the [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) agent registration standard. A typical one looks like this:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "An informational agent providing help related to Metaplex protocols and tools.",
  "description": "An autonomous agent that executes DeFi strategies on Solana.",
  "image": "https://arweave.net/agent-avatar-tx-hash",
  "services": [
    {
      "name": "web",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>"
    },
    {
      "name": "A2A",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/agent-card.json",
      "version": "0.3.0"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

See [Register an Agent](/agents/register-agent#agent-registration-document) for the full field reference.

## Fetch the Agent's Wallet

Every Core asset has a built-in wallet called the **Asset Signer** — a PDA derived from the asset's public key. No private key exists, so it can't be stolen. The wallet can hold SOL, tokens, or any other asset. Derive the address with `findAssetSignerPda`:

{% code-tabs-imported from="agents/read_agent_fetch_asset_signer" frameworks="umi" defaultFramework="umi" /%}

The address is deterministic, so anyone can derive it from the asset's public key to send funds or check balances. Only the asset itself can sign for this wallet, through Core's [Execute](/smart-contracts/core/execute-asset-signing) instruction via a delegated [executive](/agents/run-an-agent).

See the [MPL Agent Registry](/smart-contracts/mpl-agent) smart contract docs for account layouts, PDA derivation details, and error codes.

## Read Agent Data via DAS API

The [DAS API](/dev-tools/das-api) indexes agent fields on MPL Core assets — registration status, wallet PDA, and canonical token mint — so you can read them without parsing Core accounts yourself.

**Prerequisites:** a [DAS-enabled RPC endpoint](/solana/rpcs-and-das) and `@metaplex-foundation/digital-asset-standard-api` on a [Umi](/umi) instance.

### DAS Agent Response Fields

DAS derives agent metadata from two onchain sources and surfaces them as top-level response fields.

| Field | Type | Present on | Source |
|-------|------|------------|--------|
| `is_agent` | `boolean` | `MplCoreAsset` | `true` when the asset has an `AgentIdentity` external plugin |
| `asset_signer` | `string` (pubkey) | `MplCoreAsset` only | Same PDA as [`findAssetSignerPda`](#fetch-the-agents-wallet) above |
| `agent_token` | `string` (pubkey) | `MplCoreAsset` when set | `AgentIdentityV2` PDA mint, written by [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) |

{% callout type="note" %}
Only **`MplCoreAsset`** rows can be agents (`is_agent: true`). Collections and groups may include `is_agent: false` in DAS responses, but agent registration applies to individual Core assets only. Non-Core assets (Token Metadata NFTs, compressed NFTs, fungible tokens) omit all three fields.
{% /callout %}

A registered agent without a linked token returns `is_agent: true` and `asset_signer`, but omits `agent_token`:

```json {% title="getAsset response (registered, no token)" %}
{
  "interface": "MplCoreAsset",
  "id": "84jw9dw7hMRJXFvzJXrBzVQpmVWaGUtYT7R6QhNU9qt3",
  "is_agent": true,
  "asset_signer": "6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq",
  "external_plugins": [
    {
      "type": "AgentIdentity",
      "adapter_config": { "uri": "https://example.com/agent-registration.json" }
    }
  ]
}
```

After [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token), DAS includes `agent_token`:

```json {% title="getAsset response (registered with token)" %}
{
  "interface": "MplCoreAsset",
  "id": "84jw9dw7hMRJXFvzJXrBzVQpmVWaGUtYT7R6QhNU9qt3",
  "is_agent": true,
  "agent_token": "FakeToken11111111111111111111111111111111111",
  "asset_signer": "6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq"
}
```

JSON-RPC responses use snake_case (`is_agent`, `agent_token`, `asset_signer`). `searchAssets` request parameters use camelCase (`isAgent`, `agentToken`, `assetSigner`); snake_case aliases are also accepted.

### Get One Agent via DAS

Use [`getAsset`](/dev-tools/das-api/methods/get-asset) when you know the Core asset address.

{% code-tabs-imported from="agents/read_agent_das_get" frameworks="umi,curl" defaultFramework="umi" /%}

### Search Registered Agents

Use [`searchAssets`](/dev-tools/das-api/methods/search-assets) with `isAgent: true` to list registered agents. Combine with `interface: "MplCoreAsset"` to exclude collections and groups.

{% code-tabs-imported from="agents/read_agent_das_search" frameworks="umi,curl" defaultFramework="umi" /%}

### Lookup Agent by Token Mint

After an agent links its canonical token, filter by `agentToken` to resolve the agent Core asset from the mint address. Each agent can have at most one token — the binding is permanent.

{% code-tabs-imported from="agents/read_agent_das_lookup_token" frameworks="curl" defaultFramework="curl" /%}

### Lookup Agent by Asset Signer

The `assetSigner` filter finds the Core asset whose execute PDA matches a given address. Use this when you know the agent wallet but not the asset pubkey.

{% code-tabs-imported from="agents/read_agent_das_lookup_signer" frameworks="curl" defaultFramework="curl" /%}

### How DAS Indexing Works

DAS populates agent fields from two onchain sources during ingestion. **MPL Core asset** account updates set `is_agent` (when an `AgentIdentity` plugin is present) and derive `asset_signer` for `MplCoreAsset` rows. **Agent Registry** PDA updates set `agent_token` on existing `MplCoreAsset` rows when an `AgentIdentityV2` mint is present.

| Event | Field updated | Notes |
|-------|---------------|-------|
| Core asset created or updated | `is_agent`, `asset_signer` | Applies to `MplCoreAsset` rows only; `is_agent` reflects the `AgentIdentity` external plugin; `asset_signer` is derived for every indexed Core asset |
| `AgentIdentityV2` PDA updated | `agent_token` | Written by the Agent Registry transformer; only updates existing, non-burnt `MplCoreAsset` rows |
| Asset burnt | — | Subsequent Agent Registry updates are ignored |
| Stale-slot PDA replay | — | Updates with a lower slot than `slot_updated_agent_registry` are skipped |

## Notes

- The Asset Signer is a PDA — no private key exists for it. It can receive funds from any source, but only the asset itself can sign outgoing transactions through Core's [Execute](/smart-contracts/core/execute-asset-signing) instruction.
- `safeFetchAgentIdentityV1` returns `null` for unregistered assets rather than throwing, making it safe for existence checks without try/catch.
- `findAssetSignerPda` and DAS `asset_signer` return the same deterministic address on every network.
- `agent_token` is **permanent** once set via [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) — there is no instruction to clear or reassign it.
- DAS `asset_signer` is returned on **`MplCoreAsset`** rows, not only registered agents; use `is_agent` to distinguish agents from plain Core NFTs.
- Registered agents without a linked token omit `agent_token` — expected before [`createAndRegisterLaunch`](/agents/create-agent-token) or manual `setAgentTokenV1`.
- Agent Registry updates never create new asset rows; the Core asset must be indexed first.
- Provider support varies — confirm your [DAS provider](/solana/rpcs-and-das) runs an indexer with agent registry support.

## Quick Reference

| Item | Value |
|------|-------|
| Agent Registry program | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| MPL Core program | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Asset Signer seeds | `['mpl-core-execute', <core_asset_pubkey>]` |
| DAS `isAgent` filter | `searchAssets` param `isAgent: true \| false` |
| DAS `agentToken` filter | `searchAssets` param `agentToken: <mint_pubkey>` |
| DAS `assetSigner` filter | `searchAssets` param `assetSigner: <pda_pubkey>` |
| DAS response methods | `getAsset`, `getAssets`, `searchAssets` |

## FAQ

### When does `agentToken` appear in a DAS response?

`agent_token` is present only when the agent's `AgentIdentityV2` PDA has a token mint set via [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token). Registered agents without a linked token omit the field. `AgentIdentityV1` PDAs do not carry a token mint and never populate `agent_token`.

### Is `assetSigner` the same as the agent wallet?

Yes. DAS `asset_signer` is the Core [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA — the same address as [`findAssetSignerPda`](#fetch-the-agents-wallet). It is returned on `MplCoreAsset` rows; for registered agents it acts as the onchain wallet.

### Can I filter non-Core assets with `isAgent`?

No. `is_agent`, `agent_token`, and `asset_signer` apply only to **`MplCoreAsset`**. Token Metadata NFTs and other asset types omit these fields.

### Do all DAS providers support agent token fields?

Agent token indexing ships with the [Metaplex DAS indexer](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure). Third-party providers must run a compatible indexer version with the agent registry transformer and database migration.

## Glossary

| Term | Definition |
|------|------------|
| **`AgentIdentity` plugin** | External plugin on a Core asset set during [registration](/agents/register-agent); carries the off-chain registration URI |
| **`is_agent`** | DAS boolean indicating the Core asset has an `AgentIdentity` external plugin |
| **`agent_token`** | Canonical token mint pubkey indexed from the `AgentIdentityV2` PDA; set once via [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) |
| **`asset_signer`** | Core execute PDA that acts as the agent's onchain wallet; derived from `['mpl-core-execute', <asset>]` |
| **`AgentIdentityV2`** | Agent Registry PDA that stores the linked token mint; updated independently of the Core asset account |
| **`Agent Registry transformer`** | DAS ingestion handler that writes `agent_token` from Agent Registry PDA updates onto existing Core asset rows |
