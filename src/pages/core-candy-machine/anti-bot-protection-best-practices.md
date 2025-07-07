---
title: Anti-Bot Protection Best Practices
metaTitle: Anti-Bot Protection Best Practices | Core Candy Machine
description: Comprehensive guide on implementing anti-bot protection and security measures for Core Candy Machine mints to prevent malicious actors and ensure fair distribution.
---

Protecting your Core Candy Machine launch from bots and malicious actors is crucial for ensuring a fair distribution to your community. This guide covers proven strategies and implementation patterns that successful projects use to maintain mint integrity while providing transparency to legitimate users. {% .lead %}

## Why Anti-Bot Protection Matters

Without proper protection, bots can:
- Mint large quantities before real users can participate
- Use predictable patterns to snipe rare items
- Overwhelm your infrastructure with automated requests
- Create unfair advantages over genuine community members

The strategies outlined in this guide work together to create multiple layers of protection that make it extremely difficult for automated systems to game your mint while maintaining a smooth experience for legitimate users.

## Metadata Preparation and Upload Strategy

#### Creating and Uploading Real Metadata

First, create your complete collection metadata with transaction ID-based URIs instead of predictable patterns.

##### The Problem with Predictable URIs

Many projects make the mistake of using predictable, incremental URIs for their metadata:

```
https://yourproject.com/metadata/0.json
https://yourproject.com/metadata/1.json
https://yourproject.com/metadata/2.json
```

This pattern allows bots to:
- Pre-fetch all metadata before the mint
- Identify rare traits and target specific indexes
- Plan attacks based on known metadata distribution

##### Solution: Upload Services with Transaction ID-Based URIs

You can use various upload services and SDKs that automatically generate transaction ID-based URIs when you upload files. This eliminates the need to manually generate random identifiers and ensures true unpredictability.

**UMI Uploader Example (wraps Irys/ArDrive Turbo)**
UMI's built-in uploader is a wrapper around services like **Irys** and **ArDrive Turbo**. It automatically generates transaction ID-based URIs while abstracting away the complexity of working directly with these services.

**Example using UMI Uploader:**
```typescript
import fs from "fs";
import mime from "mime";
import { createGenericFile } from "@metaplex-foundation/umi";

const umi = // import or create your umi instance.

// Upload files - UMI automatically creates unpredictable transaction IDs
async function uploadFiles(filePaths: string[]): Promise<string[]> {
  const files = filePaths.map((filePath) => {
    const file = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath);
    return createGenericFile(file, "file", {
      tags: mimeType ? [{ name: "content-type", value: mimeType }] : [],
    });
  });

  const uploadedUris = await umi.uploader.upload(files);
  
  // Log each uploaded URI with its index for tracking
  uploadedUris.forEach((uri, index) => {
    console.log(`Uploaded file #${index} -> ${uri}`);
  });

  return uploadedUris;
}

// CRITICAL: Store all returned URIs - you'll need them for the reveal mapping!
const uploadedUris = await uploadFiles(allFilePaths);

// Result: Automatically unpredictable URIs that MUST be stored
// uploadedUris[0] = "https://arweave.net/BrG44HdsEhzapvs8bEqzvkq4egwevS3fRE6kLuCyOdCd"
// uploadedUris[1] = "https://arweave.net/9jK3LpM7NqR5xY8vZ2BwC4tE6gH9sF1D3a7Q8eR2nM4K"  
// uploadedUris[2] = "https://arweave.net/5tH8GpN3MqL7wV9xB2CeD4yR6kJ1sK3F8gQ7eP5nL9M2"
// ... etc for all your files

// STORE THESE SECURELY - you cannot regenerate them!
// These URIs are from the underlying service (Irys/ArDrive Turbo) via UMI
fs.writeFileSync("./uploaded-uris.json", JSON.stringify(uploadedUris, null, 2));
await securelyStoreUris(uploadedUris);
```

**Other Upload Services to Explore:**
- **Irys**: Direct SDK for Arweave uploads with transaction IDs
- **ArDrive**: Arweave-based storage with built-in transaction ID generation
- **IPFS**: Services like Pinata, Infura, or Web3.Storage
- **AWS S3**: With custom transaction ID generation
- **Custom Solutions**: Build your own upload service with random ID generation

{% callout %}
**For more detailed information about UMI uploader capabilities, see the [UMI Storage Documentation](/umi/storage).**
{% /callout %}

#### Creating Placeholder Metadata

Create a single placeholder metadata file that will be used for all mints initially:

```json
{
  "name": "Mystery Asset",
  "description": "This asset will be revealed after mint completion. Each asset is unique and will be unveiled with its true traits and rarity soon!",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "Status",
      "value": "Unrevealed"
    },
    {
      "trait_type": "Collection",
      "value": "Your Project Name"
    }
  ]
}
```

Upload this to a single, predictable URI (you can use any upload service):
```
https://yourproject.com/metadata/placeholder.json
```

**Key Requirements for Any Upload Solution:**
- **Transaction ID-based URIs**: Ensure unpredictable, non-sequential identifiers
- **Permanent storage**: Use services that provide immutable storage (Arweave, IPFS, etc.)
- **URI storage**: Always store returned URIs in order for reveal mapping
- **Batch capability**: Support for uploading multiple files efficiently

{% callout type="warning" %}
**Critical Storage Requirement:** When uploading your reveal metadata, you MUST store all returned URIs in the exact order they correspond to your metadata files. These URIs cannot be regenerated and are essential for the reveal mapping process. Without them, you cannot reveal your assets!
{% /callout %}

## Secure Mapping Generation

#### Creating the Randomized Mapping

Before setting up your Candy Machine, generate the secure mapping that will determine which mint index corresponds to which final metadata. This is the crucial step that ensures fair distribution.

```typescript
// Generate secure mapping BEFORE creating your Candy Machine
function generateSecureMapping(totalSupply: number): number[] {
  // Create array of indices [0, 1, 2, ..., totalSupply-1]
  const indices = Array.from({ length: totalSupply }, (_, i) => i);
  
  // Use cryptographically secure shuffle (Fisher-Yates)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2**32) * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  return indices;
}

// Example: For a 4000 NFT collection
const secureMapping = generateSecureMapping(4000);
// Result: [2847, 91, 3756, 128, 2904, 567, ...]
// This means:
// - Mint index 0 will reveal as metadata index 2847
// - Mint index 1 will reveal as metadata index 91
// - Mint index 2 will reveal as metadata index 3756
// etc.

// Store this mapping securely - it's your reveal key!
await storeMapping(secureMapping);
```

#### Mapping Security Requirements

- **Generate BEFORE mint launch** - this cannot be changed later
- **Keep mapping completely secret** until reveal time
- **Use encryption** for storage (database encryption, environment variables)
- **Implement strict access controls** for mapping retrieval
- **Create secure backups** in multiple locations
- **Log all access** for audit purposes

{% callout type="warning" %}
**Critical**: The mapping must be generated and secured BEFORE your mint launch. If this mapping is compromised or lost, your entire reveal process will be compromised.
{% /callout %}

## Transparent Verification Setup

#### Pre-Launch Hash Generation

Before launch, generate verification hashes that prove the fairness of your mapping without revealing it:

```typescript
// Generate verification hashes BEFORE mint launch
async function generateVerificationHashes(
  mapping: number[], 
  metadataFiles: string[], 
  uploadedUris: string[]
): Promise<{masterHash: string, metadataHashes: string[]}> {
  
  // 1. Hash each individual metadata file
  const metadataHashes = metadataFiles.map(metadata => 
    crypto.createHash('sha256').update(metadata).digest('hex')
  );
  
  // 2. Extract transaction IDs from uploaded URIs
  const transactionIds = uploadedUris.map(uri => {
    // Extract transaction ID from URI (e.g., https://arweave.net/[ID])
    return uri.split('/').pop();
  });
  
  // 3. Create verification data structure
  const verificationData = mapping.map((finalIndex, mintIndex) => ({
    mintIndex,
    finalIndex,
    transactionId: transactionIds[finalIndex],
    metadataUri: uploadedUris[finalIndex],
    metadataHash: metadataHashes[finalIndex],
  }));
  
  // 4. Generate master hash of entire mapping
  const masterHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(verificationData))
    .digest('hex');
    
  return { masterHash, metadataHashes };
}

const { masterHash, metadataHashes } = await generateVerificationHashes(
  secureMapping, 
  allMetadataFiles, 
  uploadedUris
);
```

#### Publishing Verification Data

**Before your mint begins**, publicly publish this verification data:

```json
{
  "projectName": "Your Project",
  "totalSupply": 4000,
  "masterMappingHash": "a7b9c3d2e8f4g5h6i1j0k9l8m7n6o5p4q3r2s1t0u9v8w7x6y5z4",
  "metadataHashes": [
    "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6",
    "c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7",
    // ... all 4000 metadata hashes
  ],
  "publishedAt": "2024-01-15T10:00:00Z",
  "verificationInstructions": "After reveal, verify your metadata hash matches the published hash for your revealed index"
}
```

Publish this on:
- Your website
- IPFS for permanent storage
- Social media for transparency
- Discord/community channels

## Config Line Settings with Placeholders

#### Why Candy Machine Data is Public and Visible

{% callout type="warning" %}
**Critical Security Insight:** All Candy Machine data is publicly viewable on the blockchain. Anyone can query your Candy Machine and see all the metadata URIs you've loaded into it. This is why using placeholder metadata is absolutely essential for security.
{% /callout %}

When you load items into a Candy Machine:
- **All metadata URIs are immediately visible** to anyone who queries the on-chain data
- **Bots can instantly scrape** all your real metadata if you load it directly
- **Trait analysis becomes trivial** for malicious actors
- **Rarity sniping** becomes possible before the mint even begins

This public visibility is exactly why the placeholder strategy is crucial for protection.

#### Config Lines vs Hidden Settings

There are two ways to load items into a Candy Machine, and choosing the right one affects your security:

**Hidden Settings:**
- Mints sequentially: index 0, then 1, then 2, etc.
- Users get predictable placeholder mint order
- While mapping can still randomize the final reveal, mint order itself is predictable

**Config Lines (Recommended):**
- Better user experience with unpredictable placeholder mint index results

#### Using Config Lines with Placeholder Metadata

Configure your Core Candy Machine to use placeholder metadata during the initial mint phase, potentially with pre-randomized order:

```typescript
// Option 1: Simple placeholder approach
const items = Array.from({ length: 4000 }, (_, index) => ({
  name: `Mystery Asset #${index + 1}`,
  uri: "https://yourproject.com/placeholder.json"
}));

// Option 2: Pre-randomized placeholder order for additional unpredictability
function createRandomizedPlaceholders(totalSupply: number): ConfigLine[] {
  const indices = Array.from({ length: totalSupply }, (_, i) => i);
  
  // Shuffle the indices for random mint order
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  return indices.map((randomIndex, position) => ({
    name: `Mystery Asset #${position + 1}`,
    uri: "https://yourproject.com/placeholder.json"
  }));
}

const randomizedItems = createRandomizedPlaceholders(4000);

// Insert placeholder items into your Candy Machine
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: randomizedItems,
}).sendAndConfirm(umi);
```

**Placeholder metadata structure:**
```json
{
  "name": "Mystery Asset",
  "description": "This asset will be revealed after mint completion. Each asset is unique and will be unveiled with its true traits and rarity soon!",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "Status", 
      "value": "Unrevealed"
    },
    {
      "trait_type": "Collection",
      "value": "Your Project Name"
    }
  ]
}
```

#### Benefits of This Approach

1. **Complete Metadata Privacy**: Real metadata URIs never appear in the Candy Machine
2. **Bot Protection**: No way for bots to analyze traits before reveal
3. **Fair Distribution**: Even the mint order can be randomized
4. **Public Verifiability**: Placeholder metadata shows the project is legitimate
5. **Community Excitement**: Mystery aspect builds anticipation

{% callout %}
**Note:** The placeholder should be engaging and professional to build trust, but must contain zero information about final traits, rarity, or any identifying characteristics of the real assets.
{% /callout %}

## Backend-Controlled Mint Transactions

#### The Third-Party Signer Strategy

Never allow frontend clients to generate their own mint transactions. Instead, implement a backend service that creates and partially signs all mint transactions with mandatory guards.

#### Platform Recommendations for Backend Services

**Next.js (Recommended for most projects):**
Next.js is the most popular platform for creating NFT mint sites because it provides both frontend and backend capabilities in a single framework. The built-in API routes make it incredibly easy to implement secure mint endpoints.

```typescript
// pages/api/mint.ts or app/api/mint/route.ts
// Built-in backend - no separate server needed!
```

**Other Platform Options:**

- **AWS Lambda**: Serverless functions perfect for handling mint bursts without infrastructure management
- **Vercel Functions**: Seamlessly integrates with Next.js deployments
- **Netlify Functions**: Simple serverless option for smaller projects  
- **Railway/Render**: Full-stack hosting with easy deployment
- **Express.js on VPS**: Traditional server approach for maximum control
- **Cloudflare Workers**: Edge computing for global low-latency minting

**Why Next.js is Ideal for Mint Sites:**
- **Integrated Backend**: API routes built-in, no separate server needed
- **Easy Deployment**: One-click deployment to Vercel, Netlify, etc.
- **React Frontend**: Perfect for wallet connection and mint UI
- **Large Community**: Extensive NFT project examples and resources
- **Performance**: Built-in optimizations for fast loading mint pages

##### Required Guards for Security

Always include these guards in your backend-generated transactions:

**1. Third Party Signer Guard**: Ensures only your backend can authorize mints
```typescript
const guards = {
  thirdPartySigner: {
    signerKey: backendSignerWallet.publicKey,
  },
  botTax: {
    lamports: sol(0.01), // Tax for failed attempts
    lastInstruction: true,
  },
  solPayment: {
    lamports: sol(0.1), // Mint price
    destination: treasuryWallet.publicKey,
  },
};
```

**2. Bot Tax Guard**: Discourages spam attempts by charging failed transactions

##### Backend Mint Endpoint Implementation

**Next.js API Route Example:**
```typescript
// pages/api/mint.ts (Pages Router) or app/api/mint/route.ts (App Router)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Validate user (rate limiting, captcha, etc.)
    const { userWallet } = req.body;


    // 2. Generate mint transaction with required guards.
    // You may need to supply additioanl guard args from front end.
    const mintTransaction = await mintV1(umi, {
      candyMachine: candyMachine.publicKey,
      asset: generateSigner(umi),
      minter: createNoopSigner(userWallet),
      mintArgs: {
        thirdPartySigner: {
          signer: backendSigner,
        },
      },
    });

    // 3. Partially sign with backend signer
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);
    
    // 4. Return transaction for user to sign on front end
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: 'Mint failed' });
  }
}
```

**Alternative: Express.js/AWS Lambda Example:**
```typescript
// Traditional Express or serverless function
app.post('/api/mint', async (req, res) => {
  try {
    // 1. Validate user (rate limiting, captcha, etc.)
    const { userWallet, captchaToken } = req.body;
    
    if (!await validateCaptcha(captchaToken)) {
      return res.status(400).json({ error: 'Invalid captcha' });
    }

    // 2. Check mint eligibility
    if (!await checkMintEligibility(userWallet)) {
      return res.status(400).json({ error: 'Mint limit exceeded' });
    }

    // 3. Generate mint transaction with required guards
    const mintTransaction = await mintV1(umi, {
      candyMachine: candyMachine.publicKey,
      asset: generateSigner(umi),
      minter: publicKey(userWallet),
      mintArgs: {
        thirdPartySigner: {
          signer: backendSigner,
        },
      },
    });

    // 4. Partially sign with backend signer
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);
    
    // 5. Return transaction for user to complete
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: 'Mint failed' });
  }
});
```

#### Deployment Considerations by Platform

**Next.js Deployment:**
- **Vercel**: Zero-config deployment, perfect for Next.js
- **Netlify**: Great alternative with similar ease of use
- **Railway**: Full-stack hosting with databases included

**Serverless Deployment:**
- **AWS Lambda**: Use Serverless Framework or AWS CDK
- **Cloudflare Workers**: Global edge deployment
- **Vercel Functions**: Automatic with Next.js deployment

**Traditional Server:**
- **Railway/Render**: Easy container deployment
- **DigitalOcean/Linode**: VPS with Docker
- **AWS EC2**: Full control but more setup required

{% callout type="warning" %}
**Critical Security Note:** Once a transaction is signed, it cannot be modified. The third-party signer guard ensures no one can generate valid mint transactions outside of your backend control.
{% /callout %}

## Post-Mint Metadata Updates (The Reveal)

#### The Reveal Process

After minting completes, implement a reveal mechanism that updates each asset's metadata from placeholder to final metadata using your secure mapping. There are two main strategies for handling the reveal process:

##### Strategy 1: Instant Reveal

With instant reveal, each NFT is updated to its final metadata immediately after the mint transaction completes. This provides immediate gratification for users but requires more complex backend infrastructure.

**Process:**
1. User mints an asset (gets placeholder metadata)
2. Backend immediately looks up the mint index in your secure mapping
3. Backend updates the asset with the final metadata URI from your stored upload list
4. User receives the revealed asset instantly

**Pros:**
- Immediate user satisfaction
- No waiting period for reveal
- Simpler user experience

**Cons:**
- More complex backend implementation
- Higher transaction costs (mint + reveal)
- Requires robust error handling for failed reveals

##### Strategy 2: Event Reveal (Project-Controlled)

With event reveal, all assets remain as placeholders after minting, and the project reveals all NFTs at once at a predetermined time. This creates a community-wide reveal event with no user interaction required.

**Process:**
1. User mints an asset (gets placeholder metadata)
2. Asset remains as placeholder until project reveal event
3. Project backend processes all assets using your secure mapping at the scheduled time
4. All assets are updated to their final metadata simultaneously

**Pros:**
- Simpler mint process
- Creates community-wide reveal excitement
- Can be scheduled for optimal timing (e.g., during community events)
- Lower immediate transaction costs
- No user interaction required

**Cons:**
- Users must wait for reveal
- Requires separate reveal infrastructure
- Need to manage reveal expectations

##### Strategy 3: User-Triggered Reveal

With user-triggered reveal, users can reveal their own NFTs through an interactive UI. Each user controls when their asset is revealed, but the reveal still uses the secure mapping.

**Process:**
1. User mints an asset (gets placeholder metadata)
2. Asset remains as placeholder until user chooses to reveal
3. User visits reveal website and triggers reveal for their specific asset
4. Backend looks up the asset's mint index in your secure mapping
5. Asset is updated to its final metadata

**Pros:**
- Users control their own reveal timing
- Creates interactive community engagement
- Can build anticipation while giving users choice
- Lower immediate transaction costs

**Cons:**
- More complex UI/UX implementation
- Requires user action to complete reveal
- May have incomplete reveals if users don't participate

##### Choosing Your Strategy

**Choose Instant Reveal if:**
- You want immediate user satisfaction
- Your backend can handle the complexity
- Budget allows for higher transaction costs
- You want to avoid reveal-related support issues

**Choose Event Reveal if:**
- You want to create community-wide reveal excitement
- You prefer simpler mint infrastructure
- You want to control reveal timing
- You're working with a limited budget
- You want to schedule reveals during community events

**Choose User-Triggered Reveal if:**
- You want to give users control over their reveal timing
- You want to create interactive community engagement
- You have the resources for a reveal UI/UX
- You want to build anticipation while giving users choice

All three strategies provide the same security benefits - the key differences are user experience, implementation complexity, and community engagement approach.

##### Implementation Reference

For the actual asset update implementation, refer to the [Core Asset Update documentation](/core/update) which covers how to update asset metadata, names, and URIs using UMI.

The reveal process uses your secure mapping to determine which final metadata URI corresponds to each minted asset, then updates the asset using Core's update functionality.

##### Post-Reveal Verification

After the reveal is complete, publish the complete mapping to allow your community to verify the fairness of the process:

```typescript
// Publish the complete mapping after reveal
const fullMappingData = {
  projectName: "Your Project",
  totalSupply: 4000,
  revealDate: "2024-01-20T15:30:00Z",
  mapping: secureMapping.map((finalIndex, mintIndex) => ({
    mintIndex,
    finalIndex,
    transactionId: uploadedUris[finalIndex].split('/').pop(),
    metadataUri: uploadedUris[finalIndex]
  })),
  masterHash: masterHash, // From pre-launch verification
  verificationInstructions: "Use the verification function below to check your asset"
};

// Publish to IPFS, your website, and community channels
await publishMapping(fullMappingData);
```

**Verification function for community:**
```typescript
// Verification function users can run to verify their assets
function verifyAssetMapping(
  mintIndex: number,
  finalIndex: number,
  receivedMetadata: string,
  publishedHashes: string[]
): boolean {
  // 1. Hash the received metadata
  const metadataHash = crypto
    .createHash('sha256')
    .update(receivedMetadata)
    .digest('hex');
  
  // 2. Check against published hash
  const expectedHash = publishedHashes[finalIndex];
  
  // 3. Verify the mapping is correct
  return metadataHash === expectedHash;
}

// Usage example for users
const isValid = verifyAssetMapping(
  0, // Their mint index
  2847, // The revealed final index
  theirMetadataJson, // The metadata they received
  publishedMetadataHashes // The hashes published pre-mint
);

console.log(`Asset verification: ${isValid ? 'VALID' : 'INVALID'}`);
```

## Additional Security Considerations

#### Rate Limiting and Monitoring

```typescript
// Implement rate limiting per wallet
const mintAttempts = new Map<string, number>();

function checkRateLimit(wallet: string): boolean {
  const attempts = mintAttempts.get(wallet) || 0;
  return attempts < MAX_ATTEMPTS_PER_HOUR;
}

// Monitor for suspicious patterns
function detectSuspiciousActivity(requests: MintRequest[]): boolean {
  // Check for identical timing patterns
  // Detect rapid-fire requests from multiple wallets
  // Flag requests with identical metadata
  return false; // Implement your detection logic
}
```

#### Infrastructure Protection

- **Use CDN protection** for your metadata endpoints
- **Implement CAPTCHA** for all mint requests (hCaptcha, reCAPTCHA)
- **Set up DDoS protection** on your backend services
- **Monitor transaction patterns** for unusual activity
- **Have backup infrastructure** ready for high-traffic events
- **Use environment variables** for all sensitive keys and endpoints
- **Implement proper CORS** policies for your API endpoints

#### Platform-Specific Security Tips

**Next.js Security:**
```typescript
// Implement rate limiting with express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

// Use middleware for API routes
export default limiter(handler);
```

**Serverless Security:**
- **AWS Lambda**: Use IAM roles, not hardcoded credentials
- **Vercel**: Use environment variables and edge config
- **Cloudflare Workers**: Leverage KV storage for rate limiting

{% callout type="warning" %}
**Remember**: No single security measure is foolproof. The combination of all these strategies creates a robust defense against automated exploitation while maintaining a fair experience for your community.
{% /callout %}

## Summary of the Complete Process

Here's the complete anti-bot protection workflow in order:

1. **📁 Metadata Preparation**: Create real metadata files and upload via your chosen service for transaction ID URIs + create placeholder metadata
2. **🎯 Mapping Generation**: Generate secure random mapping that connects mint indexes to final metadata indexes  
3. **🔒 Verification Setup**: Create and publish hashes that prove fairness without revealing the mapping
4. **⚙️ Candy Machine Setup**: Deploy with placeholder metadata in config lines
5. **🛡️ Backend Protection**: Control all mints through backend with mandatory third-party signer and bot tax guards
6. **🎭 Reveal Process**: Update all assets from placeholder to real metadata using the secure mapping
7. **✅ Community Verification**: Publish full mapping and provide tools for users to verify their assets

## Conclusion

Implementing comprehensive anti-bot protection requires careful planning and execution across multiple layers of your minting infrastructure. The chronological approach outlined in this guide ensures that each step builds upon the previous one, creating a robust defense system.

**Key Success Factors:**
- **Preparation is everything**: Generate mapping and verification hashes before launch
- **Backend control is critical**: Never let clients generate their own mint transactions
- **Transparency builds trust**: Publish verification data before mint and full mapping after reveal
- **Test thoroughly**: Validate the entire flow on devnet before mainnet launch

By following this structured approach, you create multiple layers of protection that make it extremely difficult for automated systems to game your mint while maintaining complete transparency and fairness for your legitimate community members.

Remember that determined attackers will always look for weaknesses, so staying informed about new attack vectors and continuously improving your defenses is essential for long-term success. 