import {
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections';
import { FolderIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';
import { buildProductTranslations } from '@/config/navigation-translations';

export const bubblegumv2 = {
  name: 'Bubblegum v2',
  headline: 'Improved Compressed NFTs',
  description: 'NFTs that scale to new orders of magnitude.',
  path: 'smart-contracts/bubblegum-v2',
  navigationMenuCatergory: 'Smart Contracts',
  icon: <FolderIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-bubblegum',
  className: 'accent-green',
  heroes: [{ path: '/smart-contracts/bubblegum-v2', component: Hero }],
  protocolFees: {
    create: {
      solana: '0.00009 SOL',
      payer: 'Minter',
      notes: 'Paid by the minter.',
    },
    transfer: {
      solana: '0.000006 SOL',
      payer: 'Collector',
      notes: 'Paid by the owner.',
    },
  },
  sections: [
    {
      ...documentationSection('smart-contracts/bubblegum-v2'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/smart-contracts/bubblegum-v2' },
            { title: 'Metaplex DAS API RPCs', href: '/rpc-providers' },
            { title: 'FAQ', href: '/smart-contracts/bubblegum-v2/faq' },
          ],
        },
        {
          title: 'SDK',
          links: [
            { title: 'Javascript', href: '/smart-contracts/bubblegum-v2/sdk/javascript' },
            { title: 'Rust', href: '/smart-contracts/bubblegum-v2/sdk/rust' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Creating Bubblegum Trees',
              href: '/smart-contracts/bubblegum-v2/create-trees',
            },
            {
              title: 'Minting Compressed NFTs (cNFTs)',
              href: '/smart-contracts/bubblegum-v2/mint-cnfts',
            },
            { title: 'Fetching cNFTs', href: '/smart-contracts/bubblegum-v2/fetch-cnfts' },
            { title: 'Transferring cNFTs', href: '/smart-contracts/bubblegum-v2/transfer-cnfts' },
            { title: 'Freeze and Thaw cNFTs', href: '/smart-contracts/bubblegum-v2/freeze-cnfts' },
            { title: 'Updating cNFTs', href: '/smart-contracts/bubblegum-v2/update-cnfts' },
            { title: 'Burning cNFTs', href: '/smart-contracts/bubblegum-v2/burn-cnfts' },
            { title: 'Delegating cNFTs', href: '/smart-contracts/bubblegum-v2/delegate-cnfts' },
            { title: 'Delegating Trees', href: '/smart-contracts/bubblegum-v2/delegate-trees' },
            {
              title: 'Collections',
              href: '/smart-contracts/bubblegum-v2/collections',
            },
            { title: 'Verifying Creators', href: '/smart-contracts/bubblegum-v2/verify-creators' },
          ],
        },
        {
          title: 'Advanced',
          links: [
            {
              title: 'Concurrent Merkle Trees',
              href: '/smart-contracts/bubblegum-v2/concurrent-merkle-trees',
            },
            {
              title: 'Storing and Indexing NFT Data',
              href: '/smart-contracts/bubblegum-v2/stored-nft-data',
            },
            { title: 'Hashing NFT Data', href: '/smart-contracts/bubblegum-v2/hashed-nft-data' },
            {
              title: 'Merkle Tree Canopy',
              href: '/smart-contracts/bubblegum-v2/merkle-tree-canopy',
            },
          ],
        },
      ],
    },
    // {
    //   ...guidesSection('bubblegum-v2'),
    //   navigation: [],
    // },
    {
      ...referencesSection('smart-contracts/bubblegum-v2'),
      href: 'https://mpl-bubblegum.typedoc.metaplex.com/',
      target: '_blank'
    },
  ],
  // Hybrid approach: Keep product display (headline/desc) in product file for easy editing
  // Use centralized keys for common navigation terms, inline for product-specific terms
  localizedNavigation: buildProductTranslations({
    // Product display translations - edit right here!
    headlineTranslations: {
      ja: '改良された圧縮NFT',
      ko: '개선된 압축 NFT',
      zh: '改进的压缩NFT'
    },
    descriptionTranslations: {
      ja: '新たな桁のスケールを実現するNFT。',
      ko: '새로운 차원의 확장성을 제공하는 NFT입니다.',
      zh: '可扩展到新数量级的NFT。'
    },

    sectionKeys: {
      'Introduction': 'sections.introduction',  // Common - centralized
      'SDK': 'sections.sdk',                     // Common - centralized
      'Features': 'sections.features',           // Common - centralized
      'Advanced': 'sections.advanced'            // Common - centralized
    },
    linkKeys: {
      // Common terms - use centralized translations
      'Overview': 'links.overview',
      'FAQ': 'links.faq',
      'Javascript': 'links.javascript',
      'Rust': 'links.rust',
      'Collections': 'links.collections',

      // Bubblegum-specific terms - inline for easy editing
      // To change these, edit right here in this file!
      'Metaplex DAS API RPCs': {
        ja: 'Metaplex DAS API RPC',
        ko: 'Metaplex DAS API RPC',
        zh: 'Metaplex DAS API RPC'
      },
      'Creating Bubblegum Trees': {
        ja: 'Bubblegumツリーの作成',
        ko: 'Bubblegum 트리 생성',
        zh: '创建Bubblegum树'
      },
      'Minting Compressed NFTs (cNFTs)': {
        ja: '圧縮NFT（cNFT）のミント',
        ko: '압축 NFT(cNFT) 민팅',
        zh: '铸造压缩NFT（cNFT）'
      },
      'Fetching cNFTs': {
        ja: 'cNFTの取得',
        ko: 'cNFT 가져오기',
        zh: '获取cNFT'
      },
      'Transferring cNFTs': {
        ja: 'cNFTの転送',
        ko: 'cNFT 전송',
        zh: '转移cNFT'
      },
      'Freeze and Thaw cNFTs': {
        ja: 'cNFTの凍結と解凍',
        ko: 'cNFT 동결 및 해제',
        zh: '冻结和解冻cNFT'
      },
      'Updating cNFTs': {
        ja: 'cNFTの更新',
        ko: 'cNFT 업데이트',
        zh: '更新cNFT'
      },
      'Burning cNFTs': {
        ja: 'cNFTのバーン',
        ko: 'cNFT 소각',
        zh: '销毁cNFT'
      },
      'Delegating cNFTs': {
        ja: 'cNFTのデリゲート',
        ko: 'cNFT 위임',
        zh: '委托cNFT'
      },
      'Delegating Trees': {
        ja: 'ツリーのデリゲート',
        ko: '트리 위임',
        zh: '委托树'
      },
      'Verifying Creators': {
        ja: '作成者の検証',
        ko: '크리에이터 검증',
        zh: '验证创作者'
      },
      'Concurrent Merkle Trees': {
        ja: '同時マークルツリー',
        ko: '동시 머클 트리',
        zh: '并发Merkle树'
      },
      'Storing and Indexing NFT Data': {
        ja: 'NFTデータの保存とインデックス化',
        ko: 'NFT 데이터 저장 및 인덱싱',
        zh: '存储和索引NFT数据'
      },
      'Hashing NFT Data': {
        ja: 'NFTデータのハッシュ化',
        ko: 'NFT 데이터 해싱',
        zh: '哈希NFT数据'
      },
      'Merkle Tree Canopy': {
        ja: 'マークルツリーキャノピー',
        ko: '머클 트리 캐노피',
        zh: 'Merkle树冠层'
      }
    }
  })
}
