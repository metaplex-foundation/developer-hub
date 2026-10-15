---
title: Getting Started with MPL-3643
metaTitle: Getting Started — Prerequisites and First Steps | MPL-3643
description: What you need before building on MPL-3643, which path to take as an issuer or integrator, and the end-to-end shape of launching a compliant token, onboarding an investor, and executing a compliant transfer.
created: '08-22-2026'
updated: '09-28-2026'
keywords:
  - MPL-3643 getting started
  - tokenized security quickstart
  - Solana RWA tutorial
  - compliant token devnet
  - Token-2022 setup
  - Token ACL setup
about:
  - Getting started
  - MPL-3643
proficiencyLevel: Intermediate
howToSteps:
  - Install the Solana toolchain and confirm devnet access.
  - Obtain a registry token-issuer role grant so you can create per-token configs.
  - Create a Token-2022 mint with DefaultAccountState set to Frozen.
  - Wire the mint's freeze authority to Token ACL with permissionless thaw and freeze enabled.
  - Run the bootstrap in order, ending with compliance initialization.
howToTools:
  - Solana CLI
  - Node.js 20 or later
faqs:
  - q: How do I get access to MPL-3643?
    a: MPL-3643 is live on mainnet in early access. Request access at https://form.typeform.com/to/AgllGJaz. Alpha partners receive direct onboarding support.
  - q: What do I need before launching an MPL-3643 token?
    a: A Token-2022 mint created with DefaultAccountState set to Frozen, a sealed Token ACL config with both permissionless flags enabled, a registry token-issuer role grant, and a trusted attestor that covers every claim topic your token will require (e.g., KYC, accreditation, sanctions screening).
  - q: Should I use the SDK or the generated program clients?
    a: Use the SDK. It sequences the irreversible bootstrap ordering for you and routes administration through the correct gate-wrapped or direct call. Reach for the generated clients only when you need instruction-level control.
  - q: Do I need to run my own cranker?
    a: For a boundary-only token, yes or arrange for one. Nothing re-freezes a non-compliant holder automatically, so without a cranker a holder whose KYC expires keeps trading indefinitely.
---

This page covers what you need in place before building on MPL-3643, which path to take, and the shape of the flows for launching a token, onboarding an investor, and executing a compliant transfer. {% .lead %}

MPL-3643 is live on Solana mainnet in early access — [request alpha access](https://form.typeform.com/to/AgllGJaz) to build with it.

{% callout type="warning" title="Audit status" %}
MPL-3643 has not been audited. Do not custody real assets without coordinating with Metaplex.
{% /callout %}

## Summary

Building on MPL-3643 means composing a Token-2022 mint with Token ACL, the four MPL-3643 programs, and a KYC provider. The order in which you do it matters, because one step is irreversible.

## Choose Your Path

Three audiences build against MPL-3643, and they need different things first.

| You are | You want to | Your flow below |
|---|---|---|
| **An RWA issuer** | Launch and administer a compliant token | [The Shape of a Token Launch](#the-shape-of-a-token-launch) |
| **An integrating developer** | Move MPL-3643 tokens from a wallet, venue, or app | [The Shape of a Compliant Transfer](#the-shape-of-a-compliant-transfer) |
| **A KYC provider** | Make investors eligible by issuing claims | [The Shape of Investor Onboarding](#the-shape-of-investor-onboarding) |

Whichever path you take, one fact drives everything else: every MPL-3643 token account is **born frozen**, and only a compliant wallet can thaw one.

## Prerequisites

### Tooling

| Requirement | Version | Why |
|---|---|---|
| Node.js | 20.18.0 or later | Required by the TypeScript SDK and generated clients |
| Solana CLI | 2.1.0 or later | Devnet interaction and key management |
| A devnet RPC endpoint | — | Must support Token-2022 |

Rust integrators additionally need the Anchor and Solana toolchain versions the programs are built against.

### On-Chain Prerequisites

Before any MPL-3643 instruction succeeds for your token, four things must be true.

1. **The mint is Token-2022 with `DefaultAccountState = Frozen`.** This extension cannot be added after the mint is created.
2. **Freeze authority is delegated to Token ACL**, with permissionless thaw *and* permissionless freeze both enabled in the Token ACL config, and the config sealed so those settings cannot later be changed.
3. **You hold a registry token-issuer role grant.** This is what lets you create your own compliance, gate, and yield configs without a Metaplex co-signature.
4. **A trusted attestor covers every topic you require.** The attestor you pin must be active and authorized for `KYC` plus every topic in your token's required set.

{% callout type="warning" title="Two mint decisions cannot be revisited" %}
`DefaultAccountState = Frozen` and the transfer hook extension are both fixed when the mint is created. A mint without the hook can never gain per-transfer modules — no lockups, no volume caps, no blackout windows, no venue restrictions. Decide before you create the mint.
{% /callout %}

## The Shape of a Token Launch

Launching a compliant token is a bootstrap sequence whose ordering is enforced by the programs.

1. **Create the Token-2022 mint** with `DefaultAccountState = Frozen`, plus the transfer hook extension if per-transfer modules will ever be needed.
2. **Create the Token ACL config** for the mint, enable both permissionless flags, and seal it.
3. **Initialize the gate config** — requires the raw mint authority. This also creates the token's trust scope.
4. **Add accepted KYC providers to the trust scope.**
5. **Initialize lifecycle yield and recovery configs**, if the token uses them — requires the raw mint authority.
6. **Initialize the compliance config.** This is the authority-transfer boundary.
7. **Initialize the gate extra account meta lists**, which reads the live compliance config and binds the gate.
8. **Enable and configure modules**, then mint the initial supply through the Compliance Module's mint flow, which keeps holder accounting in sync.

{% callout type="warning" title="Step 6 is a one-way door" %}
Compliance initialization irreversibly moves the mint's `MintTokens` authority to the `ComplianceConfig` PDA. Every instruction requiring the raw mint authority — steps 3 and 5 — must run before it. There is no recovery path: a token launched without a trust scope cannot be given one later. The SDK sequences this for you; if you use the generated clients directly, you own the ordering.
{% /callout %}

## The Shape of Investor Onboarding

An investor becomes eligible through four steps, starting from one off-chain verification.

1. **KYC off-chain.** The provider verifies the investor's documents.
2. **Attestation.** The passing result is recorded as a Solana Attestation Service attestation, or prepared as an attestor-signed `Direct` claim.
3. **Claim attach.** The trusted attestor attaches a wallet-keyed `Claim` for each topic the token requires; a residency claim records the investor's ISO-3166 country code when the token enforces jurisdiction rules.
4. **Thaw.** Anyone submits `thaw_permissionless`; the Gate Program checks eligibility and Token ACL thaws the account.

Step 3 happens once per trusted attestor — the party whose key attaches claims on-chain, typically the token issuer. The standard is designed to pair with reusable-KYC providers so an earlier verification can be shared, with the investor's consent, instead of repeated.

## The Shape of a Compliant Transfer

Moving an MPL-3643 token is a three-phase envelope, not a single instruction.

1. **Prepare** — ensure the destination's Associated Token Account exists, thaw it, and resolve transfer hook accounts if the token has a hook.
2. **Transfer** — a Token-2022 `transfer_checked`, with hook metas appended when applicable.
3. **Finalize** — checkpoint yield for both parties if the token pays yield.

Don't skip the prepare phase: a transfer to a recipient who has never held the token always fails, because their account is born frozen.

## Operational Responsibilities

A compliant token is not fire-and-forget. Two background jobs keep it correct.

| Job | What it does | Consequence of not running it |
|---|---|---|
| **Re-freeze cranker** | Calls `freeze_permissionless` on holders that fell out of compliance | Expired-KYC holders keep trading indefinitely |
| **Yield crank and checkpoint** | Advances the global index and settles holder balances | Yield does not accrue and accounting drifts |

Both are permissionless, so they can be issuer-operated, third-party, or incentivized.

## Decide Before You Build

Four decisions shape everything downstream, and three of them cannot be changed later.

| Decision | Reversible? | Consequence |
|---|---|---|
| Transfer hook enabled at mint creation | **No** | Determines whether per-transfer modules are ever possible |
| `DefaultAccountState = Frozen` | **No** | Required; without it MPL-3643 cannot enforce anything |
| Permanent delegate set to the recovery PDA | **No** | Determines whether forced recovery is ever possible |
| Which modules are enabled | Yes, mostly | Holder cap and investor cap must be enabled before any supply exists |

## Notes

- MPL-3643 tokens are Token-2022 mints. Integrations that hardcode the SPL Token program ID will not see them.
- Holder cap and investor cap must be enabled before any supply exists, and holder cap cannot be disabled once activated.
- Use canonical Associated Token Accounts everywhere. Non-canonical token accounts owned by the same wallet are not tracked by holder accounting and silently desynchronize caps and yield.
- Whether a configuration satisfies a given securities regime is a legal question for the issuer and their counsel. These pages describe what the programs enforce.
- Maintained by Metaplex Foundation. Last verified 2026-09-28.

## FAQ

### How do I get access to MPL-3643?

MPL-3643 is live on mainnet in early access. [Request access](https://form.typeform.com/to/AgllGJaz). Alpha partners receive direct onboarding support.

### What do I need before launching an MPL-3643 token?

A Token-2022 mint created with `DefaultAccountState = Frozen`, a sealed Token ACL config with both permissionless flags enabled, a registry token-issuer role grant, and a trusted attestor authorized for `KYC` plus every other topic your token will require (e.g., accreditation, sanctions screening).

### Should I use the SDK or the generated program clients?

Use the SDK. It sequences the irreversible bootstrap ordering and routes each administrative action through the correct direct or gate-wrapped call. The generated clients are for integrators who need instruction-level control and are willing to own that ordering themselves.

### Do I need to run my own cranker?

You need one to exist. Nothing re-freezes a non-compliant holder automatically, so without a cranker a holder whose KYC expires keeps trading until someone calls `freeze_permissionless`. Crankers are permissionless, so it can be yours, a third party's, or an incentivized network.

### Can I add per-transfer rules to a token I already launched?

No. Per-transfer modules run inside a Token-2022 transfer hook, and Token-2022 extensions are fixed at mint creation. Launching without the hook permanently rules out lockups, volume caps, blackout windows, and venue restrictions.
