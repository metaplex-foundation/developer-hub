# Metaplex Core: Execute Asset Signing

Use this agent page when the user asks about Core Asset Signer PDAs, asset-owned wallets, or executing CLI commands through an asset signer.

Human page: https://metaplex.com/docs/smart-contracts/core/execute-asset-signing

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks how an MPL Core Asset can sign transactions.
- The user asks how to inspect or fund an asset signer PDA.
- The user asks how to use a Core Asset as the active CLI wallet.
- The user asks about execute limitations.

## CLI Quick Reference

```bash
mplx core asset execute info <ASSETID>
```

This shows the signer PDA address and SOL balance.

## Asset-Signer Wallet Quick Reference

```bash
# 1. Check the PDA info for an asset.
mplx core asset execute info <ASSETID>

# 2. Fund the PDA.
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 3. Register the asset signer as a wallet.
mplx config wallets add vault --asset <ASSETID>

# 4. Switch to the asset-signer wallet.
mplx config wallets set vault

# 5. Use commands as the PDA.
mplx toolbox sol balance
mplx toolbox sol transfer 0.01 <destination>
mplx core asset create --name "PDA Created NFT" --uri "https://example.com/nft"
```

For bypass options, raw instructions, supported command families, and CPI limitations, use the full CLI docs: /docs/dev-tools/cli/core/execute

## CPI Limitations

Some operations cannot be wrapped in `execute()` because of Solana CPI constraints:

- Large account creation, including Merkle trees and candy machines.
- Native SOL wrapping, where `transferSol` to a token account fails in CPI context.

Use a normal wallet to create infrastructure first, then switch to the asset-signer wallet for subsequent operations.
