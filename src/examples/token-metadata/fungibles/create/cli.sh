# Create a Fungible Token using the Metaplex CLI

# Interactive wizard mode (recommended for beginners)
mplx toolbox token create --wizard

# Basic token creation (required: --name, --symbol, --mint-amount)
mplx toolbox token create \
  --name "My Token" \
  --symbol "MYT" \
  --mint-amount 1000000

# Full token creation with all options
mplx toolbox token create \
  --name "My Token" \
  --symbol "MYT" \
  --description "A fungible token on Solana" \
  --image ./token-image.png \
  --decimals 9 \
  --mint-amount 1000000000000000

# Note: mint-amount is in smallest units
# With --decimals 9, to mint 1,000,000 tokens: --mint-amount 1000000000000000
# With --decimals 0 (default), to mint 1,000,000 tokens: --mint-amount 1000000
