curl -X POST <DAS_ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "agentToken": "TOKEN_MINT_ADDRESS",
      "interface": "MplCoreAsset",
      "limit": 1
    }
  }'
