# Fetch an NFT using the DAS API
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAsset",
    "params": {
      "id": "<NFT Mint Address>"
    }
  }' \
  https://api.devnet.solana.com