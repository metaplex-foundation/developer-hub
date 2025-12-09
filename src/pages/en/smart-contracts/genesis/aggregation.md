---
title: Aggregation API
metaTitle: Genesis - Aggregation API
description: API endpoint for aggregating Genesis launch data for trading terminals and external services.
---

# Aggregation API

Genesis provides an HTTP API endpoint that allows trading terminals, aggregators, and other external services to fetch structured data about token launches. This enables platforms like Dexscreener and other trading terminals to display accurate launch information.

## Endpoint

```
GET https://metaplex.com/genesis/<genesis_account>
```

Replace `<genesis_account>` with the public key of the Genesis account you want to query.

## Response Structure

The API returns a JSON object containing all relevant information about a token launch:

```json
{
    "launch_page": "https://launchpage.com",
    "type": "launchpool",
    "genesis_address": "GenesisAccountPublicKey...",
    "symbol": "MTK",
    "image": "https://example.com/token-image.png",
    "name": "My Token",
    "description": "A description of the token and its purpose.",
    "mint": "TokenMintPublicKey...",
    "website_url": "https://mytoken.com",
    "socials": {
        "twitter": "https://x.com/mytoken",
        "telegram": "https://t.me/mytoken",
        "discord": "https://discord.gg/mytoken"
    }
}
```

## Field Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `launch_page` | string | URL to the launch page where users can participate in the token launch |
| `type` | string | The type of launch (e.g., `"launchpool"`, `"presale"`, `"bonding_curve"`) |
| `genesis_address` | string | The public key of the Genesis account |
| `symbol` | string | Token symbol (e.g., `"MTK"`) |
| `image` | string | URL to the token's image/logo |
| `name` | string | Full name of the token |
| `description` | string | Description of the token and its purpose |
| `mint` | string | The SPL token mint address |
| `website_url` | string | Official website URL for the project |

### Optional Fields (Socials)

The `socials` object contains optional social media links. These fields are based on what's available for display on trading terminals like Dexscreener:

| Field | Type | Description |
|-------|------|-------------|
| `socials.twitter` | string | Twitter/X profile URL |
| `socials.telegram` | string | Telegram group/channel URL |
| `socials.discord` | string | Discord server invite URL |

## Launch Types

The `type` field indicates what kind of token launch mechanism is being used:

| Type | Description |
|------|-------------|
| `launchpool` | A launch pool where users can participate in token distribution |
| `presale` | A presale event with pre-deposits before trading begins |
| `bonding_curve` | A bonding curve launch with dynamic pricing |

## Multiple Launches Per Token

A single token mint can have multiple Genesis accounts associated with it, representing different rounds of funding or distribution events. Each Genesis account has its own unique address and can be queried independently.

To get all launches for a specific token, query each Genesis account separately using its address.

## Example Usage

### cURL

```bash
curl https://metaplex.com/genesis/GenesisAccountPublicKey...
```

### JavaScript/TypeScript

```typescript
async function getGenesisLaunchData(genesisAccount: string) {
  const response = await fetch(
    `https://metaplex.com/genesis/${genesisAccount}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch launch data: ${response.status}`);
  }

  return response.json();
}

// Usage
const launchData = await getGenesisLaunchData('GenesisAccountPublicKey...');

console.log('Token:', launchData.name);
console.log('Symbol:', launchData.symbol);
console.log('Launch Page:', launchData.launch_page);
console.log('Type:', launchData.type);

if (launchData.socials.twitter) {
  console.log('Twitter:', launchData.socials.twitter);
}
```

### Python

```python
import requests

def get_genesis_launch_data(genesis_account: str) -> dict:
    url = f"https://metaplex.com/genesis/{genesis_account}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

# Usage
launch_data = get_genesis_launch_data("GenesisAccountPublicKey...")

print(f"Token: {launch_data['name']}")
print(f"Symbol: {launch_data['symbol']}")
print(f"Launch Page: {launch_data['launch_page']}")
print(f"Type: {launch_data['type']}")

if launch_data.get('socials', {}).get('twitter'):
    print(f"Twitter: {launch_data['socials']['twitter']}")
```

## Integration Notes

### For Trading Terminals

Trading terminals can use this API to:

- Display token information before the liquidity pool is live
- Show the launch page for users to participate
- Link to official social media channels
- Verify token metadata from the source of truth

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Token Launch  │────▶│  Genesis API    │────▶│ Trading Terminal│
│   (Launchpad)   │     │  Aggregation    │     │  (Dexscreener)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
    Token created         Returns launch         Displays token
    with metadata         data as JSON           info to users
```

{% callout type="note" %}
**Source of Truth**: Before the DEX liquidity pool is funded, trading terminals use this API as the source of truth for token information. Once the pool is live and paid on platforms like Dexscreener, those platforms become the primary source.
{% /callout %}

## Error Responses

| Status Code | Description |
|-------------|-------------|
| `200` | Success - returns the launch data JSON |
| `404` | Genesis account not found |
| `400` | Invalid Genesis account address format |
| `500` | Internal server error |

## Related

- [Getting Started](/smart-contracts/genesis/getting-started) - Initialize your Genesis account
- [Vault Deposits](/smart-contracts/genesis/vault-deposits) - Configure presale deposits
- [Bonding Curves](/smart-contracts/genesis/bonding-curves) - Set up dynamic pricing
- [Raydium Graduation](/smart-contracts/genesis/raydium-graduation) - Graduate to DEX liquidity
