---
title: Uniform Price Auction
metaTitle: Genesis Auction | Token Auction on Solana | Metaplex
description: Token auction on Solana with uniform clearing price. Competitive bidding for SPL token launches — an on-chain token sale mechanism for institutional and large-scale fundraising.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - uniform price auction
  - token auction
  - token offering
  - token auction Solana
  - clearing price
  - price discovery
  - sealed bid
  - competitive bidding
  - token offering
  - SPL token auction
  - crypto fundraising
about:
  - Auction mechanics
  - Price discovery
  - Competitive bidding
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What is a uniform price auction?
    a: An auction where all winning bidders pay the same clearing price, regardless of their individual bid amounts. The clearing price is the lowest winning bid.
  - q: How is the clearing price determined?
    a: Bids are ranked by price. The clearing price is set at the point where total bid quantity equals available tokens, with all winners paying this uniform price.
  - q: Can bids be private?
    a: Yes. Uniform Price Auctions support both public and private (sealed) bids depending on your configuration.
  - q: When should I use a Uniform Price Auction?
    a: Use it for price discovery with larger participants (whales, funds) who prefer structured auction formats over deposit-based launches.
---

**Uniform Price Auctions** enable competitive bidding for token launches on Solana. All winning bidders pay the same clearing price — the lowest winning bid — ensuring fair price discovery for structured token sales and on-chain fundraising. {% .lead %}

{% callout title="What You'll Learn" %}
This overview covers:
- How uniform price auctions work
- When to use auctions vs other launch mechanisms
- Key concepts: bids, clearing price, allocation
{% /callout %}

## Summary

Uniform Price Auctions collect bids during an auction window, then allocate tokens at a single clearing price.

- Users bid for token quantity at their chosen price
- Bids ranked by price; tokens allocated to highest bidders
- All winners pay the same clearing price (lowest winning bid)
- Supports public or sealed (private) bids

## Out of Scope

Fixed-price sales (see [Presale](/smart-contracts/genesis/presale)), proportional distribution (see [Launch Pool](/smart-contracts/genesis/launch-pool)), and post-auction liquidity setup.

## Use Cases

| Use Case | Description |
|----------|-------------|
| **Price Discovery** | Let the market determine fair token price through competitive bidding |
| **Whale/Fund Participation** | Structured auction format appeals to larger, institutional participants |
| **Controlled Access** | Can be gated or ungated depending on requirements |

## How It Works

1. **Auction Opens** - Users submit bids specifying quantity and price
2. **Bidding Period** - Bids accumulate (public or sealed)
3. **Auction Closes** - Bids are ranked by price, highest to lowest
4. **Clearing Price Set** - Price where total bid quantity equals available tokens
5. **Allocation** - Winners receive tokens, all pay the clearing price

### Clearing Price Example

```
Available tokens: 1,000,000
Bids received:
  - Bidder A: 500,000 tokens @ 0.001 SOL
  - Bidder B: 300,000 tokens @ 0.0008 SOL
  - Bidder C: 400,000 tokens @ 0.0006 SOL

Ranking (highest price first):
  1. Bidder A: 500,000 @ 0.001 SOL    (running total: 500,000)
  2. Bidder B: 300,000 @ 0.0008 SOL   (running total: 800,000)
  3. Bidder C: 400,000 @ 0.0006 SOL   (running total: 1,200,000)

Clearing price: 0.0006 SOL (Bidder C's price fills the auction)
Bidder C receives partial fill: 200,000 tokens
All winners pay 0.0006 SOL per token
```

## Comparison

| Feature | Launch Pool | Presale | Uniform Price Auction |
|---------|-------------|---------|----------------------|
| Price | Discovered at close | Fixed upfront | Clearing price |
| Distribution | Proportional | First-come-first-served | Highest bidders |
| User Action | Deposit | Deposit | Bid (price + quantity) |
| Best For | Fair distribution | Predictable outcome | Large participants |

## Notes

- Uniform Price Auctions are suited for larger token launches with institutional interest
- The clearing price mechanism ensures all winners get the same deal
- Sealed bids prevent bidders from gaming based on others' bids

{% callout type="note" %}
Detailed setup documentation for Uniform Price Auctions is coming soon. For now, see [Launch Pool](/smart-contracts/genesis/launch-pool) or [Presale](/smart-contracts/genesis/presale) for alternative launch mechanisms.
{% /callout %}

## FAQ

### What is a uniform price auction?
An auction where all winning bidders pay the same clearing price, regardless of their individual bid amounts. The clearing price is the lowest winning bid.

### How is the clearing price determined?
Bids are ranked by price from highest to lowest. The clearing price is set at the point where total bid quantity equals available tokens, with all winners paying this uniform price.

### Can bids be private?
Yes. Uniform Price Auctions support both public and private (sealed) bids depending on your configuration.

### When should I use a Uniform Price Auction?
Use it for price discovery with larger participants (whales, funds) who prefer structured auction formats over deposit-based launches.

## Glossary

| Term | Definition |
|------|------------|
| **Uniform Price Auction** | Auction where all winners pay the same clearing price |
| **Clearing Price** | The lowest winning bid price; paid by all winners |
| **Bid** | User's offer specifying token quantity and price per token |
| **Sealed Bid** | Private bid not visible to other participants |
| **Partial Fill** | When a bid is only partially satisfied due to limited supply |
| **Price Discovery** | Process of determining market value through bidding |

## Next Steps

- [Launch Pool](/smart-contracts/genesis/launch-pool) - Fair launch with proportional token distribution
- [Presale](/smart-contracts/genesis/presale) - Fixed-price token sale
- [Launch a Token](/tokens/launch-token) - End-to-end token launch guide
- [Genesis Overview](/smart-contracts/genesis) - Token launchpad concepts and architecture
