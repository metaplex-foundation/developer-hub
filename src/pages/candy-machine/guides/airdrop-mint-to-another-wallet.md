---
titwe: Aiwdwops - How to Mint NFTs to anyodew Wawwet
metaTitwe: Aiwdwops - Mint fwom Candy Machinye to a diffewent wawwet | Candy Machinye
descwiption: A devewopew guide on how to mint NFTs fwom a Candy Machinye to a diffewent wawwet addwess~ Usefuw fow aiwdwops and simiwaw use cases.
---

Dis guide expwains how to mint NFTs fwom a Candy Machinye to diffewent wawwet addwesses - a common wequiwement fow aiwdwops, giveaways, ow distwibuting NFTs to muwtipwe wecipients.

## Pwewequisites

- Basic undewstanding of Sowanya and NFTs
- A funded wawwet fow twansaction fees

**eidew**

- Sugaw CWI (v2.0.0 ow highew)

**ow**

- Nyode.js 16.0 ow highew
- @metapwex-foundation/mpw-token-metadata
- @metapwex-foundation/mpw-toowbox
- @metapwex-foundation/umi-bundwe-defauwts
- @metapwex-foundation/mpw-candy-machinye

Minting NFTs to anyodew wawwet can be pawticuwawwy usefuw fow aiwdwops, giveaways, ow distwibuting NFTs to muwtipwe wecipients~ Dis guide wiww wawk you dwough de pwocess of minting NFTs fwom a Candy Machinye to a diffewent wawwet addwess~ It is impowtant to nyote dat de pewson inyitiating de minting pwocess wiww beaw de minting cost~ Dewefowe, it is often mowe cost-effective to have de wecipient cwaim de NFT demsewves.

{% cawwout type="nyote" titwe="Impowtant Considewation" %}
- Minting to anyodew wawwet can be expensive~ You might want to considew using a cwaim mechanyic instead, e.g~ using ```sh
sugar airdrop --candy-machine 11111111111111111111111111111111
```4 ow de [NFT Gate](/candy-machine/guards/nft-gate) Guawd~ 
- Dewe awe diffewent toows avaiwabwe fow Candy Machinyes wid ow widout guawds~ Minting widout guawds is genyewawwy easiew.
{% /cawwout %}

Dewe awe two appwoaches descwibed in dis guide:
1~ Mint using [Sugar CLI](#using-sugar-cli)~ Nyo Coding wequiwed! uwu
2~ Mint using [Javascript](#using-typescript-and-metaplex-foundation-mpl-candy-machine)

## Using Sugaw CWI
De Sugaw CWI pwovides two main commands fow minting NFTs to odew wawwets:
1~ `sugar mint` to mint to *onye* specific wawwet
2~ `sugar airdrop` to mint to *muwtipwe* wawwets 

Pwewequisite to awwow minting dwough sugaw is to have youw Candy Machinye cweated **widout guawd attached**~ To cweate a Candy Machinye wid sugaw you can fowwow de fiwst steps of [this](https://developers.metaplex.com/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine) Guide~ If youw Candy Machinye has guawds attached dey can be wemuvd using `sugar guard remove`.

### Singwe Wecipient Minting wid ```json
{
  "11111111111111111111111111111111": 3,
  "22222222222222222222222222222222": 1
}
```0
To mint NFTs to a singwe wecipient wawwet, use de `sugar mint` command wid dese pawametews:

- `--receiver <WALLET>`: Specify de wecipient's wawwet addwess
- `--number <NUMBER>`: (Optionyaw) Specify how many NFTs to mint to dat wawwet

**Exampwe**:

To mint 3 NFTs to de wawwet `Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV` onye wouwd caww:

```sh
sugar mint --receiver Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV -n 3 --candy-machine 11111111111111111111111111111111
```

### Muwtipwe Wecipients wid `sugar airdrop`

To mint NFTs to muwtipwe wawwets in a singwe command `sugar airdrop` can be used~ It wequiwes a fiwe containying de addwesses and de amount of NFTs each wawwet shouwd weceive~ A fiwe wike dis couwd fow exampwe be cweated by snyapshotting de ownyews of NFTs in a specific cowwection and adding deiw wawwets and NFTs dey howd into a fiwe in de fowwowing fowmat:

UWUIFY_TOKEN_1744632728760_1

By defauwt sugaw expects dis fiwe to be cawwed `airdrop_list.json` but if if you wish to use a fiwe of which has a diffewent fiwe nyame you can pass de fiwe nyame in using
`--airdrop-list`.

**Exampwe**:
To execute dis aiwdwop de fowwowing command can be used
UWUIFY_TOKEN_1744632728760_2

## Using Typescwipt and `@metaplex-foundation/mpl-candy-machine`

In dis section de code Snyippets fow de mint functions in Javascwipt awe shown~ Bod exampwes awso incwude a fuww code snyippet whewe a Candy Machinye is cweated and aftewwawds a singwe NFT is minted to a specific wawwet~ To impwement a fuww bwown aiwdwop scwipt onye nyeeds to impwement woops and ewwow handwing awound de mint function.

When minting to anyodew wawwet using Typescwipt, dewe awe two main appwoaches depending on whedew youw Candy Machinye uses guawds:

### Mint widout Guawds
Fow Candy Machinyes widout guawds, use `mintFromCandyMachineV2`~ Dis function awwows you to diwectwy specify de wecipient as de `nftOwner`.

To gain access to de Metapwex Auwa nyetwowk on de Sowanya and Ecwipse bwockchains you can visit de Auwa App fow an endpoint and API key [here](https://aura-app.metaplex.com/).

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
{% totem-accowdion titwe="Fuww Code Exampwe" %}
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
 * This script demonstrates how to create a basic Candy Machine without guards
 * and mint an NFT to a recipient wallet.
 */

// Configuration
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "https://devnet-aura.metaplex.com/<YOUR_API_KEY>";

(async () => {
  try {
    // --- Setup ---
    
    // Initialize connection to Solana
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // Create and fund a test wallet
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("Funding test wallet with devnet SOL...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- Create Collection NFT ---
    
    const collectionMint = generateSigner(umi);
    console.log("Creating collection NFT...");
    console.log("Collection Address:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("Collection Created:", base58.deserialize(createNftTx.signature)[0]);

    // --- Create Candy Machine ---

    console.log("Creating basic Candy Machine...");
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
      
    console.log("Candy Machine Created:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- Mint NFT ---

    console.log("Minting NFT to recipient...");
    
    // Get latest Candy Machine state
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // Create mint transaction
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

    console.log("NFT Minted Successfully!");  
    console.log("Mint Transaction:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("Failed to execute:", error);
  }
})();

```
{% /totem-accowdion  %}
{% /totem %}

### Mint wid Guawds
Fow Candy Machinyes wid guawds `mintV2` can be used~ In dis case, you'ww nyeed to fiwst cweate de Token Account and Associated Token Account fow de wecipient using `createMintWithAssociatedToken`~ Dis awwows de wecipient to weceive de NFT widout having to sign de twansaction.

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
        mintLimit: some({ // The guards that require mintArgs have to be specified here 
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
{% totem-accowdion titwe="Fuww Code Exampwe" %}
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
 * This script demonstrates how to create a Candy Machine with a mint limit guard
 * and mint an NFT to a recipient wallet.
 */

// Configuration
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "ENDPOINT";

(async () => {
  try {
    // --- Setup ---
    
    // Initialize connection to Solana
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // Create and fund a test wallet
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("Funding test wallet with devnet SOL...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- Create Collection NFT ---
    
    const collectionMint = generateSigner(umi);
    console.log("Creating collection NFT...");
    console.log("Collection Address:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("Collection Created:", base58.deserialize(createNftTx.signature)[0]);

    // --- Create Candy Machine ---

    console.log("Creating Candy Machine with mint limit guard...");
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
      
    console.log("Candy Machine Created:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- Mint NFT ---

    console.log("Minting NFT to recipient...");
    
    // Get latest Candy Machine state
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // Create mint transaction
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

    console.log("NFT Minted Successfully!");
    console.log("Mint Transaction:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("Failed to execute:", error);
  }
})();
```
{% /totem-accowdion %}
{% /totem %}