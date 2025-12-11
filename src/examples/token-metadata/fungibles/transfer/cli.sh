# Transfer Tokens using the Metaplex CLI

# Usage: mplx toolbox token transfer <MINT_ADDRESS> <AMOUNT> <DESTINATION>
mplx toolbox token transfer <MINT_ADDRESS> <AMOUNT> <DESTINATION_ADDRESS>

# Example: Transfer 100 tokens (0 decimals)
mplx toolbox token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 100 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM

# Example: Transfer 100 tokens (9 decimals)
# Amount is in smallest units: 100 * 10^9 = 100000000000
mplx toolbox token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 100000000000 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM

# Note: If the destination doesn't have a token account, it will be created automatically
