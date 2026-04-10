# Metaplex Genesis: Launch Bonding Curve Via API

Use this agent page when the user wants to create and register a bonding curve token launch with the Genesis SDK, API, or CLI.

Human page: https://metaplex.com/docs/smart-contracts/genesis/bonding-curve-launch

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## SDK/API Functions

- `createAndRegisterLaunch()` handles create, sign/send, and register in one call.
- `createLaunch()` returns unsigned transactions for custom signing.
- `signAndSendLaunchTransactions()` sends the create transactions.
- `registerLaunch()` registers the launch after transactions confirm onchain.

## CLI Quick Reference

```bash
mplx genesis launch create --launchType bonding-curve \
  --name <NAME> \
  --symbol <SYMBOL> \
  --image <IRYS_URL>

mplx genesis launch create --launchType bonding-curve \
  --name <NAME> \
  --symbol <SYMBOL> \
  --image <IRYS_URL> \
  --creatorFeeWallet <ADDR> \
  --firstBuyAmount <SOL_AMOUNT>

mplx genesis launch create --launchType bonding-curve \
  --name <NAME> \
  --symbol <SYMBOL> \
  --image <IRYS_URL> \
  --agentMint <AGENT_ASSET> \
  --agentSetToken
```

Full CLI docs: /docs/dev-tools/cli/genesis/launch

## Notes

- `--image` must be an Irys gateway URL.
- `--firstBuyAmount` is in SOL and is fee-free.
- `--agentSetToken` is irreversible.
- `--agentMint` auto-derives the creator fee wallet from the agent PDA.

## Related Pages

- Bonding Curve overview: /docs/smart-contracts/genesis/bonding-curve.md
- Bonding Curve swaps: /docs/smart-contracts/genesis/bonding-curve-swaps.md
- API Client: /docs/smart-contracts/genesis/sdk/api-client.md
- Full CLI launch docs: /docs/dev-tools/cli/genesis/launch
