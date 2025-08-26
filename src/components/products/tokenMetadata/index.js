import {
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const tokenMetadata = {
  name: 'Token Metadata',
  headline: 'Digital ownership standard',
  description: 'Create tokens and NFTs with the SPL Token Program',
  navigationMenuCatergory: 'MPL',
  path: 'token-metadata',
  icon: <EllipsisHorizontalCircleIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-token-metadata',
  className: 'accent-green',
  heroes: [{ path: '/token-metadata', component: Hero }],
  sections: [
    {
      ...documentationSection('token-metadata'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/token-metadata' },
            {
              title: 'Getting Started',
              href: '/token-metadata/getting-started',
            },
            { title: 'FAQ', href: '/token-metadata/faq' },
            {
              title: 'Account Size Reduction',
              href: '/token-metadata/guides/account-size-reduction',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Token Standards (Assets)',
              href: '/token-metadata/token-standard',
            },
            { title: 'Minting Assets', href: '/token-metadata/mint' },
            { title: 'Fetching Assets', href: '/token-metadata/fetch' },
            { title: 'Updating Assets', href: '/token-metadata/update' },
            { title: 'Transferring Assets', href: '/token-metadata/transfer' },
            { title: 'Burning Assets', href: '/token-metadata/burn' },
            { title: 'Printed Editions', href: '/token-metadata/print' }, // Include "Definitions" content.
            {
              title: 'Verified Collections',
              href: '/token-metadata/collections',
            },
            { title: 'Verified Creators', href: '/token-metadata/creators' },
            {
              title: 'Delegated Authorities',
              href: '/token-metadata/delegates',
            }, // Delegate + Revoke + Delegated transfer and burn.
            { title: 'Locking Assets', href: '/token-metadata/lock' },
            { title: 'Programmable NFTs (pNFTs)', href: '/token-metadata/pnfts' },
            { title: 'NFT Escrow', href: '/token-metadata/escrow' },
            { title: 'SPL Token-2022', href: '/token-metadata/token-2022' },
          ],
        },
      ],
    },
    {
      ...guidesSection('token-metadata'),
      navigation: [
        {
          title: 'Guides',
          links: [
            { title: 'Overview', href: '/token-metadata/guides' },
            {
              title: 'Get Mints by Collection',
              href: '/token-metadata/guides/get-by-collection',
            },
            {
              title: 'Account Size Reduction',
              href: '/token-metadata/guides/account-size-reduction',
            },
            {
              title: 'Create a claim based airdrop using Gumdrop',
              href: '/guides/general/spl-token-claim-airdrop-using-gumdrop',
            },
            {
              title: 'Token Claimer (Airdrop) Smart Contract',
              href: '/token-metadata/guides/anchor/token-claimer-smart-contract',
            },
          ],
        },
        {
          title: 'Javascript',
          links: [
            {
              title: 'Create an NFT',
              href: '/token-metadata/guides/javascript/create-an-nft',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('token-metadata'),
      href: `https://mpl-token-metadata-js-docs.vercel.app/`,
      target: '_blank',
    },

  ],
  localizedNavigation: {
    en: {
      headline: 'Digital ownership standard',
      description: 'Create tokens and NFTs with the SPL Token Program',
      sections: {
        'Introduction': 'Introduction',
        'Features': 'Features',
        'Guides': 'Guides',
        'Javascript': 'Javascript',
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'FAQ': 'FAQ',
        'Account Size Reduction': 'Account Size Reduction',
        'Token Standards (Assets)': 'Token Standards (Assets)',
        'Minting Assets': 'Minting Assets',
        'Fetching Assets': 'Fetching Assets',
        'Updating Assets': 'Updating Assets',
        'Transferring Assets': 'Transferring Assets',
        'Burning Assets': 'Burning Assets',
        'Printed Editions': 'Printed Editions',
        'Verified Collections': 'Verified Collections',
        'Verified Creators': 'Verified Creators',
        'Delegated Authorities': 'Delegated Authorities',
        'Locking Assets': 'Locking Assets',
        'Programmable NFTs (pNFTs)': 'Programmable NFTs (pNFTs)',
        'NFT Escrow': 'NFT Escrow',
        'SPL Token-2022': 'SPL Token-2022',
        'Get Mints by Collection': 'Get Mints by Collection',
        'Create a claim based airdrop using Gumdrop': 'Create a claim based airdrop using Gumdrop',
        'Token Claimer (Airdrop) Smart Contract': 'Token Claimer (Airdrop) Smart Contract',
        'Create an NFT': 'Create an NFT',
      }
    },
    jp: {
      headline: 'デジタル所有権標準',
      description: 'SPL Token ProgramでトークンとNFTを作成',
      sections: {
        'Introduction': '紹介',
        'Features': '機能',
        'Guides': 'ガイド',
        'Javascript': 'JavaScript',
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'FAQ': 'よくある質問',
        'Account Size Reduction': 'アカウントサイズ削減',
        'Token Standards (Assets)': 'トークン標準（アセット）',
        'Minting Assets': 'アセットのミント',
        'Fetching Assets': 'アセットの取得',
        'Updating Assets': 'アセットの更新',
        'Transferring Assets': 'アセットの転送',
        'Burning Assets': 'アセットのバーン',
        'Printed Editions': '印刷エディション',
        'Verified Collections': '検証済みコレクション',
        'Verified Creators': '検証済み作成者',
        'Delegated Authorities': '委任された権限',
        'Locking Assets': 'アセットのロック',
        'Programmable NFTs (pNFTs)': 'プログラマブルNFT（pNFT）',
        'NFT Escrow': 'NFTエスクロー',
        'SPL Token-2022': 'SPL Token-2022',
        'Get Mints by Collection': 'コレクションでMintを取得',
        'Create a claim based airdrop using Gumdrop': 'Gumdropを使用したクレームベースのエアドロップを作成',
        'Token Claimer (Airdrop) Smart Contract': 'トークンクレーマー（エアドロップ）スマートコントラクト',
        'Create an NFT': 'NFTの作成',
      }
    },
    kr: {
      headline: '디지털 소유권 표준',
      description: 'SPL Token Program으로 토큰과 NFT를 생성',
      sections: {
        'Introduction': '소개',
        'Features': '기능',
        'Guides': '가이드',
        'Javascript': 'JavaScript',
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'FAQ': '자주 묻는 질문',
        'Account Size Reduction': '계정 크기 축소',
        'Token Standards (Assets)': '토큰 표준 (에셋)',
        'Minting Assets': '에셋 민팅',
        'Fetching Assets': '에셋 가져오기',
        'Updating Assets': '에셋 업데이트',
        'Transferring Assets': '에셋 전송',
        'Burning Assets': '에셋 소각',
        'Printed Editions': '인쇄된 에디션',
        'Verified Collections': '검증된 컬렉션',
        'Verified Creators': '검증된 크리에이터',
        'Delegated Authorities': '위임된 권한',
        'Locking Assets': '에셋 잠금',
        'Programmable NFTs (pNFTs)': '프로그래밍 가능한 NFT (pNFT)',
        'NFT Escrow': 'NFT 에스크로',
        'SPL Token-2022': 'SPL Token-2022',
        'Get Mints by Collection': '컬렉션으로 민트 가져오기',
        'Create a claim based airdrop using Gumdrop': 'Gumdrop을 사용한 클레임 기반 에어드롭 생성',
        'Token Claimer (Airdrop) Smart Contract': '토큰 클레이머 (에어드롭) 스마트 컨트랙트',
        'Create an NFT': 'NFT 생성',
      }
    }
  }
}
