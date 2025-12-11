---
title: FAQ
metaTitle: FAQ | Token Metadata
description: Token Metadataについてよく聞かれる質問
---

## `getProgramAccounts`を使用して、`creators`配列の後にあるフィールドでMetadataアカウントをフィルタリングするにはどうすればよいですか？

[RPC APIの`getProgramAccounts`メソッド](https://docs.solana.com/developing/clients/jsonrpc-api#getprogramaccounts)を使用する場合、`memcmp`フィルターを使用してフィールドでアカウントをフィルタリングしたい場合がよくあります。

`memcmp`フィルターはバイト配列を比較するため、このアプローチではアカウントのデータ構造の知識が必要です。さらに、そのデータ構造の長さが固定されている必要があります。これにより、すべての単一アカウントで探しているフィールドの位置を見つけることができます。

残念ながら、**Metadata Account**の`creators`フィールドは、1から5人の作成者を含むことができるベクターです。これは、その後のすべてのフィールドの位置が、アカウントが持つ作成者の数に依存することを意味します。

破壊的変更を追加せずにアカウントに新しいフィールドを追加するには、アカウントにオプションフィールドを追加する必要があります。これは残念ながら、Metadata Accountに追加する可能性のある新機能が`creators`フィールドの後になり、したがって`getProgramAccounts`を介してフィルタリングするのが困難になることを意味します。

この問題を解決する方法がいくつかあります：

- フィルタリングしようとしているすべての単一アカウントが**同じ数の作成者**を持っている場合、次のフィールドのオフセットを見つけることができます。これは、`creators`オフセットに`4 + 34 * n`を追加することで行えます。ここで`n`は固定の作成者数であり、`4`はベクターの長さを保存するために4バイトが使用されるためです。これにより、`creators`フィールドの後に存在する固定長のすべてのフィールドについてブロックが解除されます。残念ながら、別のベクターやオプションフィールドなど、別の可変サイズフィールドに到達するとすぐに問題が再発します。したがって、この解決策は、フィルタリングしようとしているフィールドの前にあるすべての可変フィールドの正確な長さがわかっている場合にのみ有効です。
- 別の解決策は、**トランザクションをクロールして探しているアカウントを見つける**ことです。このアプローチは少し複雑で、ニーズに合うカスタム手順を実装する必要があります。例えば、`getSignaturesForAddress`を使用してアカウントに関連付けられたすべてのトランザクションを取得し、それぞれに`getTransaction`を使用してトランザクションデータにアクセスしてから、使用例に重要なものをフィルタリングできます。このアプローチは、新しいものに代わって廃止される可能性のある命令に依存する可能性があるため、最も将来性のある解決策ではない可能性があることも考慮に値します。
- 最後に、**最も堅牢な解決策は、[Geyser Plugin](https://docs.solana.com/developing/plugins/geyser-plugins)を使用して探しているデータをインデックス化することです**。これには現在かなりのセットアップが必要ですが、Solanaブロックチェーンのデータをミラーする信頼性の高いデータストアになります。フィルタリングの問題を解決するだけでなく、データにアクセスするための非常に便利で効率的な方法も提供します。

## コレクションでMetadataアカウントをフィルタリングするにはどうすればよいですか？

上記の質問で述べたように、`creators`配列の後に存在するフィールドでフィルタリングすることは、固定サイズのフィールドではないため困難なタスクです。コレクションミントを取得する最も高速で簡単な方法としてDASの使用をお勧めします。チェーンから直接データを取得したい場合は以下の方法を使用できますが、コレクション内のすべてのNFTを取得する3つの異なる方法を示す[ガイド](/ja/token-metadata/guides/get-by-collection)があります。

## Soulbound Assetを作成するにはどうすればよいですか？

Token Metadataでは、Soulbound Assetを作成できます。これを達成する最良の方法は、`non-transferrable` Token拡張機能とともに、基本SPLトークンとしてToken22を使用することです。

{% dialect-switcher title="Create a Soulbound asset" %}
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

// Mintアカウントを作成
const createAccountIx = createAccount(umi, {
  payer: umi.identity,
  newAccount: mint,
  lamports,
  space,
  programId: SPL_TOKEN_2022_PROGRAM_ID,
}).getInstructions();

// 転送不可拡張機能を初期化
const createInitNonTransferableMintIx =
  createInitializeNonTransferableMintInstruction(
    toWeb3JsPublicKey(mint.publicKey),
    toWeb3JsPublicKey(SPL_TOKEN_2022_PROGRAM_ID)
  );

// Mintを初期化
const createInitMintIx = createInitializeMintInstruction(
  toWeb3JsPublicKey(mint.publicKey),
  0,
  toWeb3JsPublicKey(umi.identity.publicKey),
  toWeb3JsPublicKey(umi.identity.publicKey),
  toWeb3JsPublicKey(SPL_TOKEN_2022_PROGRAM_ID)
);

// Token22命令でトランザクションを作成
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

// トランザクションに署名、送信、確認
let signedTx = await mint.signTransaction(tx);
signedTx = await umi.identity.signTransaction(signedTx);
const signature = await umi.rpc.sendTransaction(signedTx);
await umi.rpc.confirmTransaction(signature, {
  strategy: { type: 'blockhash', ...blockhash },
  commitment: 'confirmed',
});

// Token Metadataアカウントを作成
await createV1(umi, {
  mint,
  name: 'My Soulbound NFT',
  uri: 'https://example.com/my-soulbound-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
}).sendAndConfirm(umi);

// Token PDAを導出
const token = findAssociatedTokenPda(umi, {
  mint: mint.publicKey,
  owner: umi.identity.publicKey,
  tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
});

// トークンをミント
await mintV1(umi, {
  mint: mint.publicKey,
  token,
  tokenOwner: umi.identity.publicKey,
  amount: 1,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Mint AuthorityとFreeze AuthorityがEdition PDAに転送されるのはなぜですか？

これは、トークンプログラムが空でないMint AuthorityやFreeze AuthorityでMintアカウントを閉じることを許可しないためです。プログラムがトークンまたはMintアカウントを閉じ、そのレントをレント受益者に返したい場合、Authority権限をプログラムが制御するPDAに転送する必要があります。

これにより、プログラムは後でこれらの権限を取り消すことができ、トークンプログラムがアカウントを閉じることを許可します。

## Token MetadataでToken-2022を使用できますか？

はい！Token Metadataは、従来のTokenプログラムとToken-2022の両方をサポートしています。Token-2022を使用する場合、追加機能やToken拡張機能にアクセスできます。

主な違いは、Token-2022使用時に`splTokenProgram`パラメーターでToken-2022プログラムIDを指定する必要があることです：

```ts
const SPL_TOKEN_2022_PROGRAM_ID = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

// Token-2022でNFTを作成
await createV1(umi, {
  mint,
  name: 'My Token-2022 NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID, // Token-2022プログラムIDを指定
}).sendAndConfirm(umi);
```