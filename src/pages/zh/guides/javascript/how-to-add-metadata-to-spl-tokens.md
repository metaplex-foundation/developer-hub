---
title: 如何向 Solana 代币添加元数据
metaTitle: 如何向 Solana 代币添加元数据 | 指南
description: 了解如何向已存在的 Solana 代币添加元数据。
created: '10-01-2024'
updated: '10-01-2024'
---

本指南将带您使用 Metaplex Token Metadata 协议向已初始化的 Solana 代币（SPL 代币）添加元数据。

{% callout %}
建议使用可用的 [create helper](https://developers.metaplex.com/token-metadata/mint#create-helpers) 函数来创建和初始化您的代币，而不是单独执行此操作。如果您想了解如何执行此操作，请改为查看本指南 [`如何创建 Solana 代币`](https://developers.metaplex.com/guides/javascript/how-to-create-a-solana-token)。

{% /callout %}

## 先决条件

- 您选择的代码编辑器（推荐 Visual Studio Code）
- Node 18.x.x 或更高版本。

## 初始设置

本指南假设您已经有一个已初始化的 SPL 代币，您想为其添加元数据。您可能需要修改和移动函数以适应您的需求。

## 初始化

首先使用您选择的 JS/TS 包管理器（npm、yarn、pnpm、bun、deno）初始化一个新的空项目。

```bash
npm init -y
```

### 所需包

安装本指南所需的包。

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata"] type="npm" /%}

```bash
npm i @metaplex-foundation/umi
```

```bash
npm i @metaplex-foundation/umi-bundle-defaults
```

```bash
npm i @metaplex-foundation/mpl-token-metadata
```

### 导入和包装函数

我们将列出必要的导入和我们的包装函数，

1. `addMetadata`

```typescript
import {
	createV1,
	findMetadataPda,
	mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, signerIdentity, sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

///
/// instantiate umi
///


// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
	///
	///
	///  code will go in here
	///
	///
}

// run the function
addMetadata();
```

## 设置 Umi

此示例将演示如何使用 `generatedSigner()` 设置 Umi。如果您希望以不同的方式设置钱包或签名者，可以查看 [**连接到 Umi**](/zh/umi/connecting-to-umi) 指南。

您可以将 Umi 实例化代码放在代码块内部或外部，但为了减少代码重复，我们将把它保留在外部。

### 生成新钱包

```ts
const umi = createUmi("https://api.devnet.solana.com")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// Generate a new keypair signer.
const signer = generateSigner(umi);

// Tell umi to use the new signer.
umi.use(signerIdentity(signer));

// Airdrop 2 SOL to the identity
// if you end up with a 429 too many requests error, you may have to use
// a different rpc other than the free default one supplied.
await umi.rpc.airdrop(umi.identity.publicKey, sol(2));
```

### 使用本地存储的现有钱包

```ts
const umi = createUmi("https://api.devnet.solana.com")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// You will need to use fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json')

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
```

## 添加元数据

添加元数据也和创建 SPL 代币一样简单。我们将利用 `mpl-token-metadata` 库中的 `createV1` 辅助方法。

还要注意，本指南假设您已经事先准备好了链外代币元数据。我们需要名称、链外 uri 地址和符号

```json
name: "Solana Gold",
symbol: "GOLDSOL",
uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
```

```typescript
// Sample Metadata for our Token
const tokenMetadata = {
	name: "Solana Gold",
	symbol: "GOLDSOL",
	uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
    const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");

    // derive the metadata account that will store our metadata data onchain
	const metadataAccountAddress = await findMetadataPda(umi, {
		mint: mint,
	});

   // add metadata to our already initialized token using `createV1` helper
	const tx = await createV1(umi, {
		mint,
		authority: umi.identity,
		payer: umi.identity,
		updateAuthority: umi.identity,
		name: tokenMetadata.name,
		symbol: tokenMetadata.symbol,
		uri: tokenMetadata.uri,
		sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
		tokenStandard: TokenStandard.Fungible,
	}).sendAndConfirm(umi);

	let txSig = base58.deserialize(tx.signature);
	console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}
```

像创建者这样的可空字段已被省略，因为与非同质化代币相比，它们对于 SPL 代币可能不那么必要。

请注意铸造地址，如果您将在不同的实例调用函数，请确保将 `findMetadataPda` 函数中 `mint` 字段的地址设置为 `generateSigner`，因为每次调用都会返回一个新的密钥对。

## 完整代码示例

```typescript
import {
	createV1,
	findMetadataPda,
	mplTokenMetadata,
	TokenStandard
} from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import {
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi("https://api.devnet.solana.com")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// Generate a new keypair signer.
const signer = generateSigner(umi);

// Tell umi to use the new signer.
umi.use(signerIdentity(signer));

// your SPL Token mint address
const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");


// Sample Metadata for our Token
const tokenMetadata = {
	name: "Solana Gold",
	symbol: "GOLDSOL",
	uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
	// Airdrop 2 SOL to the identity
    // if you end up with a 429 too many requests error, you may have to use
    // a different rpc other than the free default one supplied.
    await umi.rpc.airdrop(umi.identity.publicKey, sol(2));

    // derive the metadata account that will store our metadata data onchain
	const metadataAccountAddress = await findMetadataPda(umi, {
		mint: mint,
	});

	const tx = await createV1(umi, {
		mint,
		authority: umi.identity,
		payer: umi.identity,
		updateAuthority: umi.identity,
		name: tokenMetadata.name,
		symbol: tokenMetadata.symbol,
		uri: tokenMetadata.uri,
		sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
		tokenStandard: TokenStandard.Fungible,
	}).sendAndConfirm(umi);

	let txSig = base58.deserialize(tx.signature);
	console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}

// run the function
addMetadata();
```

## 下一步是什么？

本指南帮助您向 Solana 代币添加元数据，从这里您可以前往 [Token Metadata 程序](/zh/token-metadata) 并查看在一步中初始化并向您的代币添加元数据的辅助函数，使用非同质化代币以及与 Token Metadata 程序交互的各种其他方式。
