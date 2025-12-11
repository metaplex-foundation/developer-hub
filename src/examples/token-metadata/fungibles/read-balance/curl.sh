# Get token balance for a wallet using DAS searchAssets
# Returns all fungible tokens - filter by mint address in response
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "<Wallet Address>",
      "interface": "FungibleToken",
      "options": {
        "showFungible": true
      }
    }
  }' \
  https://api.devnet.solana.com