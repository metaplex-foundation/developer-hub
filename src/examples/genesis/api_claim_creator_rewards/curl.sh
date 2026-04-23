# Claim creator rewards. Response contains base64-encoded transactions
# the wallet (or payer) must sign and send.
curl -X POST https://api.metaplex.com/v1/creator-rewards/claim \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "CREATOR_FEE_WALLET_ADDRESS_HERE",
    "network": "solana-mainnet",
    "payer": "OPTIONAL_PAYER_ADDRESS_HERE"
  }'
