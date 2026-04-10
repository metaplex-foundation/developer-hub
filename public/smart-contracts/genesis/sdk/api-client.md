# Metaplex Genesis: API Client

Use this agent page when the user wants to create and register Genesis launches using the Genesis SDK API client.

Human page: https://metaplex.com/docs/smart-contracts/genesis/sdk/api-client

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## SDK Functions

- `createAndRegisterLaunch()` is the preferred high-level path.
- `createLaunch()` builds unsigned launch transactions.
- `registerLaunch()` registers a confirmed onchain launch with the Metaplex platform.
- Use the lower-level functions when custom signing, Jito bundles, retries, or server-side transaction senders are needed.

## CLI Equivalent

For users who want the CLI instead of SDK:

```bash
mplx genesis launch create --name <NAME> --symbol <SYMBOL> --image <IRYS_URL> ...
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig <PATH_TO_JSON>
```

Full CLI docs: /docs/dev-tools/cli/genesis/launch

## Related Pages

- Create Launch REST API: /docs/smart-contracts/genesis/integration-apis/create-launch.md
- Register Launch REST API: /docs/smart-contracts/genesis/integration-apis/register.md
- Bonding Curve launch guide: /docs/smart-contracts/genesis/bonding-curve-launch.md
