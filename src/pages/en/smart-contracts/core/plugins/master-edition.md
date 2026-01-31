---
title: Master Edition Plugin
metaTitle: Master Edition Plugin | Metaplex Core
description: Group edition Assets under a Collection with the Master Edition plugin. Store max supply and edition metadata for prints and limited runs.
updated: '01-31-2026'
---
The **Master Edition Plugin** groups numbered edition Assets under a Collection. Store maximum supply, edition names, and URIs to create print series like "Limited to 100 copies." {% .lead %}
{% callout title="What You'll Learn" %}
- Add Master Edition to Collections
- Configure max supply and metadata
- Group Edition Assets together
- Understand the print workflow
{% /callout %}
## Summary
The **Master Edition** plugin is an Authority Managed plugin for Collections that groups [Edition](/smart-contracts/core/plugins/edition) Assets together. Store the maximum supply and optional edition-specific metadata.
- Authority Managed (update authority controls)
- Works with Collections only (not Assets)
- Values are informational, not enforced
- Use with Candy Machine for automatic edition creation
## Out of Scope
Supply enforcement (use Candy Machine guards), individual edition numbers (use Edition plugin on Assets), and automatic minting.
## Quick Start
**Jump to:** [Create Collection](#creating-a-collection-with-the-master-edition-plugin) · [Update Plugin](#update-the-master-edition-plugin)
1. Create Collection with Master Edition plugin and max supply
2. Mint Assets with Edition plugin (numbers 1, 2, 3...)
3. Update max supply or metadata as needed
{% callout type="note" title="Intended Usage" %}
We recommend to
- Group the Editions using the Master Edition Plugin
- use Candy Machine with the Edition Guard to handle numbering automatically.
{% /callout %}
## Works With
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |
## Arguments
| Arg       | Value                | Usecase                                                                         |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | Indicate how many prints will exist as maximum. Optional to allow Open Editions |
| name      | Option<String>       | Name of the Editions (if different to the Collection Name)                      |
| uri       | Option<String>       | URI of the Editions (if different to the Collection uri)                       |
These values can be changed by the Authority at any time. They are purely informational and not enforced.
## Creating a Collection with the Master Edition plugin
{% dialect-switcher title="Create a MPL Core Collection with Master Edition Plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'
const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      name: 'My Master Edition',
      uri: 'https://example.com/my-master-edition.json',
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition.json",
            }),
            authority: Some(PluginAuthority::UpdateAuthority),
        }])
        .instruction();
    let signers = vec![&collection, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Update the Master Edition Plugin
If the Master Edition Plugin is mutable it can be updated similar to other Collection Plugins:
{% dialect-switcher title="Update Master Edition Plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePluginV1, createPlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await updatePlugin(umi, {
  asset: asset,
  plugin: {
    type: 'MasterEdition',
    maxSupply: 110,
    name: 'My Master Edition',
    uri: 'https://example.com/my-master-edition',
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
_coming soon_
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Cannot add to Asset`
Master Edition only works with Collections, not individual Assets. Use the Edition plugin for Assets.
### `Authority mismatch`
Only the update authority can add or update the Master Edition plugin.
## Notes
- All values (maxSupply, name, uri) are informational only—not enforced
- Use Candy Machine guards to enforce actual supply limits
- The name/uri override Collection metadata for edition-specific branding
- Can be updated at any time by the authority
## Quick Reference
### Arguments
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `maxSupply` | `Option<u32>` | No | Maximum editions (null for open editions) |
| `name` | `Option<String>` | No | Edition-specific name |
| `uri` | `Option<String>` | No | Edition-specific metadata URI |
### Edition Setup Pattern
| Step | Action | Plugin |
|------|--------|--------|
| 1 | Create Collection | Master Edition (max supply) |
| 2 | Mint Assets | Edition (number 1, 2, 3...) |
| 3 | Verify | Check edition numbers and supply |
## FAQ
### Does Master Edition enforce the max supply?
No. The `maxSupply` is informational only. Use Candy Machine with appropriate guards to actually enforce supply limits during minting.
### What's the difference between Master Edition name/uri and Collection name/uri?
Master Edition name/uri can provide edition-specific metadata that differs from the base Collection. For example, a Collection might be "Abstract Art Series" while the Master Edition name could be "Limited Print Run 2024."
### Can I create open editions (unlimited supply)?
Yes. Set `maxSupply` to `null` or omit it entirely. This indicates an open edition with no defined limit.
### Do I need both Master Edition and Edition plugins?
For proper print tracking, yes. Master Edition goes on the Collection (grouping and supply info), Edition goes on each Asset (individual numbers). They work together.
### Can I add Master Edition to an existing Collection?
Yes, unlike the Edition plugin on Assets, Master Edition can be added to existing Collections using `addCollectionPlugin`.
## Glossary
| Term | Definition |
|------|------------|
| **Master Edition** | Collection plugin that groups editions and stores supply |
| **Edition** | Asset plugin that stores individual edition number |
| **Open Edition** | Edition series with no maximum supply limit |
| **Provenance** | Record of origin and ownership history |
| **maxSupply** | Maximum number of editions (informational) |
