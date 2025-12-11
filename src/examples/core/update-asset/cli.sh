# Update an NFT using the Metaplex CLI

# Update name and URI
mplx core asset update <assetId> --name "Updated NFT" --uri "https://example.com/new-metadata.json"

# Update with new image
mplx core asset update <assetId> --image "./new-image.png"

# Update with JSON metadata file
mplx core asset update <assetId> --json "./metadata.json"

# Update with both JSON and image
mplx core asset update <assetId> --json "./metadata.json" --image "./new-image.png"
