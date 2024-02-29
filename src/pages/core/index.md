---
title: Overview
metaTitle: Core - Overview
description: Provides a high-level overview of the new Solana Core standard.
---

Metaplex Core (“Core”) sheds the complexity and technical debt of previous standards and provides a clean and simple core spec for digital assets. This makes the bare minimum use case easy and understandable for users just starting out with Digital Assets.

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/core/getting-started" description="Find the language or library of your choice and get started with digital assets on Solana." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="/core/references" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## Introduction

The Core program is new digital asset programs by Metaplex to deal with Assets on the Solana blockchain. Its main goal is to provide a easy to use, low cost program that contains a flexible plugin system.

Different to other existing Asset programs, like [Solana’s Token program](https://spl.solana.com/token) it does not rely on multiple accounts, like Associated Token Accounts, but stores the relationship between a wallet and the "mint" account in the asset itself.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="Someone's wallet." theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
Stores information about the \
asset, including the owner
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

The Core Asset account represents the bare minimum data for a digital asset. This structure provides an unopinionated blockchain primitive for on-chain ownership.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="Owner" /%}
{% node label="Update Authority" /%}
{% node label="Name" /%}
{% node label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

One important attribute of the Asset Account is the `URI` attribute that points to a JSON file off-chain. This is used to safely provide additional data whilst not being constrained by the fees involved in storing on-chain data. That JSON file [follows a certain standard](/token-metadata/token-standard) that anyone can use to find useful information on tokens.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="Owner" /%}
{% node label="Update Authority" /%}
{% node label="Name" /%}
{% node #uri label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}

{% node parent="uri" x="-200" y="-23" %}
{% node #json theme="slate" %}
Off-chain \
JSON Metadata
{% /node %}
{% node label="Name" /%}
{% node label="Description" /%}
{% node label="Image" /%}
{% node label="Animated URL" /%}
{% node label="Attributes" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="asset" /%}
{% edge from="uri" to="json" path="straight" /%}

{% /diagram %}

Note that, this JSON file can be stored using a permanent storage solution such as Arweave to ensure it cannot be updated. Additionally, one can set the `Update Authority` field to None to make it immutable and, therefore, forbid the `URI` and `Name` attributes to ever be changed. Using this combination, we can guarantee the immutability of the off-chain JSON file.

## Compression

## Plugins

## And a lot more

Whilst this provides a good overview of the Token Metadata program and what it has to offer, there’s still a lot more that can be done with it.

The other pages of this documentation aim to document it further and explain significant features in their own individual pages.

//TODO: Link to other features
