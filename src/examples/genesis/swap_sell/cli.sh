# Sell tokens — SOL is unwrapped automatically
# --sellAmount is in base token units (with decimals)
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000

# With custom slippage (100 bps = 1%)
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000 --slippage 100
