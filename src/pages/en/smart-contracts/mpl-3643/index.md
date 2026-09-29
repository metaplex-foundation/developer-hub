---
title: MPL-3643 — Permissioned Token Standard for RWAs
metaTitle: MPL-3643 — Permissioned Token Standard for RWAs on Solana | Metaplex
description: MPL-3643 is the ERC-3643 equivalent for Solana, implemented through the mpl-permission suite of onchain programs. It enables the issuance, management, and transfer of permissioned tokens, built on Token-2022, Token ACL (sRFC 37), and the Solana Attestation Service.
created: '08-22-2026'
updated: '09-28-2026'
keywords:
  - MPL-3643
  - mpl-permission
  - tokenized securities
  - real world assets
  - RWA Solana
  - ERC-3643 Solana
  - T-REX Solana
  - compliance standard
  - permissioned token
  - Token-2022
  - Token ACL
  - sRFC 37
  - Solana Attestation Service
  - identity registry
  - KYC on-chain
  - security token
about:
  - Tokenized securities
  - On-chain compliance
  - MPL-3643
proficiencyLevel: Intermediate
faqs:
  - q: What is MPL-3643?
    a: MPL-3643 is an on-chain standard for permissioned tokens on Solana, purpose built for RWAs like tokenized securities — the framework equivalent of ERC-3643, implemented through the mpl-permission program suite. It comprises four Metaplex programs (Identity Registry, Compliance Module, Gate, Lifecycle Manager) on top of Token-2022, Token ACL (sRFC 37), and the Solana Attestation Service.
  - q: Is MPL-3643 a new token program?
    a: No. MPL-3643 tokens are standard Token-2022 mints, and compliance is a layer above the token rather than a replacement for it. Wallets, explorers, and DEXs integrate through their existing Token-2022 support; the degree of support depends on each venue's handling of the extensions a mint uses, such as transfer hooks, and its own policies for permissioned assets.
  - q: How is MPL-3643 related to ERC-3643?
    a: MPL-3643 is the Solana counterpart to ERC-3643, keeping the same architecture of separate identity, compliance, and token layers while building each layer from Solana primitives. Token-2022 provides the token, Token ACL and the Gate Program perform the role of ERC-3643's compliance callback, and wallet-keyed Claim accounts serve the role ONCHAINID plays on Ethereum. Claims can be backed by Solana Attestation Service attestations or attached directly by a trusted attestor.
  - q: Do users have to complete KYC once per token?
    a: Each offering makes its own admission decision. When the issuer needs access to the underlying KYC data, MPL-3643 is designed to pair with reusable-KYC providers so, with the investor's consent, the original verification is shared with the new issuer. For issuances that do not need access to the underlying data, there is a simpler route of relying on a shared on-chain attestation, which means placing trust in the attestation provider that performed the verification.
  - q: Does every MPL-3643 transfer cost extra compute?
    a: Only if the issuer opts into per-transfer enforcement. Boundary-only tokens enforce compliance at thaw time and via permissionless re-freeze, so post-thaw transfers are ordinary Token-2022 transfers with no added overhead.
  - q: Can an issuer seize or claw back tokens?
    a: Only if the mint opts into recovery. Recovery-enabled mints set the Token-2022 permanent delegate to a Lifecycle Manager PDA that can only sign through guardrailed instructions requiring separate proposer and approver roles, a timelock, a bounded execution window, and a per-request target and amount.
  - q: Is MPL-3643 available on mainnet?
    a: Yes. MPL-3643 is live on Solana mainnet in early access. Request alpha access at https://form.typeform.com/to/AgllGJaz to get started.
---

**MPL-3643** is a suite of onchain programs that enables the issuance, management, and transfer of **permissioned tokens** on Solana. It is the [ERC-3643](https://www.erc3643.org/) equivalent for Solana, implemented through the **mpl-permission** programs. It ensures only users meeting pre-defined conditions can become token holders, making it ideal for digital assets that represent real-world value, like securities, real estate and private funds. Compliance is a layer above a standard **Token-2022** token, not a new token type. {% .lead %}

MPL-3643 is live on Solana mainnet in early access — [request alpha access](https://form.typeform.com/to/AgllGJaz) to build with it.

{% callout type="warning" title="Audit status" %}
MPL-3643 has not been audited. Do not custody real assets without coordinating with Metaplex.
{% /callout %}

## Summary

MPL-3643 is comprised of four Metaplex programs on top of Token-2022, Token ACL (sRFC 37), and the Solana Attestation Service so that an issuer can launch a permissioned token with eligibility rules that are enforced by onchain programs rather than by custom per-issuer code.

- **Standard and implementation** — MPL-3643 names the standard; **mpl-permission** names the code. The repository, npm packages, and Rust crates all use the `mpl-permission` prefix.
- **Standard token, layered compliance** — an MPL-3643 token is a Token-2022 mint, not a custom token program, so wallets, explorers, and DEXs integrate through their existing Token-2022 support. The degree of support depends on each venue's handling of the extensions a mint uses, such as transfer hooks, and its own policies for permissioned assets.
- **Four programs** — Identity Registry, Compliance Module, Gate, and Lifecycle Manager, each independently auditable.
- **Reusable verification** — the standard is designed to pair with reusable-KYC providers: with the investor's consent, an existing verification is shared to a new issuer off-chain, so investors avoid repeating document collection while each issuer retains its own data custody, regulatory responsibility, and on-chain claims.
- **Early access** — live on mainnet; [request alpha access](https://form.typeform.com/to/AgllGJaz) to build with it. See [Status and availability](#status-and-availability).

## Who MPL-3643 Is For

MPL-3643 serves four audiences, each with a different entry point. Start with [Getting Started](/smart-contracts/mpl-3643/getting-started).

| Audience | What they do |
|---|---|
| **RWA issuers** | Launch and administer a permissioned token — pre-conditions like jurisdictions, lockups |
| **Integrating developers** | Build wallets, venues, or apps that move MPL-3643 tokens |
| **KYC providers** | Issue attestations that make investors eligible |
| **Wallet and venue integrators** | Surface frozen accounts, thaw flows, and rejection reasons to users |

## What MPL-3643 Solves

Token-2022, Token ACL, and the Solana Attestation Service already provide the primitives for permissioned tokens, but nothing assembles them into a compliance-first system. Every issuer of regulated tokens on Solana today writes that assembly from scratch.

MPL-3643 supplies the missing pieces:

- A **Gate program** that implements the sRFC 37 gate interface by checking identity and compliance state.
- A **registry** that maps attestations to per-token requirements — "for this token you need KYC plus accreditation from a trusted provider".
- A **configurable rule engine** — holder caps, jurisdiction lists, lockups, volume limits — that enforces onchain without custom code per issuer.
- **Lifecycle infrastructure** — vesting, corporate actions, and guardrailed recovery — tied to compliance state.

## MPL-3643 Architecture

MPL-3643 is four Metaplex programs layered over three existing Solana components. Identity, compliance rules, and freeze authority are separate concerns in separate programs, so each can be audited and upgraded independently.

{% diagram height="h-[620px]" %}

{% node %}
{% node #sdk label="mpl-permission TypeScript SDK" theme="blue" /%}
{% node label="Token profiles, one-call token launch" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="-320" %}
{% node #identity label="Identity Registry" theme="blue" /%}
{% node label="Claim, TrustedAttestor, TokenTrustScope" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="0" %}
{% node #compliance label="Compliance Module" theme="blue" /%}
{% node label="Boundary and per-transfer rule modules" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="320" %}
{% node #lifecycle label="Lifecycle Manager" theme="blue" /%}
{% node label="Yield, vesting, corporate actions, recovery" theme="dimmed" /%}
{% /node %}

{% node parent="compliance" y="150" x="-160" %}
{% node #gate label="Gate Program" theme="crimson" /%}
{% node label="Implements the sRFC 37 gate interface" theme="dimmed" /%}
{% /node %}

{% node parent="gate" y="150" x="-180" %}
{% node #tokenacl label="Token ACL (sRFC 37)" theme="slate" /%}
{% node label="Holds the mint freeze authority" theme="dimmed" /%}
{% /node %}

{% node parent="gate" y="150" x="200" %}
{% node #sas label="Solana Attestation Service" theme="slate" /%}
{% node label="Live KYC attestations" theme="dimmed" /%}
{% /node %}

{% node parent="tokenacl" y="140" x="140" %}
{% node #t22 label="Token-2022 Mint" theme="slate" /%}
{% node label="DefaultAccountState = Frozen" theme="dimmed" /%}
{% /node %}

{% edge from="sdk" to="identity" /%}
{% edge from="sdk" to="compliance" /%}
{% edge from="sdk" to="lifecycle" /%}
{% edge from="gate" to="identity" label="identity check" /%}
{% edge from="gate" to="compliance" label="eligibility / re-freeze checks" /%}
{% edge from="tokenacl" to="gate" label="CPI" /%}
{% edge from="identity" to="sas" label="reads live attestation" /%}
{% edge from="tokenacl" to="t22" label="freeze / thaw" /%}

{% /diagram %}

**Diagram description:** The mpl-permission TypeScript SDK sits above three programs — Identity Registry, Compliance Module, and Lifecycle Manager. The Gate Program sits below the Compliance Module and calls into both the Identity Registry (identity verification) and the Compliance Module (hold-eligibility and re-freeze checks). Token ACL holds the mint's freeze authority and cross-program-invokes the Gate Program to decide every freeze and thaw; the Identity Registry reads live attestations from the Solana Attestation Service. Token ACL is the only component that calls Token-2022's freeze and thaw instructions on the mint, whose accounts are born frozen via `DefaultAccountState`.

### Program Responsibilities

Each MPL-3643 program owns exactly one concern.

| Program | Owns |
|---|---|
| **Identity Registry** | Claims, trusted attestors, per-token trust scope |
| **Compliance Module** | Offering rules — holder caps, countries, lockups, volume, blackouts |
| **Gate Program** | Composing identity + compliance into the two sRFC 37 entry points |
| **Lifecycle Manager** | Yield, vesting, corporate actions, guardrailed recovery |

### Compliance Modules

An issuer composes per-token policy from a menu of compliance modules, enabling and configuring each independently. MPL-3643 is in active development, so the module set may change before release.

| Module | Rule it enforces |
|---|---|
| **Country** | Allow- or deny-lists holders by the country in their residency claim |
| **Holder cap** | Caps the total number of holders |
| **Investor cap** | Caps the number of unique investors, counting linked wallets as one investor |
| **Lockup** | Time-locks newly acquired tokens before they can be transferred |
| **Affiliate volume** | Caps transfer volume for designated holders |
| **Blackout** | Halts transfers during scheduled windows |
| **Jurisdiction pair** | Restricts transfers between specific country pairs |
| **Venue** | Restricts trading to approved venues |

### Claim Topics

Identity claims are organized by **topic** — the vocabulary of facts a trusted attestor can assert about a wallet. Topics defined today include KYC, AML, residency, accreditation, and sanctions screening, plus classification topics used internally by specific modules. Each token's trust policy names the topics it requires, and each trusted attestor is authorized per topic. The topic space is extensible: a new pass/fail eligibility label is a configuration change rather than a program change. As with the module set, the topics defined today may be refined before release.

### Roles of Metaplex and the Issuer

Metaplex provides the infrastructure; the issuer sets the policy for its tokens.

- **Metaplex provides the onchain infrastructure.** Metaplex deploys and maintains the four programs that power MPL-3643 and curates the global trusted attestor list. MPL-3643 enforces the issuer's pre-conditions for users to hold their tokens.
- **The issuer is the policy operator.** Each issuer creates their own `ComplianceConfig`, chooses which modules to enable, configures module parameters, selects which KYC providers to accept via a per-token trust scope, and controls the owner key. The issuer is responsible for the token itself and its compliance posture.

{% callout type="note" title="MPL-3643 enforces configuration, it does not guarantee compliance" %}
These pages describe what the programs enforce. Whether a given configuration satisfies applicable regulations is a question for the issuer and their legal counsel.
{% /callout %}

## ERC-3643 to MPL-3643 Component Mapping

MPL-3643 keeps ERC-3643's separation of concerns and substitutes Solana primitives for each Ethereum contract.

| ERC-3643 component | MPL-3643 equivalent |
|---|---|
| Token contract (ERC-20) | Token-2022 mint wired to Token ACL (sRFC 37) |
| Identity Registry | Identity Registry program |
| Identity Registry Storage | Wallet-keyed `Claim` accounts in the Identity Registry |
| ONCHAINID | Wallet-keyed `Claim` accounts, backed by Solana Attestation Service attestations or attached directly by a trusted attestor |
| Trusted Issuers Registry | `TrustedAttestor` accounts in the Identity Registry |
| Claim Topics Registry | The token trust scope's required topics, set per token |
| Compliance Module | Compliance Module program plus the sRFC 37 Gate Program |
| Agent role | `owner` / `operator` / `agent` roles via per-program `RoleGrant` PDAs |

The one structural difference: ERC-3643 checks compliance inside the token's `transfer()`. Solana has no equivalent hook on a plain transfer, so MPL-3643 enforces eligibility at **freeze and thaw** time — accounts are born frozen and only a compliant wallet can thaw one. Some compliance modules — rules that must be evaluated on every transfer, such as lockups or volume limits — require per-transfer checks, and those are enforced through a Token-2022 transfer hook.

## How MPL-3643 Differs from a Plain Token-2022 Mint

MPL-3643 changes who may hold a token, not how the token itself moves.

| | Plain Token-2022 mint | MPL-3643 token |
|---|---|---|
| Token account initial state | Thawed | Frozen (`DefaultAccountState = Frozen`) |
| Freeze authority | Issuer key | Token ACL `MintConfig` PDA |
| Mint authority | Issuer key | `ComplianceConfig` PDA, after compliance initialization |
| Who may thaw | Freeze authority | Anyone, permissionlessly — the Gate Program decides |
| Who may hold | Anyone | Wallets that pass the identity and hold-eligibility checks |
| Per-transfer cost | None | None on boundary-only tokens; a transfer hook when opted in |

## Protocol Fees

MPL-3643 charges flat protocol fees, paid in SOL, at asset configuration, holder account activation, and distribution execution. Nothing is a percentage of value transferred, capital raised, or assets under management.

{% protocol-fees program="mpl-3643" showTitle=false /%}

See the [Protocol Fees](/protocol-fees) page for up-to-date information on all Metaplex protocol fees.

## Quick Reference

### Programs

| Program | Program name | Purpose |
|---|---|---|
| Identity Registry | `mpl-permission-identity-registry` | Claims, trusted attestors, trust scopes |
| Compliance Module | `mpl-permission-compliance` | Boundary and per-transfer rule enforcement |
| Gate Program | `mpl-permission-gate` | sRFC 37 gate for thaw and freeze decisions |
| Lifecycle Manager | `mpl-permission-lifecycle` | Yield, vesting, corporate actions, recovery |

### SDKs

MPL-3643 ships with a unified TypeScript SDK (`@metaplex-foundation/mpl-permission`) and a Rust SDK (`mpl-permission`), each backed by generated low-level clients for the four programs. The SDKs are the primary interface and sequence the launch bootstrap ordering automatically. They are provided through [alpha onboarding](https://form.typeform.com/to/AgllGJaz).

### External Dependencies

| Dependency | Role in MPL-3643 | Status |
|---|---|---|
| [Token-2022](https://spl.solana.com/token-2022) | The mint and token accounts | Live on mainnet |
| [Token ACL (sRFC 37)](https://solana.com/developers/guides/advanced/acl) | Holds the mint freeze authority; calls the Gate Program | Live on mainnet and devnet; source audited |
| [Solana Attestation Service](https://attest.solana.com/) | Live KYC and accreditation attestations | Live on mainnet |

## Status and Availability

MPL-3643 is live on mainnet in early access, pre-audit.

- **Early access on mainnet.** The four programs are deployed on mainnet and operated with alpha partners ([request alpha access](https://form.typeform.com/to/AgllGJaz)).
- **Audit.** MPL-3643 will undergo a security audit. See [Security](/security) for how Metaplex audits programs and how to report a vulnerability.
- **Token ACL dependency.** Token ACL (sRFC 37) is live and its source has been audited. MPL-3643 verifies the Token ACL deployment it binds to as part of release diligence.
- **Stability level.** MPL-3643 is listed as Experimental on the [Stability Index](/stability-index).

## Notes

- MPL-3643 tokens are **Token-2022** mints, not legacy SPL Token mints. Integrations must use the Token-2022 program ID.
- Boundary-only tokens have no transfer hook, so post-thaw transfers carry no MPL-3643 compute cost. Per-transfer modules require opting into the Compliance Module's Token-2022 transfer hook, which cannot be added retroactively to an existing mint.
- On-chain enforcement makes a small, fixed set of facts publicly readable, none containing direct identifiers: a wallet subject to jurisdiction rules holds a residency claim recording its ISO-3166 country code — the tradeoff for enforcing those rules autonomously, and the same choice ERC-3643's ONCHAINID makes; claims expose their topic, attestor, and expiry; and tokens that opt into an investor-count cap link wallets controlled by the same investor. Names, documents, and detailed KYC results stay off-chain, though the wallet-keyed records themselves are public and, like any public-chain data, can constitute personal data for an observer able to associate the wallet with its owner.
- Compliance initialization irreversibly transfers the mint's `MintTokens` authority to the `ComplianceConfig` PDA. Every instruction needing the raw mint authority must run before it.
- Maintained by Metaplex Foundation. Last verified 2026-09-28.

## FAQ

### What is MPL-3643?

MPL-3643 is an on-chain standard for permissioned tokens on Solana, purpose built for RWAs like tokenized securities — the framework equivalent of ERC-3643, implemented through the **mpl-permission** program suite. It comprises four Metaplex programs — Identity Registry, Compliance Module, Gate, and Lifecycle Manager — on top of Token-2022, Token ACL (sRFC 37), and the Solana Attestation Service. Developer artifacts — the repository, npm packages, and Rust crates — use the `mpl-permission` prefix.

### Is MPL-3643 a new token program?

No. MPL-3643 tokens are standard Token-2022 mints, and compliance is a layer above the token rather than a replacement for it. Wallets, explorers, and DEXs integrate through their existing Token-2022 support; the degree of support depends on each venue's handling of the extensions a mint uses, such as transfer hooks, and its own policies for permissioned assets.

### How is MPL-3643 related to ERC-3643?

MPL-3643 is the Solana counterpart to ERC-3643, keeping the same architecture of separate identity, compliance, and token layers while building each layer from Solana primitives. Token-2022 provides the token, Token ACL and the Gate Program perform the role of ERC-3643's compliance callback, and wallet-keyed `Claim` accounts serve the role ONCHAINID plays on Ethereum. Claims can be backed by Solana Attestation Service attestations or attached directly by a trusted attestor. See the [component mapping](#erc-3643-to-mpl-3643-component-mapping).

### Do users have to complete KYC once per token?

Each offering makes its own admission decision. When the issuer needs access to the underlying KYC data, MPL-3643 is designed to pair with reusable-KYC providers: with the investor's consent, the original verification is shared with the new issuer off-chain, so the investor avoids re-uploading documents, while each issuer keeps its own data custody and regulatory responsibility. For issuances that do not need access to the underlying data, there is a simpler route of relying on a shared on-chain attestation, which means placing trust in the attestation provider that performed the verification. Names, documents, and detailed KYC results remain off-chain in either route: a shared on-chain attestation records only the passing verification outcome, and MPL-3643 records enforcement metadata such as the wallet, claim topics, attestors, and expiries. Because that metadata is wallet-keyed and public, it can still amount to personal data for anyone able to associate the wallet with its owner.

### Does every MPL-3643 transfer cost extra compute?

Only when the issuer opts into per-transfer enforcement. Boundary-only tokens enforce compliance at thaw time and continuously through permissionless re-freeze, so post-thaw transfers are ordinary Token-2022 transfers. Tokens that enable the Compliance Module's transfer hook pay for a compliance evaluation on every transfer.

### Can an issuer seize or claw back tokens?

Only if the mint opts into recovery. A recovery-enabled mint sets the Token-2022 permanent delegate to a Lifecycle Manager program address that has no private key and can only sign through guardrailed recovery instructions — separate proposer and approver roles, a timelock, a bounded execution window, an on-chain audit trail, and a per-request target account and amount. Mints without a permanent delegate cannot be clawed back at all.

### Is MPL-3643 available on mainnet?

Yes. MPL-3643 is live on Solana mainnet in early access. [Request alpha access](https://form.typeform.com/to/AgllGJaz) to get started.

## Glossary

| Term | Definition |
|---|---|
| **Attestation** | A signed, on-chain credential issued by a KYC provider through the Solana Attestation Service. |
| **Boundary module** | A compliance rule evaluated when a wallet enters or leaves eligibility (thaw, re-freeze, mint, burn) rather than on each transfer. |
| **Claim** | A wallet-keyed Identity Registry account recording that a wallet holds a specific claim topic from a specific trusted attestor. |
| **Claim topic** | A numeric identifier for a kind of claim, such as KYC, accreditation, or holder role. |
| **Cranker** | A permissionless caller that re-freezes accounts that have fallen out of compliance, or advances the yield index. |
| **Gate Program** | The MPL-3643 program that implements the sRFC 37 gate interface and answers every thaw and freeze decision. |
| **Per-transfer module** | A compliance rule evaluated inside the Token-2022 transfer hook on every transfer. |
| **Re-freeze** | Permissionlessly freezing an account that has fallen out of compliance after previously being thawed. |
| **sRFC 37** | The Solana standard defining Token ACL and the gate program interface for permissionless freeze and thaw. |
| **Token ACL** | The live Solana program that holds a mint's freeze authority and consults a gate program before freezing or thawing. |
| **Transfer envelope** | The prepare, transfer, finalize sequence an integrator must follow to move an MPL-3643 token. |
| **Trust scope** | A per-token account naming which trusted attestors a token accepts and which claim topics it requires. |
| **Trusted attestor** | The party whose key attaches claims on-chain — typically the token issuer — registered globally in the Identity Registry and authorized for specific claim topics. Distinct from the off-chain KYC provider that performs the verification. |
