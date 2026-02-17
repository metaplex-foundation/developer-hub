---
title: 常见问题
metaTitle: 常见问题 | Bubblegum V2
description: 关于Bubblegum的常见问题。
---

## 什么是Bubblegum V2？

Bubblegum V2是Bubblegum程序的新迭代，引入了多项改进和新功能。
它是已知Bubblegum程序的一部分，但指令和数据结构有所不同。
在Bubblegum V2中，cNFT使用MPL-Core集合而不是Metaplex Token Metadata集合进行分组。它还引入了冻结、解冻和灵魂绑定NFT等新功能，以及其他功能，如：
- **冻结和解冻功能**：项目创建者现在可以冻结和解冻cNFT，为各种用例提供对资产的更大控制，例如在特定事件期间阻止转账或实现锁定机制。
- **MPL-Core集合集成**：Bubblegum V2 NFT现在可以添加到MPL-Core集合，而不仅限于代币元数据集合，允许更大的灵活性和与更广泛的Metaplex生态系统的集成。
- **版税强制执行**：由于Bubblegum V2使用[MPL-Core](https://docs.metaplex.com/core/overview)集合，可以使用`ProgramDenyList`等方式对cNFT强制执行版税。
- **灵魂绑定NFT**：cNFT现在可以设为灵魂绑定（不可转让），将其永久绑定到所有者的钱包。这非常适合凭证、出席证明、身份验证等。它需要在集合上启用`PermanentFreezeDelegate`插件。
- **允许永久转账**：如果在集合上启用了`PermanentTransferDelegate`插件，永久转账委托人现在可以在没有叶子所有者交互的情况下将cNFT转移给新所有者。

## 如何找到转移、委托、销毁等操作所需的参数？{% #replace-leaf-instruction-arguments %}

每当我们使用最终替换Bubblegum树中叶子的指令时——例如转移、委托、销毁等——程序需要一系列参数来确保当前叶子有效并可以更新。这是因为压缩NFT的数据在链上账户中不可用，因此需要额外的参数，如**证明**、**叶子索引**、**Nonce**等，以便程序填充这些内容。

所有这些信息都可以使用`getAsset`和`getAssetProof` RPC方法从**Metaplex DAS API**检索。然而，这些方法的RPC响应与指令期望的参数并不完全相同，从一个解析到另一个并不简单。

幸运的是，我们的SDK提供了一个辅助方法，可以为我们完成所有繁重的工作，如下面的代码示例所示。它接受压缩NFT的资产ID并返回一系列参数，可以直接注入到替换叶子的指令中——例如销毁、转移、更新等。

也就是说，如果您需要自己进行解析，以下是指令期望的参数及其如何从Metaplex DAS API检索的快速分解。这里我们假设`getAsset`和`getAssetProof` RPC方法的结果分别可通过`rpcAsset`和`rpcAssetProof`变量访问。

- **叶子所有者**：可通过`rpcAsset.ownership.owner`访问。
- **叶子委托人**：可通过`rpcAsset.ownership.delegate`访问，当为null时应默认为`rpcAsset.ownership.owner`。
- **默克尔树**：可通过`rpcAsset.compression.tree`或`rpcAssetProof.tree_id`访问。
- **根**：可通过`rpcAssetProof.root`访问。
- **数据哈希**：可通过`rpcAsset.compression.data_hash`访问。
- **创作者哈希**：可通过`rpcAsset.compression.creator_hash`访问。
- **Nonce**：可通过`rpcAsset.compression.leaf_id`访问。
- **索引**：可通过`rpcAssetProof.node_index - 2^max_depth`访问，其中`max_depth`是树的最大深度，可从`rpcAssetProof.proof`数组的长度推断。
- **证明**：可通过`rpcAssetProof.proof`访问。
- **元数据**：目前需要从`rpcAsset`响应中的各个字段重建。

{% dialect-switcher title="获取替换叶子指令的参数" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Bubblegum Umi库提供了符合上述描述的`getAssetWithProof`辅助方法。以下是如何使用`transfer`指令的示例。请注意，在这种情况下，我们覆盖了`leafOwner`参数，因为它需要是签名者，而`assetWithProof`给我们的是公钥形式的所有者。

根据树冠大小，使用`getAssetWithProof`辅助函数的`truncateCanopy: true`参数可能是有意义的。它获取树配置并截断不需要的证明。这将有助于解决交易大小过大的问题。

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId,
// {  truncateCanopy: true } // 可选，用于修剪证明
);
await transferV2(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // 作为签名者。
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi);

await transferV2(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // 作为签名者。
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="不使用辅助函数获取参数" %}

为完整起见，以下是如何在不使用提供的辅助函数的情况下实现相同结果。

```ts
import { publicKeyBytes } from '@metaplex-foundation/umi'
import { transfer } from '@metaplex-foundation/mpl-bubblegum'

const rpcAsset = await umi.rpc.getAsset(assetId)
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)

await transfer(umi, {
  leafOwner: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
  merkleTree: rpcAssetProof.tree_id,
  root: publicKeyBytes(rpcAssetProof.root),
  dataHash: publicKeyBytes(rpcAsset.compression.data_hash),
  creatorHash: publicKeyBytes(rpcAsset.compression.creator_hash),
  nonce: rpcAsset.compression.leaf_id,
  index: rpcAssetProof.node_index - 2 ** rpcAssetProof.proof.length,
  proof: rpcAssetProof.proof,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 如何解决"交易过大"错误 {% #transaction-size %}

在执行转移或销毁等叶子替换操作时，您可能会遇到"交易过大"错误。要解决此问题，请考虑以下解决方案：

1. 使用`truncateCanopy`选项：
   在`getAssetWithProof`函数中传递`{ truncateCanopy: true }`：

   ```ts
   const assetWithProof = await getAssetWithProof(umi, assetId,
    { truncateCanopy: true }
   );
   ```

   此选项检索默克尔树配置并根据树冠删除不必要的证明来优化`assetWithProof`。虽然它增加了额外的RPC调用，但显著减少了交易大小。

2. 使用版本化交易和地址查找表：
   另一种方法是实现[版本化交易和地址查找表](https://metaplex.com/docs/umi/toolbox/address-lookup-table)。此方法可以帮助更有效地管理交易大小。

通过应用这些技术，您可以克服交易大小限制并成功执行您的操作。
