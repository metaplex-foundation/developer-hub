# Metaplex Agents: What Is An Agent

Use this agent page when the user asks for the conceptual model of Metaplex agents.

Human page: https://metaplex.com/docs/agents/what-is-an-agent

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## Core Concepts

- A Metaplex agent is an MPL Core asset with an on-chain agent identity.
- The agent identity is a PDA record and `AgentIdentity` plugin attached to the Core asset.
- The agent wallet is the Core asset's Asset Signer PDA.
- Since there is no private key for the Asset Signer PDA, outgoing actions use Core Execute through delegated execution.
- An executive is an off-chain operator wallet authorized to execute on behalf of the agent.

## Route To Task Pages

- Mint a new agent with API flow: /docs/agents/mint-agent.md
- Register an existing Core asset as an agent: /docs/agents/register-agent.md
- Read agent identity data: /docs/agents/run-agent.md
- Delegate execution: /docs/agents/run-an-agent.md
- Create an agent token: /docs/agents/create-agent-token.md
