---
title: Soulbound Assets in MPL Core
metaTitle: Soulbound Assets in MPL Core | Core Guides
description: This Guide explores the different options for soulbound Assets in MPL Core
---


Soulbound NFTs are non-fungible tokens that are permanently bound to a specific wallet address and cannot be transferred to another owner. They are useful for representing achievements, credentials, or memberships that should remain tied to a specific identity.  {% .lead %}

## Overview

In this guide, we'll explore how to create soulbound assets using MPL Core and the Umi Framework. Whether you're a developer looking to implement soulbound NFTs in TypeScript or just want to understand how they work, we'll cover everything from basic concepts to practical implementation. We'll examine different approaches for making assets soulbound and walk through creating your first soulbound NFT within a collection.

In MPL Core, there are two main approaches to create soulbound NFTs:

### 1. Permanent Freeze Delegate Plugin
- Makes assets completely non-transferrable and non-burnable
- Can be applied at either:
  - Individual asset level
  - Collection level (more rent efficient)
- Collection-level implementation allows thawing all assets in a single transaction

### 2. Oracle Plugin
- Makes assets non-transferrable but still burnable
- Can also be applied at:
  - Individual asset level  
  - Collection level (more rent efficient)
- Collection-level implementation allows thawing all assets in a single transaction

## Creating Soulbound NFTs with the Permanent Freeze Delegate Plugin

The Permanent Freeze Delegate Plugin provides functionality to make assets non-transferrable by freezing them. When creating a soulbound asset, you would:

1. Include the Permanent Freeze plugin during asset creation
2. Set the initial state to frozen
3. Set the authority to None, making the frozen state permanent and immutable

This effectively creates a permanently soulbound asset that cannot be transferred or thawed.


### Asset-Level Implementation
The Permanent Freeze Delegate Plugin can be attached to individual assets to make them soulbound. This provides more granular control but requires more rent and separate thaw transactions per asset in case it ever should not be soulbound anymore.

{% totem %}
{% totem-accordion title="Code Example" %}
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
    "YOUR ENDPOINT"
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
{% /totem-accordion  %}
{% /totem %}

### Collection-Level Implementation
For collections where all assets should be soulbound, applying the plugin at the collection level is more efficient. This requires less rent and enables thawing the entire collection in one transaction.

{% totem %}
{% totem-accordion title="Code Example" %}
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
    "YOUR ENDPOINT"
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
{% /totem-accordion  %}
{% /totem %}

## Creating Soulbound NFTs with the Oracle Plugin

The Oracle Plugin provides a way to approve or reject different lifecycle events for an asset. To create soulbound NFTs, we can use a special Oracle deployed by Metaplex that always rejects transfer events while still allowing other operations like burning. This differs from the Permanent Freeze Delegate Plugin approach since assets remain burnable even though they cannot be transferred   .

### Asset-Level Implementation
The Oracle Plugin can make individual assets non-transferrable while preserving the ability to burn them. This provides flexibility for cases where assets may need to be destroyed.

{% totem %}
{% totem-accordion title="Code Example" %}
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
    "YOUR ENDPOINT"
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
{% /totem-accordion  %}
{% /totem %}

### Collection-Level Implementation
Applying the Oracle Plugin at the collection level makes all assets in the collection non-transferrable but burnable. This is more rent efficient and allows managing permissions for the entire collection at once.

{% totem %}
{% totem-accordion title="Code Example" %}
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
    "YOUR ENDPOINT"
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
{% /totem-accordion  %}
{% /totem %}