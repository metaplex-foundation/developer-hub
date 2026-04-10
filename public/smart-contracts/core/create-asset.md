# Metaplex Core: Create Asset

Use this agent page when the user wants to create, mint, or initialize a Metaplex Core Asset.

Human page: https://metaplex.com/docs/smart-contracts/core/create-asset

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks how to create a Core Asset or Core NFT.
- The user asks which Core SDK function creates an asset.
- The user wants to mint an asset into a Core Collection.
- The user wants to create a Core Asset with plugins such as royalties.

## Do Not Use

- For fungible tokens, use SPL Token or Token Metadata fungible-token docs.
- For compressed NFTs, use Bubblegum docs.
- For legacy Token Metadata NFTs, use Token Metadata docs.

## Required Context

- Core Assets are single on-chain accounts that store ownership, metadata URI, and plugin data.
- A new asset requires a fresh signer. Do not reuse an existing asset signer.
- Metadata JSON should be uploaded first and referenced by URI.
- The Core program ID is `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`.

## SDK Packages

```bash
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
```

## CLI Quick Reference

Use these when the user asks for the Metaplex CLI flow instead of SDK code.

```bash
mplx core asset create --name <NAME> --uri <URI>
mplx core asset create --name <NAME> --uri <URI> --owner <ADDR>
mplx core asset create --name <NAME> --uri <URI> --collection <ADDR>
mplx core asset create --files --image <PATH> --offchain <PATH>
mplx core asset template
```

Notes:

- `--owner` mints to a different wallet and works on all asset create variants.
- `--files` uploads local image and metadata files automatically. If JSON upload fails, use the manual upload workflow.
- `mplx core asset template` generates template files.
- Full CLI docs: /docs/dev-tools/cli/core/create-asset

## CLI Metadata Quick Reference

```bash
# One-step local file workflow
mplx core asset create --files --image ./image.png --offchain ./metadata.json
```

For manual upload workflows or batch creation, use the full CLI docs: /docs/dev-tools/cli/core/create-asset

## Minimal Create

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

await create(umi, {
  asset,
  name: 'My NFT',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi)
```

## Create Into A Collection

Use `fetchCollection` first, then pass the collection into `create`.

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create, fetchCollection } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('YOUR_COLLECTION_ADDRESS')
const collection = await fetchCollection(umi, collectionAddress)
const asset = generateSigner(umi)

await create(umi, {
  asset,
  collection,
  name: 'Collection Item #1',
  uri: 'https://example.com/item1.json',
}).sendAndConfirm(umi)
```

## Create With Royalties

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create, ruleSet } from '@metaplex-foundation/mpl-core'

const creator = publicKey('YOUR_CREATOR_ADDRESS')
const asset = generateSigner(umi)

await create(umi, {
  asset,
  name: 'NFT with Royalties',
  uri: 'https://example.com/metadata.json',
  plugins: [
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [{ address: creator, percentage: 100 }],
      ruleSet: ruleSet('None'),
    },
  ],
}).sendAndConfirm(umi)
```

## Common Errors

- `Asset account already exists`: generate a new asset signer.
- `Collection not found`: verify the collection address and fetch a Core Collection, not a Token Metadata collection.
- `Insufficient funds`: fund the payer with enough SOL for rent and fees.

## Related Pages

- Fetch a Core Asset: /docs/smart-contracts/core/fetch
- Update a Core Asset: /docs/smart-contracts/core/update
- Create a Core Collection: /docs/smart-contracts/core/collections/create
- Core plugins overview: /docs/smart-contracts/core/plugins
- Full CLI create asset docs: /docs/dev-tools/cli/core/create-asset
