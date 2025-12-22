---
title: 并发默克尔树
metaTitle: 并发默克尔树 | Bubblegum V2
description: 了解更多关于并发默克尔树及其在Bubblegum中的使用。
---

## 介绍

默克尔树是一种树数据结构，其中每个叶节点都标有代表某些数据的哈希值。相邻的叶子被哈希在一起，结果哈希成为这些叶子父节点的标签。同一级别的节点再次被哈希在一起，结果哈希成为这些节点父节点的标签。这个过程持续进行，直到为根节点创建单个哈希值。这个单一哈希值以密码学方式代表整棵树的数据完整性，被称为默克尔根。

大多数默克尔树是二叉树，但不必是二叉树。用于Bubblegum压缩NFT（cNFT）的默克尔树是如我们图表所示的二叉树。

{% diagram %}

{% node %}
{% node #root label="默克尔根" /%}
{% node label="Hash(节点 1, 节点 2)" /%}
{% /node %}

{% node parent="root" y=100 x=-220 %}
{% node #i-node-1 label="节点 1" /%}
{% node label="Hash(节点 3, 节点 4)" /%}
{% /node %}

{% node parent="root" y=100 x=220 %}
{% node #i-node-2 label="节点 2" /%}
{% node label="Hash(节点 5, 节点 6)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=-110 %}
{% node #i-node-3 label="节点 3" /%}
{% node label="Hash(叶子 1, 叶子 2)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=110 %}
{% node #i-node-4 label="节点 4" /%}
{% node label="Hash(叶子 3, 叶子 4)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=-110 %}
{% node #i-node-5 label="节点 5" /%}
{% node label="Hash(叶子 5, 叶子 6)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=110 %}
{% node #i-node-6 label="节点 6" /%}
{% node label="Hash(叶子 7, 叶子 8)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="-40" %}
{% node #leaf-1 label="叶子 1" /%}
{% node label="Hash(cNFT 1)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="70" %}
{% node #leaf-2 label="叶子 2" /%}
{% node label="Hash(cNFT 2)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="-40" %}
{% node #leaf-3 label="叶子 3" /%}
{% node label="Hash(cNFT 3)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="70" %}
{% node #leaf-4 label="叶子 4" /%}
{% node label="Hash(cNFT 4)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="-40" %}
{% node #leaf-5 label="叶子 5" /%}
{% node label="Hash(cNFT 5)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="70" %}
{% node #leaf-6 label="叶子 6" /%}
{% node label="Hash(cNFT 6)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="-40" %}
{% node #leaf-7 label="叶子 7" /%}
{% node label="Hash(cNFT 7)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="70" %}
{% node #leaf-8 label="叶子 8" /%}
{% node label="Hash(cNFT 8)" /%}
{% /node %}

{% edge from="i-node-1" to="root" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-2" to="root" fromPosition="top" toPosition="bottom" /%}

{% edge from="i-node-3" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-4" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-6" to="i-node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-5" to="i-node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-3" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-5" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="i-node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="i-node-6" fromPosition="top" toPosition="bottom" /%}

{% /diagram %}

当我们谈论在区块链上存储数据状态时，如果我们存储这个默克尔根，我们可以有效地存储一个代表之前哈希以创建根的所有数据完整性的单一值。如果树上的任何叶值发生变化，现有的默克尔根将变得无效，需要重新计算。

对于Bubblegum压缩NFT，叶节点哈希是[叶子模式](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/state/leaf_schema.rs#L40)的哈希。叶子模式包含叶子ID、所有者/委托人信息、代表cNFT[创作者](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/state/metaplex_adapter.rs#L103)的[`creator_hash`](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/lib.rs#L433)，以及代表压缩NFT的[元数据](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/state/metaplex_adapter.rs#L81)的[`data_hash`](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/lib.rs#L450)（它再次包含创作者数组）。因此，我们需要以密码学方式验证单个压缩NFT的所有信息都存储在哈希叶子模式中。

## 叶子路径

正如我们在上一节中学到的，在默克尔树中，只有叶节点代表最终用户数据。通向哈希的内部节点都只是服务于默克尔根的中间值。当我们提到叶节点的**路径**时，我们指的是叶节点哈希本身和直接通向默克尔根的内部节点。例如，叶子2的路径在下图中高亮显示。

{% diagram %}

{% node %}
{% node #root label="默克尔根" theme="blue" /%}
{% node label="Hash(节点 1, 节点 2)" theme="blue" /%}
{% /node %}

{% node parent="root" y=100 x=-220 %}
{% node #i-node-1 label="节点 1" theme="blue" /%}
{% node label="Hash(节点 3, 节点 4)" theme="blue" /%}
{% /node %}

{% node parent="root" y=100 x=220 %}
{% node #i-node-2 label="节点 2" /%}
{% node label="Hash(节点 5, 节点 6)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=-110 %}
{% node #i-node-3 label="节点 3" theme="blue" /%}
{% node label="Hash(叶子 1, 叶子 2)" theme="blue" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=110 %}
{% node #i-node-4 label="节点 4" /%}
{% node label="Hash(叶子 3, 叶子 4)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=-110 %}
{% node #i-node-5 label="节点 5" /%}
{% node label="Hash(叶子 5, 叶子 6)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=110 %}
{% node #i-node-6 label="节点 6" /%}
{% node label="Hash(叶子 7, 叶子 8)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="-40" %}
{% node #leaf-1 label="叶子 1" /%}
{% node label="Hash(cNFT 1)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="70" %}
{% node #leaf-2 label="叶子 2" theme="blue" /%}
{% node label="Hash(cNFT 2)" theme="blue" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="-40" %}
{% node #leaf-3 label="叶子 3" /%}
{% node label="Hash(cNFT 3)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="70" %}
{% node #leaf-4 label="叶子 4" /%}
{% node label="Hash(cNFT 4)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="-40" %}
{% node #leaf-5 label="叶子 5" /%}
{% node label="Hash(cNFT 5)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="70" %}
{% node #leaf-6 label="叶子 6" /%}
{% node label="Hash(cNFT 6)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="-40" %}
{% node #leaf-7 label="叶子 7" /%}
{% node label="Hash(cNFT 7)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="70" %}
{% node #leaf-8 label="叶子 8" /%}
{% node label="Hash(cNFT 8)" /%}
{% /node %}

{% edge from="i-node-1" to="root" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="i-node-2" to="root" fromPosition="top" toPosition="bottom" /%}

{% edge from="i-node-3" to="i-node-1" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="i-node-4" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-6" to="i-node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-5" to="i-node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="i-node-3" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="leaf-4" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-3" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-5" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="i-node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="i-node-6" fromPosition="top" toPosition="bottom" /%}

{% /diagram %}

## 叶子证明

如果我们想证明压缩NFT是否存在于默克尔树中，我们不需要重新哈希所有叶节点。正如您在下图中看到的，我们只需要有某些值来哈希在一起，直到我们计算出默克尔根。这些值被称为叶子的**证明**。具体来说，叶节点的证明是相邻叶节点的哈希，以及可用于计算默克尔根的相邻内部节点哈希。叶子2的证明在下图中高亮显示。

{% diagram %}

{% node %}
{% node #root label="默克尔根" /%}
{% node label="Hash(节点 1, 节点 2)" /%}
{% /node %}

{% node parent="root" y=100 x=-220 %}
{% node #i-node-1 label="节点 1" /%}
{% node label="Hash(节点 3, 节点 4)" /%}
{% /node %}

{% node parent="root" y=100 x=220 %}
{% node #i-node-2 label="节点 2" theme="mint" /%}
{% node label="Hash(节点 5, 节点 6)" theme="mint" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=-110 %}
{% node #i-node-3 label="节点 3" /%}
{% node label="Hash(叶子 1, 叶子 2)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=110 %}
{% node #i-node-4 label="节点 4" theme="mint" /%}
{% node label="Hash(叶子 3, 叶子 4)" theme="mint" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=-110 %}
{% node #i-node-5 label="节点 5" /%}
{% node label="Hash(叶子 5, 叶子 6)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=110 %}
{% node #i-node-6 label="节点 6" /%}
{% node label="Hash(叶子 7, 叶子 8)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="-40" %}
{% node #leaf-1 label="叶子 1" theme="mint" /%}
{% node label="Hash(cNFT 1)" theme="mint" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="70" %}
{% node #leaf-2 label="叶子 2" theme="blue" /%}
{% node label="Hash(cNFT 2)" theme="blue" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="-40" %}
{% node #leaf-3 label="叶子 3" /%}
{% node label="Hash(cNFT 3)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="70" %}
{% node #leaf-4 label="叶子 4" /%}
{% node label="Hash(cNFT 4)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="-40" %}
{% node #leaf-5 label="叶子 5" /%}
{% node label="Hash(cNFT 5)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="70" %}
{% node #leaf-6 label="叶子 6" /%}
{% node label="Hash(cNFT 6)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="-40" %}
{% node #leaf-7 label="叶子 7" /%}
{% node label="Hash(cNFT 7)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="70" %}
{% node #leaf-8 label="叶子 8" /%}
{% node label="Hash(cNFT 8)" /%}
{% /node %}

{% edge from="i-node-1" to="root" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-2" to="root" fromPosition="top" toPosition="bottom" /%}

{% edge from="i-node-3" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-4" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-6" to="i-node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-5" to="i-node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-3" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-5" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="i-node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="i-node-6" fromPosition="top" toPosition="bottom" /%}

{% /diagram %}

## 叶子验证

使用叶节点及其证明来计算默克尔根的过程如下：
1. 从我们的原始叶子模式开始，对其进行哈希。
2. 将步骤1的值与兄弟叶节点的哈希进行哈希，以创建叶子路径的下一个值。
3. 将步骤2的路径值与下一个兄弟内部节点进行哈希，这是证明的下一个值。
4. 继续这个将值与兄弟内部节点值进行哈希的过程，沿着树向上直到我们计算出默克尔根。

如果我们计算的默克尔根与为该树提供的默克尔根匹配，那么我们就知道我们确切的叶节点存在于默克尔树中。此外，每当叶节点更新时（即当cNFT转移给新所有者时），必须计算并在链上更新新的默克尔根。

## 并发性

用于cNFT的链上默克尔树必须能够处理同一区块中发生的多次写入。这是因为可以有多个交易向树中铸造新的cNFT、转移cNFT、委托cNFT、销毁cNFT等。问题是第一次对链上树的写入会使同一区块内其他写入发送的证明失效。

解决方案是[spl-account-compression](https://spl.solana.com/account-compression)使用的默克尔树不仅存储一个默克尔根，还存储先前根的[`ChangeLog`](https://github.com/solana-labs/solana-program-library/blob/master/libraries/concurrent-merkle-tree/src/changelog.rs#L9)和先前修改叶子的路径。即使新交易发送的根和证明已被先前的更新使无效，程序也会快进证明。请注意，可用的`ChangeLog`数量由创建树时使用的[最大缓冲区大小](/zh/bubblegum-v2/create-trees#creating-a-bubblegum-tree)设置。

还要注意，默克尔树的最右侧证明存储在链上。这允许在不需要发送证明的情况下向树追加内容。这正是Bubblegum能够在不需要证明的情况下铸造新cNFT的方式。
