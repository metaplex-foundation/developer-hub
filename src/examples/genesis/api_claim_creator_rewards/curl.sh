# Claim creator rewards. Response contains base64-encoded transactions
# the wallet (or payer) must sign and send.
curl -X POST https://api.metaplex.com/v1/creator-rewards/claim \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "CREATOR_FEE_WALLET_ADDRESS_HERE",
    "network": "solana-mainnet"
  }'

# Add "payer" when the creator fee wallet does not hold SOL (e.g. an agent PDA):
#   "payer": "PAYER_WALLET_ADDRESS_HERE"
