---
title: エアドロップ - 別のウォレットへNFTをミントする方法
metaTitle: エアドロップ - Candy Machineから別のウォレットへミント | Candy Machine
description: Candy Machineから別のウォレットアドレスにNFTをミントする方法についての開発者ガイド。エアドロップや類似のユースケースに有用です。
---

このガイドでは、Candy Machineから異なるウォレットアドレスにNFTをミントする方法を説明します。これは、エアドロップ、景品配布、または複数の受信者にNFTを配布する一般的な要件です。

## 前提条件

- SolanaとNFTの基本的な理解
- トランザクション手数料のための資金調達されたウォレット

**どちらか**

- Sugar CLI（v2.0.0以上）

**または**

- Node.js 16.0以上
- @metaplex-foundation/mpl-token-metadata
- @metaplex-foundation/mpl-toolbox
- @metaplex-foundation/umi-bundle-defaults
- @metaplex-foundation/mpl-candy-machine

別のウォレットへNFTをミントすることは、エアドロップ、景品配布、または複数の受信者にNFTを配布する際に特に有用です。このガイドでは、Candy Machineから異なるウォレットアドレスにNFTをミントするプロセスを案内します。ミントプロセスを開始する人がミントコストを負担することに注意することが重要です。したがって、受信者が自分でNFTを請求する方がしばしばコスト効率的です。

{% callout type="note" title="重要な考慮事項" %}
- 別のウォレットへのミントは高額になる可能性があります。代わりに[allowlist](/ja/smart-contracts/candy-machine/guards/allow-list)や[NFT Gate](/ja/smart-contracts/candy-machine/guards/nft-gate) Guardを使用した請求メカニズムを検討することをお勧めします。
- ガードありとガードなしのCandy Machineで利用可能な異なるツールがあります。ガードなしでのミントは通常より簡単です。
{% /callout %}

このガイドでは2つのアプローチを説明します：
1. [Sugar CLI](#using-sugar-cli)を使用したミント。コーディング不要！
2. [Javascript](#using-typescript-and-metaplex-foundation-mpl-candy-machine)を使用したミント

## Sugar CLIの使用

Sugar CLIは、他のウォレットにNFTをミントするための2つの主要なコマンドを提供します：
1. `sugar mint`：*1つ*の特定のウォレットにミント
2. `sugar airdrop`：*複数*のウォレットにミント

Sugarを通じてミントを許可する前提条件は、**ガードが添付されていない**Candy Machineを作成することです。Sugarを使用してCandy Machineを作成するには、[この](/ja/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine)ガイドの最初のステップに従ってください。Candy Machineにガードが添付されている場合、`sugar guard remove`を使用してガードを削除できます。

### `sugar mint`を使用した単一受信者ミント

単一の受信者ウォレットにNFTをミントするには、以下のパラメーターで`sugar mint`コマンドを使用してください：

- `--receiver <WALLET>`：受信者のウォレットアドレスを指定
- `--number <NUMBER>`：（オプション）そのウォレットにミントするNFTの数を指定

**例**：

ウォレット`Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV`に3つのNFTをミントするには、以下を実行します：

```sh
sugar mint --receiver Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV -n 3 --candy-machine 11111111111111111111111111111111
```

### `sugar airdrop`を使用した複数受信者

単一のコマンドで複数のウォレットにNFTをミントするには、`sugar airdrop`を使用できます。これには、アドレスと各ウォレットが受け取るべきNFTの量を含むファイルが必要です。このようなファイルは、例えば特定のコレクションのNFT所有者のスナップショットを取得し、彼らのウォレットと所有するNFTを以下の形式でファイルに追加することで作成できます：

```json
{
  "11111111111111111111111111111111": 3,
  "22222222222222222222222222222222": 1
}
```

デフォルトでは、Sugarはこのファイルを`airdrop_list.json`と呼ぶことを期待しますが、異なるファイル名を使用したい場合は、`--airdrop-list`を使用してファイル名を渡すことができます。

**例**：
このエアドロップを実行するには、以下のコマンドを使用できます：

```sh
sugar airdrop --candy-machine 11111111111111111111111111111111
```

## Typescriptと`@metaplex-foundation/mpl-candy-machine`の使用

このセクションでは、Javascriptでのミント関数のコードスニペットを示します。両方の例には、Candy Machineが作成され、その後特定のウォレットに単一のNFTがミントされる完全なコードスニペットも含まれています。完全なエアドロップスクリプトを実装するには、ミント関数の周りにループとエラー処理を実装する必要があります。

Typescriptを使用して別のウォレットにミントする場合、Candy Machineがガードを使用するかどうかに応じて2つの主要なアプローチがあります：

### ガードなしでのミント

ガードなしのCandy Machineの場合、`mintFromCandyMachineV2`を使用します。この関数では、受信者を`nftOwner`として直接指定できます。


```js
const candyMachineAccount = await fetchCandyMachine(umi, publicKey("CM Address"));

const recipient = publicKey('Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV')
const nftMint = generateSigner(umi)
const mintTx = await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient }))
  .add(
    mintFromCandyMachineV2(umi, {
      candyMachine: candyMachine.publicKey,
      mintAuthority: umi.identity,
      nftOwner: recipient,
      nftMint,
      collectionMint: candyMachineAccount.collectionMint,
      collectionUpdateAuthority: candyMachineAccount.authority,
    })
  )
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' },
  })
```

{% totem %}
{% totem-accordion title="完全なコード例" %}
```js
import {
  addConfigLines,
  createCandyMachineV2,
  fetchCandyMachine,
  mintFromCandyMachineV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi-serializers";
import {
  createMintWithAssociatedToken,
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

/**
 * このスクリプトは、ガードなしの基本的なCandy Machineを作成し、
 * 受信者ウォレットにNFTをミントする方法を示します。
 */

// 設定
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "https://api.devnet.solana.com";

(async () => {
  try {
    // --- セットアップ ---
    
    // Solanaへの接続を初期化
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // テストウォレットを作成・資金調達
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("devnet SOLでテストウォレットに資金調達中...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- コレクションNFTの作成 ---
    
    const collectionMint = generateSigner(umi);
    console.log("コレクションNFTを作成中...");
    console.log("コレクションアドレス:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
      collectionDetails: {
        __kind: 'V1',
        size: 0,
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("コレクション作成完了:", base58.deserialize(createNftTx.signature)[0]);

    // --- Candy Machineの作成 ---

    console.log("基本的なCandy Machineを作成中...");
    const candyMachine = generateSigner(umi);
    
    const createCandyMachineV2Tx = await (
      await createCandyMachineV2(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 2,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: "My NFT #",
          nameLength: 3,
          prefixUri: "https://example.com/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    )
      .add(
        addConfigLines(umi, {
          candyMachine: candyMachine.publicKey,
          index: 0,
          configLines: [
            { name: "1", uri: "https://example.com/nft1.json" },
            { name: "2", uri: "https://example.com/nft2.json" },
          ],
        })
      )
      .sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
      
    console.log("Candy Machine作成完了:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- NFTのミント ---

    console.log("受信者へNFTをミント中...");
    
    // 最新のCandy Machine状態を取得
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // ミントトランザクションの作成
    const nftMint = generateSigner(umi);
    const mintTx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient })
      )
      .add(
        mintFromCandyMachineV2(umi, {
          candyMachine: candyMachine.publicKey,
          mintAuthority: umi.identity,
          nftOwner: recipient,
          nftMint,
          collectionMint: candyMachineAccount.collectionMint,
          collectionUpdateAuthority: candyMachineAccount.authority,
        })
      )
      .sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

    console.log("NFTミント成功！");  
    console.log("ミントトランザクション:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("実行に失敗しました:", error);
  }
})();

```
{% /totem-accordion  %}
{% /totem %}

### ガードありでのミント

ガードありのCandy Machineの場合、`mintV2`を使用できます。この場合、まず`createMintWithAssociatedToken`を使用して受信者のToken AccountとAssociated Token Accountを作成する必要があります。これにより、受信者がトランザクションに署名する必要なくNFTを受け取ることができます。

```js
const candyMachineAccount = await fetchCandyMachine(umi, publicKey("CM Address"));

const recipient = publicKey('Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV')
const nftMint = generateSigner(umi)
const mintTx = await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachineAccount.publicKey,
      nftMint,
      token: findAssociatedTokenPda(umi, {
        mint: nftMint.publicKey,
        owner: recipient,
      }),
      collectionMint: candyMachineAccount.collectionMint,
      collectionUpdateAuthority: candyMachineAccount.authority,
      tokenStandard: TokenStandard.NonFungible,
      mintArgs: {
        mintLimit: some({ // mintArgsが必要なガードをここで指定する必要があります
          id: 1,
        }),
      },
    })
  )
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' },
  })
```

{% totem %}
{% totem-accordion title="完全なコード例" %}
```js
import {
  addConfigLines,
  create,
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi-serializers";
import {
  createMintWithAssociatedToken,
  findAssociatedTokenPda,
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

/**
 * このスクリプトは、ミント制限ガード付きのCandy Machineを作成し、
 * 受信者ウォレットにNFTをミントする方法を示します。
 */

// 設定
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "ENDPOINT";

(async () => {
  try {
    // --- セットアップ ---
    
    // Solanaへの接続を初期化
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // テストウォレットを作成・資金調達
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("devnet SOLでテストウォレットに資金調達中...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- コレクションNFTの作成 ---
    
    const collectionMint = generateSigner(umi);
    console.log("コレクションNFTを作成中...");
    console.log("コレクションアドレス:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
      collectionDetails: {
        __kind: 'V1',
        size: 0,
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("コレクション作成完了:", base58.deserialize(createNftTx.signature)[0]);

    // --- Candy Machineの作成 ---

    console.log("ミント制限ガード付きCandy Machineを作成中...");
    const candyMachine = generateSigner(umi);
    
    const createCandyMachineV2Tx = await (
      await create(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 2,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
          },
        ],
        guards: {
          mintLimit: some({
            id: 1,
            limit: 2,
          }),
        },
        configLineSettings: some({
          prefixName: "My NFT #",
          nameLength: 3,
          prefixUri: "https://example.com/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    )
      .add(
        addConfigLines(umi, {
          candyMachine: candyMachine.publicKey,
          index: 0,
          configLines: [
            { name: "1", uri: "https://example.com/nft1.json" },
            { name: "2", uri: "https://example.com/nft2.json" },
          ],
        })
      )
      .sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
      
    console.log("Candy Machine作成完了:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- NFTのミント ---

    console.log("受信者へNFTをミント中...");
    
    // 最新のCandy Machine状態を取得
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // ミントトランザクションの作成
    const nftMint = generateSigner(umi);
    const mintTx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient })
      )
      .add(
        mintV2(umi, {
          candyMachine: candyMachineAccount.publicKey,
          nftMint,
          token: findAssociatedTokenPda(umi, {
            mint: nftMint.publicKey,
            owner: recipient,
          }),
          collectionMint: candyMachineAccount.collectionMint,
          collectionUpdateAuthority: candyMachineAccount.authority,
          tokenStandard: TokenStandard.NonFungible,
          mintArgs: {
            mintLimit: some({
              id: 1,
            }),
          },
        })
      )
      .sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

    console.log("NFTミント成功！");
    console.log("ミントトランザクション:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("実行に失敗しました:", error);
  }
})();
```
{% /totem-accordion %}
{% /totem %}