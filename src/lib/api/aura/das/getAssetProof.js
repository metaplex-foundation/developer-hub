const getAssetProof = {
    description: 'Get the proof of a compressed Digital Asset NFT (cNFT) by its ID',
    method: 'getAssetProof',
    params: [
      {
        type: 'string',
        description: 'Public key of the asset',
        name: 'id',
        placeholder: 'Public key of the asset',
        required: true
      },
    ],
    examples: [
      {
        name: 'Fetch asset proof of Saga Monkes #6233 (cNFT)',
        description: 'Get an asset by its ID',
        body: {
          params: {
            id: 'H6GDZujkpEcxbpDgEbSbNFxNtSi3RBJPJC5GZCvzagaP',
          },
        },
      },
    ],
  }
  
  export default getAssetProof
  