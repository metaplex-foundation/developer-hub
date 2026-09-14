import Link from 'next/link'
import { useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'

const pageTitle = {
  en: 'Program Guides Index',
  ja: 'プログラムガイドインデックス',
  ko: '프로그램 가이드 인덱스',
  zh: '程序指南索引',
}

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
  name: {
    en: 'Bubblegum V1',
    ja: 'Bubblegum V1',
    ko: 'Bubblegum V1'
  },
  guides: [
    {
      name: {
        en: 'How to create 1000000 NFTs on Solana',
        ja: 'Solanaで100万NFTを作成する方法',
        ko: 'Solana에서 100만 NFT 만들기'
      },
      path: '/smart-contracts/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana',
      tags: [GuideTags.js, GuideTags.nfts],
    },
    {
      name: {
        en: 'How to interact with CNFTs on other SVMS',
        ja: '他のSVMでcNFTと相互作用する方法',
        ko: '다른 SVM에서 cNFT와 상호작용하는 방법'
      },
      path: '/smart-contracts/bubblegum/guides/javascript/how-to-interact-with-cnfts-on-other-svms',
      tags: [GuideTags.js, GuideTags.nfts],
    },
  ],
}

const bubblegumV2Guides = {
  name: {
    en: 'Bubblegum V2',
    ja: 'Bubblegum V2',
    ko: 'Bubblegum V2'
  },
  guides: [],
}

const candyMachineGuides = {
  name: {
    en: 'Candy Machine',
    ja: 'キャンディマシン',
    ko: '캔디 머신'
  },
  guides: [
    {
      name: {
        en: 'Airdrop Mint to Another Wallet',
        ja: '他のウォレットへのエアドロップミント',
        ko: '다른 지갑으로 에어드롭 민팅'
      },
      path: '/smart-contracts/candy-machine/guides/airdrop-mint-to-another-wallet',
      tags: [GuideTags.airdrop, GuideTags.nfts],
    },
    {
      name: {
        en: 'Create an NFT Collection on Solana with Candy Machine',
        ja: 'キャンディマシンでSolanaにNFTコレクションを作成',
        ko: '캔디 머신으로 Solana에서 NFT 컬렉션 만들기'
      },
      path: '/smart-contracts/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine',
      tags: [GuideTags.nfts],
    },
  ],
}

const coreGuides = {
  name: {
    en: 'Core',
    ja: 'Core',
    ko: 'Core'
  },
  guides: [
    {
      name: {
        en: 'Immutable NFTs',
        ja: '不変NFT',
        ko: '불변 NFT'
      },
      path: '/smart-contracts/core/guides/immutability',
      tags: [GuideTags.nfts],
    },
    {
      name: {
        en: 'Create Soulbound NFT Asset',
        ja: 'ソウルバウンドNFTアセットの作成',
        ko: '소울바운드 NFT 자산 생성'
      },
      path: '/smart-contracts/core/guides/create-soulbound-nft-asset',
      tags: [GuideTags.nfts],
    },
    {
      name: {
        en: 'Print Editions',
        ja: '印刷エディション',
        ko: '인쇄 에디션'
      },
      path: '/smart-contracts/core/guides/print-editions',
      tags: [GuideTags.nfts],
    },
    {
      name: {
        en: 'Oracle Plugin Example',
        ja: 'Oracleプラグインの例',
        ko: 'Oracle 플러그인 예제'
      },
      path: '/smart-contracts/core/guides/oracle-plugin-example',
      tags: [GuideTags.nfts],
    },
    {
      name: {
        en: 'Onchain Ticketing with AppData',
        ja: 'AppDataを使用したオンチェーンチケット',
        ko: 'AppData를 사용한 온체인 티켓팅'
      },
      path: '/smart-contracts/core/guides/onchain-ticketing-with-appdata',
      tags: [GuideTags.nfts],
    },
    {
      name: {
        en: 'How to create a Core NFT Asset with JavaScript',
        ja: 'JavaScriptでCore NFTアセットを作成する方法',
        ko: 'JavaScript로 Core NFT 자산 생성하는 방법'
      },
      path: '/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript',
      tags: [GuideTags.nfts, GuideTags.js],
    },
    {
      name: {
        en: 'How to create a Core Collection with Javascript',
        ja: 'JavaScriptでCoreコレクションを作成する方法',
        ko: 'JavaScript로 Core 컬렉션 생성하는 방법'
      },
      path: '/smart-contracts/core/guides/javascript/how-to-create-a-core-collection-with-javascript',
      tags: [GuideTags.nfts, GuideTags.js],
    },
    {
      name: {
        en: 'Web2 Typescript Staking Example',
        ja: 'Web2 TypeScriptステーキングの例',
        ko: 'Web2 TypeScript 스테이킹 예제'
      },
      path: '/smart-contracts/core/guides/javascript/web2-typescript-staking-example',
      tags: [GuideTags.nfts, GuideTags.js],
    },
    {
      name: {
        en: 'Loyalty Card Concept Guide',
        ja: 'ロイヤリティカードコンセプトガイド',
        ko: '로얄티 카드 컨셉트 가이드'
      },
      path: '/smart-contracts/core/guides/loyalty-card-concept-guide',
      tags: [GuideTags.nfts],
    },
    {
      name: {
        en: 'How to create a Core NFT Asset with Anchor',
        ja: 'AnchorでCore NFTアセットを作成する方法',
        ko: 'Anchor로 Core NFT 자산 생성하는 방법'
      },
      path: '/smart-contracts/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor',
      tags: [GuideTags.nfts, GuideTags.anchor, GuideTags.rust],
    },
    {
      name: {
        en: 'How to create a Core Collection with Anchor',
        ja: 'AnchorでCoreコレクションを作成する方法',
        ko: 'Anchor로 Core 컬렉션 생성하는 방법'
      },
      path: '/smart-contracts/core/guides/anchor/how-to-create-a-core-collection-with-anchor',
      tags: [GuideTags.nfts, GuideTags.anchor, GuideTags.rust],
    },
    {
      name: {
        en: 'Anchor Staking Example',
        ja: 'Anchorステーキングの例',
        ko: 'Anchor 스테이킹 예제'
      },
      path: '/smart-contracts/core/guides/anchor/anchor-staking-example',
      tags: [GuideTags.nfts, GuideTags.anchor, GuideTags.rust],
    },
  ],
}

const coreCandyMachineGuides = {
  name: {
    en: 'Core Candy Machine',
    ja: 'Coreキャンディマシン',
    ko: 'Core 캔디 머신'
  },
  guides: [
    {
      name: {
        en: 'Create a Core Candy Machine UI',
        ja: 'CoreキャンディマシンUIの作成',
        ko: 'Core 캔디 머신 UI 만들기'
      },
      path: '/smart-contracts/core-candy-machine/guides/create-a-core-candy-machine-ui',
      tags: [GuideTags.nfts, GuideTags.js],
    },
    {
      name: {
        en: 'Create a Core Candy Machine with Hidden Settings',
        ja: '非表示設定でCoreキャンディマシンを作成',
        ko: '숨겨진 설정으로 Core 캔디 머신 만들기'
      },
      path: '/smart-contracts/core-candy-machine/guides/create-a-core-candy-machine-with-hidden-settings',
      tags: [GuideTags.nfts],
    },
  ],
}

const fusionGuides = { 
  name: {
    en: 'Fusion',
    ja: 'Fusion',
    ko: 'Fusion'
  }, 
  guides: [] 
}
const hydraGuides = { 
  name: {
    en: 'Hydra',
    ja: 'Hydra',
    ko: 'Hydra'
  }, 
  guides: [] 
}
const inscriptionGuides = { 
  name: {
    en: 'Inscription',
    ja: 'Inscription',
    ko: 'Inscription'
  }, 
  guides: [] 
}
const mpl404Guides = { 
  name: {
    en: 'MPL404',
    ja: 'MPL404',
    ko: 'MPL404'
  }, 
  guides: [] 
}
const tokenAuthGuides = { 
  name: {
    en: 'Token Auth',
    ja: 'トークン認証',
    ko: '토큰 인증'
  }, 
  guides: [] 
}

const tokenMetadataGuides = {
  name: {
    en: 'Token Metadata',
    ja: 'トークンメタデータ',
    ko: '토큰 메타데이터'
  },
  guides: [
    {
      name: {
        en: 'Get NFTs By Collection',
        ja: 'コレクションでNFTを取得',
        ko: '컬렉션별 NFT 가져오기'
      },
      path: '/smart-contracts/token-metadata/guides/get-by-collection',
      tags: [GuideTags.nfts],
    },
    {
      name: {
        en: 'Account Size Reduction',
        ja: 'アカウントサイズ削減',
        ko: '계정 크기 축소'
      },
      path: '/smart-contracts/token-metadata/guides/account-size-reduction',
      tags: [GuideTags.nfts],
    },
    {
      name: {
        en: 'Create a Claimable Token Airdrop with MPL-Distro',
        ja: 'MPL-Distroを使用したクレームベースのトークンエアドロップ',
        ja: 'MPL-Distroを使用したクレームベースのトークンエアドロップ',
        ko: 'MPL-Distro를 사용한 클레임 기반 토큰 에어드롭',
        ko: 'MPL-Distro를 사용한 클레임 기반 토큰 에어드롭',
        zh: '使用 MPL-Distro 创建可领取的代币空投'
      },
      path: '/smart-contracts/mpl-distro/production-delivery',
      tags: [GuideTags.nfts, GuideTags.airdrop, GuideTags.tokens],
    },
    {
      name: {
        en: 'Token Claimer Smart Contract',
        ja: 'トークンクレーマースマートコントラクト',
        ko: '토큰 클레이머 스마트 컨트렉트'
      },
      path: '/smart-contracts/token-metadata/guides/anchor/token-claimer-smart-contract',
      tags: [GuideTags.tokens, GuideTags.anchor, GuideTags.rust],
    },
    {
      name: {
        en: 'Create an NFT',
        ja: 'NFTの作成',
        ko: 'NFT 생성'
      },
      path: '/smart-contracts/token-metadata/guides/javascript/create-an-nft',
      tags: [GuideTags.tokens, GuideTags.js],
    },
  ],
}

const umiGuides = {
  name: {
    en: 'Umi',
    ja: 'Umi',
    ko: 'Umi'
  },
  guides: [
    {
      name: {
        en: 'Optimal Transactions with Compute Units and Priority Fees',
        ja: 'コンピュートユニットとプライオリティ手数料を使用した最適なトランザクション',
        ko: '컴퓨트 유닛과 우선순위 수수료를 사용한 최적 트랜잭션'
      },
      path: '/dev-tools/umi/guides/optimal-transactions-with-compute-units-and-priority-fees',
      tags: [GuideTags.js],
    },
    {
      name: {
        en: 'Serializing and Deserializing Transactions',
        ja: 'トランザクションのシリアライズとデシリアライズ',
        ko: '트랜잭션 직렬화 및 역직렬화'
      },
      path: '/dev-tools/umi/guides/serializing-and-deserializing-transactions',
      tags: [GuideTags.js],
    },
  ],
}

const generalGuides = { 
  name: {
    en: 'General',
    ja: '一般',
    ko: '일반'
  }, 
  guides: [] 
}

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
  const { locale } = useLocale()

  const getLocalizedText = (textObj, fallback = '') => {
    if (typeof textObj === 'string') return textObj
    return textObj?.[locale] || textObj?.en || fallback
  }

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
                  selectedTag === value ? 'hsl(var(--primary))' : '#262626',
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

  const getLocalizedPath = (path) => {
    if (locale === 'en') return path
    return `/${locale}${path}`
  }

  return (
    <div>
      <h1>{getLocalizedText(pageTitle)}</h1>
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
              <li key={getLocalizedText(guideGroup.name)}>
                {getLocalizedText(guideGroup.name)}
                <ul>
                  {filteredGuides.map((guide) => (
                    <li key={getLocalizedText(guide.name)}>
                      <Link href={getLocalizedPath(guide.path)}>
                        {getLocalizedText(guide.name)}
                      </Link>
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
