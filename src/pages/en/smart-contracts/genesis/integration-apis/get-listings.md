---
title: Get Listings
metaTitle: Genesis - Get Listings | REST API | Metaplex
description: Get active and upcoming Genesis launch listings. Returns a paginated list of launches with metadata.
method: GET
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - listings
  - active launches
  - launch directory
about:
  - API endpoint
  - Launch listings
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Retrieve active and upcoming Genesis launch listings. Returns a paginated list of launches with their metadata, token info, and social links. {% .lead %}

## Endpoint

```
GET /listings
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | `string` | No | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `status` | `string` | No | Filter by status: `active`, `upcoming`, `completed`. Default: returns all. |
| `limit` | `number` | No | Number of results per page. Default: `20`. Max: `100`. |
| `offset` | `number` | No | Number of results to skip for pagination. Default: `0`. |

## Example Request

```bash
curl "https://api.metaplex.com/v1/listings?status=active&limit=10"
```

## Response

```json
{
  "data": {
    "listings": [
      {
        "launch": {
          "launchPage": "https://example.com/launch/mytoken",
          "type": "launchpool",
          "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
        },
        "baseToken": {
          "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "name": "My Token",
          "symbol": "MTK",
          "image": "https://example.com/token-image.png",
          "description": "A community-driven token for the example ecosystem."
        },
        "website": "https://example.com",
        "socials": {
          "x": "https://x.com/mytoken",
          "telegram": "https://t.me/mytoken",
          "discord": "https://discord.gg/mytoken"
        },
        "status": "active"
      }
    ],
    "total": 42,
    "limit": 10,
    "offset": 0
  }
}
```

## Response Type

### TypeScript

```ts
interface ListingEntry {
  launch: Launch;
  baseToken: BaseToken;
  website: string;
  socials: Socials;
  status: "active" | "upcoming" | "completed";
}

interface ListingsResponse {
  data: {
    listings: ListingEntry[];
    total: number;
    limit: number;
    offset: number;
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ListingEntry {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ListingsData {
    pub listings: Vec<ListingEntry>,
    pub total: u64,
    pub limit: u64,
    pub offset: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ListingsResponse {
    pub data: ListingsData,
}
```

## Usage Examples

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/listings?status=active&limit=10"
);
const { data }: ListingsResponse = await response.json();
console.log(`${data.total} total listings`);
data.listings.forEach((entry) => {
  console.log(entry.baseToken.name, entry.status);
});
```

### Rust

```rust
let response: ListingsResponse = reqwest::get(
    "https://api.metaplex.com/v1/listings?status=active&limit=10"
)
.await?
.json()
.await?;

println!("{} total listings", response.data.total);
```

## Pagination

Use `limit` and `offset` to paginate through results:

```bash
# First page
curl "https://api.metaplex.com/v1/listings?limit=20&offset=0"

# Second page
curl "https://api.metaplex.com/v1/listings?limit=20&offset=20"
```

The `total` field in the response indicates the total number of matching listings.
