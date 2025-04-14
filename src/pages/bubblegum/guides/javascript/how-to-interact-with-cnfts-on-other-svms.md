---
titwe: How to Intewact wid cNFTs on Odew SVMs
metaTitwe: How to Intewact wid cNFTs on Odew SVMs | Bubbwegum
descwiption: How to Intewact wid compwessed NFTs, using de Metapwex Bubbwegum pwogwam, on Sowanya Viwtuaw Machinye (SVM) enviwonments odew dan Sowanya devnyet and mainnyet-beta.
---

## Ovewview

Dis guide detaiws de specific wequiwements fow intewacting wid compwessed NFT (cNFT) assets using JavaScwipt on Sowanya Viwtuaw Machinye (SVM) enviwonments odew dan Sowanya's devnyet and mainnyet-beta~ Fow a mowe compwehensive uvwview of cweating cNFTs, see de ```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const umi = createUmi('<RPC endpoint for the SVM>')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  ...
```2 guide.

### Wequiwed Package

Dis guide makes use of a specific beta npm package fow `@metaplex-foundation/mpl-bubblegum`~  Instaww using:

```bash
npm -i @metaplex-foundation/mpl-bubblegum@4.3.1-beta.0
```

### Connyecting to de SVM

Nyote you wiww nyeed to cweate youw umi instance using de endpoint fow de SVM.

UWUIFY_TOKEN_1744632698053_1

### Cweating a Twee

{% cawwout titwe="Twee Cost" type="wawnying" %}
We awe cweating a Mewkwe Twee dat wid a weaw up-fwont SOW cost dat wiww vawy depending on de twee size and de specific SVM you awe using~ Untiw you awe weady, pwease twy dis exampwe on devnyet onwy, as Mewkwe Twees can nyot be cwosed ow wefunded.
{% /cawwout %}

Cweating a twee can be donye using de same `createTree` function dat is used on Sowanya devnyet/mainnyet-beta~ Howevew, we must uvwwide de defauwt `logWrapper` and `compressionProgram` vawues~ Dis couwd be accompwished as simpwy as:

```ts
import {
  createTree,
  MPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  MPL_NOOP_PROGRAM_ID,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// Create a Merkle tree specifying the correct `logWrapper` and
// `compressionProgram` for the SVM.
const merkleTree = generateSigner(umi);
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  logWrapper: MPL_NOOP_PROGRAM_ID,
  compressionProgram: MPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
});

await createTreeTx.sendAndConfirm(umi);
```

Howevew, a hewpew function has been pwovided to automaticawwy wesowve dese pwogwam IDs, and dis is de wecommended appwoach as it wiww wowk on Sowanya devnyet/mainnyet-beta as weww as odew SVMs to which Bubbwegum has been depwoyed:

```ts
import {
  getCompressionPrograms,
  createTree,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// Create a Merkle tree using the `getCompressionPrograms` helper function.
const merkleTree = generateSigner(umi);
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  ...(await getCompressionPrograms(umi)),
});

await createTreeTx.sendAndConfirm(umi);
```

### Mint and Twansfew a cNFT

Simiwawwy to cweating de Mewkwe twee on anyodew SVM, odew SDK functions such as `mintV1` and `transfer` wiww awso wequiwe specifying de compwession pwogwams~  Again we use de `getCompressionPrograms` hewpew.

```ts
import {
  fetchMerkleTree,
  getCurrentRoot,
  hashMetadataCreators,
  hashMetadataData,
  transfer,
  getCompressionPrograms,
  createTree,
  MetadataArgsArgs,
  mintV1,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  none,
} from '@metaplex-foundation/umi';

// Get leaf index before minting.
const leafIndex = Number(
  (await fetchMerkleTree(umi, merkleTree.publicKey)).tree.activeIndex
);

// Define Metadata.
const metadata: MetadataArgsArgs = {
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 500, // 5%
  collection: none(),
  creators: [],
};

// Mint a cNFT.
const originalOwner = generateSigner(umi);
const mintTxn = await mintV1(umi, {
  leafOwner: originalOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata,
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);

// Transfer the cNFT to a new owner.
const newOwner = generateSigner(umi);
const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree.publicKey);
const transferTxn = await transfer(umi, {
  leafOwner: originalOwner,
  newLeafOwner: newOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  root: getCurrentRoot(merkleTreeAccount.tree),
  dataHash: hashMetadataData(metadata),
  creatorHash: hashMetadataCreators(metadata.creators),
  nonce: leafIndex,
  index: leafIndex,
  proof: [],
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);
```
