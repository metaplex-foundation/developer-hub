---
title: Minting Assets from a Candy Machine
metaTitle: Minting | Core Candy Machine
description: How to mint from a Core Candy Machine allowing users to purchase your Core NFT Assets.
---

**Note**: Minting can only begin after all assets have been loaded into the Candy Machine. If you missed this step, refer to [Loading Items in the Candy Machine](/core-candy-machine/insert-items)

## Minting Assets from a Candy Machine

When the Candy Machine has no guards, only the `mintAuthority` can mint from it. This can be done using the `mintAssetFromCandyMachine()` instruction while explicitly specifying who will receive the asset (`assetOwner`).

Here is an example of how to mint from a Core Candy Machine directly:

{% dialect-switcher title="Mint from a Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { mintAssetFromCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await mintAssetFromCandyMachine(umi, {
  candyMachine: candyMachineId,
  mintAuthority: umi.identity,
  assetOwner: umi.identity.publicKey,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

### with guards

When a Candy Machine has guards, its `mintAuthority` is transferred to the associated Candy Guard account. This ensures that all configured rules are enforced before minting, which is why we're using a different instruction (`mintV1`).

Depending on the guards configured in the Candy Guard account, additional guard-specific parameters and accounts may be required for the minting process. Below is a list of the extra parameters that may be needed for each guard:

{% totem %}

{% totem-accordion title="Candy Guards Mint Arguments" %}

| **Guard Name**               | **Arguments**                                          |
|------------------------------|--------------------------------------------------------|
| **AllocationMintArgs**       | { `id`: number }                                       |
| **AllowList**                | { `merkleRoot`: Uint8Array }                           |
| **AssetBurnMintArgs**        | { `asset`: PublicKey<string>, `requiredCollection`: PublicKey<string> } |
| **AssetBurnMultiMintArgs**   | { `assets`: PublicKey<string>[], `requiredCollection`: PublicKey<string> } |
| **AssetGateMintArgs**        | { `asset`: PublicKey }                                 |
| **AssetMintLimitMintArgs**   | { `asset`: PublicKey, `id`: number }                   |
| **AssetPaymentMintArgs**     | { `asset`: PublicKey<string>, `destination`: PublicKey<string>, `requiredCollection`: PublicKey<string> } |
| **AssetPaymentMultiMintArgs**| { `assets`: PublicKey<string>[], `destination`: PublicKey<string>, `requiredCollection`: PublicKey<string> } |
| **FreezeSolPayment**         | { `destination`: PublicKey, `lamports`: SolAmount }    |
| **FreezeTokenPaymentArgs**   | { `amount`: number | bigint, `destinationAta`: PublicKey, `mint`: PublicKey } |
| **GatekeeperMintArgs**       | { `expireOnUse`: boolean, `gatekeeperNetwork`: PublicKey<string>, `tokenAccount?`: PublicKey<string> } |
| **MintLimitMintArgs**        | { `id`: number }                                       |
| **NftBurnMintArgs**          | { `mint`: PublicKey<string>, `requiredCollection`: PublicKey<string>, `tokenAccount?`: PublicKey<string>, `tokenStandard`: TokenStandard } |
| **NftGateMintArgs**          | { `mint`: PublicKey, `tokenAccount?`: PublicKey }      |
| **NftMintLimitMintArgs**     | { `id`: number, `mint`: PublicKey, `tokenAccount?`: PublicKey } |
| **NftPaymentMintArgs**       | { `destination`: PublicKey<string>, `mint`: PublicKey<string>, `ruleSet?`: PublicKey<string>, `tokenAccount?`: PublicKey<string>, `tokenStandard`: TokenStandard } |
| **SolFixedFeeMintArgs**      | { `destination`: PublicKey<string> }                   |
| **SolPaymentMintArgs**       | { `destination`: PublicKey<string> }                   |
| **ThirdPartySignerMintArgs** | { `signer`: Signer }                                   |
| **Token2022PaymentMintArgs** | { `destinationAta`: PublicKey<string>, `mint`: PublicKey<string> } |
| **TokenBurnMintArgs**        | { `mint`: PublicKey<string> }                          |
| **TokenGateMintArgs**        | { `mint`: PublicKey<string> }                          |
| **TokenPaymentMintArgs**     | { `destinationAta`: PublicKey<string>, `mint`: PublicKey<string> } |

{% /totem-accordion %}

{% /totem %}

**Note**: Due to the extra parameters and data required by the transaction, adding more Candy Guards will increase the need for additional compute units.

Here is an example of how to mint from a Core Candy Machine with Guards that requires additional paramters:

{% dialect-switcher title="Mint from a Core Candy Machine with guards" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  some,
  generateSigner,
} from '@metaplex-foundation/umi'
import { mintV1 } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await mintV1(umi, {
  candyMachine: candyMachineId,
  asset,
  collection: coreCollection,
  mintArgs: {
    thirdPartySigner: some({ signer: thirdPartySigner }),
    mintLimit: some({ id: 1 }),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### with guard groups

When a Candy Machine has guard groups, same as [minting with guards](#with-guards) its `mintAuthority` is transferred to the associated Candy Guard account and depending on the guards, additional guard-specific parameters and accounts may be required for the minting process. 

The main difference between the two types is that when using guard groups, **we must explicitly select which group we want to mint from** by providing its label. Additionally the guard-specific parameters that needs to be added are specific to the choosen group.

For example, for a Candy Machine with the following guards:

- **Default Guards**: Bot Tax, Third Party Signer, Start Date
- **Group 1 - Label: nft**: NFT Payment, Start Date
- **Group 2 - Label: public**: Sol Payment

The "Resolved Guards" of Group 1 — labelled “nft” — are:

- Bot Tax: from the **Default Guards**.
- Third Party Signer: from the **Default Guards**.
- NFT Payment: from **Group 1**.
- Start Date: from **Group 1** because it overrides the default guard.

Therefore, the guard-specific parameters must be related only to these Resolved Guards.

Here is an example of how to mint from a Core Candy Machine with guard groups that requires additional paramters:

{% dialect-switcher title="Mint from a Core Candy Machine with guard groups" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  some,
  generateSigner,
} from '@metaplex-foundation/umi'
import { mintV1 } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await mintV1(umi, {
  candyMachine: candyMachineId,
  asset,
  collection: coreCollection,
  group: some('nft'),
  mintArgs: {
    thirdPartySigner: some({ signer: thirdPartySigner }),
    nftPayment: some({
      mint: nftFromRequiredCollection.publicKey,
      destination: nftTreasury,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### with pre-validation

For pre-validation, we mean all the guards that may require additional verification steps before the mint like creating an account getting a token that acts as proof of that verification.

This can be done in two ways:

- **Using the [route instruction]()**: An example of this is the **[Allowlist Guard](/core-candy-machine/guards/allow-list)** that needs to verify that the wallet belongs to the allowlist providing a valid Merkle Proof. If the route instruction is successful, it will create an Allowlist PDA linked with the wallet wich the Candy Machine  instruction will read and validate during the mint. 

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Verify Merkle Proof" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

- **Using External Services**: An example of this is the **[Gatekeeper Guard](/core-candy-machine/guards/gatekeeper)** that request a Gateway Token by performing a challenge — such as completing a Captcha — which depends on the configured Gatekeeper Network. The Gatekeeper guard will then check for the existence of such Gateway Token to either validate or reject the mint.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #gatekeeper-guard label="Gatekeeper" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 y=-40 %}
{% node #network label="Gatekeeper Network" theme="slate" /%}
{% node theme="slate" %}
Request Gateway Token \
from the Gatekeeper \
Network, e.g. Captcha.
{% /node %}
{% /node %}

{% node #gateway-token parent="network" x=23 y=140 label="Gateway Token" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="gatekeeper-guard" to="network" theme="slate" /%}
{% edge from="network" to="gateway-token" theme="slate" path="straight" /%}
{% edge from="gateway-token" to="mint-1" theme="pink" /%}

{% /diagram %}

## The Bot Tax

The [Bot Tax Guard](/core-candy-machine/guards/bot-tax) protects your Candy Machine against bots by charging mints, that failed because of a Guard, a configurable amount of SOL. All the Sol collected is transferred to the Candy Machine and is accessible by [closing the account](/core-candy-machine/withdrawing-a-candy-machine).

**Note**: When the Bot Tax Guard gets activated, the transaction will pretend to succeed, this means no errors will be returned by the program but no NFT will be minted either. This is because the transaction must succeed for the funds to be transferred from the bot to the Core Candy Machine account.
