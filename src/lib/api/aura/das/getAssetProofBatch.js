const getAssetProofBatch = {
  description:
    'Get the proof of a compressed Digital Asset NFT (cNFT) by its ID',
  method: 'getAssetProofBatch',
  params: [
    {
      type: 'array',
      description: 'Public keys of the assets you want to fetch proofs for',
      name: 'id',
      value: [],
      required: true,
    },
  ],
}

export default getAssetProofBatch
