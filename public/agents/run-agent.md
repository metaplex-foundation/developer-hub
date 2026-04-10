# Metaplex Agents: Read Agent Data

Use this agent page when the user wants to verify an agent registration or read agent identity data.

Human page: https://metaplex.com/docs/agents/run-agent

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## SDK Functions

- `findAgentIdentityV2Pda()` derives the current agent identity PDA from the asset address.
- `safeFetchAgentIdentityV2()` returns the identity account or `null` if not registered.
- `fetchAgentIdentityV1FromSeeds()` fetches directly from the asset seed.
- `fetchAsset()` reads the Core asset and attached `AgentIdentity` plugin.
- `findAssetSignerPda()` derives the agent wallet PDA.

V1 fetchers still work for legacy identity accounts. Prefer V2 helpers for new reads, then fall back to V1 only when working with older data.

```ts
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import {
  findAgentIdentityV2Pda,
  safeFetchAgentIdentityV2,
} from '@metaplex-foundation/mpl-agent-registry'

const [agentIdentity] = findAgentIdentityV2Pda(umi, { asset })
const identity = await safeFetchAgentIdentityV2(umi, agentIdentity)
const assetData = await fetchAsset(umi, asset)
const plugin = assetData.agentIdentities?.[0]
```

## CLI Quick Reference

```bash
mplx agents fetch <ASSET_ADDRESS>
mplx agents fetch <ASSET_ADDRESS> --json
```

Full CLI docs: /docs/dev-tools/cli/agents/fetch

## PDA Reference

- `AgentIdentityV2`: seeds `["agent_identity", <asset_pubkey>]`, account size 104 bytes.
- `AgentIdentityV1`: same seeds, legacy account size 40 bytes.
- Asset Signer PDA: use `findAssetSignerPda()` when deriving the agent wallet.

## Related Pages

- Register an agent: /docs/agents/register-agent.md
- Run an agent with executive delegation: /docs/agents/run-an-agent.md
- Core Execute and Asset Signer: /docs/smart-contracts/core/execute-asset-signing.md
