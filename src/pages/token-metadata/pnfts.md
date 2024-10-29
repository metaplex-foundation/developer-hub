---
title: Programmable NFTs (pNFTs)
metaTitle: Programmable NFTs (pNFTs) | Token Metadata
description: Learn more about Programmable NFTs (a.k.a. pNFTs) on Token Metadata
---

As mentioned in the [overview page](/token-metadata#pnfts), Programmable NFTs (pNFTs) are a new asset standard that allows creators to define custom rules on specific operations and delegate more granularly to third-party authorities. {% .lead %}

## No More Bypassing Token Metadata

Because the Token Metadata program is built on top of the SPL Token program, any owner or spl-token delegate can interact with the SPL Token program directly and bypass the Token Metadata program on vital operations like transferring and burning. Whilst this creates a nice composability pattern between programs it also means the Token Metadata program cannot enforce any rules on behalf of the creators.

A good example of why this can be problematic is that Token Metadata cannot enforce secondary sales royalties. Even though the royalty percentage is stored on the **Metadata** account, it is up to the user or program that performs the transfer to decide whether they want to honor it or not. We talk more about this and how pNFTs fix this issue [in a section below](#use-case-royalty-enforcement).

Programmable NFTs are introduced to solve this issue in a flexible way that **allows creators to customize the authorization layer** of their assets.

Programmable NFTs work as follows:

- **The Token account of the pNFT is always frozen** on the SPL Token program, regardless of whether the pNFT is delegated or not. This ensures that no one can bypass the Token Metadata program by interacting with the SPL Token program directly.
- Whenever an operation is performed on the Token account of a pNFT, the Token Metadata program **thaws the account, performs the operation, and then freezes the account again**. All of this happens **atomically** in the same instruction. That way, all operations that could be made on the SPL Token program are still available to pNFTs but they are always performed through the Token Metadata program.
- When a [Token Delegate](/token-metadata/delegates#token-delegates) is set on a pNFT, the information is stored in a **Token Record** account. Since pNFTs are always frozen on the SPL Token program, it is the responsibility of the Token Record account to keep track of whether the pNFT is really locked or not.
- Because every single operation that affects a pNFT must go through the Token Metadata program, we created a bottleneck that allows us to enforce authorization rules for these operations. These rules are defined in a **Rule Set** account managed by the **Token Auth Rules** program.

Essentially, this gives pNFTs the ability to:

1. Have more granular delegates.
2. Enforce rules on any operation.

Let's dive into these two abilities in more detail.

## More granular delegates

Since all pNFTs operations must go through the Token Metadata program, it can create a new delegate system on top of the spl-token delegate. One that is more granular and allows pNFT owners to pick the operations they want to delegate to a third party.

Information for this new delegate system is stored on a special **Token Record** PDA that is derived from both the Mint and the Token accounts of the pNFT. When a new delegate authority is assigned to a pNFT, the Token Metadata program synchronizes that information on both the Token account and the Token Record account.

We discuss these delegates in more detail in the ["Token Delegates" section of the Delegated Authorities page](/token-metadata/delegates#token-delegates).

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="0" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State" /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

## Additional Accounts

pNFTs require additional accounts for most operations and these include `tokenRecord`, `authorizationRules`, `authorizationRulesProgram`.

### Token Record

A `tokenRecord` account is responsible for holding details regarding the token and its state such as `delegates`, it's `lock` state.

There are a few ways to access the `tokenRecord` account and that is either by `fetchDigitalAssetWithAssociatedToken` which returns all needed accounts including metadata, token account, and token record.
An alternative is generate the token record PDA address using the mint ID and the token account address with the `findTokenRecordPda` function.

#### Asset With Token

You can fetch all accounts needed with the `fetchDigitalAssetWithAssociatedToken` function which returns data such as the pNFT metadata account, the token account, and the token record account.

```ts
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
    // Umi instance
    umi,
    // Mint ID
    publicKey("11111111111111111111111111111111"),
    // Owner
    publicKey("22222222222222222222222222222222")
);
```

#### Token Record PDA

Generates the PDA address for the `tokenRecord` account with the `mintId` and `tokenAccount` of the wallet the pNFT asset is stored in.  

```ts
const tokenRecordPda = findTokenRecordPda(umi, {
    // pNFT mint ID
    mint: publicKey("11111111111111111111111111111111")s,
    // Token Account
    token: publicKey("22222222222222222222222222222222"),
});
```

### RuleSet

If you have the `metadata` account data available you will be able to use an `unwrap` to check for the `programableConfig` field on the metadata account.

```ts
const ruleSet = unwrapOptionRecursively(assetWithToken.metadata.programmableConfig)?.ruleSet
```

### Authorization Rules Program

If you have a `ruleSet` set on your pNFT Asset you will need to pass in the **Authorization Rules Program ID** so the `ruleSet` can be validated. There are two was to get this ID, either from the `mpl-token-auth-rules` npm package or by manually pasting in the ID.

#### mpl-token-auth-rules

```ts
const authorizationRulesProgram = getMplTokenAuthRulesProgramId(umi)
```
or

#### Program Address
```ts
const authorizationRulesProgram = pubicKey("auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg")
```

### Authorization Data

If you have a `ruleSet` on your pNFT Asset that requires additional data for validation you would pass it in here.

```ts
const = authorizationData: { payload: ... },
```

## Enforcing rules on any operation

One of the most important features of Programmable NFTs is their ability to enforce a set of rules on any operation that affects them. The entire authorization layer is provided by another Metaplex program called [Token Auth Rules](/token-auth-rules). Whilst that program is used to make pNFTs programmable, it is a generic program that can be used to create and validate authorization rules for any use case.

In the case of pNFTs, the following operations are supported:

| Operation                    | Description                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Transfer:Owner`             | Transfer initiated by the owner of the pNFT                                                                                                                                           |
| `Transfer:SaleDelegate`      | Transfer initiated by a [Sale delegate](/token-metadata/delegates#sale-delegate-pnft-only)                                                                                            |
| `Transfer:TransferDelegate`  | Transfer initiated by a [Transfer](/token-metadata/delegates#transfer-delegate-pnft-only) or [Locked Transfer](/token-metadata/delegates#locked-transfer-delegate-pnft-only) delegate |
| `Transfer:MigrationDelegate` | Transfer initiated by a Migration delegate (legacy delegate used during the pNFT migration period)                                                                                    |
| `Transfer:WalletToWallet`    | Transfer between wallets (currently not in use)                                                                                                                                       |
| `Delegate:Sale`              | Approve a [Sale delegate](/token-metadata/delegates#sale-delegate-pnft-only)                                                                                                          |
| `Delegate:Transfer`          | Approve a [Transfer delegate](/token-metadata/delegates#transfer-delegate-pnft-only)                                                                                                  |
| `Delegate:LockedTransfer`    | Approve a [Locked Transfer delegate](/token-metadata/delegates#locked-transfer-delegate-pnft-only)                                                                                    |
| `Delegate:Utility`           | Approve a [Utility delegate](/token-metadata/delegates#utility-delegate-pnft-only)                                                                                                    |
| `Delegate:Staking`           | Approve a [Staking delegate](/token-metadata/delegates#staking-delegate-pnft-only)                                                                                                    |

Creators can assign a custom **Rule** to any of these operations. When that operation is performed, the Token Metadata program will ensure the rule is valid before allowing the operation to go through. The available rules are documented by the Token Auth Rules program directly but it is worth noting that there are two types of rules:

- **Primitive Rules**: These rules explicitly tell us if an operation is allowed or not. For instance: the `PubkeyMatch` rule will pass if and only if the public key at the given field matches the given public key; the `ProgramOwnedList` will pass if and only if the program owning the account at the given field is part of a given list of programs; the `Pass` rule will always pass; etc.
- **Composite Rules**: These rules aggregate multiple rules together to create a more complex authorization logic. For instance: the `All` rule will pass if and only if all of the rules it contains pass; the `Any` rule will pass if and only if at least one of the rules it contains passes; the `Not` rule will pass if and only if the rule it contains does not pass; etc.

Once we have all the rules for our operations defined, we can store them in a **Rule Set** account on the Token Auth Rules program. Whenever we need to make a change to this Rule Set, a new **Rule Set Revision** is appended to the Rule Set account. This ensures any pNFT currently locked within a specific revision can be unlocked before moving on to the latest revision.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="41" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #ruleset-revision label="Rule Set Revision" theme="orange" z=1 /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-80" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #programmable-configs label="Programmable Configs" theme="orange" z=1 /%}
{% /node %}

{% node parent="metadata" x="-260" %}
{% node #ruleset label="Rule Set Account" theme="crimson" /%}
{% node label="Owner: Token Auth Rules Program" theme="dimmed" /%}
{% node label="Header" /%}
{% node label="Rule Set Revision 0" /%}
{% node #ruleset-revision-1 label="Rule Set Revision 1" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" fromPosition="top" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" path="straight" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% edge from="programmable-configs" to="ruleset" dashed=true arrow="none" animated=true /%}
{% edge from="ruleset-revision" to="ruleset-revision-1" dashed=true arrow="none" animated=true toPosition="left" /%}
{% /diagram %}

## Use-case: Royalty enforcement

Now that we understand pNFTs a bit better, let's look at a concrete use case that can be solved with PNFTs: royalty enforcement.

As mentioned above, without pNFTs, anyone can bypass the royalty percentage stored on the **Metadata** account by interacting with the SPL Token program directly. This means creators must rely on the goodwill of the users and programs that interact with their assets.

However, with pNFTs, creators can design a **Rule Set** that ensures **programs that do not enforce royalties are forbidden to perform transfers** on their assets. They can use a combination of Rules to create an allow list or a deny list depending on their needs.

Additionally, since Rule Sets can be shared and reused across multiple pNFTs, creators can create and share **Community Rule Sets** to ensure that any program that stops supporting royalties is immediately banned from interacting with any pNFTs that use such Community Rule Set. This creates a strong incentive for programs to support royalties as they would otherwise be banned from interacting with a large number of assets.
