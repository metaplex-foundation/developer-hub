---
title: Programmable NFTs
metaTitle: Token Metadata - Programmable NFTs
description: Learn more about Programmable NFTs (a.k.a. pNFTs) on Token Metadata
---

As mentioned in the [overview page](/token-metadata#pnfts), Programmable NFTs (PNFTs) are a new asset standard that allows creators to define custom rules on specific operations and delegate more granularly to third-party authorities. {% .lead %}

## No More Bypassing Token Metadata

Because the Token Metadata program is built on top of the SPL Token program, any owner or spl-token delegate can interact with the SPL Token program directly and bypass the Token Metadata program on vital operations like transferring and burning. Whilst this creates a nice composibility pattern between programs it also means the Token Metadata program cannot enforce any rules on behalf of the creators.

A good example of why this can be problematic is that Token Metadata cannot enforce secondary sales royalties. Even though the royalty percentage is stored on the **Metadata** account, it is up to the user or program that performs the transfer to decide whether they want to honour it or not. We talk more about this and how PNFTs fix this issue [in a section below](#use-case-royalty-enforcement).

Programmable NFTs are introduced to solve this issue in a flexible way that **allows creators to customise the authorization layer** of their assets.

Programmable NFTs work as follows:

- **The Token account of the PNFT is always frozen** on the SPL Token program, regardless of whether the PNFT is delegated or not. This ensures that no one can bypass the Token Metadata program by interacting with the SPL Token program directly.
- Whenever an operation is performed on the Token account of a PNFT, the Token Metadata program **thaws the account, performs the operation, and then freezes the account again**. All of this happens **atomically** in the same instruction. That way, all operations that could be made on the SPL Token program are still available to PNFTs but they are always performed through the Token Metadata program.
- When a [Token Delegate](/token-metadata/delegates#token-delegates) is set on a PNFT, the information is stored in a **Token Record** account. Since PNFTs are always frozen on the SPL Token program, it is the responsibility of the Token Record account to keep track of whether the PNFT is really locked or not.
- Because every single operation that affects a PNFT must go through the Token Metadata program, we created a bottleneck that allows us to enforce authorization rules for these operations. These rules are defined in a **Rule Set** account managed by the **Token Auth Rules** program.

Essentially, this gives PNFTs the ability to:

1. Have more granular delegates.
2. Enforce rules on any operation.

Let's dive into these two abilities in more detail.

## More granular delegates

_Coming soon..._

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

## Enforcing rules on any operation

_Coming soon..._

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
{% node label="Rule Set Revision" theme="orange" z=1 /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-80" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node theme="orange" z=1 %}
Programmable Configs \
\- Rule Set
{% /node %}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" fromPosition="top" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" path="straight" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

## Use-case: Royalty enforcement

_Coming soon..._
