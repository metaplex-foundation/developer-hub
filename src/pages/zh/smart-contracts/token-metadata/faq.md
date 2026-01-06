---
title: 常见问题
metaTitle: 常见问题 | Token Metadata
description: 关于 Token Metadata 的常见问题
---

## 如何使用 `getProgramAccounts` 过滤 `creators` 数组之后的元数据账户字段?

当使用 [RPC API 的 `getProgramAccounts` 方法](https://docs.solana.com/developing/clients/jsonrpc-api#getprogramaccounts)时,通常希望使用 `memcmp` 过滤器按字段过滤账户。

由于 `memcmp` 过滤器比较字节数组,这种方法需要了解账户的数据结构。此外,它要求该数据结构的长度是固定的,这样我们才能找到我们正在寻找的字段在每个账户中的位置。

不幸的是,**元数据账户**的 `creators` 字段是一个可以包含一到五个创作者的向量。这意味着它之后的每个字段的位置取决于账户有多少创作者。

请注意,在不添加破坏性更改的情况下向账户添加新字段需要将可选字段附加到账户。这不幸地意味着我们可能添加到元数据账户的任何新功能都将在 `creators` 字段之后,因此通过 `getProgramAccounts` 过滤将具有挑战性。

有几种方法可以解决这个问题：

- 如果我们试图过滤的每个账户都有**相同数量的创作者**,那么我们可以计算出下一个字段的偏移量。我们可以通过将 `4 + 34 * n` 添加到 `creators` 偏移量来做到这一点,其中 `n` 是固定数量的创作者,`4` 是因为使用 4 个字节来存储向量的长度。这为我们解锁了 `creators` 字段之后的每个固定长度字段。不幸的是,一旦我们到达另一个可变大小的字段,如另一个向量或可选字段,问题就会再次出现。因此,只有当我们知道我们试图过滤的字段之前所有可变字段的确切长度时,此解决方案才有效。
- 另一个解决方案是**爬取交易以找到我们正在寻找的账户**。这种方法更复杂一些,需要我们实现一个适合我们需求的自定义程序。例如,我们可以使用 `getSignaturesForAddress` 获取与账户关联的所有交易,然后对每个交易使用 `getTransaction` 来访问它们的交易数据,然后过滤对我们的用例重要的交易。还值得考虑的是,这种方法可能不是最具未来性的解决方案,因为我们最终可能会依赖可能被弃用以支持新指令的指令。
- 最后,**最健壮的解决方案是使用 [Geyser 插件](https://docs.solana.com/developing/plugins/geyser-plugins)索引我们正在寻找的数据**。这目前需要大量的设置,但我们最终得到了一个可靠的数据存储,镜像 Solana 区块链中的数据。它不仅解决了我们的过滤问题,而且还提供了一种更方便和高效的方式来访问我们的数据。

## 如何按集合过滤元数据账户?

如上面的问题所述,按 `creators` 数组之后的字段过滤是一项具有挑战性的任务,因为它不是固定大小的字段。我们建议使用 DAS 作为获取集合铸造的最快最简单的方法。如果您想直接从链上获取数据,可以使用以下方法,但我们有一个[指南](/zh/smart-contracts/token-metadata/guides/get-by-collection)显示了三种不同的方法来获取集合中的所有 NFT。

## 如何创建灵魂绑定资产?

Token Metadata 允许您创建灵魂绑定资产。实现这一点的最佳方法是使用 Token22 作为基础 SPL 代币,以及 `non-transferrable` 代币扩展。

{% dialect-switcher title="创建灵魂绑定资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createV1 } from "@metaplex-foundation/mpl-token-metadata";
import { createAccount } from '@metaplex-foundation/mpl-toolbox';
import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeNonTransferableMintInstruction,
} from '@solana/spl-token';
import {
  fromWeb3JsInstruction,
  toWeb3JsPublicKey,
} from '@metaplex-foundation/umi-web3js-adapters';

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

const umi = await createUmi();
const mint = generateSigner(umi);

const extensions = [ExtensionType.NonTransferable];
const space = getMintLen(extensions);
const lamports = await umi.rpc.getRent(space);

// Create the mint account.
const createAccountIx = createAccount(umi, {
  payer: umi.identity,
  newAccount: mint,
  lamports,
  space,
  programId: SPL_TOKEN_2022_PROGRAM_ID,
}).getInstructions();

// Initialize the non-transferable extension.
const createInitNonTransferableMintIx =
  createInitializeNonTransferableMintInstruction(
    toWeb3JsPublicKey(mint.publicKey),
    toWeb3JsPublicKey(SPL_TOKEN_2022_PROGRAM_ID)
  );

// Initialize the mint.
const createInitMintIx = createInitializeMintInstruction(
  toWeb3JsPublicKey(mint.publicKey),
  0,
  toWeb3JsPublicKey(umi.identity.publicKey),
  toWeb3JsPublicKey(umi.identity.publicKey),
  toWeb3JsPublicKey(SPL_TOKEN_2022_PROGRAM_ID)
);

// Create the transaction with the Token22 instructions.
const blockhash = await umi.rpc.getLatestBlockhash();
const tx = umi.transactions.create({
  version: 0,
  instructions: [
    ...createAccountIx,
    fromWeb3JsInstruction(createInitNonTransferableMintIx),
    fromWeb3JsInstruction(createInitMintIx),
  ],
  payer: umi.identity.publicKey,
  blockhash: blockhash.blockhash,
});

// Sign, send, and confirm the transaction.
let signedTx = await mint.signTransaction(tx);
signedTx = await umi.identity.signTransaction(signedTx);
const signature = await umi.rpc.sendTransaction(signedTx);
await umi.rpc.confirmTransaction(signature, {
  strategy: { type: 'blockhash', ...blockhash },
  commitment: 'confirmed',
});

// Create the Token Metadata accounts.
await createV1(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
}).sendAndConfirm(umi);

// Derive the token PDA.
const token = findAssociatedTokenPda(umi, {
  mint: mint.publicKey,
  owner: umi.identity.publicKey,
  tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
});

// Mint the token.
await mintV1(umi, {
  mint: mint.publicKey,
  token,
  tokenOwner: umi.identity.publicKey,
  amount: 1,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}

如果需要使用 TokenKeg SPL 代币,您可以在 pNFT 上使用[锁定转移委托](/zh/smart-contracts/token-metadata/delegates#locked-transfer-委托仅限-pnft)创建灵魂绑定资产,然后锁定 pNFT。但请注意,这不仅会阻止所有者转移 pNFT,还会阻止所有者销毁它。这就是为什么对于灵魂绑定资产的建议是使用 Token22 代币。

## 为什么铸造和冻结权限会转移到 Edition PDA?

我们经常收到的一个问题是：为什么 Token Metadata 程序在创建 NFT 时将铸造账户的 `Mint Authority` 和 `Freeze Authority` 转移到 Edition PDA？为什么不直接通过将它们设置为 `None` 来使它们失效？

让我们分别看看为什么这两个权限都是这种情况。

### 铸造权限

控制铸造权限是确保代币非同质化的关键步骤。如果没有这种保护,有人可以为给定的 NFT 铸造更多代币,从而使 NFT 变得可替代。

防止这种情况发生的一种方法是将铸造权限设置为 `None`,以确保没有人能够为该 NFT 铸造更多代币。但是,Token Metadata 程序将该权限设置为 Edition PDA——它链接到主版账户或版本账户。

**但是为什么呢?** 简短的答案是：**它使我们能够以更低的成本部署对 Token Metadata 程序的升级**。

失去铸造权限是一个不可逆转的操作,这意味着我们永远无法利用它将 NFT 迁移到更新的版本。例如,假设我们想改变原始和印刷 NFT 的结构方式,而不是使用版本账户,我们想利用代币。如果没有铸造权限,将 NFT 迁移到新版本将根本不可能。

**失去这个权限将限制我们未来可能想要实现的功能和更改的范围**,这就是为什么我们不将其设置为 `None`。

但是,这并不意味着有人可以使用该铸造权限在您的 NFT 上铸造更多代币。铸造权限不会转移给某人的公钥,它会转移到属于 Token Metadata 程序的 PDA。因此,只有程序提供的指令才能使用它,而程序上不存在这样的指令。重要的是要注意,Token Metadata 程序是完全开源的,因此任何人都可以检查它以确保铸造权限不会用于铸造更多代币。

### 冻结权限

控制冻结权限允许某人冻结代币账户,使该账户不可变,直到解冻为止。

将此权限转移到 Token Metadata 程序的 Edition PDA 的一个原因是,与铸造权限类似,它增加了潜在新功能和升级的范围。

但是,与铸造权限相反,我们实际上在程序中使用了该权限。

`FreezeDelegatedAccount` 和 `ThawDelegatedAccount` 指令是唯一使用冻结权限的指令。它们允许代币账户的委托冻结（和解冻）该代币账户,使它们成为我们所说的"**不可转移的 NFT**"。这使得各种用例成为可能,例如防止某人在无托管市场上列出时出售 NFT。

## 为什么元数据账户同时具有链上和链下数据?

**元数据账户**包含链上数据,但它也有一个 `URI` 属性,指向提供附加数据的链下 JSON 文件。那么为什么会这样呢？我们不能将所有内容都存储在链上吗？嗯,这存在几个问题：

- 我们必须支付租金来在链上存储数据。如果我们必须将所有内容存储在元数据账户中,其中可能包括长文本,如 NFT 的描述,则需要更多字节,铸造 NFT 突然会变得昂贵得多。
- 链上数据灵活性差得多。一旦使用某种结构创建了账户,就不容易更改。因此,如果我们必须将所有内容存储在链上,NFT 标准将更难随着生态系统的需求而发展。

因此,将数据拆分为链上和链下数据使我们能够获得两全其美的优势,其中链上数据可以被程序使用**为用户创建保证和期望**,而链下数据可以用于**提供标准化但灵活的信息**。

## 使用 Token Metadata 是否有任何成本?

Token Metadata 目前对某些指令的调用者收取非常小的费用,范围在 0.001 SOL 到 0.01 SOL 之间。更多详细信息可以在[协议费用页面](/zh/protocol-fees)上找到。

## 在哪里可以找到已弃用的指令?

Token Metadata 程序的一些指令已经经历了几次迭代,并已弃用以支持更新的指令。已弃用的指令仍然在程序中可用,但它们不在开发者中心上记录,因为它们不再是与程序交互的推荐方式。话虽如此,如果您正在寻找已弃用的指令,可以在 Token Metadata 程序存储库中找到它们。以下是它们的列表：

- [CreateMetadataAccountV3](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L448) 已被 [CreateV1](/zh/smart-contracts/token-metadata/mint#creating-mint-and-metadata-accounts) 替换。
- [UpdateMetadataAccountV2](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L241) 已被 [CreateV1](/zh/smart-contracts/token-metadata/mint#creating-mint-and-metadata-accounts) 替换。
- [UpdatePrimarySaleHappenedViaToken](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L112)
- [SignMetadata](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L146) 请改用 [Verify](/zh/smart-contracts/token-metadata/collections)。
- [RemoveCreatorVerification](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L388) 请改用 [Unverify](/zh/smart-contracts/token-metadata/collections#unverify)。
- [CreateMasterEditionV3](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L267) 已被 [CreateV1](/zh/smart-contracts/token-metadata/mint#creating-mint-and-metadata-accounts) 替换。
- [MintNewEditionFromMasterEditionViaToken](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L202) 已被 [CreateV1](/zh/smart-contracts/token-metadata/mint#creating-mint-and-metadata-accounts) 替换。
- [ConvertMasterEditionV1ToV2](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L210)
- [PuffMetadata](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L236)
- [VerifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L278) 请改用 [Verify](/zh/smart-contracts/token-metadata/collections)。
- [SetAndVerifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L367) 请改用 [Verify](/zh/smart-contracts/token-metadata/collections)。
- [UnverifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L334) 请改用 [Unverify](/zh/smart-contracts/token-metadata/collections#unverify)。
- [Utilize](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L296) - 使用功能已被弃用。
- [ApproveUseAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L311) - 使用功能已被弃用。
- [RevokeUseAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L324) - 使用功能已被弃用。
- [ApproveCollectionAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L346) 请改用 [Delegate](/zh/smart-contracts/token-metadata/delegates)。
- [RevokeCollectionAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L354) 请改用 [Revoke](/zh/smart-contracts/token-metadata/delegates)。
- [FreezeDelegatedAccount](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L375)
- [ThawDelegatedAccount](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L383)
- [BurnNft](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L383) 已被 [Burn](/zh/smart-contracts/token-metadata/burn) 替换。
- [BurnEditionNft](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L487) 已被 [Burn](/zh/smart-contracts/token-metadata/burn) 替换。
- [VerifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L411) 大小集合已被弃用。
- [SetAndVerifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L437) 大小集合已被弃用。
- [UnverifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L423) 大小集合已被弃用。
- [SetCollectionSize](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L456) 大小集合已被弃用。
- [SetTokenStandard](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L464) TokenStandard 现在会自动设置。

## 在哪里可以了解更多关于 Token Metadata 账户大小缩减的信息?
请查看[特殊常见问题](/zh/smart-contracts/token-metadata/guides/account-size-reduction)以获取更多信息,或在有其他问题的情况下加入我们的 [Discord](https://discord.gg/metaplex)。
