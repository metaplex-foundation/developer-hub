# Metaplex Agents: Run An Agent

Use this agent page when the user wants to set up executive delegation so an off-chain operator can run an agent.

Human page: https://metaplex.com/docs/agents/run-an-agent

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## SDK Functions

- `registerExecutiveV1()` creates the executive profile for a wallet.
- `delegateExecutionV1()` delegates an agent asset to an executive profile.
- `revokeExecutionV1()` revokes a delegated execution relationship.
- `findExecutiveProfileV1Pda()` derives the executive profile PDA.
- `findExecutionDelegateRecordV1Pda()` derives the delegation record PDA.

```ts
import {
  delegateExecutionV1,
  registerExecutiveV1,
  revokeExecutionV1,
} from '@metaplex-foundation/mpl-agent-registry'

await registerExecutiveV1(umi, {}).sendAndConfirm(umi)

await delegateExecutionV1(umi, {
  asset,
  executive: executivePublicKey,
}).sendAndConfirm(umi)

await revokeExecutionV1(umi, {
  asset,
  executive: executivePublicKey,
}).sendAndConfirm(umi)
```

## CLI Quick Reference

```bash
mplx agents executive register
mplx agents executive delegate <AGENT_ASSET> --executive <EXECUTIVE_WALLET>
mplx agents executive revoke <AGENT_ASSET> --executive <EXECUTIVE_WALLET>
mplx agents executive revoke <AGENT_ASSET>
```

Full CLI docs: /docs/dev-tools/cli/agents/executive

## Notes

- The executive must register a profile before an agent can be delegated to it.
- Only the asset owner can delegate execution.
- Either the owner or executive can revoke a delegation.
- `ExecutiveProfileV1` PDA seeds: `["executive_profile", <authority>]`.
- `ExecutionDelegateRecordV1` PDA seeds: `["execution_delegate_record", <executive_profile>, <agent_asset>]`.

## Related Pages

- Read agent data first: /docs/agents/run-agent.md
- Core Execute and Asset Signer: /docs/smart-contracts/core/execute-asset-signing.md
