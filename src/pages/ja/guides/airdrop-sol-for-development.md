---
title: Airdrop SOL for Development
metaTitle: Airdrop SOL for Development | Devnet Airdrops & Faucets Guide
description: Learn how to get free SOL for development using airdrops, faucets, and other methods on Solana devnet.
# remember to update dates also in /components/guides/index.js
created: '02-04-2026'
updated: null
---

A complete guide to obtaining SOL for development and testing on Solana devnet networks. {% .lead %}

## What You'll Learn

- How to request SOL airdrops via CLI
- Web faucets and alternative sources
- Rate limits and how to work around them
- Troubleshooting common airdrop failures

## Prerequisites

- [Solana CLI installed](/guides/solana-cli-essentials)
- [A keypair/wallet configured](/guides/solana-keypairs-and-wallets)

## Understanding Test Networks

Solana provides free test networks for development:

| Network | Purpose | SOL Value | Reset Frequency |
|---------|---------|-----------|-----------------|
| **Devnet** | Primary development/testing | None (test SOL) | unknown |
| **Testnet** | Stress testing, realistic conditions | None (test SOL) | unknown |
| **Localnet** | Offline development | None (local) | Every restart |

{% callout title="Test SOL Has No Value" %}
SOL on devnet and testnet is free and has no monetary value. Never pay anyone for test SOL. It's always free.
{% /callout %}

## Method 1: CLI Airdrop (Fastest)

The quickest way to get devnet SOL is through the Solana CLI.

### Using Solana CLI

```bash
# Ensure you're on devnet
solana config set --url devnet

# Airdrop 1 SOL to your configured wallet
solana airdrop 1

# Airdrop 2 SOL (maximum per request)
solana airdrop 2

# Airdrop to a specific address
solana airdrop 1 <WALLET_ADDRESS>

# Check your balance
solana balance
```

### Using MPLX CLI

The MPLX CLI provides the same functionality:

```bash
# Airdrop to your active wallet
mplx toolbox sol-airdrop 1

# Airdrop to a specific address
mplx toolbox sol-airdrop 2 --to <WALLET_ADDRESS>

# Check balance
mplx toolbox sol-balance
```

### Airdrop Limits

| Limit | Value |
|-------|-------|
| Maximum per request | 2 SOL |
| Rate limit | ~2-5 requests per minute |
| Daily soft limit | ~10-20 SOL (varies) |

## Method 2: Web Faucets

When CLI airdrops are rate-limited, web faucets provide an alternative.

### Popular Faucets

**Sol Faucet** - https://solfaucet.com
- Devnet and testnet support
- No account required
- Up to 2 SOL per request

**QuickNode Faucet** - https://faucet.quicknode.com/solana/devnet
- Reliable availability
- Multiple networks supported

### Using a Faucet

1. Copy your wallet address:
   ```bash
   solana-keygen pubkey ~/.config/solana/id.json
   ```

2. Visit the faucet website

3. Paste your address and request SOL

4. Verify receipt:
   ```bash
   solana balance
   ```

## Method 3: Local Validator (Unlimited)

For heavy development, a local validator provides unlimited SOL without rate limits.

```bash
# Start local validator (in a separate terminal)
solana-test-validator

# In your main terminal, switch to localhost
solana config set --url localhost

# Airdrop any amount
solana airdrop 1000

# No rate limits on localhost!
solana balance
```

See the [local validator guide](/guides/setup-a-local-validator) for detailed setup.

## Method 4: Fund from Another Wallet

If you have SOL in another devnet wallet, simply transfer it:

```bash
# Transfer from wallet with SOL to new wallet
solana transfer <NEW_WALLET_ADDRESS> 10 --keypair ~/funded-wallet.json
```

This is useful for:
- Funding multiple test wallets
- Team development (one person airdrops, distributes to team)
- Automated testing with pre-funded wallets

## Troubleshooting

### "Airdrop request failed"

**Cause**: Rate limiting or network issues.

**Solutions**:
```bash
# 1. Wait 60 seconds and retry
sleep 60 && solana airdrop 1

# 2. Try a smaller amount
solana airdrop 0.5

# 3. Use a web faucet instead

# 4. Check you're on devnet (not mainnet)
solana config get
```

### "Too many requests"

**Cause**: You've hit the rate limit.

**Solutions**:
- Wait 5-10 minutes before retrying
- Use a different faucet
- Switch to local validator for unlimited SOL
- Use a funded wallet to transfer

### "RPC request error" or "Connection refused"

**Cause**: Network issues or RPC endpoint problems.

**Solutions**:
```bash
# Try a different RPC endpoint
solana config set --url https://api.devnet.solana.com

# Or use an alternative
solana config set --url https://devnet.helius-rpc.com/?api-key=YOUR_KEY
```

### Airdrop Succeeds but Balance Doesn't Update

**Cause**: Checking wrong address or cluster mismatch.

**Solutions**:
```bash
# Verify which keypair is configured
solana config get

# Check the correct address
solana-keygen pubkey $(solana config get keypair | awk '{print $3}')

# Confirm you're on devnet
solana config set --url devnet
solana balance
```

## Next Steps

- [Setup a local validator](/guides/setup-a-local-validator) - Unlimited SOL for testing
- [Solana CLI essentials](/guides/solana-cli-essentials) - Master the CLI
- [Working with devnet and testnet](/guides/working-with-devnet-and-testnet) - Network deep dive
- [Create a token](/tokens/create-a-token) - Use your SOL to create tokens

## FAQ

### Why did my airdrop fail?

Most likely rate limiting. Wait a few minutes and try again, or use a web faucet.

### How much SOL do I need for testing?

For basic testing, 2-5 SOL is usually enough. For heavy testing with many transactions, consider 20+ SOL or use a local validator.

### Is devnet SOL ever worth real money?

No. Devnet and testnet SOL have zero monetary value and cannot be converted to mainnet SOL.

### How often does devnet reset?

Devnet can reset without notice, wiping all accounts and balances. Don't store anything important on devnet—it's purely for testing.
