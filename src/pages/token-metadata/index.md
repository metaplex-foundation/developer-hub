---
title: Overview
metaTitle: Token Metadata - Overview
description: Provides a high-level overview of the Solana NFT standard.
---

The Token Metadata program is a fundamental program when dealing NFTs and Fungible assets on the Solana blockchain. In this overview, we explain what this program does and how we can leverage its various features at a high level. {% .lead %}

{% quick-links %}

{% quick-link title="Installation" icon="InboxArrowDown" href="/" description="Step-by-step guides to setting up your system and installing the library." /%}

{% quick-link title="Architecture guide" icon="CubeTransparent" href="/" description="Learn how the internals work and contribute." /%}

{% quick-link title="Plugins" icon="SquaresPlus" href="/" description="Extend the library with third-party plugins or write your own." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="/" description="Learn to easily customize and modify your app's visual design to fit your brand." /%}

{% /quick-links %}

## Introduction

The Token Metadata program is one of the most important programs when dealing with NFTs on the Solana blockchain. Its main goal is to **attach additional data to [Fungible](https://en.wikipedia.org/wiki/Fungibility) or Non-Fungible [Tokens](https://spl.solana.com/token)** on Solana.

It achieves this using [Program Derived Addresses](/understanding-programs/#program-derived-addresses-pda) (PDAs) that are _derived_ from the address of Mint Accounts. If you’re not familiar with [Solana’s Token program](https://spl.solana.com/token), _Mint Accounts_ are responsible for storing the global information of a Token and _Token Accounts_ store the relationship between a wallet and a Mint Account.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="Someone's wallet." theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="token" theme="transparent" %}
Stores the number of \
tokens owned by the wallet, \
among other things.
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="mint" theme="transparent" %}
Stores information about the \
token itseft. E.g. its current \
supply and its authorities.
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}

{% /diagram %}

Whilst Mint Accounts contain a few data attributes such as its current supply, it doesn't offer the ability to inject standardized data that can be understood by apps and marketplaces.

This is why the Token Metadata program offers a **Metadata Account** that attaches itself to a Mint Account via a PDA.

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

{% node #metadata-pda parent="mint" x="41" y="-100" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-300" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataV1" /%}
{% node label="Update Authority" /%}
{% node label="Mint" /%}
{% node label="Name" /%}
{% node label="Symbol" /%}
{% node label="URI" /%}
{% node label="Seller Fee Basis Points" /%}
{% node label="Creators" /%}
{% node label="Primary Sale Happened" /%}
{% node label="Is Mutable" /%}
{% node label="Edition Nonce" /%}
{% node label="Token Standard" /%}
{% node label="Collection" /%}
{% node label="Uses" /%}
{% node label="Collection Details" /%}
{% node label="Programmable Configs" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" /%}

{% /diagram %}

That Metadata Account holds a lot of valuable information that can be used throughout the ecosystem. For instance, it maintains a list of creators for the token. Each creator has a `Verified` attribute that, when `True`, guarantees the token was signed by that creator. Each creator also has a `Share` attribute that can be used by marketplaces to distribute royalties.

By attaching more data to the Mint Account, **the Token Metadata program is able to make Digital Assets** of regular on-chain Tokens.

## A JSON standard

One important attribute of the Metadata Account is the `URI` attribute that points to a JSON file off-chain. This is used to safely provide additional data whilst not being constrained by the fees involved in storing on-chain data. That JSON file [follows a certain standard](/token-metadata/token-standard) that anyone can use to find useful information on tokens.

![Same diagram as the previous one with an arrow pointing out of the "URI" attribute of the Metadata Account, towards a cloud labelled "Off-chain JSON Object". A list of example attributes is displayed below that cloud: "Name, Description, Image, Animation URL, Attributes, etc.".](/assets/programs/token-metadata/Token-Metadata-Overview-3.png#radius)

Note that, this JSON file can be stored using a permanent storage solution such as Arweave to ensure it cannot be updated. Additionally, one can use the `Is Mutable` attribute of the Metadata Account to make it immutable and, therefore, forbid the `URI` attribute — and other attributes such as `Name` and `Creators` — to ever be changed. Using this combination, we can guarantee the immutability of the off-chain JSON file.

## NFTs

You might be wondering: what has this got to do with NFTs? Well, NFTs are special tokens that are Non-Fungible.

More precisely, NFTs in Solana are Mint Accounts with the following characteristics:

- It has **a supply of 1**, meaning only one token is in circulation.
- It has **zero decimals**, meaning there cannot be such a thing as 0.5 tokens.
- It has **no mint authority**, meaning no one can ever mint additional tokens.

What we end up with is a token that cannot be traded with something of the same kind, which is the definition of a Non-Fungible Token (NFT).

![A simplified version of the previous diagram: no data attributes on the Metadata Account nor JSON Object cloud displayed. Instead the Mint Account displays the following attributes: "Mint Authority = None", "Supply = 1" and "Decimals = 0". The Token Account displays only one attribute: "Amount = 1".](/assets/programs/token-metadata/Token-Metadata-Overview-4.png#radius)

In this particular yet popular case, the goal of the Metadata Account is to provide the actual data of that NFT to make it a useful Digital Asset.

Additionally, the Token Metadata program offers another account specifically for NFTs called the **Master Edition Account**. This account is also a PDA derived from the Mint Account.

Before creating this account, the Token Metadata program will ensure the special characteristics of Non-Fungible Tokens listed above are met. However, it is worth noting that, instead of voiding the Mint Authority, it will transfer both the Mint Authority and the Freeze Authority to the Master Edition PDA to ensure no one can mint or freeze tokens without going through the Token Metadata program. You can [read more about why this decision was made in the FAQ](/token-metadata/faq#why-are-the-mint-and-freeze-authorities-transferred-to-the-edition-pda).

Thus, **the existence of the Master Edition account acts as proof of Non-Fungibility** for that Mint Account.

![Same diagram as the previous one but the Mint Account points to an additional "PDA" pill which itself points to a new brown rectangle labelled "Master Edition Account". The Mint account also displays the following updated data attributes: "Mint Authority = Edition" and "Freeze Authority = Edition" where both of these attributes point to the new PDA.](/assets/programs/token-metadata/Token-Metadata-Overview-5.png#radius)

## Printing Editions

In addition to being Non-Fungibility evidence, the Master Edition account also allows users to print one or multiple copies of an NFT.

This feature is particularly helpful to creators that want to offer multiple copies of their 1/1 NFTs to their audience.

The Master Edition account contains an optional `Max Supply` attribute that dictates the maximum amount of NFTs that can be printed that way. If set to `0`, printing is disabled. If set to `None` an unlimited amount of copies can be printed.

The Master Edition NFT, a.k.a. Original NFT, acts as the master record that one can use to print copies, a.k.a. Print NFTs.

Each Print NFT is made of its own Mint Account and its own Metadata Account whose data is copied from the Original NFT. However, instead of having a Master Edition account attached to their Mint Account, Print NFTs use yet another PDA account called an **Edition Account**. This account keeps track of the edition number and the parent Master Edition it originated from.

Note that the Master Edition account and the Edition account share the same seeds for their PDA. That means an NFT can be one or the other but not both.

![Same diagram as the previous one but with a new brown rectangle labelled "Edition Account". The "PDA" pill pointing to the Master Edition Account now also points to the new Edition Account with a big "OR" written on the arrow to show it points to one or the other.](/assets/programs/token-metadata/Token-Metadata-Overview-6.png#radius)

## Semi-Fungible Tokens

Whilst NFTs are the biggest use case of the Token Metadata program, it’s important to notice that the program also works with Fungible Token and, what we call, Semi-Fungible Tokens or Fungible Assets.

At the end of the day, the Metadata account helps attach data to tokens regardless of their fungibility. However, the standard of the off-chain JSON file will vary slightly to accommodate their needs.

To safely identify the fungibility of a token — and, thus, the standard that we should use — the Metadata account keeps track of that information in its `Token Standard` attribute. This attribute is automatically computed by the program and cannot be manually updated. It can take the following values.

- `NonFungible`: The Mint account is associated with a Master Edition account and, therefore, is Non-Fungible. This is your typical NFT standard.
- `NonFungibleEdition`: This is the same as `NonFungible` but the NFT was printed from an Original NFT and, thus, is associated with an Edition account instead of a Master Edition account.
- `FungibleAsset`: The Mint account is Fungible but has zero decimal places. Having zero decimals means we can treat the token as an asset whose supply is not limited to one. For instance, Fungible Assets can be used in the gaming industry to store resources such as “Wood” or “Iron”.
- `Fungible`: The Mint account is Fungible and has more than one decimal place. This is more likely going to be a token used as a decentralised currency.
- `ProgrammableNonFungible`: A special `NonFungible` token that is frozen at all times to enforce custom authorization rules. See the next section for more information.

You can [read more about these standards here](/token-metadata/token-standard).

![This image shows three diagrams representing all three fungibility standards. From top to bottom. "NonFungible": Shows a Mint Account with the following attributes "Mint Authority = Edition", "Supply = 1", "Decimals = 0" and "Freeze Authority = Edition". It points to two PDAs, one pointing to a Metadata Account and one pointing to both a Master Edition Account and an Edition Account with a big OR in the middle. "FungibleAsset": Shows a Mint Account with the following attribute: "Decimals = 0". It points to a single PDA which points to a Metadata Account. "Fungible": Shows the same diagram as the "FungibleAsset" diagram but instead of "Decimals = 0", it displays "Decimals > 0" under the Mint Account.](/assets/programs/token-metadata/Token-Metadata-Overview-7.png#radius)

## Programmable NFTs

Because the Token Metadata program is building on top of the Solana Token program, anyone can transfer tokens (fungible or not) without going through the Token Metadata program. Whilst this is great for program composibility, it also means that the Token Metadata program cannot enforce any rules on the tokens it is attached to.

A good example of why this can be problematic is that Token Metadata cannot enforce secondary sales royalties. Whilst there is **Seller Fee Basis Points** attribute on the Metadata account, it is purely [indicative](/programs/understanding-programs#indicative-fields) and anyone could create a marketplace that does not honor royalties — which is exactly what happened.

**Programmable NFTs** were introduced to solve this problem. They are a new _opt-in_ Token Standard that **keeps the underlying token accounts frozen at all times**. That way, nobody can transfer, lock or burn Programmable NFTs without going through the Token Metadata program.

It is then up to the creators to define custom operation-specific authorization rules that will be enforced by the Token Metadata program. These are defined in a special **RuleSet** account which is attached to the Metadata account. An example of such RuleSet could be an allowlist of program addresses that honor royalties. RuleSets are part of a new Metaplex program called [Token Auth Rules](https://github.com/metaplex-foundation/mpl-token-auth-rules).

You can [read more about Programmable NFTs here](https://github.com/metaplex-foundation/metaplex-program-library/blob/master/token-metadata/program/ProgrammableNFTGuide.md).

![Diagram of a Programmable NFT listing all the accounts they require.](/assets/programs/token-metadata/Token-Metadata-Overview-8.png#radius)

## And a lot more

Whilst this provides a good overview of the Token Metadata program and what it has to offer, there’s still a lot more that can be done with it.

The other pages of the “Token Metadata” section aim to document it further and explain significant features in their own individual pages.

The next three pages focus on helping you get started with the Token Metadata program and provide detailed information on the accounts and instructions it provides, so you get the full picture and can refer back to them in the future.

- [Getting started](/token-metadata/getting-started)
- [Accounts](/token-metadata/accounts)
- [Instructions](/token-metadata/instructions)

The next pages act as in-depth guides on certain features offered by the program.

- [Token Standard](/token-metadata/token-standard)
- [Certified Collections](/token-metadata/certified-collections)
- [Using NFTs](/token-metadata/using-nfts)

Finally, the last two pages answer frequently asked questions and document version updates.

- [FAQ](/token-metadata/faq)
- [Changelog](/token-metadata/changelog/)
