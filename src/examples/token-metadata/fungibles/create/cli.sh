# Create a Fungible Token using the Metaplex CLI

# Interactive wizard mode (recommended)
mplx toolbox token create --wizard

# Basic token creation
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000

# Full token creation with all options
mplx toolbox token create \
  --name "My Token" \
  --symbol "MYT" \
  --description "A fungible token on Solana" \
  --image "./token-image.png" \
  --decimals 9 \
  --mint-amount 1000000
