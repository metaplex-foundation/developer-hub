# Metaplex Genesis API: Create Launch

Use this agent page when the user wants to call the REST API endpoint that builds Genesis launch transactions.

Human page: https://metaplex.com/docs/smart-contracts/genesis/integration-apis/create-launch

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
POST /v1/launches/create
```

This returns unsigned transactions. The caller must sign and send them, then call Register Launch after onchain confirmation.

## Prefer SDK When Possible

Use `createAndRegisterLaunch()` from the SDK when the user does not need direct HTTP access.

## CLI Equivalent

```bash
mplx genesis launch create --name <NAME> --symbol <SYMBOL> --image <IRYS_URL> ...
```

Full CLI docs: /docs/dev-tools/cli/genesis/launch

## Related Pages

- Register Launch: /docs/smart-contracts/genesis/integration-apis/register.md
- API Client SDK: /docs/smart-contracts/genesis/sdk/api-client.md
