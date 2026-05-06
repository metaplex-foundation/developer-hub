# Claim creator rewards across all your bonding-curve and Raydium buckets.
# Defaults the wallet to the configured signer; network is auto-detected from RPC.
mplx genesis claim-creator-rewards

# Claim on behalf of a different creator fee wallet (you still pay fees).
mplx genesis claim-creator-rewards --wallet <CREATOR_FEE_WALLET>

# Force devnet and a specific API base URL.
mplx genesis claim-creator-rewards --network solana-devnet --apiUrl https://api.metaplex.dev
