---
title: DAS API
metaTitle: DAS API - Overview
description: A DAS API client used to access the Metaplex Digital Asset Standard.
---

The Metaplex Digital Asset Standard (DAS) API represents a unified interface for interacting with digital assets on Solana, supporting all three Metaplex standards Core, Token Metadata, compressed (Bubblegum) assets. This allows easy access and filtering of Asset Data. This is especially useful for:
- Core Assets, where the Plugins can be automatically derived and include the plugin data of the collection.
- Compressed NFT, where the detailed account data is not stored onchain, but in data stores managed by RPC providers.
- Fetching Data with less Calls because the Off Chain Metadata is also indexed through the standard.

The API defines a set of methods that RPCs implement in order to provide asset data. In the majority of cases, the data is indexed using Metaplex Digital Asset RPC infrastructure.

## Core Extension
In addition to the general DAS SDK an extension for [MPL Core](/core) has been created that directly returns you the correct types to further use with the MPL Core SDKs. It also automatically derives the plugins in assets inherited from the collection and provides functions for [DAS-to-Core type conversions](//TODO).  

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/das-api/getting-started" description="Find the language or library of your choice and get started essentials programs." /%}

{% quick-link title="Methods" icon="CodeBracketSquare" href="/das-api/methods" description="DAS API methods for fetching data." /%}

{% quick-link title="MPL Core Extension" icon="CodeBracketSquare" href="/das-api/methods" description="Get and parse MPL Core assets easily" /%}

{% /quick-links %}
