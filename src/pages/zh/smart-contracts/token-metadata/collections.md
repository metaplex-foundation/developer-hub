---
title: 已验证的集合
metaTitle: 已验证的集合 | Token Metadata
description: 了解如何在 Token Metadata 上安全地将资产包装到集合中
---

认证集合功能使 NFT（以及一般代币）**能够被分组在一起**，并且该信息可以**在链上验证**。此外，它通过在链上为这些集合分配数据，使管理这些集合变得更加容易。{% .lead %}

此功能提供以下优势：

- 无需进行额外的链上调用即可轻松识别任何给定 NFT 所属的集合。
- 可以找到属于给定集合的所有 NFT（[查看指南了解如何操作](/zh/smart-contracts/token-metadata/guides/get-by-collection)）。
- 易于管理集合元数据，如名称、描述和图片。

## 集合本身就是 NFT

为了将 NFT（或任何代币）分组在一起，我们必须首先创建一个集合 NFT，其目的是存储与该集合相关的任何元数据。没错，**NFT 的集合本身就是一个 NFT**。它在链上具有与任何其他 NFT 相同的数据布局。

集合 NFT 和普通 NFT 之间的区别在于，前者提供的信息将用于定义它包含的 NFT 组，而后者将用于定义 NFT 本身。

## 将 NFT 关联到集合 NFT

集合 NFT 和普通 NFT **通过元数据账户上的"属于"关系链接在一起**。为此目的，元数据账户上的可选 `Collection` 字段被创建。

- 如果 `Collection` 字段设置为 `None`，则表示该 NFT 不属于任何集合。
- 如果 `Collection` 字段已设置，则表示该 NFT 属于该字段中指定的集合。

因此，`Collection` 字段包含两个嵌套字段：

- `Key`：此字段指向 NFT 所属的集合 NFT。更准确地说，它指向**集合 NFT 的铸造账户的公钥**。此铸造账户必须由 SPL Token 程序拥有。
- `Verified`：此布尔值非常重要，因为它用于验证 NFT 确实属于它所指向的集合。更多内容见下文。

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-180 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
Collection NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-180 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
Regular NFT {% .font-bold %}

Attached to a collection
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-180 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
Regular NFT {% .font-bold %}

With no collection
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}

{% /diagram %}

## 区分 NFT 和集合 NFT

仅凭 `Collection` 字段就能让我们将 NFT 和集合链接在一起，但它无法帮助我们识别给定的 NFT 是普通 NFT 还是集合 NFT。这就是创建 `CollectionDetails` 字段的原因。它提供了有关集合 NFT 的附加上下文，并将它们与普通 NFT 区分开来。

- 如果 `CollectionDetails` 字段设置为 `None`，则表示该 NFT 是**普通 NFT**。
- 如果 `CollectionDetails` 字段已设置，则表示该 NFT 是**集合 NFT**，并且可以在此字段中找到其他属性。

`CollectionDetails` 是一个可选的枚举，目前只包含一个选项 `V1`。此选项是一个包含以下字段的结构体：

- `Size`：集合的大小，即直接链接到此集合 NFT 的 NFT 数量。此数字由 Token Metadata 程序自动计算，但也可以手动设置以方便迁移过程。请注意，目前[有一个 MIP 正在废弃此 `Size` 属性](https://github.com/metaplex-foundation/mip/blob/main/mip-3.md)。

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node theme="orange" z=1 %}
CollectionDetails = **Some**
{% /node %}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
Collection NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
Regular NFT {% .font-bold %}

Attached to a collection
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
Regular NFT {% .font-bold %}

With no collection
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}

{% /diagram %}

## 创建集合 NFT

创建集合 NFT 与创建普通 NFT 非常相似。唯一的区别是我们必须设置上一节中看到的 `CollectionDetails` 字段。我们的一些 SDK 通过在创建 NFT 时请求 `isCollection` 属性来封装此功能。

{% code-tabs-imported from="token-metadata/create-collection" frameworks="umi,kit" /%}

## 嵌套集合 NFT

由于集合和 NFT 通过"属于"关系链接在一起，因此在设计上可以定义嵌套集合。在这种情况下，`Collection` 和 `CollectionDetails` 字段可以一起使用来区分根集合 NFT 和嵌套集合 NFT。

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node label="CollectionDetails = Some" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-1" x=-10 y=-40 theme="transparent" %}
Collection NFT {% .font-bold %}

Root collection
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = Some" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
Collection NFT {% .font-bold %}

Nested collection
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-3-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
Regular NFT {% .font-bold %}

Attached to a collection
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}
{% edge from="metadata-3-collection" to="mint-2" theme="orange" /%}

{% /diagram %}

## 验证集合 NFT

如上所述，`Collection` 字段包含一个 `Verified` 布尔值，用于**确定 NFT 是否确实属于它所指向的集合**。如果没有这个字段，任何人都可以假装他们的 NFT 属于任何集合。

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node theme="orange" z=1 %}
CollectionDetails = **Some**
{% /node %}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
Collection NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="mint" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-55 theme="transparent" %}
Verified NFT {% .font-bold .text-emerald-600 %}

The Collection NFT verified this NFT \
so we know for sure it is part of it.
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-3-collection theme="red" z=1 %}
Collection

\- Key \
\- Verified = **False**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-55 theme="transparent" %}
Unverified NFT {% .font-bold .text-red-500 %}

This could be anyone's NFT pretending \
to be part of this collection.
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="mint" /%}
{% edge from="metadata-3-collection" to="mint-1" theme="red" path="straight" /%}

{% /diagram %}

为了将 `Verified` 布尔值翻转为 `True`，集合 NFT 的权限必须签名 NFT，以证明它被允许成为集合的一部分。

{% callout title="极其重要" type="warning" %}

浏览器、钱包和市场**必须检查** `Verified` 是否为 `true`。只有在集合 NFT 上的权限对 NFT 运行了 Token Metadata `Verify` 指令之一时，Verified 才能设置为 true。

这与 `Creators` 字段的模式相同，其中 `Verified` 必须为 true 才能验证 NFT。

为了检查 NFT 上的集合是否有效，它**必须**设置了包含以下内容的集合结构：

- `key` 字段与适当的集合父级的铸造地址匹配。
- `verified` 字段设置为 `true`。

如果不遵循这两个步骤，您可能会在真实集合上暴露欺诈性 NFT。
{% /callout %}

### 验证

一旦在 NFT 上设置了 `Collection` 属性，集合 NFT 的权限就可以在 Token Metadata 上发送**验证**指令，将其 `verify` 属性从 `false` 翻转为 `true`。此指令接受以下属性：

- **Metadata**：NFT 的元数据账户地址。这是我们想要在集合中验证的 NFT。
- **Collection Mint**：集合 NFT 的铸造账户地址。这是已经在 NFT 的元数据账户上设置但尚未验证的集合 NFT。
- **Authority**：集合 NFT 的权限作为签名者。这可以是集合 NFT 的更新权限或具有适当角色的已批准委托（请参阅"[委托权限](/zh/smart-contracts/token-metadata/delegates)"页面）。

以下是如何使用我们的 SDK 在 Token Metadata 上验证集合 NFT。

{% code-tabs-imported from="token-metadata/verify-collection" frameworks="umi,kit" /%}

### 取消验证

相反，集合 NFT 的权限可以取消验证属于其集合的任何 NFT。这是通过向 Token Metadata 程序发送**取消验证**指令来完成的，其属性与**验证**指令相同。

{% code-tabs-imported from="token-metadata/unverify-collection" frameworks="umi,kit" /%}
