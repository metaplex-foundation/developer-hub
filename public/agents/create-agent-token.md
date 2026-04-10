# Metaplex Agents: Create Agent Token

Use this agent page when the user wants to launch a Genesis token on behalf of a registered Metaplex agent.

Human page: https://metaplex.com/docs/agents/create-agent-token

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user wants a token linked to an agent identity.
- The user wants creator fees routed to the agent Asset Signer PDA.
- The user wants to use Genesis `createAndRegisterLaunch()` with the `agent` field.

## SDK/API Function

Use `createAndRegisterLaunch()` from `@metaplex-foundation/genesis` with:

```ts
agent: {
  mint: agentAssetAddress,
  setToken: true,
}
```

Notes:

- `setToken: true` is irreversible.
- Creator fees route to the agent's Asset Signer PDA unless explicitly overridden.
- The first buy buyer defaults to the agent PDA when `agent` is provided.

For an existing Genesis account, use `setAgentTokenV1()` from `@metaplex-foundation/mpl-agent-registry`.

```ts
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry'

await setAgentTokenV1(umi, {
  asset: agentAssetAddress,
  genesisAccount,
  authority: assetSignerPda,
}).sendAndConfirm(umi)
```

When using the SDK directly, `authority` must be the Asset Signer PDA and should be provided explicitly. The SDK can derive the agent identity if omitted. The agent token can only be set once; repeated attempts fail with `AgentTokenAlreadySet`.

## CLI Quick Reference

```bash
# Recommended one-step launch and link.
mplx genesis launch create --launchType bonding-curve \
  --name <NAME> \
  --symbol <SYMBOL> \
  --image <IRYS_URL> \
  --agentMint <AGENT_ASSET> \
  --agentSetToken

# Two-step link after a launch already exists.
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
```

For the two-step CLI link, switch the CLI wallet to asset-signer mode for the agent asset before running the command:

```bash
mplx config wallets add --name my-agent --type asset-signer --asset <AGENT_ASSET>
mplx config wallets set my-agent
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
```

Full CLI docs: /docs/dev-tools/cli/agents/set-agent-token

## Notes

- `--agentSetToken` is irreversible.
- If a launch immediately after registration reports that the agent is not owned by the connected wallet, verify with `mplx agents fetch <AGENT_ASSET>` and wait about 30 seconds before retrying. RPC propagation can lag behind a successful on-chain registration.

## Related Pages

- Register an agent first: /docs/agents/register-agent.md
- Genesis bonding curve launch: /docs/smart-contracts/genesis/bonding-curve-launch.md
- Agent token CLI docs: /docs/dev-tools/cli/agents/set-agent-token
