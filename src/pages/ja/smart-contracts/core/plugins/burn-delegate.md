---
title: Burn Delegate
metaTitle: Burn Delegate Plugin | Metaplex Core
description: Allow a delegate to burn Core NFT Assets. Use the Burn Delegate plugin for game mechanics, subscription expirations, and automated asset destruction.
updated: '01-31-2026'
keywords:
  - burn delegate
  - delegate burn
  - automated burn
  - NFT lifecycle
about:
  - Burn delegation
  - Game mechanics
  - Asset lifecycle
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What's the difference between Burn Delegate and Permanent Burn Delegate?
    a: Burn Delegate authority is revoked on transfer. Permanent Burn Delegate authority persists forever and uses forceApprove, meaning it can burn even if the Asset is frozen.
  - q: Can the owner still burn if there's a Burn Delegate?
    a: Yes. The owner can always burn their own Asset regardless of delegates.
  - q: Does Burn Delegate work on frozen Assets?
    a: No. Regular Burn Delegate cannot burn frozen Assets. Use Permanent Burn Delegate if you need to burn frozen Assets.
  - q: When is Burn Delegate revoked?
    a: When the Asset is transferred to a new owner. The new owner would need to add a new Burn Delegate.
---
The **Burn Delegate Plugin** allows a designated authority to burn Core Assets on behalf of the owner. Useful for game mechanics, subscription services, and automated asset lifecycle management. {% .lead %}
{% callout title="What You'll Learn" %}
- Add the Burn Delegate plugin to an Asset
- Delegate burn authority to another address
- Revoke burn authority
- Use cases: games, subscriptions, automated burns
{% /callout %}
## Summary
The **Burn Delegate** is an Owner Managed plugin that allows a delegate to burn an Asset. Once added, the delegate can burn the Asset at any time without owner approval.
- Delegate burn authority to a program or wallet
- Authority is revoked on Asset transfer
- Use [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) for irrevocable burn authority
- No additional arguments required
## Out of Scope
Collection burning (different process), permanent burn authority (see Permanent Burn Delegate), and Token Metadata burn authority (different system).
## Quick Start
**Jump to:** [Add Plugin](#adding-the-burn-plugin-to-an-asset) · [Delegate Authority](#delegating-burn-authority) · [Revoke](#revoking-burn-authority)
1. Add the Burn Delegate plugin: `addPlugin(umi, { asset, plugin: { type: 'BurnDelegate' } })`
2. Optionally delegate to another address
3. The delegate can now burn the Asset at any time
{% callout type="note" title="When to Use Burn vs Permanent Burn Delegate" %}
| Use Case | Burn Delegate | Permanent Burn Delegate |
|----------|---------------|-------------------------|
| Game item destruction | ✅ Best choice | ✅ Also works |
| Subscription expiration | ✅ Best choice | ❌ Too permanent |
| Burn frozen Assets | ❌ Cannot burn | ✅ Can force burn |
| Authority persists on transfer | ❌ Revokes | ✅ Persists |
| Emergency burn capability | ❌ Limited | ✅ Best choice |
**Choose Burn Delegate** when burn authority should reset on ownership change.
**Choose [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate)** when authority must persist forever.
{% /callout %}
## Common Use Cases
- **Game mechanics**: Burn NFTs when items are consumed, destroyed, or lost in-game
- **Subscription services**: Auto-burn expired subscription tokens
- **Crafting systems**: Burn ingredient NFTs when crafting new items
- **Achievement redemption**: Burn achievement tokens when redeemed for rewards
- **Event tickets**: Burn tickets after event check-in
- **Limited-time assets**: Burn assets after expiration period
## Works With
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## Arguments
The Burn Plugin doesn't contain any arguments to pass in.
## Adding the Burn Plugin to an Asset
{% dialect-switcher title="Adding a Burn Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
(async () => {
    const asset = publicKey('11111111111111111111111111111111')
    await addPlugin(umi, {
    asset: asset,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{BurnDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_burn_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::BurnDelegate(BurnDelegate {}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_burn_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_burn_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_burn_delegate_plugin_ix_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Delegating Burn Authority
The Burn Delegate plugin authority can be delegated to a different address using the `approvePluginAuthority` function. This allows you to change who can burn the Asset.
{% dialect-switcher title="Delegate Burn Authority" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('22222222222222222222222222222222')
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## Revoking Burn Authority
The burn authority can be revoked using the `revokePluginAuthority` function, returning control to the asset owner.
{% dialect-switcher title="Revoke Burn Authority" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    await revokePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Authority mismatch`
Only the burn delegate authority can burn the Asset. Verify you're signing with the correct keypair.
### `Asset is frozen`
Frozen Assets cannot be burned. The freeze authority must thaw the Asset first.
## Notes
- Owner Managed: requires owner signature to add
- Authority is automatically revoked when the Asset transfers
- Frozen Assets cannot be burned
- Use Permanent Burn Delegate if authority must persist after transfer
- Burning is immediate and irreversible
## Quick Reference
### Who Can Burn?
| Authority | Can Burn? |
|-----------|-----------|
| Asset Owner | Yes (always) |
| Burn Delegate | Yes |
| Permanent Burn Delegate | Yes (force approve) |
| Update Authority | No |
## FAQ
### What's the difference between Burn Delegate and Permanent Burn Delegate?
Burn Delegate authority is revoked on transfer. Permanent Burn Delegate authority persists forever and uses `forceApprove`, meaning it can burn even if the Asset is frozen.
### Can the owner still burn if there's a Burn Delegate?
Yes. The owner can always burn their own Asset regardless of delegates.
### Does Burn Delegate work on frozen Assets?
No. Regular Burn Delegate cannot burn frozen Assets. Use Permanent Burn Delegate if you need to burn frozen Assets.
### When is Burn Delegate revoked?
When the Asset is transferred to a new owner. The new owner would need to add a new Burn Delegate.
## Related Plugins
- [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) - Irrevocable burn authority with forceApprove
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - Block transfers and burns temporarily
- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - Allow delegate to transfer Assets
## Glossary
| Term | Definition |
|------|------------|
| **Burn Delegate** | Owner Managed plugin allowing a delegate to burn the Asset |
| **Owner Managed** | Plugin type requiring owner signature to add |
| **Revoke** | Remove the delegate's burn authority |
| **Permanent Burn Delegate** | Irrevocable version that persists after transfer |
| **forceApprove** | Permanent plugin ability to override freeze restrictions |
