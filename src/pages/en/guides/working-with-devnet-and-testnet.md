---
title: Working with Devnet
metaTitle: Working with Devnet | Solana Development Environments
description: Learn how to use Solana devnet and local validators for development. Understand when to use each environment and how to transition to mainnet.
# remember to update dates also in /components/guides/index.js
created: '02-04-2026'
updated: null
---

A practical guide to Solana development environments—devnet for testing against the network, localnet for fast offline development, and transitioning to mainnet. {% .lead %}

## What You'll Learn

- When to use devnet vs local validator
- How to switch between environments
- Setting up Amman for local Metaplex development
- Best practices for transitioning to mainnet

## Prerequisites

- [Solana CLI installed](/guides/solana-cli-essentials)
- [A keypair configured](/guides/solana-keypairs-and-wallets)

## Development Environment Options

For Metaplex development, we recommend two environments:

| Environment | Best For | SOL | Speed |
|-------------|----------|-----|-------|
| **Devnet** | Integration testing, API testing | Free (airdrop) | Network latency |
| **Localnet** | Fast iteration, offline work, CI/CD | Unlimited | Instant |

{% callout title="Skip Testnet" %}
For most Metaplex development, you won't need testnet. Use **devnet** for network testing and **localnet** for fast local development. Testnet is primarily for validator operators and stress testing.
{% /callout %}

## Devnet: Network Testing Environment

**Devnet** is Solana's primary development network—use it when you need to test against real network conditions.

### When to Use Devnet

- Testing RPC interactions and API calls
- Verifying transactions work on the network
- Integration testing with deployed programs
- Testing with other devnet-deployed contracts
- Sharing work with team members

### Connecting to Devnet

```bash
# CLI
solana config set --url devnet

# MPLX CLI
mplx config rpcs set devnet

# Verify
solana config get
```

In code:

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('https://api.devnet.solana.com')
```

### Getting Devnet SOL

```bash
# CLI
solana airdrop 2

# MPLX CLI
mplx toolbox sol-airdrop 2
```

See [Getting SOL for Development](/guides/getting-sol-for-development) for more options.

### Devnet Characteristics

| Aspect | Details |
|--------|---------|
| **SOL** | Free via airdrop (up to 2 SOL per request) |
| **Persistence** | May reset periodically |
| **Programs** | All Metaplex programs deployed |
| **Rate limits** | More relaxed than mainnet |
| **Latency** | Real network latency (~400ms) |

## Localnet: Fast Local Development

For rapid iteration, use a **local validator**. No network latency, unlimited SOL, and full control.

### Option 1: Basic solana-test-validator

Quick and simple for basic testing:

```bash
# Start local validator
solana-test-validator

# In another terminal, switch to localhost
solana config set --url localhost

# Unlimited airdrops
solana airdrop 100
```

See [Setup a Local Validator](/guides/setup-a-local-validator) for the basic setup guide.

### Option 2: Amman (Recommended for Metaplex)

**[Amman](/dev-tools/amman)** is Metaplex's local validator toolkit with powerful features:

- **Auto-clone programs** from mainnet/devnet
- **Clone accounts** with their data
- **Amman Explorer** for transaction inspection
- **Mock storage** for metadata testing
- **Pre-made configs** for Metaplex programs

#### Quick Amman Setup

```bash
# Install
npm install -D @metaplex-foundation/amman

# Create config file .ammanrc.js
# Start
npx amman start
```

#### Example: Amman Config for Token Development

Create `.ammanrc.js` in your project root:

```javascript
const { LOCALHOST, tmpLedgerDir } = require('@metaplex-foundation/amman');

module.exports = {
  validator: {
    killRunningValidators: true,
    accountsCluster: 'https://api.mainnet-beta.solana.com',
    accounts: [
      {
        label: 'Token Metadata Program',
        accountId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        executable: true,
      },
      {
        label: 'MPL Core',
        accountId: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
        executable: true,
      },
    ],
    jsonRpcUrl: LOCALHOST,
    commitment: 'confirmed',
    ledgerDir: tmpLedgerDir(),
    resetLedger: true,
    verifyFees: false,
  },
  relay: {
    enabled: process.env.CI == null,
    killRunningRelay: true,
  },
  storage: {
    enabled: process.env.CI == null,
    storageId: 'mock-storage',
    clearOnStart: true,
  },
};
```

See the [Amman documentation](/dev-tools/amman) for full configuration options and [pre-made configs](/dev-tools/amman/pre-made-configs) for Bubblegum, Candy Machine, and more.

### When to Use Localnet

- Rapid development iteration
- Offline development
- CI/CD pipelines
- Testing without rate limits
- Debugging with full control
- When devnet is down or slow

## Comparing Environments

| Feature | Devnet | Localnet |
|---------|--------|----------|
| **Network latency** | Yes (~400ms) | No (instant) |
| **SOL availability** | Rate-limited airdrops | Unlimited |
| **Programs** | Pre-deployed | Must clone or deploy |
| **Account state** | Shared (others can see) | Private |
| **Persistence** | Until reset | Until you stop |
| **Good for** | Integration testing | Fast iteration |

## Environment Management

### Quick Switching

```bash
# Add to ~/.bashrc or ~/.zshrc
alias sol-dev='solana config set --url devnet'
alias sol-local='solana config set --url localhost'
alias sol-main='solana config set --url mainnet-beta'
```

### In Applications

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

// config.js
const CLUSTER = process.env.SOLANA_CLUSTER || 'devnet'

const ENDPOINTS = {
  'devnet': 'https://api.devnet.solana.com',
  'localnet': 'http://127.0.0.1:8899',
  'mainnet-beta': process.env.MAINNET_RPC || 'https://api.mainnet-beta.solana.com',
}

export const umi = createUmi(ENDPOINTS[CLUSTER])
```

### Separate Wallets

Always use different wallets for each environment:

```bash
# Create separate wallets
solana-keygen new --outfile ~/.config/solana/devnet.json
solana-keygen new --outfile ~/.config/solana/mainnet.json

# Configure with MPLX CLI
mplx config wallets add devnet ~/.config/solana/devnet.json
mplx config wallets add mainnet ~/.config/solana/mainnet.json
```

## Mainnet-Beta: Production

When you're ready for production:

```bash
solana config set --url mainnet-beta
```

{% callout title="Mainnet Considerations" type="warning" %}
- **Real SOL** with real monetary value
- **Strict rate limits** on public RPCs—use a dedicated provider
- **No undo**—transactions are permanent
- Always test thoroughly on devnet first
{% /callout %}

### Recommended RPC Providers

For production, use a dedicated RPC provider:

- [Helius](https://helius.dev)
- [QuickNode](https://quicknode.com)
- [Triton](https://triton.one)

## Migration Checklist: Dev to Mainnet

Before deploying to mainnet:

### Code
- [ ] Remove hardcoded devnet addresses
- [ ] Environment-based cluster configuration
- [ ] Error handling for network failures
- [ ] Retry logic with exponential backoff
- [ ] Proper compute unit and priority fee handling

### Testing
- [ ] All features tested on devnet
- [ ] Edge cases handled
- [ ] Localnet tests pass in CI

### Infrastructure
- [ ] Dedicated RPC provider configured
- [ ] Monitoring and alerting set up
- [ ] Separate mainnet wallet with proper security

## Common Patterns

### Development Workflow

```bash
# 1. Start local development with Amman
npx amman start

# 2. Code and test locally (fast iteration)
# ... make changes ...

# 3. Test on devnet
solana config set --url devnet
npm test

# 4. Deploy to mainnet when ready
solana config set --url mainnet-beta
```

### CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Start local validator
  run: |
    npx amman start &
    sleep 10

- name: Run tests
  run: npm test
  env:
    SOLANA_CLUSTER: localnet
```

## Troubleshooting

### "Connection refused" on localhost

Local validator isn't running:

```bash
# Check if running
pgrep -f solana-test-validator

# Start it
solana-test-validator
# or
npx amman start
```

### Program not found on localnet

Programs must be loaded. Use Amman to auto-clone:

```javascript
// .ammanrc.js
accounts: [
  {
    label: 'Token Metadata Program',
    accountId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    executable: true,  // This clones the program
  },
]
```

### Devnet airdrop failing

Rate limited. Options:
- Wait and retry
- Use a [web faucet](/guides/getting-sol-for-development)
- Switch to localnet for unlimited SOL

## Next Steps

- [Amman documentation](/dev-tools/amman) - Full Amman setup and configuration
- [Setup a local validator](/guides/setup-a-local-validator) - Basic local validator guide
- [Getting SOL for development](/guides/getting-sol-for-development) - Devnet SOL sources

## FAQ

### Do I need testnet?

For most Metaplex development, no. Devnet + localnet covers typical use cases. Testnet is mainly for validator operators and performance testing.

### Can I transfer assets between devnet and mainnet?

No. Each cluster is completely separate. Tokens, NFTs, and programs exist independently on each network.

### Why use Amman instead of solana-test-validator?

Amman automatically clones programs and accounts from mainnet/devnet, includes an explorer relay for debugging, and provides mock storage for metadata. It's purpose-built for Metaplex development.

### How often does devnet reset?

There's no fixed schedule. Resets happen for maintenance. Never rely on devnet data persisting—it's purely for testing.
