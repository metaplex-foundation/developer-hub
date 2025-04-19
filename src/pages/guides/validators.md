---
title: Validators and Staking
metaTitle: Validators and Staking | Guides
description: An overview of Solana Validators and staking mechanics.
# remember to update dates also in /components/guides/index.js
created: '04-19-2025'
updated: '04-19-2025'
---
## Overview

Validators are responsible for processing transactions, generating new blocks, and validating the state of the blockchain to ensure accuracy and prevent double-spending. They participate in the consensus mechanism by voting on the legitimacy of blocks proposed by other validators, which helps to maintain the integrity and security of the network. Validators also contribute to the network's decentralization by staking their SOL tokens, which aligns their incentives with the network's health and stability.

Validators often participate in governance decisions, providing insights and voting on proposals that affect the network's future. Many validators also contribute to the community by offering educational resources, running community nodes, and supporting the development of decentralized applications (dApps) and tools that enhance the ecosystem.

## Solana's Validator Network

### Proof of Stake and Proof of History

Solana uses a unique combination of Proof of Stake (PoS) and Proof of History (PoH) consensus mechanisms:

- **Proof of Stake**: Validators must stake SOL tokens to participate in consensus. The amount staked influences their voting weight and potential rewards.
- **Proof of History**: A cryptographic clock that provides a historical record of events, allowing validators to agree on the timing of events without requiring communication.

This hybrid approach enables Solana to achieve high transaction throughput (up to 65,000 TPS) and low latency (400ms block times).

### Validator Requirements

Running a validator on Solana requires:

- Hardware: High-performance servers with substantial computational power, including:
  - CPU: 12 cores / 24 threads, 2.8GHz or faster
  - RAM: 256GB or more
  - Storage: 2TB or larger NVMe SSD
  - Network: 1 Gbps or faster internet connection
- Software: Solana validator software and supporting tools
- SOL Tokens: To cover vote transaction fees and optional self-stake

### Validator Economics

Validators earn rewards through:

1. **Transaction Fees**: A portion of transaction fees paid by users
2. **Inflation Rewards**: New SOL tokens distributed to validators and delegators
3. **MEV (Maximal Extractable Value)**: Additional value that can be extracted by influencing transaction ordering

## Staking on Solana

### Staking Mechanics

Staking on Solana can be done in two primary ways:

1. **Direct Staking (Validator)**: Running a validator node and staking your own SOL
2. **Delegation (Delegator)**: Delegating your SOL to an existing validator without running a node yourself

### Delegation Process

To delegate SOL to a validator:

1. Choose a validator based on performance, commission rate, and reliability
2. Create a stake account using a compatible wallet (Phantom, Solflare, etc.)
3. Delegate SOL to your chosen validator
4. Monitor your staking rewards, which are automatically compounded

### Stake Activation and Deactivation

- **Activation**: When you delegate SOL, it takes approximately 2-3 epochs (2-3 days) for your stake to become active and start earning rewards
- **Deactivation**: When you decide to undelegate, it takes approximately 2-3 epochs before your SOL becomes fully liquid again

### Choosing a Validator

Consider these factors when selecting a validator:
- **Performance**: Uptime and block production history
- **Commission**: The percentage of rewards the validator keeps (typically 5-10%)
- **Total Stake**: Higher stake may indicate trust but also contributes to centralization
- **Decentralization Impact**: Consider supporting smaller validators to enhance network decentralization

## Tools and Resources

### Staking Tools
- [Solana Beach](https://solanabeach.io/validators) - Explorer and validator statistics
- [Validators.app](https://www.validators.app/) - Detailed validator performance metrics
- [Stakeview.app](https://stakeview.app/) - Validator ranking and comparison

### Wallets Supporting Staking
- Phantom
- Solflare
- Ledger
- Math Wallet

## Common Terms

- **Epoch**: A time period in Solana (approximately 2-3 days) during which validator performance is measured and rewards are distributed
- **Commission**: The percentage of staking rewards that validators charge delegators for their services
- **Slashing**: A penalty for validator misbehavior, currently not implemented on Solana
- **Vote Account**: An account that validators use to participate in consensus by voting on blocks
- **Stake Account**: An account that holds delegated SOL tokens