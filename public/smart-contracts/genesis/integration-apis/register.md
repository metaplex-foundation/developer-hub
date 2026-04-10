# Metaplex Genesis API: Register Launch

Use this agent page when the user wants to register an already-created Genesis launch after onchain transactions confirm.

Human page: https://metaplex.com/docs/smart-contracts/genesis/integration-apis/register

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## API Endpoint

```text
POST /v1/launches/register
```

Register only after the create transactions are confirmed onchain.

## Prefer SDK When Possible

Use `createAndRegisterLaunch()` for the common one-call flow, or `registerLaunch()` after custom transaction sending.

## CLI Equivalent

```bash
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig <PATH_TO_JSON>
```

Full CLI docs: /docs/dev-tools/cli/genesis/launch

## Related Pages

- Create Launch: /docs/smart-contracts/genesis/integration-apis/create-launch.md
- API Client SDK: /docs/smart-contracts/genesis/sdk/api-client.md
