curl -X POST <DAS_ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "assetSigner": "ASSET_SIGNER_PDA_ADDRESS",
      "limit": 1
    }
  }'
