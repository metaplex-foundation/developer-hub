const getAssetProof = {
    description: 'Get the proof of a compressed Digital Asset NFT (cNFT) by its ID',
    method: 'getAssetProofs',
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
        name: 'Saga Monkes #6233 (cNFT V1)',
        chain: 'solanaMainnet',
        description: 'Get an asset proof by its ID',
        body: {
          params: {
            id: 'H6GDZujkpEcxbpDgEbSbNFxNtSi3RBJPJC5GZCvzagaP',
          },
        },
      },
      {
        name: 'Metaplex Test (cNFT V1)',
        chain: 'solanaDevnet',
        description: 'Get an asset proof by its ID',
        body: {
          params: {
            id: 'E1hi4uEdfe9gai3Y1Vg5eSA8A2oxotVUWv5LtVJXxxpv',
          },
        },
      },
    ],
    exampleResponse: {
      "jsonrpc": "2.0",
      "result": {
        "root": "55bo42a5Vz9pKsuXybLBDDijfL15aZ8yo4YvCKivsswm",
        "proof": [
          "Wo8BxWavZxJkNYQvDf98kesxX4Yket1PRdLna4hNXxc",
          "9i9ZcT1KLf9sqx7TzT9AkkAkxAE4yfrWjcuGGrAtpJde",
          "Bco6o8YsbVvL5RJeRX9gBwvVr3B1xCtSkFAbbsNwFWvW",
          "7vSEygK2aWtjPC11gNLGzdXdATG3B8DwdZqtcpzJNKjB",
          "5QxNqt6Ekv5bQaPxgn4cnmqYPpRjg4FHjofXrGvN35L5",
          "BYebt3P7jCHgTdPvdyJ4DzbeoKj3VEGs6Wv7g9tzWBHK",
          "AWk4KY6f7wmcdWuhgSk1jQxEm8GeYA7aRFw6CoLKGtc5",
          "BMkbYSoj6t2VFGHP5oDi1YKTRqKm6DAeyKSNJq3BpeKD",
          "DeD9EasMhdyZB6Lsgp5xfwxFkhf66tScSH4X3eEuNmKR",
          "9XeVtw7o4TJZoqjSvJuv8fGjX33n6BWprSogmEjckb9A",
          "DBmErTVKEMHEsHcc3M7tDNQKGWerVd3a3ihXwq3JSt7R",
          "6VTjVoMRMgxE7SCmTeyNEguzetfBsCtoSD6Zt27Q68m5",
          "6LMPcGLfMVJz3mGdh9NPUxRsnNLdqMMptEzpFNP8mRFm",
          "DaDD5eZcLV2Cev4yLTc3zeqNyMXDAoR7jLjfGC4smQE8"
        ],
        "node_index": 22585,
        "leaf": "8uKWwYxK7imdvHSPthAVJhidAh5EwuvahdW3BpMYXaz8",
        "tree_id": "2uH9TkmYkAKGrK7EPnd4Y7JVYswpQ2aED9deMn8QoYVy"
      },
      "id": "1"
    }
  }
  
  export default getAssetProof
  