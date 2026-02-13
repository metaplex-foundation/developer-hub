import {
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections';
import { ArchiveBoxIcon } from '@heroicons/react/24/solid';

export const bubblegum = {
  name: 'Bubblegum v1 (legacy)',
  headline: 'Compressed NFTs',
  description: 'NFTs that scale.',
  path: 'smart-contracts/bubblegum',
  navigationMenuCatergory: 'Smart Contracts',
  icon: <ArchiveBoxIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-bubblegum',
  className: 'accent-green',
  protocolFees: {
    create: {
      solana: 'Free',
      payer: null,
      notes: null,
    },
  },
  sections: [
    {
      ...documentationSection('smart-contracts/bubblegum'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/smart-contracts/bubblegum' },
            { title: 'Metaplex DAS API RPCs', href: '/guides/rpc-providers' },
            { title: 'FAQ', href: '/smart-contracts/bubblegum-v2/faq' },
          ],
        },
        {
          title: 'SDK',
          links: [
            { title: 'Javascript', href: '/smart-contracts/bubblegum/sdk/javascript' },
            { title: 'Rust', href: '/smart-contracts/bubblegum/sdk/rust' },
          ],
        },
        {
          title: 'General Features',
          links: [
            {
              title: 'Creating Bubblegum Trees',
              href: '/smart-contracts/bubblegum/create-trees',
            },
            { title: 'Fetching cNFTs', href: '/smart-contracts/bubblegum-v2/fetch-cnfts' },
            { title: 'Delegating Trees', href: '/smart-contracts/bubblegum/delegate-trees' },
          ],
        },
        {
          title: 'Bubblegum',
          links: [
            {
              title: 'Minting Compressed NFTs (cNFTs)',
              href: '/smart-contracts/bubblegum/mint-cnfts',
            },
            { title: 'Transferring cNFTs', href: '/smart-contracts/bubblegum/transfer-cnfts' },
            { title: 'Updating cNFTs', href: '/smart-contracts/bubblegum/update-cnfts' },
            { title: 'Burning cNFTs', href: '/smart-contracts/bubblegum/burn-cnfts' },
            {
              title: 'Decompressing cNFTs',
              href: '/smart-contracts/bubblegum/decompress-cnfts',
            },
            { title: 'Delegating cNFTs', href: '/smart-contracts/bubblegum/delegate-cnfts' },
            {
              title: 'Verifying Collections',
              href: '/smart-contracts/bubblegum/verify-collections',
            },
            { title: 'Verifying Creators', href: '/smart-contracts/bubblegum/verify-creators' },
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
    {
      ...guidesSection('smart-contracts/bubblegum'),
      navigation: [
        {
          title: 'Javascript',
          links: [
            {
              title: 'How to Create a 1,000,000 NFT Collection on Solana',
              href: '/smart-contracts/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana',
            },
            {
              title: 'How to Interact with cNFTs on Other SVMs',
              href: '/smart-contracts/bubblegum/guides/javascript/how-to-interact-with-cnfts-on-other-svms',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('smart-contracts/bubblegum'),
      href: 'https://mpl-bubblegum.typedoc.metaplex.com/',
      target: '_blank'
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Compressed NFTs',
      description: 'NFTs that scale.',
      sections: {
        'Introduction': 'Introduction',
        'SDK': 'SDK',
        'General Features': 'General Features',
        'Bubblegum': 'Bubblegum',
        'Advanced': 'Advanced',
        'Javascript': 'Javascript'
      },
      links: {
        'Overview': 'Overview',
        'Metaplex DAS API RPCs': 'Metaplex DAS API RPCs',
        'FAQ': 'FAQ',
        'Javascript': 'Javascript',
        'Rust': 'Rust',
        'Creating Bubblegum Trees': 'Creating Bubblegum Trees',
        'Fetching cNFTs': 'Fetching cNFTs',
        'Delegating Trees': 'Delegating Trees',
        'Minting Compressed NFTs (cNFTs)': 'Minting Compressed NFTs (cNFTs)',
        'Transferring cNFTs': 'Transferring cNFTs',
        'Updating cNFTs': 'Updating cNFTs',
        'Burning cNFTs': 'Burning cNFTs',
        'Decompressing cNFTs': 'Decompressing cNFTs',
        'Delegating cNFTs': 'Delegating cNFTs',
        'Verifying Collections': 'Verifying Collections',
        'Verifying Creators': 'Verifying Creators',
        'Concurrent Merkle Trees': 'Concurrent Merkle Trees',
        'Storing and Indexing NFT Data': 'Storing and Indexing NFT Data',
        'Hashing NFT Data': 'Hashing NFT Data',
        'Merkle Tree Canopy': 'Merkle Tree Canopy',
        'How to Create a 1,000,000 NFT Collection on Solana': 'How to Create a 1,000,000 NFT Collection on Solana',
        'How to Interact with cNFTs on Other SVMs': 'How to Interact with cNFTs on Other SVMs'
      }
    },
    ja: {
      headline: '圧縮NFT',
      description: 'スケールするNFT。',
      sections: {
        'Introduction': '紹介',
        'SDK': 'SDK',
        'General Features': '一般機能',
        'Bubblegum': 'Bubblegum',
        'Advanced': '高度',
        'Javascript': 'JavaScript'
      },
      links: {
        'Overview': '概要',
        'Metaplex DAS API RPCs': 'Metaplex DAS API RPC',
        'FAQ': 'よくある質問',
        'Javascript': 'JavaScript',
        'Rust': 'Rust',
        'Creating Bubblegum Trees': 'Bubblegumツリーの作成',
        'Fetching cNFTs': 'cNFTの取得',
        'Delegating Trees': 'ツリーのデリゲート',
        'Minting Compressed NFTs (cNFTs)': '圧縮NFT（cNFT）のミント',
        'Transferring cNFTs': 'cNFTの転送',
        'Updating cNFTs': 'cNFTの更新',
        'Burning cNFTs': 'cNFTのバーン',
        'Decompressing cNFTs': 'cNFTの解凍',
        'Delegating cNFTs': 'cNFTのデリゲート',
        'Verifying Collections': 'コレクションの検証',
        'Verifying Creators': '作成者の検証',
        'Concurrent Merkle Trees': '同時マークルツリー',
        'Storing and Indexing NFT Data': 'NFTデータの保存とインデックス化',
        'Hashing NFT Data': 'NFTデータのハッシュ化',
        'Merkle Tree Canopy': 'マークルツリーキャノピー',
        'How to Create a 1,000,000 NFT Collection on Solana': 'Solanaで100万NFTコレクションを作成する方法',
        'How to Interact with cNFTs on Other SVMs': '他のSVMでcNFTと相互作用する方法'
      }
    },
    ko: {
      headline: '압축 NFT',
      description: '확장 가능한 NFT입니다.',
      sections: {
        'Introduction': '소개',
        'SDK': 'SDK',
        'General Features': '일반 기능',
        'Bubblegum': 'Bubblegum',
        'Advanced': '고급',
        'Javascript': 'JavaScript'
      },
      links: {
        'Overview': '개요',
        'Metaplex DAS API RPCs': 'Metaplex DAS API RPC',
        'FAQ': '자주 묻는 질문',
        'Javascript': 'JavaScript',
        'Rust': 'Rust',
        'Creating Bubblegum Trees': 'Bubblegum 트리 생성',
        'Fetching cNFTs': 'cNFT 가져오기',
        'Delegating Trees': '트리 위임',
        'Minting Compressed NFTs (cNFTs)': '압축 NFT(cNFT) 민팅',
        'Transferring cNFTs': 'cNFT 전송',
        'Updating cNFTs': 'cNFT 업데이트',
        'Burning cNFTs': 'cNFT 소각',
        'Decompressing cNFTs': 'cNFT 압축 해제',
        'Delegating cNFTs': 'cNFT 위임',
        'Verifying Collections': '컬렉션 검증',
        'Verifying Creators': '크리에이터 검증',
        'Concurrent Merkle Trees': '동시 머클 트리',
        'Storing and Indexing NFT Data': 'NFT 데이터 저장 및 인덱싱',
        'Hashing NFT Data': 'NFT 데이터 해싱',
        'Merkle Tree Canopy': '머클 트리 캐노피',
        'How to Create a 1,000,000 NFT Collection on Solana': 'Solana에서 100만 NFT 컬렉션 만들기',
        'How to Interact with cNFTs on Other SVMs': '다른 SVM에서 cNFT와 상호작용하기'
      }
    },
    zh: {
      headline: '压缩NFT',
      description: '可扩展的NFT。',
      sections: {
        'Introduction': '简介',
        'SDK': 'SDK',
        'General Features': '通用功能',
        'Bubblegum': 'Bubblegum',
        'Advanced': '高级',
        'Javascript': 'JavaScript'
      },
      links: {
        'Overview': '概述',
        'Metaplex DAS API RPCs': 'Metaplex DAS API RPC',
        'FAQ': '常见问题',
        'Javascript': 'JavaScript',
        'Rust': 'Rust',
        'Creating Bubblegum Trees': '创建Bubblegum树',
        'Fetching cNFTs': '获取cNFT',
        'Delegating Trees': '委托树',
        'Minting Compressed NFTs (cNFTs)': '铸造压缩NFT（cNFT）',
        'Transferring cNFTs': '转移cNFT',
        'Updating cNFTs': '更新cNFT',
        'Burning cNFTs': '销毁cNFT',
        'Decompressing cNFTs': '解压cNFT',
        'Delegating cNFTs': '委托cNFT',
        'Verifying Collections': '验证合集',
        'Verifying Creators': '验证创作者',
        'Concurrent Merkle Trees': '并发Merkle树',
        'Storing and Indexing NFT Data': '存储和索引NFT数据',
        'Hashing NFT Data': '哈希NFT数据',
        'Merkle Tree Canopy': 'Merkle树冠层',
        'How to Create a 1,000,000 NFT Collection on Solana': '如何在Solana上创建100万个NFT合集',
        'How to Interact with cNFTs on Other SVMs': '如何在其他SVM上与cNFT交互'
      }
    }
  }
}
