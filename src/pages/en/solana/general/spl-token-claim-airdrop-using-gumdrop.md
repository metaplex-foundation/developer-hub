---
title: Create a Claimable SPL Token Airdrop
metaTitle: Create a Claimable SPL Token Airdrop | Gumdrop Guides
description: Learn how to create an SPL token airdrop where users claim their allocation using Gumdrop.
created: '01-06-2025'
updated: '01-06-2025'
keywords:
  - SPL token airdrop
  - Gumdrop
  - claimable airdrop
  - Merkle tree
  - Solana token distribution
about:
  - Gumdrop airdrop program
  - SPL token distribution
  - Merkle tree verification
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Create an SPL token with sufficient supply for the distribution
  - Prepare a JSON distribution list with wallet addresses and token amounts
  - Install the Gumdrop CLI and create the airdrop using the create command
  - Set up a frontend claim interface for users to claim their tokens
  - Close the Gumdrop after the airdrop period to recover unclaimed tokens
howToTools:
  - Gumdrop CLI
  - Solana CLI
---

## Overview

Gumdrop is a Solana program that enables the creation of claimable airdrops. Unlike direct airdrops that send tokens to wallets, Gumdrop creates a claim mechanism where users must actively claim their allocation. This approach has several benefits:

- Reduces costs by only transferring tokens to users who claim and having the claimant bearing the cost of the transaction
- Allows for verification of user identity through various methods
- Provides flexibility in distribution methods (wallet, email, SMS, Discord)
- Enables time-limited claims with the ability to recover unclaimed tokens

This guide demonstrates how to create a claimable SPL token airdrop using Gumdrop.

## How It Works

1. When creating the Gumdrop, a merkle tree is generated from your distribution list
2. The merkle root is stored on-chain as part of the Gumdrop program
3. Each recipient gets a unique merkle proof derived from their position in the tree
4. When claiming, the proof is verified against the on-chain root to ensure:
   - The claimer is in the original distribution list
   - They are claiming the correct amount of tokens
   - They haven't claimed before

## Prerequisites

- Node.js 14
- Solana CLI tools installed
- Basic familiarity with SPL tokens and the Solana blockchain
- A funded wallet for transaction fees

## Required Tools

Install the Gumdrop CLI:

```bash
git clone https://github.com/metaplex-foundation/gumdrop
yarn install
```

## Creating the SPL Token

First, create the SPL token that will be distributed. You can follow [our guide](/solana/javascript/how-to-create-a-solana-token) or use tools like [sol-tools.io](https://sol-tools.io/token-tools/create-token).

{% callout type="note" title="Token Amount" %}
Ensure you mint enough tokens to cover your entire distribution list plus some buffer for testing.
{% /callout %}

## Distribution Methods

To distribute the proofs to the users, Gumdrop supports multiple distribution methods. Wallet-based distribution is recommended for:
- Better reliability
- Simpler implementation
- No dependency on external services
- Direct wallet verification

For wallet distribution, you'll need to either
- Send your users a claim URL containing the required proof data, using one of the already available Discord Bots.
or:
1. Store the claim data in your database indexed by wallet address
2. Create a frontend that fetches claim data when users connect their wallet
3. Use the claim data to execute the on-chain claim transaction

Other distribution methods are:
- Email through AWS SES
- SMS through AWS SNS
- Discord through Discord API

## Distribution List Setup
After creating the SPL token, you need to create a distribution list. This list defines who can claim tokens and the amount. This data is used to:
1. Generate unique claim proofs for each recipient
2. Create a merkle tree where the root is stored on-chain for verification
3. Ensure only listed recipients can claim their exact allocation

Create a JSON file containing the distribution list:

```json
[
    {
        "handle": "8SoWVrwJ6vPa3rcdNBkhznR54yJ6iQqPSmgcXVGnwtEu",
        "amount": 10000000
    },
    {
        "handle": "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
        "amount": 5000000
    }
]
```

{% callout title="Token Amounts" %}
The amount should be specified without decimals. For example, if you want to drop 10 tokens of a mint with 6 decimals, specify 10000000 (10 * 10^6).
{% /callout %}

The `handle` can be:
- Wallet address for direct distribution **recommended**
- Email address for AWS SES distribution
- Phone number for AWS SNS distribution  
- Discord user ID for Discord distribution

## Creating the Gumdrop

Use the Gumdrop CLI you downloaded and installed before to create the airdrop. The command can look like this:

```bash
ts-node gumdrop-cli.ts create \
  -e devnet \
  --keypair <KEYPAIR_PATH> \
  --distribution-list <PATH_TO_JSON> \
  --claim-integration transfer \
  --transfer-mint <TOKEN_MINT> \
  --distribution-method <METHOD>
```

{% callout type="note" title="Gumdrop Keypair" %}
The CLI will create a `.log` folder containing a keypair. Save it since you will need it to close the Gumdrop account and recover any unclaimed tokens.
{% /callout %}

## Hosting the Claim Interface

Users need a frontend interface to claim their tokens. You can either:

1. Use the hosted version at `https://gumdrop.metaplex.com`

2. Host your own interface **recommended**. You might want to use the Gumdrop frontend as a starting point and customize it to your needs. For example, it can massively increase the user experience by automatically filling in the claim data for the user based on the wallet they are connected with.

Before launching:

1. Test on devnet with a small distribution list
2. Verify claim URLs and proofs work correctly
3. Test the closing process

## Closing the Gumdrop

After the airdrop period ends, recover unclaimed tokens:

```bash
ts-node gumdrop-cli.ts close \
  -e devnet \
  --base <GUMDROP_KEYPAIR> \
  --keypair <AUTHORITY_KEYPAIR> \
  --claim-integration transfer \
  --transfer-mint <TOKEN_MINT>
```

## Conclusion

Gumdrop provides a powerful and flexible way to distribute SPL tokens through a claim-based mechanism. This approach offers several advantages over traditional airdrops:

- **Cost Efficiency**: Transaction costs are paid by claimants rather than the distributor
- **Controlled Distribution**: Only verified recipients can claim their allocated tokens
- **Recoverability**: Unclaimed tokens can be recovered after the airdrop period
- **Flexibility**: Multiple distribution methods to reach users through their preferred channels

When implementing your Gumdrop:
1. Choose wallet-based distribution for the most reliable experience
2. Test thoroughly on devnet before mainnet deployment
3. Consider building a custom frontend for better user experience
4. Save your Gumdrop keypair to ensure you can close it later

By following this guide, you can create a secure and efficient token distribution system that puts you in control while providing a smooth claiming experience for your users.

## Need Help?

- Join our [Discord](https://discord.gg/metaplex) for support
- Check the [Metaplex Gumdrop Docs](/legacy-documentation/gumdrop)
- Review the [source code](https://github.com/metaplex-foundation/gumdrop)
