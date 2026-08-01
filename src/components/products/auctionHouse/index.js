import { documentationSection } from '@/shared/sections'
import { BuildingStorefrontIcon } from '@heroicons/react/24/solid'

export const auctionHouse = {
  name: 'Auction House',
  headline: 'Decentralized NFT marketplace protocol',
  description: 'A decentralized sales protocol for listing and trading NFTs on Solana. Deprecated.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/auction-house',
  icon: <BuildingStorefrontIcon />,
  github: 'https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auction-house',
  className: 'accent-green',
  deprecated: true,
  sections: [
    {
      ...documentationSection('smart-contracts/auction-house'),
      navigation: [
        {
          title: 'Auction House',
          links: [
            { title: 'Overview', href: '/smart-contracts/auction-house' },
            { title: 'Getting Started', href: '/smart-contracts/auction-house/getting-started' },
            { title: 'Auction House Settings', href: '/smart-contracts/auction-house/settings' },
            { title: 'Managing Auction Houses', href: '/smart-contracts/auction-house/manage' },
            { title: 'Trading Assets', href: '/smart-contracts/auction-house/trading-assets' },
            { title: 'Managing Buyer Escrow Account', href: '/smart-contracts/auction-house/buyer-escrow' },
            { title: 'Auction House Receipts', href: '/smart-contracts/auction-house/receipts' },
            { title: 'Finding Bids, listings, sales', href: '/smart-contracts/auction-house/find' },
            { title: 'How to manage Auction House using CLI', href: '/smart-contracts/auction-house/manage-using-cli' },
            { title: 'Timed Auctions with Auctioneers', href: '/smart-contracts/auction-house/auctioneer' },
            { title: 'FAQ', href: '/smart-contracts/auction-house/faq' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    ja: {
      headline: '分散型NFTマーケットプレイスプロトコル',
      description: 'Solana上でNFTを出品・取引するための分散型販売プロトコル。非推奨。',
      sections: {
        'Auction House': 'Auction House',
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'Auction House Settings': 'Auction House設定',
        'Managing Auction Houses': 'Auction Houseの管理',
        'Trading Assets': 'アセットの取引',
        'Managing Buyer Escrow Account': '購入者エスクローアカウントの管理',
        'Auction House Receipts': 'Auction Houseレシート',
        'Finding Bids, listings, sales': '入札、リスティング、販売の検索',
        'How to manage Auction House using CLI': 'CLIを使用したAuction Houseの管理方法',
        'Timed Auctions with Auctioneers': 'Auctioneersを使用した時間制オークション',
        'FAQ': 'よくある質問',
      },
    },
    ko: {
      headline: '탈중앙화 NFT 마켓플레이스 프로토콜',
      description: 'Solana에서 NFT를 리스팅하고 거래하기 위한 탈중앙화 판매 프로토콜입니다. 지원 중단됨.',
      sections: {
        'Auction House': 'Auction House',
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'Auction House Settings': 'Auction House 설정',
        'Managing Auction Houses': 'Auction House 관리',
        'Trading Assets': '에셋 거래',
        'Managing Buyer Escrow Account': '구매자 에스크로 계정 관리',
        'Auction House Receipts': 'Auction House 영수증',
        'Finding Bids, listings, sales': '입찰, 리스팅, 판매 찾기',
        'How to manage Auction House using CLI': 'CLI를 사용한 Auction House 관리 방법',
        'Timed Auctions with Auctioneers': 'Auctioneers를 사용한 시간제 경매',
        'FAQ': '자주 묻는 질문',
      },
    },
    zh: {
      headline: '去中心化NFT市场协议',
      description: '用于在Solana上列出和交易NFT的去中心化销售协议。已弃用。',
      sections: {
        'Auction House': 'Auction House',
      },
      links: {
        'Overview': '概述',
        'Getting Started': '快速入门',
        'Auction House Settings': 'Auction House设置',
        'Managing Auction Houses': '管理Auction House',
        'Trading Assets': '交易资产',
        'Managing Buyer Escrow Account': '管理买家托管账户',
        'Auction House Receipts': 'Auction House收据',
        'Finding Bids, listings, sales': '查找出价、列表、销售',
        'How to manage Auction House using CLI': '如何使用CLI管理Auction House',
        'Timed Auctions with Auctioneers': '使用Auctioneers进行定时拍卖',
        'FAQ': '常见问题',
      },
    },
  },
}
