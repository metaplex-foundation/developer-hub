# Buy tokens — SOL is wrapped automatically
# --buyAmount is in lamports (1 SOL = 1000000000)
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 1000000000

# With custom slippage (100 bps = 1%)
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 1000000000 --slippage 100
