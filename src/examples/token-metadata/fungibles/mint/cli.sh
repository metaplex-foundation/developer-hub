# Mint Additional Tokens using the Metaplex CLI

# Mint tokens to your own wallet (default)
# Usage: mplx toolbox token mint <MINT_ADDRESS> <AMOUNT>
mplx toolbox token mint <MINT_ADDRESS> <AMOUNT>

# Mint tokens to a specific recipient
mplx toolbox token mint <MINT_ADDRESS> <AMOUNT> --recipient <RECIPIENT_ADDRESS>

# Example: Mint 1000 tokens (0 decimals) to your wallet
mplx toolbox token mint 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 1000

# Example: Mint 1000 tokens (9 decimals) to your wallet
# Amount is in smallest units: 1000 * 10^9 = 1000000000000
mplx toolbox token mint 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 1000000000000

# Example: Mint tokens to another wallet
mplx toolbox token mint 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 1000 \
  --recipient 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM

# Note: You must be the mint authority to mint additional tokens
