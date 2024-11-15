---
title: FAQ
metaTitle: FAQ | Token Metadata
description: Frequently asked questions about Token Metadata
---

## How can I filter Metadata accounts by fields located after the `creators` array using `getProgramAccounts`?

When using [the `getProgramAccounts` method from the RPC API](https://docs.solana.com/developing/clients/jsonrpc-api#getprogramaccounts), it is common to want to filter accounts by fields using `memcmp` filters.

Since the `memcmp` filter compares arrays of bytes, this approach requires knowledge of the data structure of the account. Additionally, it requires the length of that data structure to be fixed, so we can find the position of the field we're looking for, for every single account.

Unfortunately, the `creators` field of the **Metadata Account** is a vector that can contain one to five creators. This means the position of every field after it depends on how many creators the account has.

Note that adding new fields to an account without adding breaking change requires appending optional fields to the accounts. This unfortunately means that any new features we may add to the Metadata Account will be after the `creators` field and therefore will be challenging to filter via `getProgramAccounts`.

There are several ways to solve this problem:

- If every single account we are trying to filter has **the same number of creators**, then we can figure out the offset of the next field. We can do this by adding `4 + 34 * n` to the `creators` offset, where `n` is the fixed number of creators and `4` is because 4 bytes are used to store the length of the vector. This unblocks us for every field of fixed length present after the `creators` field. Unfortunately, the problem reoccurs as soon as we reach another field of variable size such as another vector or an optional field. Therefore, this solution is only valid if we know the exact length of all variable fields before the field we are trying to filter with.
- Another solution is to **crawl transactions to find the accounts we're looking for**. This approach is a bit more complex and requires us to implement a custom procedure that fits our needs. For instance, we can use `getSignaturesForAddress` to get all transactions associated with an account and then use `getTransaction` on each of them to access their transaction data before filtering the ones that matter for our use case. It is also worth considering that this approach might not be the most future-proof solution since we might end up relying on instructions that could be deprecated in favor of new ones.
- Finally, **the most robust solution is to index the data we're looking for using a [Geyser Plugin](https://docs.solana.com/developing/plugins/geyser-plugins)**. This currently requires a significant setup, but we end up with a reliable data store that mirrors the data in the Solana blockchain. Not only does it fix our filtering issue, but it also provides a much more convenient and efficient way to access our data.

## How can I filter Metadata accounts by collection?

As mentioned in the question above, filtering by fields present after the `creators` array is a challenging task because it is not a field of fixed size. We recommend to use DAS for the fastest and easiest method to get collection mints. If you want to get the data directly from chain you can use the following method, but we have a [Guide](/token-metadata/guides/get-by-collection) showing three different Methods to get all the NFTs in a collection.

## How to create a Soulbound Asset?

Token Metadata allows you to create Soulbound Assets. The best way to achieve this is using Token22 as the base SPL token, along with the `non-transferrable` Token Extension.

{% dialect-switcher title="Create a Soulbound asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createV1 } from "@metaplex-foundation/mpl-token-metadata";
import { createAccount } from '@metaplex-foundation/mpl-toolbox';
import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeNonTransferableMintInstruction,
} from '@solana/spl-token';
import {
  fromWeb3JsInstruction,
  toWeb3JsPublicKey,
} from '@metaplex-foundation/umi-web3js-adapters';

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

const umi = await createUmi();
const mint = generateSigner(umi);

const extensions = [ExtensionType.NonTransferable];
const space = getMintLen(extensions);
const lamports = await umi.rpc.getRent(space);

// Create the mint account.
const createAccountIx = createAccount(umi, {
  payer: umi.identity,
  newAccount: mint,
  lamports,
  space,
  programId: SPL_TOKEN_2022_PROGRAM_ID,
}).getInstructions();

// Initialize the non-transferable extension.
const createInitNonTransferableMintIx =
  createInitializeNonTransferableMintInstruction(
    toWeb3JsPublicKey(mint.publicKey),
    toWeb3JsPublicKey(SPL_TOKEN_2022_PROGRAM_ID)
  );

// Initialize the mint.
const createInitMintIx = createInitializeMintInstruction(
  toWeb3JsPublicKey(mint.publicKey),
  0,
  toWeb3JsPublicKey(umi.identity.publicKey),
  toWeb3JsPublicKey(umi.identity.publicKey),
  toWeb3JsPublicKey(SPL_TOKEN_2022_PROGRAM_ID)
);

// Create the transaction with the Token22 instructions.
const blockhash = await umi.rpc.getLatestBlockhash();
const tx = umi.transactions.create({
  version: 0,
  instructions: [
    ...createAccountIx,
    fromWeb3JsInstruction(createInitNonTransferableMintIx),
    fromWeb3JsInstruction(createInitMintIx),
  ],
  payer: umi.identity.publicKey,
  blockhash: blockhash.blockhash,
});

// Sign, send, and confirm the transaction.
let signedTx = await mint.signTransaction(tx);
signedTx = await umi.identity.signTransaction(signedTx);
const signature = await umi.rpc.sendTransaction(signedTx);
await umi.rpc.confirmTransaction(signature, {
  strategy: { type: 'blockhash', ...blockhash },
  commitment: 'confirmed',
});

// Create the Token Metadata accounts.
await createV1(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
}).sendAndConfirm(umi);

// Derive the token PDA.
const token = findAssociatedTokenPda(umi, {
  mint: mint.publicKey,
  owner: umi.identity.publicKey,
  tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
});

// Mint the token.
await mintV1(umi, {
  mint: mint.publicKey,
  token,
  tokenOwner: umi.identity.publicKey,
  amount: 1,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}

If it is required to use TokenKeg SPL tokens, you can create a Soulbound Asset using the [Locked Transfer Delegate](/token-metadata/delegates#locked-transfer-delegate-pnft-only) on a pNFT and then locking the pNFT.  Note however that this will not only prevent the owner from transferring the pNFT, but will also prevent the owner from burning it.  This is why the recommendation for Soulbound Assets is to use Token22 tokens.

## Why are the mint and freeze authorities transferred to the Edition PDA?

One question we often receive is: Why does the Token Metadata program transfer the `Mint Authority` and the `Freeze Authority` of the Mint Account to the Edition PDA when creating NFTs? Why not just void them by setting them to `None`?

Let's take a look at why this is the case for both of these authorities separately.

### Mint Authority

Controlling the Mint Authority is a crucial step for ensuring the non-fungibility of a token. Without this protection, someone could mint more tokens for a given NFT and therefore make the NFT fungible.

One way to prevent this from happening is to set the Mint Authority to `None` to ensure no one will ever be able to mint any more tokens for that NFT. However, the Token Metadata program sets that authority to the Edition PDA — which links to a Master Edition account or an Edition account.

**But Why?** The short answer is: **it enables us to deploy upgrades to the Token Metadata program at a much lower cost**.

Losing the Mint Authority is an irreversible action which means we could never leverage it to migrate NFTs to newer versions. For instance, say we want to change the way Original and Printed NFTs are structured and, instead of using Edition accounts, we want to leverage tokens. Without the Mint Authority, migrating NFTs to the new version would simply be impossible.

**Losing this authority would limit the scope of features and changes we may want to implement in the future** and that's why we're not setting it to `None`.

However, that doesn't mean someone can use that Mint Authority to mint more tokens on your NFT. The Mint Authority isn't transferred to someone's public key, it is transferred to a PDA that belongs to the Token Metadata program. Therefore, only an instruction provided by the program could make use of it and such instruction does not exist on the program. It is important to note that the Token Metadata program is completely open-source so anyone can inspect it to ensure the Mint Authority is not used to mint more tokens.

### Freeze Authority

Controlling the Freeze Authority allows someone to freeze a Token account, making that account immutable until it is thawed.

One reason this authority is transferred to the Edition PDA of the Token Metadata program is, similarly to the Mint Authority, it increases the scope of potential new features and upgrades.

However, contrary to the Mint Authority, we actually make use of that authority in the program.

The `FreezeDelegatedAccount` and `ThawDelegatedAccount` instructions are the only instructions that make use of the Freeze Authority. They allow the Delegate of a Token account to freeze (and thaw) that Token account to make them what we call "**Non-Transferable NFTs**". This enables a variety of use-cases such as preventing someone from selling an NFT while it is listed in an escrowless marketplace.

## Why does the Metadata account have both onchain and off-chain data?

The **Metadata account** contains onchain data, yet it also has a `URI` attribute which points to an off-chain JSON file which provides additional data. So why is that? Can't we just store everything onchain? Well, there are several issues with that:

- We have to pay rent to store data onchain. If we had to store everything within the Metadata account, which may include long texts such as the description of an NFT, it would require a lot more bytes and minting an NFT would suddenly be a lot more expensive.
- Onchain data is much less flexible. Once an account is created using a certain structure, it cannot easily be changed. Therefore, if we had to store everything onchain, the NFT standard would be a lot harder to evolve with the demands of the ecosystem.

Therefore, splitting the data into onchain and off-chain data allows us to get the best of both worlds where onchain data can be used by the program **to create guarantees and expectations for its users** whereas off-chain data can be used **to provide standardized yet flexible information**.

## Are there any costs to using Token Metadata?

Token Metadata currently charges very small fees ranging between 0.001 SOL and 0.01 SOL to the caller of certain instructions. More details can be found on the [Protocol Fees page](/protocol-fees).

## Where can I find the deprecated instructions?

Some of the instructions of the Token Metadata program have been through a few iterations and have been deprecated in favour of newer ones. The deprecated instructions are still available in the program but they are not documented on the Developer Hub as they are no longer the recommended way to interact with the program. That being said, if you are looking for the deprecated instructions, you can find them in the Token Metadata program repository. Here is a list of them:

- [CreateMetadataAccountV3](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L448) has been replaced with [CreateV1](/token-metadata/mint#creating-mint-and-metadata-accounts).
- [UpdateMetadataAccountV2](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L241) has been replaced with [CreateV1](/token-metadata/mint#creating-mint-and-metadata-accounts).
- [UpdatePrimarySaleHappenedViaToken](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L112)
- [SignMetadata](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L146) use [Verify](/token-metadata/collections) instead.
- [RemoveCreatorVerification](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L388)  use [Unverify](/token-metadata/collections#unverify) instead.
- [CreateMasterEditionV3](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L267)  has been replaced with [CreateV1](/token-metadata/mint#creating-mint-and-metadata-accounts).
- [MintNewEditionFromMasterEditionViaToken](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L202)  has been replaced with [CreateV1](/token-metadata/mint#creating-mint-and-metadata-accounts).
- [ConvertMasterEditionV1ToV2](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L210)
- [PuffMetadata](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L236)
- [VerifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L278) use [Verify](/token-metadata/collections) instead.
- [SetAndVerifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L367)  use [Verify](/token-metadata/collections) instead.
- [UnverifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L334)  use [Unverify](/token-metadata/collections#unverify) instead.
- [Utilize](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L296) - the use feature has been deprecated.
- [ApproveUseAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L311) - the use feature has been deprecated.
- [RevokeUseAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L324) - the use feature has been deprecated.
- [ApproveCollectionAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L346) use [Delegate](/token-metadata/delegates) instead.
- [RevokeCollectionAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L354) use [Revoke](/token-metadata/delegates) instead.
- [FreezeDelegatedAccount](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L375)
- [ThawDelegatedAccount](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L383)
- [BurnNft](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L383) has been replaced by [Burn](https://developers.metaplex.com/token-metadata/burn).
- [BurnEditionNft](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L487) has been replaced by [Burn](https://developers.metaplex.com/token-metadata/burn).
- [VerifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L411)  Sized collections have been deprecated.
- [SetAndVerifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L437)  Sized collections have been deprecated.
- [UnverifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L423) Sized collections have been deprecated.
- [SetCollectionSize](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L456) Sized collections have been deprecated.
- [SetTokenStandard](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L464) the TokenStandard is automatically set now.

## Where can I learn more about Token Metadata Account Size Reduction?
Please check the [special FAQ](/token-metadata/guides/account-size-reduction) for more information or join our [Discord](https://discord.gg/metaplex) in case of remaining open quesitons.