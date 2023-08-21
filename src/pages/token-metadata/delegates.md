---
title: Delegated Authorities
metaTitle: Token Metadata - Delegated Authorities
description: Learn how to approve delegated authorities for your Assets on Token Metadata
---

_Coming soon..._

## Metadata vs Token Delegates

_Coming soon..._

## Metadata Delegates

_Coming soon..._

- There can be as many Metadata delegates as needed for a given asset.
- Metadata delegates are derived from the Mint account which means they exist regardless of the owner of the asset. Thus, transferring an asset does not affect the Metadata delegates.
- Metadata delegates are also derived from the current Update Authority of the asset. This means, whenever the Update Authority is updated on an asset, all Metadata delegates are voided and cannot be used by the new Update Authority.
- Metadata delegates can revoke themselves.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-15" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-delegate-pda parent="mint" x="-15" y="-260" label="PDA" theme="crimson" /%}

{% node parent="metadata-delegate-pda" x="-283" %}
{% node #metadata-delegate label="Metadata Delegate Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataDelegate" /%}
{% node label="Bump" /%}
{% node label="Mint" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Update Authority" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="metadata-delegate-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="metadata-delegate-pda" to="metadata-delegate" path="straight" /%}
{% /diagram %}

### Authority Item Delegate

- The Delegate Authority can update a sub-set of the asset. It can update anything that the Update Authority can update aside from the **Data** object which requires a Data Delegate as explained below.

{% dialect-switcher title="Use an Authority Item delegate" %}
{% dialect title="JavaScript" id="js" %}

{% totem-accordion title="Approve" %}

```ts
import { delegateAuthorityItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateAuthorityItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: authorityItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Revoke" %}

```ts
import { revokeAuthorityItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeAuthorityItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: authorityItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Delegated update" %}

```ts
import { updateAsAuthorityItemDelegateV2 } from '@metaplex-foundation/mpl-token-metadata'

await updateAsAuthorityItemDelegateV2(umi, {
  mint,
  authority: authorityItemDelegate,
  newUpdateAuthority,
  isMutable: false,
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

### Collection Delegate

_Coming soon..._

- The Delegate Authority can update a sub-set of the asset. It can set the **Collection** attribute of the Metadata account.
- When applied to a Collection NFT, the Delegate Authority can perfom the following actions on the items inside that Collection:
  - It can verify and unverify that Collection NFT on the item. It can only do this if the Collection NFT is already set on the item. Otherwise, there is no way of knowing that the item is part of the delegated Collection NFT.
  - It can clear the Collection NFT from the item.

### Collection Item Delegate

_Coming soon..._

- The Delegate Authority can update a sub-set of the asset. It can set the **Collection** attribute of the Metadata account.
- Even if the asset is a Collection NFT, and contrary to the Collection Delegate, the Collection Item Delegate cannot affect the items of that collection.

### Data Delegate

_Coming soon..._

- The Delegate Authority can update a sub-set of the asset. It can update the entire **Data** object of the Metadata account but nothing else. This means it can update the **Creators** of the asset.
- When applied to a Collection NFT, the Delegate Authority can perfom the same updates on the items inside that Collection.

### Data Item Delegate

_Coming soon..._

- The Delegate Authority can update a sub-set of the asset. It can update the entire **Data** object of the Metadata account but nothing else. This means it can update the **Creators** of the asset.
- Even if the asset is a Collection NFT, and contrary to the Data Delegate, the Data Item Delegate cannot affect the items of that collection.

### Programmable Config Delegate

_Coming soon..._

- The Programmable Config Delegate is only relevant for [Programmable Non-Fungibles](/token-metadata/pnfts).
- The Delegate Authority can update the **Programmable Config** attribute of the Metadata account but nothing else. This means it can update the **Rule Set** of the PNFT.
- When applied to a Collection NFT, the Delegate Authority can perfom the same updates on the items inside that Collection.

### Programmable Config Item Delegate

_Coming soon..._

- The Programmable Config Delegate is only relevant for [Programmable Non-Fungibles](/token-metadata/pnfts).
- The Delegate Authority can update the **Programmable Config** attribute of the Metadata account but nothing else. This means it can update the **Rule Set** of the PNFT.
- Even if the asset is a Collection NFT, and contrary to the Programmable Config Delegate, the Programmable Config Item Delegate cannot affect the items of that collection.

## Token Delegates

_Coming soon..._

- There can only be one Token Delegate per token account.
- Token delegates cannot revoke themselves as they are also set on the Token Program which does not allow the delegates to self-revoke.
- Token delegates are reset on transfer. When dealing with fungible assets, the Delegate Authority is reset when all delegated tokens are transferred.
- The Standard delegate can be used by all assets except Programmable Non-Fungibles. All other Token delegates can only be used by Programmable Non-Fungibles.
- All Token delegates that can be used by Programmable Non-Fungibles also store the current Delegate Authority and its role on the Token Record account of the PNFT.

{% diagram height="h-64 md:h-[600px]" %}
{% node %}
{% node #wallet-1 label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-1" x=-10 y=-25 label="Non-Fungibles and Semi-Fungibles" theme="transparent" /%}

{% node x="200" parent="wallet-1" %}
{% node #token-1 label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% node label="Delegate Amount" theme="orange" z=1 /%}
{% /node %}

{% node x="200" parent="token-1" %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-1" y=150 %}
{% node #wallet-2 label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-2" x=-10 y=-25 label="Programmable Non-Fungibles" theme="transparent" /%}

{% node #token-2-wrapper x="200" parent="wallet-2" %}
{% node #token-2 label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% node label="Delegate Amount = 1" theme="orange" z=1 /%}
{% /node %}

{% node #mint-2-wrapper x="200" parent="token-2" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint-2" x="0" y="150" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State" /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" theme="orange" z=1 /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet-1" to="token-1" /%}
{% edge from="mint-1" to="token-1" /%}

{% edge from="wallet-2" to="token-2" /%}
{% edge from="mint-2" to="token-2" /%}
{% edge from="token-2-wrapper" to="token-record-pda" /%}
{% edge from="mint-2-wrapper" to="token-record-pda" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

### Standard Delegate

_Coming soon..._

The Standard Delegate is a wrapper around the SPL Token Program to offer the same API regardless of the Token Standard. It is analogous to setting a delegate directly using the Token program.

- The Delegate Authority can transfer the asset to any address. Doing so will revoke the Delegate Authority.
- The Delegate Authority can burn the asset.
- The Delegate Authority can lock the asset — also known as "freezing" the asset on the Token program. Until the Delegate Authority unlocks the asset, the owner cannot transfer it, burn it, or revoke the Delegate Authority.
- When used with fungible assets, an amount greater than 1 can be provided to specify the number of tokens to delegate to the Delegate Authority.

### Sale Delegate (PNFT only)

_Coming soon..._

- The Delegate Authority can transfer the PNFT to any address. Doing so will revoke the Delegate Authority.
- As long as a Sale Delegate is set on a PNFT, the owner cannot transfer or burn it. However, the owner can revoke the Sale Delegate at any time, which will make the PNFT transferable and burnable again.

### Transfer Delegate (PNFT only)

_Coming soon..._

- The Delegate Authority can transfer the PNFT to any address. Doing so will revoke the Delegate Authority.
- Contrary to the Sale Delegate, when a Transfer Delegate is set, the owner can still transfer and burn the PNFT.

### Locked Transfer Delegate (PNFT only)

_Coming soon..._

- The Delegate Authority can lock the PNFT. Until the Delegate Authority unlocks the PNFT, the owner cannot transfer it, burn it, or revoke the Delegate Authority.
- The Delegate Authority can transfer the PNFT to any address. Doing so will revoke the Delegate Authority and unlock the PNFT if it was locked.

### Utility Delegate (PNFT only)

_Coming soon..._

- The Delegate Authority can lock the PNFT. Until the Delegate Authority unlocks the PNFT, the owner cannot transfer it, burn it, or revoke the Delegate Authority.
- The Delegate Authority can burn the PNFT.

### Staking Delegate (PNFT only)

_Coming soon..._

- The Delegate Authority can lock the PNFT. Until the Delegate Authority unlocks the PNFT, the owner cannot transfer it, burn it, or revoke the Delegate Authority.

## Legacy Delegates

_Coming soon..._
