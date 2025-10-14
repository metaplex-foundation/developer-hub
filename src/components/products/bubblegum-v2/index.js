import {
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections';
import { FolderIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const bubblegumv2 = {
  name: 'Bubblegum v2',
  headline: 'Improved Compressed NFTs',
  description: 'NFTs that scale to new orders of magnitude.',
  path: 'bubblegum-v2',
  navigationMenuCatergory: 'MPL',
  icon: <FolderIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-bubblegum',
  className: 'accent-green',
  heroes: [{ path: '/bubblegum-v2', component: Hero }],
  sections: [
    {
      ...documentationSection('bubblegum'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/bubblegum-v2' },
            { title: 'Metaplex DAS API RPCs', href: '/rpc-providers' },
            { title: 'FAQ', href: '/bubblegum-v2/faq' },
          ],
        },
        {
          title: 'SDK',
          links: [
            { title: 'Javascript', href: '/bubblegum-v2/sdk/javascript' },
            { title: 'Rust', href: '/bubblegum-v2/sdk/rust' },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Creating Bubblegum Trees',
              href: '/bubblegum-v2/create-trees',
            },
            {
              title: 'Minting Compressed NFTs (cNFTs)',
              href: '/bubblegum-v2/mint-cnfts',
            },
            { title: 'Fetching cNFTs', href: '/bubblegum-v2/fetch-cnfts' },
            { title: 'Transferring cNFTs', href: '/bubblegum-v2/transfer-cnfts' },
            { title: 'Freeze and Thaw cNFTs', href: '/bubblegum-v2/freeze-cnfts' },
            { title: 'Updating cNFTs', href: '/bubblegum-v2/update-cnfts' },
            { title: 'Burning cNFTs', href: '/bubblegum-v2/burn-cnfts' },
            { title: 'Delegating cNFTs', href: '/bubblegum-v2/delegate-cnfts' },
            { title: 'Delegating Trees', href: '/bubblegum-v2/delegate-trees' },
            {
              title: 'Collections',
              href: '/bubblegum-v2/collections',
            },
            { title: 'Verifying Creators', href: '/bubblegum-v2/verify-creators' },
          ],
        },
        {
          title: 'Advanced',
          links: [
            {
              title: 'Concurrent Merkle Trees',
              href: '/bubblegum-v2/concurrent-merkle-trees',
            },
            {
              title: 'Storing and Indexing NFT Data',
              href: '/bubblegum-v2/stored-nft-data',
            },
            { title: 'Hashing NFT Data', href: '/bubblegum-v2/hashed-nft-data' },
            {
              title: 'Merkle Tree Canopy',
              href: '/bubblegum-v2/merkle-tree-canopy',
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
      ...referencesSection('bubblegum-v2'),
      href: 'https://mpl-bubblegum.typedoc.metaplex.com/',
      target: '_blank'
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Improved Compressed NFTs',
      description: 'NFTs that scale to new orders of magnitude.',
      sections: {
        'Introduction': 'Introduction',
        'SDK': 'SDK',
        'Features': 'Features',
        'Advanced': 'Advanced'
      },
      links: {
        'Overview': 'Overview',
        'Metaplex DAS API RPCs': 'Metaplex DAS API RPCs',
        'FAQ': 'FAQ',
        'Javascript': 'Javascript',
        'Rust': 'Rust',
        'Creating Bubblegum Trees': 'Creating Bubblegum Trees',
        'Minting Compressed NFTs (cNFTs)': 'Minting Compressed NFTs (cNFTs)',
        'Fetching cNFTs': 'Fetching cNFTs',
        'Transferring cNFTs': 'Transferring cNFTs',
        'Freeze and Thaw cNFTs': 'Freeze and Thaw cNFTs',
        'Updating cNFTs': 'Updating cNFTs',
        'Burning cNFTs': 'Burning cNFTs',
        'Delegating cNFTs': 'Delegating cNFTs',
        'Delegating Trees': 'Delegating Trees',
        'Collections': 'Collections',
        'Verifying Creators': 'Verifying Creators',
        'Concurrent Merkle Trees': 'Concurrent Merkle Trees',
        'Storing and Indexing NFT Data': 'Storing and Indexing NFT Data',
        'Hashing NFT Data': 'Hashing NFT Data',
        'Merkle Tree Canopy': 'Merkle Tree Canopy'
      }
    },
    ja: {
      headline: '改良された圧縮NFT',
      description: '新たな桁のスケールを実現するNFT。',
      sections: {
        'Introduction': '紹介',
        'SDK': 'SDK', 
        'Features': '機能',
        'Advanced': '高度'
      },
      links: {
        'Overview': '概要',
        'Metaplex DAS API RPCs': 'Metaplex DAS API RPC',
        'FAQ': 'よくある質問',
        'Javascript': 'JavaScript',
        'Rust': 'Rust',
        'Creating Bubblegum Trees': 'Bubblegumツリーの作成',
        'Minting Compressed NFTs (cNFTs)': '圧縮NFT（cNFT）のミント',
        'Fetching cNFTs': 'cNFTの取得',
        'Transferring cNFTs': 'cNFTの転送',
        'Freeze and Thaw cNFTs': 'cNFTの凍結と解凍',
        'Updating cNFTs': 'cNFTの更新',
        'Burning cNFTs': 'cNFTのバーン',
        'Delegating cNFTs': 'cNFTのデリゲート',
        'Delegating Trees': 'ツリーのデリゲート',
        'Collections': 'コレクション',
        'Verifying Creators': '作成者の検証',
        'Concurrent Merkle Trees': '同時マークルツリー',
        'Storing and Indexing NFT Data': 'NFTデータの保存とインデックス化',
        'Hashing NFT Data': 'NFTデータのハッシュ化',
        'Merkle Tree Canopy': 'マークルツリーキャノピー'
      }
    },
    ko: {
      headline: '개선된 압축 NFT',
      description: '새로운 차원의 확장성을 제공하는 NFT입니다.',
      sections: {
        'Introduction': '소개',
        'SDK': 'SDK',
        'Features': '기능',
        'Advanced': '고급'
      },
      links: {
        'Overview': '개요',
        'Metaplex DAS API RPCs': 'Metaplex DAS API RPC',
        'FAQ': '자주 묻는 질문',
        'Javascript': 'JavaScript',
        'Rust': 'Rust', 
        'Creating Bubblegum Trees': 'Bubblegum 트리 생성',
        'Minting Compressed NFTs (cNFTs)': '압축 NFT(cNFT) 민팅',
        'Fetching cNFTs': 'cNFT 가져오기',
        'Transferring cNFTs': 'cNFT 전송',
        'Freeze and Thaw cNFTs': 'cNFT 동결 및 해제',
        'Updating cNFTs': 'cNFT 업데이트',
        'Burning cNFTs': 'cNFT 소각',
        'Delegating cNFTs': 'cNFT 위임',
        'Delegating Trees': '트리 위임',
        'Collections': '컬렉션',
        'Verifying Creators': '크리에이터 검증',
        'Concurrent Merkle Trees': '동시 머클 트리',
        'Storing and Indexing NFT Data': 'NFT 데이터 저장 및 인덱싱',
        'Hashing NFT Data': 'NFT 데이터 해싱',
        'Merkle Tree Canopy': '머클 트리 캐노피'
      }
    }
  }
}
