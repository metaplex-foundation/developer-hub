---
title: 铸造资产
metaTitle: 铸造资产 | Token Metadata
description: 了解如何在 Token Metadata 上铸造 NFT、SFT 和可编程 NFT（又名资产）
---

正如我们在 [Token Metadata 概述](/zh/smart-contracts/token-metadata)中讨论的那样,Solana 上的数字资产由几个链上账户和描述代币的链下数据组成。在本页面上,我们将介绍铸造这些资产的过程。{% .lead %}

## 铸造过程

无论我们想要铸造可替代、半可替代还是不可替代资产,整体过程都是相同的：

1. **上传链下数据。** 首先,我们必须确保我们的链下数据已准备就绪。这意味着我们必须在某处存储一个描述我们资产的 JSON 文件。该 JSON 文件的存储方式和位置无关紧要,只要它可以通过 **URI** 访问即可。
2. **创建链上账户。** 然后,我们必须创建将保存我们资产数据的链上账户。具体创建哪些账户取决于我们资产的**代币标准**,但在所有情况下,都会创建一个**元数据**账户,并将存储我们链下数据的 **URI**。
3. **铸造代币。** 最后,我们必须铸造与所有这些账户关联的代币。对于不可替代资产,这只是意味着从 0 铸造到 1,因为不可替代性禁止我们拥有大于 1 的供应量。对于可替代或半可替代资产,我们可以铸造任意数量的代币。

让我们更详细地深入了解这些步骤,同时提供具体的代码示例。

## 上传链下数据

您可以使用任何服务上传链下数据,或者只需将其存储在自己的服务器上,但值得注意的是,我们的一些 SDK 可以提供帮助。它们使用插件系统,允许您选择您选择的上传器,并为您提供统一的界面来上传数据。

{% dialect-switcher title="上传资产和 JSON 数据" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accordion title="选择上传器" %}

要使用 Umi 选择您选择的上传器,只需安装上传器提供的插件即可。

例如,以下是我们如何安装用于与 Arweave 网络交互的 irysUploader 插件：

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

 umi.use(irysUploader())
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

现在我们有了 **URI**,我们可以继续下一步。

{% callout %}
接下来的步骤显示如何分两步创建账户和铸造代币。在[页面底部](#create-helpers)有**代码示例**,这些辅助函数结合了这些步骤,使创建不同代币类型更容易。
{% /callout %}

## 创建铸造和元数据账户

要创建您选择的代币标准所需的所有链上账户,您可以简单地使用 **Create V1** 指令。它将适应请求的代币标准并相应地创建正确的账户。

例如,`NonFungible` 资产将创建一个 `Metadata` 账户和一个 `MasterEdition` 账户,而 `Fungible` 资产只会创建一个 `Metadata` 账户。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node label="Freeze Authority = Edition" /%}
{% /node %}
{% node parent="mint-1" y="-20" x="-10" label="NonFungible (incl. editions and pNFTs)" theme="transparent" /%}

{% node parent="mint-1" x="220" #metadata-1-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-1-pda" x="140" %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = NonFungible" /%}
{% /node %}

{% node parent="mint-1" x="220" y="100" #master-edition-pda label="PDA" theme="crimson" /%}
{% node parent="master-edition-pda" x="140" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}
{% node parent="master-edition" y="80" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node parent="mint-1" y="260" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals = 0" /%}
{% /node %}
{% node parent="mint-2" y="-20" x="-10" label="FungibleAsset" theme="transparent" /%}

{% node parent="mint-2" x="220" #metadata-2-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-2-pda" x="140" %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = FungibleAsset" /%}
{% /node %}

{% node parent="mint-2" y="120" %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals > 0" /%}
{% /node %}
{% node parent="mint-3" y="-20" x="-10" label="Fungible" theme="transparent" /%}

{% node parent="mint-3" x="220" #metadata-3-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-3-pda" x="140" %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = Fungible" /%}
{% /node %}

{% edge from="mint-1" to="metadata-1-pda" path="straight" /%}
{% edge from="metadata-1-pda" to="metadata-1" path="straight" /%}
{% edge from="mint-1" to="master-edition-pda" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" label="OR" /%}

{% edge from="mint-2" to="metadata-2-pda" path="straight" /%}
{% edge from="metadata-2-pda" to="metadata-2" path="straight" /%}
{% edge from="mint-3" to="metadata-3-pda" path="straight" /%}
{% edge from="metadata-3-pda" to="metadata-3" path="straight" /%}
{% /diagram %}

此外,如果提供的**铸造**账户不存在,它将为我们创建。这样,我们甚至不需要调用底层的 Token 程序来在向其添加元数据之前准备我们的代币。

此指令接受各种参数,我们的 SDK 尽最大努力为它们提供默认值,因此您不需要每次都填写所有参数。话虽如此,以下是您可能感兴趣的参数列表：

- **Mint**：资产的铸造账户。如果它不存在,它必须作为签名者提供,因为它将被初始化。通常,我们为此目的生成一个新的密钥对。
- **Authority**：铸造账户的权限。这是允许或将被允许从铸造账户铸造代币的账户。如果 SDK 支持,这将默认为"身份"钱包——即已连接的钱包。
- **Name**、**URI**、**Seller Fee Basis Points**、**Creators** 等：要存储在**元数据**账户上的资产数据。
- **Token Standard**：资产的代币标准。

{% callout %}
`createV1` 是一个辅助函数,可以初始化铸造账户并创建元数据账户。如果铸造已经存在,它将只创建元数据账户。如果您正在寻找如何使用 [`createMetadataAccountV3`](https://mpl-token-metadata-js-docs.vercel.app/functions/createMetadataAccountV3.html),您应该改用此函数。
{% /callout %}

{% dialect-switcher title="创建链上账户" %}
{% dialect title="JavaScript - Umi" id="js-umi" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createV1(umi, {
  mint,
  authority,
  name: 'My NFT',
  uri,
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust Script" id="rust-script" %}
{% totem %}

```rust
use mpl_token_metadata::{
    instructions::CreateV1Builder,
    types::{PrintSupply, TokenStandard},
};
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. client is a reference to the initialized RpcClient
// 2. every account is specified by their pubkey

let client = ...;

let create_ix = CreateV1Builder::new()
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint.pubkey(), true)
    .authority(payer.pubkey())
    .payer(payer.pubkey())
    .update_authority(payer.pubkey(), false)
    .name(String::from("My NFT"))
    .uri(uri)
    .seller_fee_basis_points(550)
    .token_standard(TokenStandard::NonFungible)
    .print_supply(PrintSupply::Zero)
    .instruction();

let message = Message::new(
    &[create_ix],
    Some(&payer.pubkey()),
);

let blockhash = client.get_latest_blockhash()?;
let mut tx = Transaction::new(&[mint, payer], message, blockhash);
client.send_and_confirm_transaction(&tx)?;
```

{% totem-prose %}

请注意,在设置 `mint` 账户时,需要指定一个 `bool` 标志来指示账户是否为签名者——如果 `mint` 账户不存在,则需要是签名者。

{% /totem-prose %}

{% /totem %}

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-cpi" %}

```rust
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::CreateV1CpiBuilder,
    types::{PrintSupply, TokenStandard},
};

// 1. every account is specified by a reference to their AccountInfo

let create_cpi = CreateV1CpiBuilder::new(token_metadata_program_info)
    .metadata(metadata_info)
    .mint(mint_info, true)
    .authority(payer_info)
    .payer(payer_info)
    .update_authority(update_authority_info, false)
    .master_edition(Some(master_edition_info))
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .token_standard(TokenStandard::NonFungible)
    .name(String::from("My NFT"))
    .uri(uri)
    .seller_fee_basis_points(550)
    .token_standard(TokenStandard::NonFungible)
    .print_supply(PrintSupply::Zero);

create_cpi.invoke();
```

{% /dialect %}
{% /dialect-switcher %}

## 铸造代币

一旦为我们的资产创建了所有链上账户,我们就可以为其铸造代币。如果资产是不可替代的,我们将简单地铸造其唯一的代币,否则我们可以铸造任意数量的代币。请注意,不可替代资产只有在铸造了其唯一代币后才有效,因此这是该代币标准的强制步骤。

我们可以使用 Token Metadata 程序的 **Mint V1** 指令来实现这一点。它需要以下参数：

- **Mint**：资产的铸造账户地址。
- **Authority**：可以授权此指令的权限。对于不可替代资产,这是**元数据**账户的更新权限,否则,这指的是铸造账户的**铸造权限**。
- **Token Owner**：接收代币的钱包地址。
- **Amount**：要铸造的代币数量。对于不可替代资产,这只能是 1。
- **Token Standard**：资产的代币标准（**我们的 JavaScript SDK 需要**）。程序不需要此参数,但我们的 SDK 需要它,以便它们可以为大多数其他参数提供适当的默认值。

{% dialect-switcher title="铸造代币" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

await mintV1(umi, {
  mint: mint.publicKey,
  authority,
  amount: 1,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
{% totem %}

```rust
use mpl_token_metadata::instructions::MintV1Builder;
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. client is a reference to the initialized RpcClient
// 2. every account is specified by their pubkey

let client = ...;

let mint_ix = MintV1Builder::new()
    .token(token)
    .token_owner(Some(token_owner))
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint)
    .authority(update_authority)
    .payer(payer)
    .amount(1)
    .instruction();

let message = Message::new(
    &[mint_ix],
    Some(&payer.pubkey()),
);

let blockhash = client.get_latest_blockhash()?;
let mut tx = Transaction::new(&[update_authority, payer], message, blockhash);
client.send_and_confirm_transaction(&tx)?;
```

{% totem-prose %}

我们正在设置 `master_edition`,因为铸造 `NonFungible` 需要它；如果 `token` 账户不存在并且将初始化一个,则需要 `token_owner`。

{% /totem-prose %}

{% /totem %}
{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
use mpl_token_metadata::instructions::MintV1CpiBuilder;

// 1. every account is specified by a reference to their AccountInfo

let mint_cpi = MintV1CpiBuilder::new(token_metadata_program_info)
    .token(token_info)
    .token_owner(Some(token_owner_info))
    .metadata(metadata_info)
    .master_edition(Some(master_edition_info))
    .mint(mint_info)
    .payer(payer_info)
    .authority(update_authority_info)
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .spl_ata_program(spl_ata_program_info)
    .amount(1);

mint_cpi.invoke();
```

{% /dialect %}
{% /dialect-switcher %}

## 创建辅助函数

由于创建数字资产是 Token Metadata 的重要组成部分,我们的 SDK 提供了辅助方法来使该过程更容易。也就是说,这些辅助方法以不同的方式组合 **Create V1** 和 **Mint V1** 指令,具体取决于我们想要创建的代币标准。

{% dialect-switcher title="创建辅助函数" %}
{% dialect title="JavaScript" id="js" %}

{% totem-accordion title="创建 NonFungible" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  // optional if you directly want to add to a collection. Need to verify later.
  // collection: some({ key: collectionMint.publicKey, verified: false }),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="创建 Fungible" %}

```ts
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungible } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungible(umi, {
  mint,
  name: 'My Fungible',
  uri: 'https://example.com/my-fungible.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(7), // for 0 decimals use some(0)
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="创建 FungibleAsset" %}

```ts
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungibleAsset } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungibleAsset(umi, {
  mint,
  name: 'My Fungible Asset',
  uri: 'https://example.com/my-fungible-asset.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(7) // for 0 decimals use some(0)
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="创建 ProgrammableNonFungible" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createProgrammableNft(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  // optional if you directly want to add to a collection. Need to verify later.
  // collection: some({ key: collectionMint.publicKey, verified: false }),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% /dialect %}

{% dialect title="Rust" id="rust" %}
<!-- Rust helper examples are not provided in this version of the documentation -->
{% /dialect %}
{% /dialect-switcher %}
