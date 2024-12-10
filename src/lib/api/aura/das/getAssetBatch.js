const getAssetBatch = {
  description: 'Get an asset by its ID',
  method: 'getAssetBatch',
  params: [
    {
      type: 'array',
      description: 'Public keys of the Assets to fetch',
      name: 'id',
      value: [""],
      required: true,
    },
  ],
}

export default getAssetBatch
