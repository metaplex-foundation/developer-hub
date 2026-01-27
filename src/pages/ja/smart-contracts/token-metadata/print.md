---
title: エディションの印刷
metaTitle: エディションの印刷 | Token Metadata
description: Token MetadataでNFTエディションを印刷する方法を学習します
---

すべてのNFTは、その**Master Edition**アカウントが適切に設定されている場合、複数のエディションとして印刷される可能性を持っています。このページでは、印刷可能なNFTを作成し、そこからエディションを印刷する方法を学びます。

## 印刷可能NFT

印刷可能NFTの所有者は、その最大供給量に達していない限り、そこから好きなだけエディションを印刷できます。

すべての非代替可能アセット（すなわち、`NonFungible`および`ProgrammableNonFungible`トークン標準）は、作成時に印刷可能NFTになることができます。これは、アセットのMaster Editionアカウントの**Max Supply**属性を設定することで行われます。この属性はオプションであり、以下の値のいずれかを持つことができます：

- `None`: NFTには固定の供給量がありません。言い換えると、**NFTは印刷可能で無制限の供給量を持ちます**。
- `Some(x)`: NFTは`x`エディションの固定供給量を持ちます。
  - `x = 0`の場合、これは**NFTが印刷不可能**であることを意味します。
  - `x > 0`の場合、これは**NFTが印刷可能で`x`エディションの固定供給量を持つ**ことを意味します。

印刷可能NFTから新しい印刷エディションが作成されるたびに、いくつかのことが起こります：

- 全く新しいエディションNFTが作成され、そのデータは元のNFTと一致します。唯一の違いは、印刷されたエディションが元のNFTとは異なるトークン標準を使用することです。
  - `NonFungible`アセットの場合、印刷エディションは`NonFungibleEdition`トークン標準を使用します。
  - `ProgrammableNonFungible`アセットの場合、印刷エディションは`ProgrammableNonFungibleEdition`トークン標準を使用します。
- **Master Edition**アカウントを使用する代わりに、新しいエディションNFTは**Edition**アカウントを使用し、そのエディション番号と親NFTを追跡するために、親の**Master Edition**アカウントのアドレスを保存します。
- Master Editionアカウントの**Supply**属性が1増加します。**Supply**属性が**Max Supply**属性に達すると、NFTはもはや印刷できません。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-280" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-220" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-280" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = MasterEditionV2" /%}
{% node label="Supply" /%}
{% node label="Max Supply" theme="orange" z=1 /%}
{% /node %}

{% node parent="master-edition" y="-140" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = EditionV1" /%}
{% node #edition-parent label="Parent" /%}
{% node label="Edition" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" fromPosition="left" label="OR" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="edition-parent" to="master-edition" dashed=true arrow="none" fromPosition="left" toPosition="left" /%}
{% /diagram %}

## Master Edition NFTの設定

印刷可能なNFTを作成するには、Token Metadataプログラムの[**Create**命令](/ja/smart-contracts/token-metadata/mint#creating-accounts)の**Print Supply**属性を設定する必要があります。これにより、前のセクションで見たように**Master Edition**アカウントの**Max Supply**属性が設定されます。この属性は以下のいずれかになります：

- `Zero`: NFTは印刷不可能です。
- `Limited(x)`: NFTは印刷可能で、`x`エディションの固定供給量を持ちます。
- `Unlimited`: NFTは印刷可能で、無制限の供給量を持ちます。

SDKを使用して印刷可能なNFTを作成する方法を以下に示します。

{% code-tabs-imported from="token-metadata/create-master-edition" frameworks="umi,kit" /%}

## Master Edition NFTからのエディション印刷

**Max Supply**に達していない印刷可能なNFTがあれば、そこから新しいエディションを印刷できます。これはToken Metadataプログラムの**Print**命令を呼び出すことで行われます。この命令は以下の属性を受け入れます：

- **Master Edition Mint**: 印刷可能なNFTのMintアカウントのアドレス。
- **Edition Mint**: 新しいエディションNFTのMintアカウントのアドレス。これは通常、アカウントが存在しない場合は命令によって作成されるため、新しく生成されたSignerです。
- **Master Token Account Owner**: Signerとしての印刷可能なNFTの所有者。印刷可能なNFTの所有者のみが、そこから新しいエディションを印刷できます。
- **Edition Token Account Owner**: 新しいエディションNFTの所有者のアドレス。
- **Edition Number**: 印刷する新しいエディションNFTのエディション番号。これは通常、**Master Edition**アカウントの現在の**Supply**に1を加えた値です。
- **Token Standard**: 印刷可能なNFTのトークン標準。`NonFungible`または`ProgrammableNonFungible`です。

SDKを使用して印刷可能なNFTから新しいエディションを印刷する方法を以下に示します。

{% code-tabs-imported from="token-metadata/print-edition" frameworks="umi,kit" /%}
