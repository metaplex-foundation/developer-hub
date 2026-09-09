---
title: Funding and Recovery
metaTitle: Fund and Recover an MPL-Distro Token Distribution
description: Deposit distribution tokens, fund claim-receipt subsidies, and recover unused MPL-Distro balances.
keywords:
  - fund MPL-Distro
  - withdraw unclaimed tokens
  - claim receipt subsidy
  - token distribution vault
about:
  - MPL-Distro
  - Distribution Funding
  - Fund Recovery
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
howToSteps:
  - Calculate and deposit the complete token allocation.
  - Optionally fund the distribution PDA for receipt-rent subsidies.
  - Monitor token and SOL balances during claims.
  - Recover unused tokens and subsidy SOL outside the active window.
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: Can the authority withdraw tokens while claims are active?
    a: No. Token withdrawals are rejected from the start timestamp through the end timestamp, inclusive.
  - q: What costs does subsidizeReceipts reimburse?
    a: It reimburses claim-receipt rent only, not the protocol fee, transaction fee, or recipient token-account rent.
  - q: Can more tokens be deposited after claims start?
    a: Yes. Deposits are not time-gated, so the authority can replenish an underfunded vault.
  - q: Can a treasury wallet deposit without the distribution authority?
    a: No. The current authority must sign deposit, even when a separate depositor supplies the tokens.
---

[MPL-Distro](/smart-contracts/mpl-distro) separates token funding in the distribution vault from optional SOL funding for claim-receipt rent. {% .lead %}

## Summary

The authority deposits SPL tokens into the distribution's associated token account and may fund the distribution PDA with SOL when receipt subsidies are enabled.

- Deposit enough token base units to cover every Merkle allocation.
- Budget one claim-receipt rent payment per expected successful claim.
- Monitor both the recorded `totalAmount` and the actual vault token balance.
- Withdraw unclaimed tokens and unused subsidy SOL only when the distribution is inactive.

## Quick Start

MPL-Distro funding and recovery follows four operational steps.

1. Sum all allocation amounts and deposit that many token base units.
2. When receipt subsidies are enabled, transfer the expected receipt-rent budget to the distribution PDA.
3. Monitor the actual vault balance, distribution SOL, and claim totals.
4. After the window ends, withdraw unclaimed tokens and unused subsidy SOL.

## Deposit Distribution Tokens

The `deposit` instruction transfers tokens from the depositor's account to the distribution PDA's canonical associated token account. The current distribution authority must sign every deposit, even when a different wallet supplies the tokens.

{% code-tabs-imported from="mpl-distro/fund_distribution" frameworks="umi" filename="fundDistribution" /%}

The SDK defaults `depositor`, `payer`, and `authority` to the Umi payer and derives both associated token accounts. Supply a separate depositor signer when another wallet owns the source tokens, and still pass the current distribution authority.

{% code-tabs-imported from="mpl-distro/deposit_from_separate_wallet" frameworks="umi" filename="depositFromSeparateWallet" /%}

The program increments `totalAmount` after each deposit. It does not compare that value with the sum of allocations committed by the Merkle root.

## Calculate the Token Deposit

The required token deposit is the sum of all allocation amounts expressed in the mint's base units.

{% code-tabs-imported from="mpl-distro/calculate_deposit" frameworks="umi" filename="calculateDeposit" /%}

Deposit a deliberate buffer only when the authority accepts that it must recover the excess later. A valid proof fails with `InsufficientFunds` when the recorded balance is below its allocation, and the SPL transfer can also fail if the actual vault balance is lower.

## Fund Claim Receipt Subsidies

Receipt subsidies let the distribution PDA reimburse the transaction payer for the rent used to create each claim receipt.

Enable `subsidizeReceipts` during `createDistribution`, calculate rent through the RPC, and transfer SOL directly to the distribution PDA:

{% code-tabs-imported from="mpl-distro/fund_receipt_subsidy" frameworks="umi" filename="fundReceiptSubsidy" /%}

{% callout title="Subsidy Budget Boundary" type="warning" %}
The distribution must retain its own rent-exempt minimum. A claim fails with `InsufficientFundsToSubsidizeReceipts` when the remaining SOL cannot cover both the distribution rent and one receipt reimbursement.
{% /callout %}

## MPL-Distro Funding Quick Reference

Claim costs are split among a fixed protocol fee, Solana transaction costs, and account rent.

| Cost | Default payer | Receipt subsidy covers it |
|---|---|---|
| Protocol fee ({% fee product="mpl-distro" config="claim" fee="protocolFee" /%}) | Claim transaction payer | No |
| Transaction fee | Claim transaction payer | No |
| Claim receipt rent | Claim transaction payer | Yes, when enabled and funded |
| Recipient ATA rent | Claim transaction payer | No |

## Recover Unclaimed Tokens

The distribution authority recovers unclaimed or excess tokens with `withdraw` before the start time or after the end time.

{% code-tabs-imported from="mpl-distro/recover_funds" frameworks="umi" filename="recoverFunds" /%}

The active interval is inclusive. A withdrawal is rejected when `startTime <= clusterTime <= endTime`.

## Recover Unused Subsidy SOL

The authority recovers unused receipt subsidy with `withdrawSubsidy` only when subsidies are enabled and the distribution is inactive.

`withdrawSubsidy` transfers a requested lamport amount while preserving the distribution account's rent-exempt minimum. Determine the safe amount from the current account balance instead of assuming every expected claim occurred.

## Monitor Distribution Balances

Production systems should compare program bookkeeping with the actual SPL and SOL account balances.

| Value | Source | Meaning |
|---|---|---|
| `distribution.totalAmount` | Distribution account | Deposits minus withdrawals recorded by the program; claims do not decrement it |
| Vault token amount | Distribution associated token account | Tokens actually available for transfer |
| Distribution lamports | Distribution PDA account | Rent reserve plus optional unused receipt subsidy |
| `claimCount` | Distribution account | Number of recorded successful claims |
| `claimAmount` | Distribution account | Sum of recorded claimed token base units |

The token withdrawal bookkeeping uses saturating subtraction, so integrations should not assume `totalAmount` can never diverge from the SPL vault balance.

## Notes

Funding operations require authority controls and explicit balance monitoring.

- Only the current distribution authority can authorize a deposit.
- Deposits are allowed before, during, and after the claim window.
- Token and subsidy withdrawals are blocked throughout the active window.
- Anyone can transfer SOL directly to the distribution PDA, but only the authority can withdraw subsidy through the program.
- Receipt rent remains allocated because claim receipts cannot currently be closed.

## FAQ

### Can the authority withdraw tokens while claims are active?

No. Token withdrawals are rejected from the start timestamp through the end timestamp, inclusive.

### What costs does subsidizeReceipts reimburse?

It reimburses claim-receipt rent only, not the protocol fee, transaction fee, or recipient token-account rent.

### Can more tokens be deposited after claims start?

Yes. Deposits are not time-gated, so the authority can replenish an underfunded vault.

### Can a treasury wallet deposit without the distribution authority?

No. The current authority must sign `deposit`, even when a separate depositor supplies the tokens.
