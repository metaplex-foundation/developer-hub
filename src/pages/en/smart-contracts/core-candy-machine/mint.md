---
title: Minting from a Core Candy Machine
metaTitle: Minting from a Core Candy Machine | Core Candy Machine
description: How to mint Core NFT Assets from a Core Candy Machine using the mintV1 instruction, including guard configuration, guard groups, pre-validation, and bot tax behavior.
keywords:
  - core candy machine minting
  - mintV1 instruction
  - candy guard program
  - mint settings
  - guard groups
  - bot tax
  - pre-validation
  - route instruction
  - NFT minting Solana
  - mpl-core-candy-machine
  - Metaplex Core
  - mint args
  - allow list
  - compute unit limit
about:
  - Minting NFTs from a Core Candy Machine
  - Configuring guards and guard groups for minting workflows
  - Pre-validation and bot protection for minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: What is the difference between minting via the Candy Guard program and minting directly from the Core Candy Machine program?
    a: Minting via the Candy Guard program allows any user to mint as long as they satisfy the configured guards, enabling complex access-control workflows like payments, allow lists, and start dates. Minting directly from the Core Candy Machine program bypasses all guards but requires the configured mint authority to sign the transaction, making it suitable only for authority-controlled mints.
  - q: How do I increase the compute unit limit when minting with multiple guards?
    a: Use the setComputeUnitLimit helper from @metaplex-foundation/mpl-toolbox in a transaction builder. A value of 300,000 units is a common starting point, but you should adjust based on the number of guards configured. More guards require more compute units.
  - q: What happens when a mint fails and Bot Tax is enabled?
    a: When Bot Tax is active and another guard rejects the mint, the transaction still succeeds on-chain but no NFT is created. Instead, the configured bot tax amount (in SOL) is transferred from the minter to the Candy Machine account. This design prevents bots from cheaply probing guard conditions because failed attempts still cost SOL.
  - q: Do I need to provide Mint Settings for every guard when minting?
    a: No. Only guards that require additional runtime information need Mint Settings. For example, Third Party Signer requires a signer reference and Mint Limit requires an ID. Guards like Start Date or End Date validate automatically and do not need Mint Settings. Each guard's documentation page specifies whether Mint Settings are required.
  - q: What is the difference between the minter signer and the payer signer?
    a: Starting from Candy Guard v1.0, the mintV1 instruction accepts separate minter and payer signers. The payer covers SOL-based fees such as storage and SOL payment guards. The minter is validated against guard conditions (like allow lists and mint limits) and pays token-based fees. This separation enables gasless minting workflows where a backend payer covers SOL costs on behalf of the end user.
---

## Summary

The `mintV1` instruction creates a Core Asset from a loaded [Core Candy Machine](/smart-contracts/core-candy-machine) by routing through the [Candy Guard](/smart-contracts/core-candy-machine/guards) program for access control, then delegating the actual mint to the Core Candy Machine program.

- **Two minting paths**: mint via the Candy Guard program (recommended, supports guards) or directly via the Core Candy Machine program (requires mint authority signature).
- **Mint Settings**: guards that need runtime data (such as Third Party Signer or NFT Payment) require additional `mintArgs` passed at mint time.
- **Guard groups**: when [guard groups](/smart-contracts/core-candy-machine/guard-groups) are configured, you must specify which group label to mint from, and Mint Settings apply to the resolved guards of that group.
- **Pre-validation**: some guards (such as Allow List and Gatekeeper) require a separate verification step before the mint instruction can succeed.

## Basic Minting

The Core Candy Machine uses two on-chain programs to handle minting: the **Core Candy Machine program** (responsible for the actual mint logic) and the **Candy Guard program** (which adds a configurable access-control layer on top). As described on the [Candy Guards page](/smart-contracts/core-candy-machine/guards#why-another-program), these programs work together to enable flexible minting workflows.

There are two ways to mint from a Core Candy Machine:

- **From a Candy Guard program** which will then delegate the minting to the Candy Machine Core program. Most of the time, you will want to do this as it allows for much more complex minting workflows. You may need to pass extra remaining accounts and instruction data to the mint instruction based on the guards configured in the account. Fortunately, our SDKs make this easy by requiring a few extra parameters and computing the rest for us.

- **Directly from the Core Candy Machine Core program**. In this case, only the configured mint authority can mint from it and, therefore, it will need to sign the transaction.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-1 %}

Mint Authority = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
Anyone can mint as long \
as they comply with the \
activated guards.
{% /node %}

{% node parent="mint-1" x=-36 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
Only Alice \
can mint.
{% /node %}

{% node #nft parent="mint-2" x=77 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-2 %}

Mint Authority = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

If everything went well, an NFT will be created following the parameters configured in the Core Candy Machine. For instance, if the given Core Candy Machine uses **Config Line Settings** with **Is Sequential** set to `false`, then we will get the next item at random.

{% callout type="note" %}
Starting from version `1.0` of the Candy Guard program, the mint instruction accepts an additional `minter` signer which can be different than the existing `payer` signer. The `payer` covers SOL-based fees (storage, SOL payment guards), while the `minter` is validated against guard conditions and pays token-based fees. This enables gasless minting workflows where a backend wallet pays SOL costs on behalf of the end user.
{% /callout %}

{% dialect-switcher title="Mint from a Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

To mint from a Core Candy Machine via a configured Candy Guard account, you may use the `mintV1` function and provide the mint address and update authority of the collection NFT the minted NFT will belong to. A `minter` signer and `payer` signer may also be provided but they will default to Umi's identity and payer respectively.

```ts
import { mintV1 } from "@metaplex-foundation/mpl-core-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner } from "@metaplex-foundation/umi";

const candyMachineId = publicKey("11111111111111111111111111111111");
const coreCollection = publicKey("22222222222222222222222222222222");
const asset = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachineId,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);

```

In the rare event that you wish to mint directly from the Core Candy Machine program instead of the Candy Guard Program, you may use the `mintAssetFromCandyMachine` function instead. This function requires the mint authority of the Core Candy Machine to be provided as a signer and accepts an explicit `assetOwner` attribute.

```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
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

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [mintAssetFromCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintAssetFromCandyMachine.html)

{% /dialect %}
{% /dialect-switcher %}

## Minting With Guards

Guards that require runtime information use **Mint Settings** -- additional parameters passed via `mintArgs` to supply guard-specific data such as signer references, token mint addresses, or limit identifiers. If you were to build the mint instruction manually, that information would be provided as a mixture of instruction data and remaining accounts. However, using our SDKs, each guard that requires additional information at mint time defines a set of settings that we call **Mint Settings**. These Mint Settings will then be parsed into whatever the program needs.

A good example of a guard that requires Mint Settings is the **NFT Payment** guard which requires the mint address of the NFT we should use to pay for the mint amongst other things.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
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

{% node parent="mint-2" x=-400 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="Using our SDKs" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="Mint Arguments" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="Mint Remaining Accounts" parent="mint-args" y=50 theme="slate" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="nft-payment-guard" to="mint-settings" theme="slate" /%}
{% edge from="third-party-signer-guard" to="mint-settings" theme="slate" /%}
{% edge from="mint-settings" to="mint-args" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-settings" to="mint-accounts" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-args" to="mint-1" theme="pink" /%}
{% edge from="mint-accounts" to="mint-1" theme="pink" /%}

{% /diagram %}

[Each available guard](/smart-contracts/core-candy-machine/guards) contains its own documentation page and it will tell you whether or not that guard expects Mint Settings to be provided when minting.

If you were to only use guards that do not require Mint Settings, you may mint in the same way described by the "Basic Minting" section above. Otherwise, you'll need to provide an additional object attribute containing the Mint Settings of all guards that require them. Let's have a look at what that looks like in practice using our SDKs.

{% callout type="note" %}
You may need to increase the compute unit limit depending on the number of [guards](/smart-contracts/core-candy-machine/guards) configured on the Core Candy Machine. Use `setComputeUnitLimit` from `@metaplex-foundation/mpl-toolbox` to set a higher limit (e.g. `300_000` units). Adjust this value based on the number of guards in use.
{% /callout %}

{% dialect-switcher title="Mint from a Core Candy Machine with guards" %}
{% dialect title="JavaScript" id="js" %}

When minting via the Umi library, you may use the `mintArgs` attribute to provide the required **Mint Settings**.

Here's an example using the **Third Party Signer** guard which requires an additional signer and the **Mint Limit** guard which keeps track of how many times a wallet minted from the Core Candy Machine.

As mentioned above, you may need to increase the compute unit limit of the transaction to ensure the `mintV1` instruction is successful. Current units are set to `300_000` but you can adjust this number as you see fit. You may do this by using the `setComputeUnitLimit` helper function on the `mpl-toolbox` Umi library as illustrated in the code snippet below.

```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV1 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// Create a Core Candy Machine with guards.
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// Mint from the Core Candy Machine.
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Minting With Guard Groups

When [guard groups](/smart-contracts/core-candy-machine/guard-groups) are configured, the mint instruction requires an explicit `group` label to select which group to mint from. The Mint Settings then apply to the **Resolved Guards** of the selected group -- the combination of that group's guards merged with any default guards.

For instance, imagine a Core Candy Machine with the following guards:

- **Default Guards**:
  - Bot Tax
  - Third Party Signer
  - Start Date
- **Group 1**
  - Label: "nft"
  - Guards:
    - NFT Payment
    - Start Date
- **Group 2**
  - Label: "public"
  - Guards:
    - Sol Payment

The Resolved Guards of Group 1 -- labelled "nft" -- are:

- Bot Tax: from the **Default Guards**.
- Third Party Signer: from the **Default Guards**.
- NFT Payment: from **Group 1**.
- Start Date: from **Group 1** because it overrides the default guard.

Therefore, the provided Mint Settings must be related to these Resolved Guards. In the example above, Mint Settings must be provided for the Third Party Signer guard and the NFT Payment guard.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards (default guards)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="Start Date" /%}
{% node #nft-group theme="mint" z=1 %}
Group 1: "nft" {% .font-semibold %}
{% /node %}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Start Date" /%}
{% node theme="mint" z=1 %}
Group 2: "public"
{% /node %}
{% node label="SOL Payment" /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
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

{% node parent="mint-2" x=-400 y=60 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="Using our SDKs" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="Mint Arguments" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="Mint Remaining Accounts" parent="mint-args" y=50 theme="slate" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="nft-payment-guard" to="mint-settings" theme="slate" /%}
{% edge from="third-party-signer-guard" to="mint-settings" theme="slate" /%}
{% edge from="mint-settings" to="mint-args" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-settings" to="mint-accounts" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-args" to="mint-1" theme="pink" /%}
{% edge from="mint-accounts" to="mint-1" theme="pink" /%}
{% edge from="nft-group" to="mint-1" theme="pink" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="Mint from a Core Candy Machine with guard groups" %}
{% dialect title="JavaScript" id="js" %}

When minting from a Core Candy Machine using guard groups, the label of the group we want to select must be provided via the `group` attribute.

Additionally, the Mint Settings for the Resolved Guards of that group may be provided via the `mintArgs` attribute.

Here is how we would use the Umi library to mint from the example Core Candy Machine described above.

```ts
// Create a Core Candy Machine with guards.
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
  },
  groups: [
    {
      label: 'nft',
      guards: {
        nftPayment: some({ requiredCollection, destination: nftTreasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
      },
    },
    {
      label: 'public',
      guards: {
        solPayment: some({ lamports: sol(1), destination: solTreasury }),
      },
    },
  ],
}).sendAndConfirm(umi)

// Mint from the Core Candy Machine.

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
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
    })
  )
  .sendAndConfirm(umi)
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Minting With Pre-Validation

Some guards require an additional verification step before the mint instruction can succeed. This pre-validation step typically creates an on-chain account or issues a token that serves as proof of eligibility, which the mint instruction then checks during execution.

### Pre-Validation via the Route Instruction

The [route instruction](/smart-contracts/core-candy-machine/guard-route) allows a guard to execute its own custom instruction for pre-mint verification. The guard defines what the route instruction does, and the resulting on-chain proof is checked during the subsequent mint call.

A good example of that is the **Allow List** guard. When using this guard, we must verify that our wallet belongs to a predefined list of wallets by calling the route instruction and providing a valid Merkle Proof. If this route instruction is successful, it will create an Allow List PDA for that wallet which the mint instruction can then read to validate the Allow List guard. [You can read more about the Allow List guard on its dedicated page](/smart-contracts/core-candy-machine/guards/allow-list).

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

### Pre-Validation via External Services

Some guards delegate pre-validation to an external service rather than using the route instruction. The external service issues a token or credential that the guard checks during mint.

For instance, when using the **Gatekeeper** guard, we must request a Gateway Token by performing a challenge -- such as completing a Captcha -- which depends on the configured Gatekeeper Network. The Gatekeeper guard will then check for the existence of such Gateway Token to either validate or reject the mint. [You can learn more about the Gatekeeper guard on its dedicated page](/smart-contracts/core-candy-machine/guards/gatekeeper).

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

## Minting With Bot Taxes

The [Bot Tax](/smart-contracts/core-candy-machine/guards/bot-tax) guard protects a Core Candy Machine against bots by charging a configurable SOL fee on failed mints instead of reverting the transaction. This amount is usually small to hurt bots without affecting genuine mistakes from real users. All bot taxes will be transferred to the Core Candy Machine account so that, once minting is over, you can access these funds by deleting the Core Candy Machine account.

This guard is a bit special and affects the minting behaviour of all other guards. When the Bot Tax is activated and any other guard fails to validate the mint, **the transaction will pretend to succeed**. This means no errors will be returned by the program but no NFT will be minted either. This is because the transaction must succeed for the funds to be transferred from the bot to the Core Candy Machine account. [You can learn more about the Bot Tax guard on its dedicated page](/smart-contracts/core-candy-machine/guards/bot-tax).

{% callout type="warning" %}
Because Bot Tax causes failed mints to appear as successful transactions, you should always verify that the expected NFT was actually created after a mint transaction confirms. Check the transaction logs or verify the asset account exists.
{% /callout %}

## Notes

- **Compute unit limits**: Minting with multiple [guards](/smart-contracts/core-candy-machine/guards) may exceed the default compute budget. Use `setComputeUnitLimit` from `@metaplex-foundation/mpl-toolbox` to increase the limit -- `300_000` units is a common starting point, but adjust based on the number of active guards.
- **Minter vs. payer signers**: Since Candy Guard program v1.0, the `mintV1` instruction accepts separate `minter` and `payer` signers. The `payer` covers SOL fees (rent, SOL payment guards); the `minter` is validated against guards and covers token-based fees. Both default to Umi's identity and payer if not explicitly set.
- **Bot Tax behavior**: When [Bot Tax](/smart-contracts/core-candy-machine/guards/bot-tax) is enabled and another guard rejects the mint, the transaction succeeds on-chain but no NFT is created. The bot tax SOL amount is transferred to the Candy Machine account. Always confirm NFT creation after minting when Bot Tax is active.
- **Config Line sequencing**: If the Core Candy Machine uses Config Line Settings with `isSequential` set to `false`, minted items are selected at random from the remaining pool. Setting it to `true` mints items in order.
- **Guard group label required**: When [guard groups](/smart-contracts/core-candy-machine/guard-groups) are configured, the `group` parameter is mandatory. Omitting it will cause the mint instruction to fail.

## FAQ

### What is the difference between minting via the Candy Guard program and minting directly from the Core Candy Machine program?

Minting via the Candy Guard program allows any user to mint as long as they satisfy the configured [guards](/smart-contracts/core-candy-machine/guards), enabling complex access-control workflows like payments, allow lists, and start dates. Minting directly from the Core Candy Machine program bypasses all guards but requires the configured mint authority to sign the transaction, making it suitable only for authority-controlled mints.

### How do I increase the compute unit limit when minting with multiple guards?

Use the `setComputeUnitLimit` helper from `@metaplex-foundation/mpl-toolbox` in a transaction builder. A value of `300_000` units is a common starting point, but you should adjust based on the number of guards configured. More guards require more compute units.

### What happens when a mint fails and Bot Tax is enabled?

When [Bot Tax](/smart-contracts/core-candy-machine/guards/bot-tax) is active and another guard rejects the mint, the transaction still succeeds on-chain but no NFT is created. Instead, the configured bot tax amount (in SOL) is transferred from the minter to the Candy Machine account. This design prevents bots from cheaply probing guard conditions because failed attempts still cost SOL.

### Do I need to provide Mint Settings for every guard when minting?

No. Only guards that require additional runtime information need Mint Settings. For example, Third Party Signer requires a signer reference and Mint Limit requires an ID. Guards like Start Date or End Date validate automatically and do not need Mint Settings. Each [guard's documentation page](/smart-contracts/core-candy-machine/guards) specifies whether Mint Settings are required.

### What is the difference between the minter signer and the payer signer?

Starting from Candy Guard v1.0, the `mintV1` instruction accepts separate `minter` and `payer` signers. The `payer` covers SOL-based fees such as storage and SOL payment guards. The `minter` is validated against guard conditions (like allow lists and mint limits) and pays token-based fees. This separation enables gasless minting workflows where a backend payer covers SOL costs on behalf of the end user.

---

## Next Steps

Here are some additional reading resources you might be interested in:

- [All Available Guards](/smart-contracts/core-candy-machine/guards): Have a look through all the guards available to you so you can cherry-pick the ones you need.
- [Guard Groups](/smart-contracts/core-candy-machine/guard-groups): Learn how to configure multiple groups of guards for different minting phases.
- [Route Instruction](/smart-contracts/core-candy-machine/guard-route): Understand how guards use the route instruction for pre-validation.

