const searchAssets = {
  description: 'Search of Assets based on parameters',
  method: 'searchAssets',
  params: [
    {
      name: 'negate',
      type: 'boolean',
      description:
        'Indicates whether the search criteria should be inverted or not.',
    },
    {
      name: 'conditionType',
      type: 'option',
      value: ['all', 'any'],
      description:
        'Indicates whether to retrieve all ("all") or any ("any") asset that matches the search criteria.',
    },
    {
      name: 'interface',
      type: 'option',
      value: [
        'V1_NFT',
        'V1_PRINT',
        'LEGACY_NFT',
        'V2_NFT',
        'FungibleAsset',
        'Custom',
        'Identity',
        'Executable',
      ],
      description:
        'The interface value (one of ["V1_NFT", "V1_PRINT", "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"])',
    },
    {
      name: 'ownerAddress',
      type: 'string',
      description: 'The owner address of the asset',
    },
    {
      name: 'ownerType',
      type: 'option',
      description: 'Type of ownership',
      value: ['single', 'token'],
    },
    {
      name: 'creatorAddress',
      type: 'string',
      description: 'The creator address of the asset',
    },
    {
      name: 'createVerified',
      type: 'boolean',
      description: 'Indicates whether the creator must be verified or not.',
    },
    {
      name: 'authorityAddress',
      type: 'string',
      description: 'The authority address of the asset',
    },
    {
      name: 'grouping',
      type: 'arrayKeyValuePair',
      locked: true,
      length: 2,
      value: [],
    },
    {
      name: 'delegateAddress',
      type: 'string',
      description: 'The delegate address of the asset',
    },
    {
      name: 'frozen',
      type: 'boolean',
      description: 'Indicates whether the asset is frozen or not.',
    },
    {
      name: 'supply',
      type: 'number',
      description: 'The supply of the asset',
    },
    {
      name: 'supplyMint',
      type: 'string',
      description: 'The supply mint of the asset',
    },
    {
      name: 'compressed',
      type: 'boolean',
      description: 'Indicates whether the asset is compressed or not.',
    },
    {
      name: 'compressible',
      type: 'boolean',
      description: 'Indicates whether the asset is compressable or not.',
    },
    {
      name: 'royaltyTargetType',
      type: 'option',
      value: ['single', 'creators', 'fanout'],
      description: 'The royalty type of the asset',
    },
    {
      name: 'royaltyTarget',
      type: 'string',
      description: 'The target address for royalties',
    },
    {
      name: 'royaltyAmount',
      type: 'number',
      description: 'The royalty amount',
    },
    {
      name: 'burnt',
      type: 'boolean',
      description: 'Indicates whether the asset is burnt or not.',
    },
    {
      name: 'sortBy',
      type: 'object',
      description: 'Sorting criteria',
      value: {
        sortBy: {
          type: 'option',
          value: ['created', 'updated', 'recentAction', 'none'],
        },
        sortDirection: {
          type: 'option',
          value: ['asc', 'desc'],
        },
      },
    },
    {
      name: 'limit',
      type: 'number',
      description: 'Number of assets to return',
    },
    {
      name: 'page',
      type: 'number',
      description: 'The index of the "page" to retrieve.',
    },
    {
      name: 'before',
      type: 'string',
      description: 'Retrieve assets before the specified ID',
    },
    {
      name: 'after',
      type: 'string',
      description: 'Retrieve assets after the specified ID',
    },
    {
      name: 'jsonUri',
      type: 'string',
      description: 'The value of the JSON URI of the asset',
    },
  ],
}

export default searchAssets
