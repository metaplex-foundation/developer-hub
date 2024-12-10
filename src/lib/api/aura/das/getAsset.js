const getAsset = {
  description: 'Get an asset by its ID',
  method: 'getAsset',
  params: [
    {
      type: 'string',
      description: 'Public key of the asset',
      name: 'id',
      placeholder: 'Public key of the asset',
      required: true,
    },
  ],
  examples: [
    {
      name: 'Fetch Madlad #4221 (pNFT)',
      description: 'Get an asset by its ID',
      body: {
        params: {
          id: 'G3nEdTzAvPvSuj2Z5oSSiMN42NayQDZvkC3usMrnGaTi',
        },
      },
    },
    {
      name: 'Fetch Saga Monkes #6233 (cNFT)',
      description: 'Get an asset by its ID',
      body: {
        params: {
          id: 'H6GDZujkpEcxbpDgEbSbNFxNtSi3RBJPJC5GZCvzagaP',
        },
      },
    },
    {
      name: 'Fetch SMB Geb2 #121 (NFT)',
      description: 'Get an asset by its ID',
      body: {
        params: {
          id: '8aguf5d15kvHVsXyr8WfY73JgdQnWq1z6FhsUWqawivd',
        },
      },
    },
  ],
}

export default getAsset
