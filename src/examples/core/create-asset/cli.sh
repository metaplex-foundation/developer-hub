# Create an NFT using the Metaplex CLI

# Interactive wizard mode (recommended)
mplx core asset create --wizard

# Simple creation with name and URI
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"

# Create with files (image + metadata)
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
