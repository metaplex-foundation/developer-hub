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
      chain: "solanaMainnet",
      body: {
        params: {
          id: 'H6GDZujkpEcxbpDgEbSbNFxNtSi3RBJPJC5GZCvzagaP',
        },
      },
    },
    {
      name: 'Metaplex Test (cNFT V1)',
      chain: 'solanaDevnet',
      description: 'Get an asset by its ID',
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
      "total": 26,
      "limit": 1000,
      "before": "102852",
      "after": "6202",
      "items": [
        [
          "ku1YghMvsszXcLSGCHTCqZcDh1tRaJV9NmYysgW8xJFBnbHsaGmXrLZWNpW84btE5LFT2ugEibBnHFqR7Ga1dEW",
          "Transfer"
        ],
        [
          "2cjTJnmHeGj54d2CKhxbYyzu4iwGSSd4BdvxMEWkBZ59wx4GMNz9qwBETjdnc799h6nexctbtAKEUHwnSWWPynHP",
          "Transfer"
        ],
        [
          "5VYXhQ1hCmAbYxhXppCDAA2mcstGSp9n5f2aY3RH2ZjSdsVhNVGy99f2Mcnc1qLgGS99gvGCgVXnhwzALszeUEzg",
          "Transfer"
        ],
        [
          "65uJ7B2Za5iEbnC3EuqD5FSZzr6pSmAFAc9kQGEcKqvXuZmtgzzKksBgDSfcA6RdGyBKNLquYq6vRBVx77v7ACK8",
          "Transfer"
        ],
        [
          "35QGhF8HZ9jJdGKbF4wCJ7dWYeDJAq6sGdo5jDWfnf9z5QJiobS7fu4ZYEk4FmNMvxk6Q3B2Mzz4dUahhzQXi4jp",
          "UpdateMetadata"
        ],
        [
          "3acoPpA8r6fFvgouphrX8AZs4YycHzSHbZG455DABWaMQTG72nRTgh1Ngvr9bTShaokyx6uH4WpwhdyEPTd61uLY",
          "Transfer"
        ],
        [
          "3ybYGksQYM289onorCzpGb2iVykH76UQ6iLWuEDkom2pkW4bNZ9Z3tLWEPiMZaHHQkEshz3Szy1L3sSYAHNUuZTw",
          "Transfer"
        ],
        [
          "3W1fGLVeHqr5o8KFAyV53uUHQGjbi4EWkmukT6peZFXScReu35M1TRiUdqGYxcUCE8nUMHtWro6KZF7Fp5scUDUL",
          "Transfer"
        ],
        [
          "65pT3upbbd9fFqLDkVGU4Txe92xvCPntr32cBsqFG8UAcSTY1EoZT7v39ZKXmP6iLGdDn14iHnzzt9woc8Rg55Ps",
          "Transfer"
        ],
        [
          "5YfJqdyGfDeFEtvrXVgJgp78ZktjCCPG3oHtoDgwvhwP1jHYspdQcVWn8YaNsDo3978McgF7NHpBzG8fiGM9pAUB",
          "Transfer"
        ],
        [
          "5Hkc9E1RcW7joxj6VCCRAV91mrkKbaUjTLNPTTdXKxNCKGPvTcJNkg6rBk3yQHczc3DKzMHvXyARKXW8iDTkUijU",
          "Transfer"
        ],
        [
          "iuMcrfwQs6DZmYXhdjHMEAbSxBEqe3TZRjxbTH21QncsdvGJxbahVpfuPQsqRCsjx9WZrPQUVVTEk3abR6RPV9x",
          "Transfer"
        ],
        [
          "5sWWSAN3XTdaER9zSGf4duBWWXdRjnW6emjBsNmntBFxcw1EqRva64X6ouACc9fupCJAa6VVj6tHFxtPZkaMLnzt",
          "Transfer"
        ],
        [
          "ML3D7hHyYv29uki13o53sbQwnkV2qADJxocEEqPXT5GS2H612MKbLBXEv31QUAQxXn5EHpUmnqmoumS7ju4sduv",
          "Transfer"
        ],
        [
          "88JcrzFgGgSB3JvzAE9V1Rw158M7tY3HaG8vAfRE55yR3ZNFjMFbNFayAT3BzC56YK9mP31oTH6yMfn948cEHZt",
          "Transfer"
        ],
        [
          "2NBrzfVKWDnvm7mdAZ7VC5FxfXM2pgAZtAFthkYtDPL6Wbh8XvKkTQUiWUrhz7DD4NH7RzDxEmRaDFLoFWwQRK6k",
          "Transfer"
        ],
        [
          "NvbTkDe4GAvMXW9yud9GDmzhrLKVBypJkHpveN99s41ieuWrPHnZcwqbL5zUaXGESWx6YmVdgyyPrbt5fA1dTxg",
          "Transfer"
        ],
        [
          "21fMgxF7AYsDuJ7qAsDZwkPzE5MKHEtTxihfPp2Df4jMCSVN89ihsL5BpDepkTdWA35RkwS95YyN5sg6xopDTyku",
          "Transfer"
        ],
        [
          "2BGd8CSCXr8TbCjzZ9wDANErggZnBKRVkwJJsFS8mGjphenF8ubo25pCXug77ejomtjxy3PAJegLMhd9nC9kQyRs",
          "Transfer"
        ],
        [
          "idmLXJSXBqk4GyxXGG7Jt3kN7iocuzS9S9WFLAyh7hMqQXEDoMe9dQEx4ZduPA5vyXgVC4e8pNBsxoHQEridZ9Z",
          "Transfer"
        ],
        [
          "2cPinwrSXqkcnc1a2f8jqH9HwtGjVaFoGUFgX5ngs9ReQkf762SjwtWSr38Z6Mw42yPk1iNp4rxmVZ5AHbWRDjzp",
          "Transfer"
        ],
        [
          "5EG6nGd19D7w8iKTZW3j4LrGcPL25Vb8DgC1ow3eSxRc6pt5zjhjVKmUqMmzJhzbWF6CnyfU3eE9uUdj74hP7pBX",
          "Transfer"
        ],
        [
          "4CGNUpVBBb5GxkJ5wjfBYMzFBCzJYmDxLKrycqyTcXKigU1zyifTbUze7qwoYngQmGRsoeUSTgzTH3fC5hMwqMXL",
          "Transfer"
        ],
        [
          "pT7iNQXjdSpnLWFT3FWgpjjUZpDxqXGcdV6zuom3AoRhT1XHxggCQPaVNnwZDHo2xyrqi6CJ6atQDyA9zdZgqeA",
          "Transfer"
        ],
        [
          "3rG9cE8SZ3g9yVxjbBwtJoP91cxAe5NMjKLTrocqfz4ThLB5DUWmHKSUiaWHKMiYYwsLuFCuaL7yWLYSRT946fAh",
          "Transfer"
        ],
        [
          "3mCjD5iVXMaV2YwmKxUzHVu3WkGggzEa23BVwdu2Nx5Ef7gwzXQSnspZZrtu8xVbddm1LJsjuaenGbtapFeDQXZL",
          "MintToCollectionV1"
        ]
      ]
    },
    "id": "1"
  }
}

export default getSignaturesForAsset
