# Get all fungible tokens owned by a wallet using searchAssets
# Using interface: "FungibleToken" filters server-side (more efficient)
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "GfK2Xz6pzQp1sC1FvxePKnikZA7iyaCSVXZykixLjem5",
      "interface": "FungibleToken",
      "options": {
        "showFungible": true
      }
    }
  }' \
  https://api.devnet.solana.com