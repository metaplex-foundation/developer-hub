---
title: Candy Machine设置
metaTitle: 设置 | Candy Machine
description: 详细解释Candy Machine设置。
---

在本页面中,我们将深入了解Candy Machine上可用的所有设置。我们将重点关注影响Candy Machine本身及其生成的NFT的设置,而不是影响铸造过程的设置(称为Guard)。我们将在专门的页面中处理后者。{% .lead %}

## 权限

在Solana上创建账户时,最重要的信息之一是允许管理它们的钱包,称为**权限**。因此,在创建新的Candy Machine时,您需要提供权限的地址,该权限稍后能够更新它、向其插入项目、删除它等。

铸造过程还有一个额外的权限,专门称为**铸造权限**。当创建没有Candy Guard的Candy Machine时,此权限是唯一被允许从Candy Machine铸造的钱包。没有其他人可以铸造。然而,在实践中,此铸造权限设置为Candy Guard的地址,Candy Guard根据一些预配置的规则集(称为**guard**)控制铸造过程。

重要的是要注意,在使用我们的SDK时,Candy Machine将始终默认创建一个关联的Candy Guard,因此您无需担心此铸造权限。

{% dialect-switcher title="设置权限" %}
{% dialect title="JavaScript" id="js" %}

创建新的Candy Machine时,权限将默认为Umi身份。您可以通过向`authority`属性提供有效的签名者来明确设置此权限。

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /dialect %}
{% /dialect-switcher %}

## 所有NFT共享的设置

Candy Machine设置的很大一部分用于定义将从它们铸造的NFT。这是因为许多NFT属性对所有铸造的NFT都是相同的。因此,我们在Candy Machine设置中设置一次,而不是每次向Candy Machine加载项目时都要重复这些属性。

请注意,可以区分一个铸造的NFT与另一个NFT的唯一属性是NFT的**名称**和指向其JSON元数据的**URI**。有关更多信息,请参阅[插入项目](/zh/smart-contracts/candy-machine/insert-items)。

以下是所有铸造的NFT之间共享的属性列表。

- **Seller Fee Basis Points**:应在铸造的NFT上设置的二次销售版税(以基点为单位)。例如,`250`表示`2.50%`的版税。
- **Symbol**:在铸造的NFT上使用的符号——例如"MYPROJECT"。这可以是最多10个字符的任何文本,并且可以通过提供空文本来设为可选。
- **Max Edition Supply**:可以从铸造的NFT打印的最大版本数。对于大多数用例,您需要将此设置为`0`以防止铸造的NFT被多次打印。请注意,您不能将此设置为`null`,这意味着Candy Machine不支持无限版本。
- **Is Mutable**:铸造的NFT是否应该是可变的。我们建议将此设置为`true`,除非您有特定原因。您始终可以在将来使NFT不可变,但您永远无法使不可变的NFT再次可变。
- **Creators**:应在铸造的NFT上设置的创作者列表。它包括他们的地址和他们在版税中的份额百分比——即`5`是`5%`。请注意,Candy Machine地址将始终设置为所有铸造的NFT的第一个创作者,并将自动验证。这使任何人都可以验证NFT是从可信的Candy Machine铸造的。所有其他提供的创作者将在此之后设置,并需要由这些创作者手动验证。
- **Token Standard**:在铸造的NFT上使用的[代币标准](/zh/smart-contracts/token-metadata/token-standard)。到目前为止,仅支持两种代币标准:"[NonFungible](/zh/smart-contracts/token-metadata/token-standard#the-non-fungible-standard))"和"[ProgrammableNonFungible](/zh/smart-contracts/token-metadata/token-standard#the-programmable-non-fungible-standard)"。请注意,这仅适用于_账户版本_为2及以上的Candy Machine。
- **Rule Set**:如果Candy Machine使用"ProgrammableNonFungible"代币标准,它可以提供一个明确的规则集,该规则集将分配给每个铸造的可编程NFT。如果未提供规则集,它将默认使用集合NFT上的规则集(如果有)。否则,可编程NFT将在没有规则集的情况下铸造。请注意,这仅适用于_账户版本_为2及以上的Candy Machine。

{% dialect-switcher title="设置共享NFT设置" %}
{% dialect title="JavaScript" id="js" %}

从上面列出的属性中,只有`sellerFeeBasisPoints`、`creators`和`tokenStandard`属性是必需的。其他属性具有以下默认值:

- `symbol`默认为空字符串——即铸造的NFT不使用符号。
- `maxEditionSupply`默认为零——即铸造的NFT不可打印。
- `isMutable`默认为`true`。

您可以像这样明确提供这些属性中的任何一个。

```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```

{% /dialect %}
{% /dialect-switcher %}

## Metaplex认证集合

每个Candy Machine必须与一个称为[Metaplex认证集合(MCC)](/zh/smart-contracts/token-metadata/collections)的特殊NFT相关联。此**集合NFT**使铸造的NFT能够分组在一起,并且可以在链上验证该信息。

为了确保没有其他人可以在他们的Candy Machine上使用您的集合NFT,需要**集合的更新权限**签署任何更改Candy Machine上集合的交易。因此,Candy Machine可以安全地自动验证所有铸造的NFT的集合。

{% dialect-switcher title="设置集合NFT" %}
{% dialect title="JavaScript" id="js" %}

创建新的Candy Machine或更新其集合NFT时,您需要提供以下属性:

- `collectionMint`:集合NFT的铸造账户地址。
- `collectionUpdateAuthority`:集合NFT的更新权限作为签名者。

以下是一个示例。

```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// 创建集合NFT。
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
    collectionDetails: {
    __kind: 'V1',
    size: 0,
  },
}).sendAndConfirm(umi)

// 在设置中传递集合地址及其权限。
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```

{% /dialect %}
{% /dialect-switcher %}

## 项目设置

Candy Machine设置还包含有关已加载或将要加载到其中的项目的信息。**Items Available**属性属于该类别,存储将从Candy Machine铸造的NFT的最大数量。

{% dialect-switcher title="设置项目数量" %}
{% dialect title="JavaScript" id="js" %}

创建新的Candy Machine时,`itemsAvailable`属性是必需的,可以是数字或用于大整数的原生`bigint`。

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /dialect %}
{% /dialect-switcher %}

除了**Items Available**属性之外,还有两个其他属性定义了如何在Candy Machine中加载项目。您必须选择这两个属性之一,并将另一个留空。这些属性是:

- **Config Line Settings**。
- **Hidden Settings**。

请注意,一旦使用这两种模式之一创建Candy Machine,就无法更新为使用另一种模式。此外,当使用**Config Line Settings**时,不再可能更新**Items Available**属性。

让我们更详细地了解这两者。

{% callout type="note" title="随机性" %}

建议使用[Hidden Settings](#hidden-settings)进行揭示机制,因为资产的"随机"铸造过程并不完全不可预测,可能会受到充足资源和恶意意图的影响。

{% /callout %}

### Config Line Settings

**Config Line Settings**属性允许我们描述已插入或将要插入到Candy Machine中的项目。它使我们能够通过为项目的**名称**和**URI**提供精确长度以及提供一些共享前缀来减少该长度,从而将Candy Machine的大小保持在最小。**Config Line Settings**属性是包含以下属性的对象:

- **Name Prefix**:所有插入项目共享的名称前缀。此前缀最多可以有32个字符。
- **Name Length**:每个插入项目的名称的最大长度,不包括名称前缀。
- **URI Prefix**:所有插入项目共享的URI前缀。此前缀最多可以有200个字符。
- **URI Length**:每个插入项目的URI的最大长度,不包括URI前缀。
- **Is Sequential**:指示是否按顺序铸造NFT——`true`——还是按随机顺序——`false`。我们建议将此设置为`false`以防止买家预测下一个将铸造的NFT。请注意,我们的SDK在创建新Candy Machine时将默认使用Is Sequential设置为`false`的Config Line Settings。

为了更好地理解这些**名称**和**URI**属性,让我们通过一个示例。假设您想创建一个具有以下特征的Candy Machine:

- 它包含`1000`个项目。
- 每个项目的名称是"My NFT Project #X",其中X是从1开始的项目索引。
- 每个项目的JSON元数据已上传到Arweave,因此它们的URI以"https://arweave.net/"开头,以最大长度为43个字符的唯一标识符结束。

在此示例中,如果没有前缀,我们将得到:

- Name Length = 20。"My NFT Project #"有16个字符,最高数字"1000"有4个字符。
- URI Length = 63。"https://arweave.net/"有20个字符,唯一标识符有43个字符。

插入1000个项目时,总共需要83'000个字符来存储项目。但是,如果我们使用前缀,我们可以显著减少创建Candy Machine所需的空间,从而降低在区块链上创建它的成本。

- Name Prefix = "My NFT Project #"
- Name Length = 4
- URI Prefix = "https://arweave.net/"
- URI Length = 43

有了1000个项目,我们现在只需要47'000个字符来存储我们的项目。

但这还不是全部!您可以在名称或URI前缀中使用**两个特殊变量**来进一步减少大小。这些变量是:

- `$ID$`:这将被替换为从0开始的项目索引。
- `$ID+1$`:这将被替换为从1开始的项目索引。

在我们上面的示例中,我们可以利用`$ID+1$`变量作为名称前缀,这样我们就不需要在每个项目上插入它。我们最终得到以下Config Line Settings:

- Name Prefix = "My NFT Project #$ID+1$"
- Name Length = 0
- URI Prefix = "https://arweave.net/"
- URI Length = 43

没错,**我们的名称长度现在为零**,我们已将所需字符减少到43'000个字符。

{% dialect-switcher title="设置config line settings" %}
{% dialect title="JavaScript" id="js" %}

使用Umi时,您可以使用`some`和`none`辅助函数通过`configLineSettings`和`hiddenSettings`属性分别告诉库是否使用Config Line Settings或Hidden Settings。只能使用这些设置之一,因此,必须配置其中一个,另一个必须设置为`none()`。

以下是一个代码片段,展示了如何使用Umi库设置上述示例。

```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+1$',
    nameLength: 0,
    prefixUri: 'https://arweave.net/',
    uriLength: 43,
    isSequential: false,
  }),
}
```

{% /dialect %}
{% /dialect-switcher %}

### Hidden Settings

准备项目的另一种方法是使用**Hidden Settings**。这是与Config Line Settings完全不同的方法,因为使用Hidden Settings,您不需要向Candy Machine插入任何项目,因为每个铸造的NFT都将共享相同的名称和相同的URI。您可能想知道:为什么有人会想这样做?原因是创建**隐藏和揭示NFT发布**,在铸造后揭示所有NFT。那么这是如何工作的?

- 首先,创作者使用Hidden Settings配置每个铸造的NFT的名称和URI。URI通常指向一个"预告"JSON元数据,清楚地表明即将进行揭示。
- 然后,买家使用相同的URI铸造所有这些NFT,因此使用相同的"预告"JSON元数据。
- 最后,当所有NFT都已铸造时,创作者将每个铸造的NFT的URI更新为指向特定于该NFT的真实URI。

最后一步的问题是,它允许创作者操纵哪个买家获得哪个NFT。为了避免这种情况并允许买家验证NFT和JSON元数据之间的映射没有被篡改,Hidden Settings包含一个**Hash**属性,该属性应填充映射NFT索引与其真实JSON元数据的文件的32个字符哈希。这样,在揭示之后,创作者可以公开该文件,买家可以验证其哈希是否对应于Hidden Settings中提供的哈希。

因此,我们在Hidden Settings属性上得到以下属性:

- **Name**:所有铸造的NFT的"隐藏"名称。这最多可以有32个字符。
- **URI**:所有铸造的NFT的"隐藏"URI。这最多可以有200个字符。
- **Hash**:映射NFT索引与其真实JSON元数据的文件的32个字符哈希,允许买家验证它没有被篡改。

请注意,就像Config Line Settings的前缀一样,特殊变量可以用于Hidden Settings的**名称**和**URI**。提醒一下,这些变量是:

- `$ID$`:这将被替换为从0开始的铸造的NFT的索引。
- `$ID+1$`:这将被替换为从1开始的铸造的NFT的索引。

还要注意,由于我们没有向Candy Machine插入任何项目,Hidden Settings使创建非常大的发布成为可能。唯一的注意事项是,在铸造后需要一个链下流程来更新每个NFT的名称和URI。

{% dialect-switcher title="设置hidden settings" %}
{% dialect title="JavaScript" id="js" %}

要计算哈希,您可以使用以下函数:

```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```

使用Umi时,您可以使用`some`和`none`辅助函数通过`configLineSettings`和`hiddenSettings`属性分别告诉库是否使用Config Line Settings或Hidden Settings。只能使用这些设置之一,因此,必须配置其中一个,另一个必须设置为`none()`。

以下是一个代码片段,展示了如何使用Umi库设置上述示例。

```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  configLineSettings: none(),
  hiddenSettings: some({
    name: 'My NFT Project #$ID+1$',
    uri: 'https://example.com/path/to/teaser.json',
    hash: hashOfTheFileThatMapsUris,
  }),
}
```

{% /dialect %}
{% /dialect-switcher %}

## Guard和组

如引言中所述,本页面重点介绍主要的Candy Machine设置,但您可以通过使用guard在Candy Machine上配置更多内容。

由于这是一个庞大的主题,有很多可用的默认guard需要解释,我们已经为它专门准备了整个文档部分。最佳起点是[Candy Guard](/zh/smart-contracts/candy-machine/guards)页面。

## 结论

现在我们了解了主要的Candy Machine设置,在[下一页](/zh/smart-contracts/candy-machine/manage)上,我们将看到如何使用它们来创建和更新我们自己的Candy Machine。
