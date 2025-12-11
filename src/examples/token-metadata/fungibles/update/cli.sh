# Update Token Metadata using the Metaplex CLI

# Interactive editor mode (opens metadata JSON in your default editor)
mplx toolbox token update <MINT_ADDRESS> --editor

# Update specific fields via flags
mplx toolbox token update <MINT_ADDRESS> --name "New Token Name"
mplx toolbox token update <MINT_ADDRESS> --symbol "NEW"
mplx toolbox token update <MINT_ADDRESS> --description "Updated description"

# Update with new image
mplx toolbox token update <MINT_ADDRESS> --image ./new-image.png

# Update multiple fields at once
mplx toolbox token update <MINT_ADDRESS> \
  --name "Updated Token" \
  --symbol "UPD" \
  --description "An updated token description" \
  --image ./updated-image.png

# Note: You must be the update authority to update token metadata
# Note: --editor flag cannot be combined with other update flags
