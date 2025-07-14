import { useState } from 'react'

const GuideTags = {
  js: 'javascript',
  // ts: 'typescript', // TODO: add typescript guides
  rust: 'rust',
  anchor: 'anchor',
  // shank: 'shank', // TODO: add shank guides
  tokens: 'tokens',
  nfts: 'nfts',
  airdrop: 'airdrop',
}

const bubblegumV1Guides = {
  name: 'Bubblegum V1',
  guides: [
    {
      name: 'How to create 1000000 NFTs on Solana',
      path: '/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana',
      tags: [GuideTags.js, GuideTags.nfts],
    },
    {
      name: 'How to interact with CNFTs on other SVMS',
      path: '/bubblegum/guides/javascript/how-to-interact-with-cnfts-on-other-svms',
      tags: [GuideTags.js, GuideTags.nfts],
    },
  ],
}

const bubblegumV2Guides = {
  name: 'Bubblegum V2',
  guides: [],
}

const candyMachineGuides = {
  name: 'Candy Machine',
  guides: [
    {
      name: 'Airdrop Mint to Another Wallet',
      path: '/candy-machine/guides/airdrop-mint-to-another-wallet',
      tags: [GuideTags.airdrop, GuideTags.nfts],
    },
    {
      name: 'Create an NFT Collection on Solana with Candy Machine',
      path: '/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine',
      tags: [GuideTags.nfts],
    },
  ],
}

const coreGuides = {
  name: 'Core',
  guides: [
    {
      name: 'Immutable NFTs',
      path: '/core/guides/immutability',
      tags: [GuideTags.nfts],
    },
    {
      name: 'Create Soulbound NFT Asset',
      path: '/core/guides/create-soulbound-nft-asset',
      tags: [GuideTags.nfts],
    },
    {
      name: 'Print Editions',
      path: '/core/guides/print-editions',
      tags: [GuideTags.nfts],
    },
    {
      name: 'Oracle Plugin Example',
      path: '/core/guides/oracle-plugin-example',
      tags: [GuideTags.nfts],
    },
    {
      name: 'Onchain Ticketing with AppData',
      path: '/core/guides/onchain-ticketing-with-appdata',
      tags: [GuideTags.nfts],
    },
    {
      name: 'How to create a Core NFT Asset with JavaScript',
      path: '/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript',
      tags: [GuideTags.nfts, GuideTags.js],
    },
    {
      name: 'How to create a Core Collection with Javascript',
      path: '/core/guides/javascript/how-to-create-a-core-collection-with-javascript',
      tags: [GuideTags.nfts, GuideTags.js],
    },
    {
      name: 'Web2 Typescript Staking Example',
      path: '/core/guides/web2-typescript-staking-example',
      tags: [GuideTags.nfts, GuideTags.js],
    },
    {
      name: 'Loyalty Card Concept Guide',
      path: '/core/guides/loyalty-card-concept-guide',
      tags: [GuideTags.nfts],
    },
    {
      name: 'How to create a Core NFT Asset with Anchor',
      path: '/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor',
      tags: [GuideTags.nfts, GuideTags.anchor, GuideTags.rust],
    },
    {
      name: 'How to create a Core Collection with Anchor',
      path: '/core/guides/anchor/how-to-create-a-core-collection-with-anchor',
      tags: [GuideTags.nfts, GuideTags.anchor, GuideTags.rust],
    },
    {
      name: 'Anchor Staking Example',
      path: '/core/guides/anchor/anchor-staking-example',
      tags: [GuideTags.nfts, GuideTags.anchor, GuideTags.rust],
    },
  ],
}

const coreCandyMachineGuides = {
  name: 'Core Candy Machine',
  guides: [
    {
      name: 'Create a Core Candy Machine UI',
      path: '/core-candy-machine/guides/create-a-core-candy-machine-ui',
      tags: [GuideTags.nfts, GuideTags.js],
    },
    {
      name: 'Create a Core Candy Machine with Hidden Settings',
      path: '/core-candy-machine/guides/create-a-core-candy-machine-with-hidden-settings',
      tags: [GuideTags.nfts],
    },
  ],
}

const fusionGuides = { name: 'Fusion', guides: [] }
const hydraGuides = { name: 'Hydra', guides: [] }
const inscriptionGuides = { name: 'Inscription', guides: [] }
const mpl404Guides = { name: 'MPL404', guides: [] }
const tokenAuthGuides = { name: 'Token Auth', guides: [] }

const tokenMetadataGuides = {
  name: 'Token Metadata',
  guides: [
    {
      name: 'Get NFTs By Collection',
      path: '/token-metadata/guides/get-by-collection',
      tags: [GuideTags.nfts],
    },
    {
      name: 'Account Size Reduction',
      path: '/token-metadata/guides/account-size-reduction',
      tags: [GuideTags.nfts],
    },
    {
      name: 'Spl Token Claim Airdrop Using Gumdrop',
      path: '/guides/general/spl-token-claim-airdrop-using-gumdrop',
      tags: [GuideTags.nfts, GuideTags.airdrop, GuideTags.tokens],
    },
    {
      name: 'Token Claimer Smart Contract',
      path: '/token-metadata/guides/anchor/token-claimer-smart-contract',
      tags: [GuideTags.tokens, GuideTags.anchor, GuideTags.rust],
    },
    {
      name: 'Create an NFT',
      path: '/token-metadata/guides/javascript/create-an-nft',
      tags: [GuideTags.tokens, GuideTags.js],
    },
  ],
}

const umiGuides = {
  name: 'Umi',
  guides: [
    {
      name: 'Optimal Transactions with Compute Units and Priority Fees',
      path: '/umi/guides/optimal-transactions-with-compute-units-and-priority-fees',
      tags: [GuideTags.js],
    },
    {
      name: 'Serializing and Deserializing Transactions',
      path: '/umi/guides/serializing-and-deserializing-transactions',
      tags: [GuideTags.js],
    },
  ],
}

const generalGuides = { name: 'General', guides: [] }

const guideGroups = [
  bubblegumV1Guides,
  bubblegumV2Guides,
  candyMachineGuides,
  coreCandyMachineGuides,
  coreGuides,
  fusionGuides,
  hydraGuides,
  inscriptionGuides,
  mpl404Guides,
  tokenAuthGuides,
  tokenMetadataGuides,
  umiGuides,
  generalGuides,
]

const GuideIndexComponent = () => {
  const [selectedTag, setSelectedTag] = useState()

  const TagPicker = () => (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '10px',
        }}
      >
        {Object.entries(GuideTags)
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map(([key, value]) => (
            <div
              style={{
                cursor: 'pointer',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRadius: '5px',
                color: selectedTag === value ? 'black' : 'white',
                backgroundColor:
                  selectedTag === value ? 'var(--color-accent-400)' : '#262626',
              }}
              onClick={() =>
                selectedTag === value ? setSelectedTag(undefined) : setSelectedTag(value)
              }
              key={value}
            >
              {value}
            </div>
          ))}
      </div>
    </div>
  )

  return (
    <div>
      <h1>Program Guides Index</h1>
      <TagPicker />
      <ul>
        {guideGroups.map((guideGroup) => {
          const filteredGuides = guideGroup.guides.filter((guide) => {
            if (selectedTag === undefined) {
              return true
            }
            return guide.tags.some((guideTag) => guideTag === selectedTag)
          })
          if (filteredGuides.length > 0) {
            return (
              <li key={guideGroup.name}>
                {guideGroup.name}
                <ul>
                  {filteredGuides.map((guide) => (
                    <li key={guide.name}>
                      <a href={guide.path}>{guide.name}</a>
                    </li>
                  ))}
                </ul>
              </li>
            )
          }
          return null
        })}
      </ul>
    </div>
  )
}

export default GuideIndexComponent
