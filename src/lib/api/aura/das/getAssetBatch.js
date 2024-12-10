const getAssetBatch = {
  description: 'Get an asset by its ID',
  method: 'getAssetBatch',
  params: [
    {
      type: 'array',
      description: 'Public keys of the Assets to fetch',
      name: 'ids',
      value: [""],
      required: true,
      placeHolder: "Asset Public Key"
    },
  ],
}

export default getAssetBatch
