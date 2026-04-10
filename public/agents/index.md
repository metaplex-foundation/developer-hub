# Metaplex Agent Kit

Use this agent page when the user asks about creating, registering, reading, running, or tokenizing agents on Solana.

Human page: https://metaplex.com/docs/agents

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## Route To Task Pages

- What is an Agent: /docs/agents/what-is-an-agent.md
- Mint an Agent: /docs/agents/mint-agent.md
- Register an Agent on an existing Core asset: /docs/agents/register-agent.md
- Read Agent Data: /docs/agents/run-agent.md
- Run an Agent with executive delegation: /docs/agents/run-an-agent.md
- Create an Agent Token: /docs/agents/create-agent-token.md
- Agent Skill overview: /docs/agents/skill.md

## SDK Setup

Install `@metaplex-foundation/mpl-agent-registry`. The package ships as CommonJS; in ESM files import the default package and destructure exports if named imports do not work.

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

## CLI Quick Reference

```bash
mplx agents register --name <NAME> --description <DESCRIPTION> --image <PATH_OR_URI>
mplx agents fetch <AGENT_ASSET>
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
mplx agents executive register
mplx agents executive delegate <AGENT_ASSET> --executive <EXECUTIVE_WALLET>
mplx agents executive revoke <AGENT_ASSET>
```

Full CLI docs: /docs/dev-tools/cli/agents

## Reference Notes

- Agent registration service types include `web`, `A2A`, `MCP`, `OASF`, `DID`, `email`, and custom service names.
- Supported trust models include `reputation`, `crypto-economic`, and `tee-attestation`.
- The Agent Identity program ID is `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`.
- The Agent Tools program ID is `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`.
