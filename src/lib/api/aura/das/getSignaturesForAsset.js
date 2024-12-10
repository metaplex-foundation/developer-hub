const getSignaturesForAsset = {
  description:
    'Get the proof of a compressed Digital Asset NFT (cNFT) by its ID',
  method: 'getSignaturesForAsset',
  params: [
    {
      name: 'id',
      type: 'string',
      description: 'Public key of the asset',
      placeholder: 'Public key of the asset',
      required: true,
    },
    {
      name: 'page',
      type: 'number',
      description: 'The page to return',
      placeholder: 'The page to return',
    },
    {
      name: 'limit',
      type: 'number',
      description:
        'Amount of signatures to return. Default is 1000. Max is 1000',
      placeholder: 'Amount',
    },
    {
      name: 'before',
      type: 'string',
      description: 'Return results before signature with this ID',
      placeholder: 'Signature ID',
    },
    {
      name: 'after',
      type: 'string',
      description: 'Return results after signature with this ID',
      placeholder: 'Signature ID',
    },
  ],
  examples: [
    {
      name: 'Fetch signatures of Saga Monkes #6233 (cNFT)',
      description: 'Fetch the signatures associated with an asset by its ID',
      body: {
        params: {
          id: 'H6GDZujkpEcxbpDgEbSbNFxNtSi3RBJPJC5GZCvzagaP',
        },
      },
    },
  ],
}

export default getSignaturesForAsset
