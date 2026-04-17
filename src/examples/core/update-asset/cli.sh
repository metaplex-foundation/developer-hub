# Update name and URI
mplx core asset update <assetId> --name "Updated Asset" --uri "https://example.com/metadata.json"

# Update with a JSON metadata file
mplx core asset update <assetId> --offchain ./asset/metadata.json

# Update with a new image
mplx core asset update <assetId> --image ./asset/image.jpg

# Update with JSON metadata and image
mplx core asset update <assetId> --offchain ./asset/metadata.json --image ./asset/image.jpg
