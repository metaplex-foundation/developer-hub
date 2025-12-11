# Fetch an NFT using the Metaplex CLI

# Fetch asset by ID
mplx core fetch asset <assetId>

# Download all files to a directory
mplx core fetch asset <assetId> --download --output ./assets

# Download only the image
mplx core fetch asset <assetId> --download --image

# Download only the metadata
mplx core fetch asset <assetId> --download --metadata
