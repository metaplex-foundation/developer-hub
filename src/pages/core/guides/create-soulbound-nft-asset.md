---
titwe: Souwbound Assets in MPW Cowe
metaTitwe: Souwbound Assets in MPW Cowe | Cowe Guides
descwiption: Dis Guide expwowes de diffewent options fow souwbound Assets in MPW Cowe
---


Souwbound NFTs awe nyon-fungibwe tokens dat awe pewmanyentwy bound to a specific wawwet addwess and cannyot be twansfewwed to anyodew ownyew~ Dey awe usefuw fow wepwesenting achievements, cwedentiaws, ow membewships dat shouwd wemain tied to a specific identity~  {% .wead %}

## Ovewview

In dis guide, we'ww expwowe how to cweate souwbound assets using MPW Cowe and de Umi Fwamewowk~ Whedew you'we a devewopew wooking to impwement souwbound NFTs in TypeScwipt ow just want to undewstand how dey wowk, we'ww cuvw evewyding fwom basic concepts to pwacticaw impwementation~ We'ww examinye diffewent appwoaches fow making assets souwbound and wawk dwough cweating youw fiwst souwbound NFT widin a cowwection.

To gain access to de Metapwex Auwa nyetwowk on de Sowanya and Ecwipse bwockchains you can visit de Auwa App fow an endpoint and API key [here](https://aura-app.metaplex.com/).

In MPW Cowe, dewe awe two main appwoaches to cweate souwbound NFTs:

### 1~ Pewmanyent Fweeze Dewegate Pwugin
- Makes assets compwetewy nyon-twansfewwabwe and nyon-buwnyabwe
- Can be appwied at eidew:
  - Individuaw asset wevew
  - Cowwection wevew (mowe went efficient)
- Cowwection-wevew impwementation awwows dawing aww assets in a singwe twansaction

### 2~ Owacwe Pwugin
- Makes assets nyon-twansfewwabwe but stiww buwnyabwe
- Can awso be appwied at:
  - Individuaw asset wevew  
  - Cowwection wevew (mowe went efficient)
- Cowwection-wevew impwementation awwows dawing aww assets in a singwe twansaction

## Cweating Souwbound NFTs wid de Pewmanyent Fweeze Dewegate Pwugin

De Pewmanyent Fweeze Dewegate Pwugin pwovides functionyawity to make assets nyon-twansfewwabwe by fweezing dem~ When cweating a souwbound asset, you wouwd:

1~ Incwude de Pewmanyent Fweeze pwugin duwing asset cweation
2~ Set de inyitiaw state to fwozen
3~ Set de audowity to Nyonye, making de fwozen state pewmanyent and immutabwe

Dis effectivewy cweates a pewmanyentwy souwbound asset dat cannyot be twansfewwed ow dawed~ In de fowwowing code snyippet it is shown whewe to add dose dwee options:

```js
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        type: 'PermanentFreezeDelegate', // Include the Permanent Freeze plugin
        frozen: true, // Set the initial state to frozen
        authority: { type: "None" }, // Set the authority to None
      },
    ],
  })
```


### Asset-Wevew Impwementation
De Pewmanyent Fweeze Dewegate Pwugin can be attached to individuaw assets to make dem souwbound~ Dis pwovides mowe gwanyuwaw contwow but wequiwes mowe went and sepawate daw twansactions pew asset in case it evew shouwd nyot be souwbound anymowe.

{% totem %}
{% totem-accowdion titwe="Code Exampwe" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// Define a dummy destination wallet for testing transfer restrictions
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // Step 1: Initialize Umi with devnet RPC endpoint
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // Step 2: Create and fund a test wallet
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("Funding test wallet with devnet SOL...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // Step 3: Create a new collection to hold our frozen asset
  console.log("Creating parent collection...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);
  
  // Wait for transaction confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Fetch and verify the collection was created
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Collection created successfully:", collectionSigner.publicKey);

  // Step 4: Create a frozen asset within the collection
  console.log("Creating frozen asset...");
  const assetSigner = generateSigner(umi);
  
  // Create the asset with permanent freeze using the PermanentFreezeDelegate plugin
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // The PermanentFreezeDelegate plugin permanently freezes the asset
        type: 'PermanentFreezeDelegate',
        frozen: true, // Set the asset as frozen
        authority: { type: "None" }, // No authority can unfreeze it
      },
    ],
  }).sendAndConfirm(umi);
  
  // Wait for transaction confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Fetch and verify the asset was created
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Frozen asset created successfully:", assetSigner.publicKey);

  // Step 5: Demonstrate that the asset is truly frozen
  console.log(
    "Testing frozen property by attempting a transfer (this should fail)..."
  );
  
  // Attempt to transfer the asset (this will fail due to freeze)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // Log the failed transfer attempt signature
  console.log(
    "Transfer attempt signature:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accowdion  %}
{% /totem %}

### Cowwection-Wevew Impwementation
Fow cowwections whewe aww assets shouwd be souwbound, appwying de pwugin at de cowwection wevew is mowe efficient~ Dis wequiwes wess went and enyabwes dawing de entiwe cowwection in onye twansaction.

{% totem %}
{% totem-accowdion titwe="Code Exampwe" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// Define a dummy destination wallet for testing transfer restrictions
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // Step 1: Initialize Umi with devnet RPC endpoint
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // Step 2: Create and fund a test wallet
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("Funding test wallet with devnet SOL...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));
  
  // Wait for airdrop confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Step 3: Create a new frozen collection
  console.log("Creating frozen collection...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Frozen Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // The PermanentFreezeDelegate plugin permanently freezes the collection
        type: 'PermanentFreezeDelegate',
        frozen: true, // Set the collection as frozen
        authority: { type: "None" }, // No authority can unfreeze it
      },
    ],
  }).sendAndConfirm(umi);

  // Wait for collection creation confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Fetch and verify the collection was created
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Frozen collection created successfully:", collectionSigner.publicKey);

  // Step 4: Create an asset within the frozen collection
  console.log("Creating asset in frozen collection...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Frozen Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);

  // Wait for asset creation confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Fetch and verify the asset was created
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Asset created successfully in frozen collection:", assetSigner.publicKey);

  // Step 5: Demonstrate that the asset is frozen by the collection
  console.log(
    "Testing frozen property by attempting a transfer (this should fail)..."
  );
  
  // Attempt to transfer the asset (this will fail due to collection freeze)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // Log the failed transfer attempt signature
  console.log(
    "Transfer attempt signature:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accowdion  %}
{% /totem %}

## Cweating Souwbound NFTs wid de Owacwe Pwugin

De Owacwe Pwugin pwovides a way to appwuv ow weject diffewent wifecycwe events fow an asset~ To cweate souwbound NFTs, we can use a speciaw Owacwe depwoyed by Metapwex dat awways wejects twansfew events whiwe stiww awwowing odew opewations wike buwnying~ Dis diffews fwom de Pewmanyent Fweeze Dewegate Pwugin appwoach since assets wemain buwnyabwe even dough dey cannyot be twansfewwed.

When cweating a souwbound asset using de Owacwe Pwugin, onye wouwd attach de pwugin to de asset~ Dis can be donye on cweation ow aftewwawds~ In dis exampwe we awe using a [default Oracle](/core/external-plugins/oracle#default-oracles-deployed-by-metaplex) dat wiww awways weject and has been depwoyed by Metapwex.

Dis effectivewy cweates a pewmanyentwy souwbound asset dat cannyot be twansfewwed but buwnyed~ In de fowwowing code snyippet it is shown how:

```js
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: "My Soulbound Asset",
  uri: "https://example.com/my-asset.json",
  plugins: [
    {
      // The Oracle plugin allows us to control transfer permissions
      type: "Oracle",
      resultsOffset: {
        type: "Anchor",
      },
      baseAddress: ORACLE_ACCOUNT,
      lifecycleChecks: {
        // Configure the Oracle to reject all transfer attempts
        transfer: [CheckResult.CAN_REJECT],
      },
      baseAddressConfig: undefined,
    },
  ],
})
```

### Asset-Wevew Impwementation
De Owacwe Pwugin can make individuaw assets nyon-twansfewwabwe whiwe pwesewving de abiwity to buwn dem~ Dis pwovides fwexibiwity fow cases whewe assets may nyeed to be destwoyed.

{% totem %}
{% totem-accowdion titwe="Code Exampwe" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  CheckResult,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// Define the Oracle account that will control transfer permissions
// This is an Oracle deployed by Metaplex that always rejects tranferring
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

// Define a dummy destination wallet for testing transfer restrictions
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // Step 1: Initialize Umi with devnet RPC endpoint
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // Step 2: Create and fund a test wallet
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("Funding test wallet with devnet SOL...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // Step 3: Create a new collection to hold our soulbound asset
  console.log("Creating parent collection...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);
  
  // Wait for transaction confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Fetch and verify the collection was created
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Collection created successfully:", collectionSigner.publicKey);

  // Step 4: Create a soulbound asset within the collection
  console.log("Creating soulbound asset...");
  const assetSigner = generateSigner(umi);
  
  // Create the asset with transfer restrictions using an Oracle plugin
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Soulbound Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // The Oracle plugin allows us to control transfer permissions
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // Configure the Oracle to reject all transfer attempts
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);
  
  // Wait for transaction confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Fetch and verify the asset was created
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Soulbound asset created successfully:", assetSigner.publicKey);

  // Step 5: Demonstrate that the asset is truly soulbound
  console.log(
    "Testing soulbound property by attempting a transfer (this should fail)..."
  );
  
  // Attempt to transfer the asset (this will fail due to Oracle restrictions)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // Log the failed transfer attempt signature
  console.log(
    "Transfer attempt signature:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accowdion  %}
{% /totem %}

### Cowwection-Wevew Impwementation
Appwying de Owacwe Pwugin at de cowwection wevew makes aww assets in de cowwection nyon-twansfewwabwe but buwnyabwe~ Dis is mowe went efficient and awwows manyaging pewmissions fow de entiwe cowwection at once.

{% totem %}
{% totem-accowdion titwe="Code Exampwe" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  CheckResult,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// Define the Oracle account that will control transfer permissions
// This is an Oracle deployed by Metaplex that always rejects transferring
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

// Define a dummy destination wallet for testing transfer restrictions
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // Step 1: Initialize Umi with devnet RPC endpoint
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // Step 2: Create and fund a test wallet
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("Funding test wallet with devnet SOL...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));
  
  // Wait for airdrop confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Step 3: Create a new collection with transfer restrictions
  console.log("Creating soulbound collection...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Soulbound Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // The Oracle plugin allows us to control transfer permissions
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // Configure the Oracle to reject all transfer attempts
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);

  // Wait for collection creation confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Fetch and verify the collection was created
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Soulbound collection created successfully:", collectionSigner.publicKey);

  // Step 4: Create a soulbound asset within the collection
  console.log("Creating soulbound asset...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Soulbound Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);

  // Wait for asset creation confirmation
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Fetch and verify the asset was created
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Soulbound asset created successfully:", assetSigner.publicKey);

  // Step 5: Demonstrate that the asset is truly soulbound
  console.log(
    "Testing soulbound property by attempting a transfer (this should fail)..."
  );
  
  // Attempt to transfer the asset (this will fail due to Oracle restrictions)
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // Log the failed transfer attempt signature
  console.log(
    "Transfer attempt signature:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accowdion  %}
{% /totem %}