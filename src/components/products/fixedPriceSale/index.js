import { documentationSection } from '@/shared/sections'
import { TagIcon } from '@heroicons/react/24/solid'

export const fixedPriceSale = {
  name: 'Fixed Price Sale',
  headline: 'Fixed-price NFT sales program',
  description: 'A program for selling NFT editions at a fixed price on Solana. Deprecated.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/fixed-price-sale',
  icon: <TagIcon />,
  github: 'https://github.com/metaplex-foundation/metaplex-program-library/tree/master/fixed-price-sale',
  className: 'accent-green',
  deprecated: true,
  sections: [
    {
      ...documentationSection('smart-contracts/fixed-price-sale'),
      navigation: [
        {
          title: 'Fixed Price Sale',
          links: [
            { title: 'Introduction', href: '/smart-contracts/fixed-price-sale' },
            { title: 'Overview', href: '/smart-contracts/fixed-price-sale/tech-description' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    ja: {
      headline: '固定価格NFT販売プログラム',
      description: 'Solana上でNFTエディションを固定価格で販売するプログラム。非推奨。',
      sections: { 'Fixed Price Sale': 'Fixed Price Sale' },
      links: { 'Introduction': '紹介', 'Overview': '概要' },
    },
    ko: {
      headline: '고정 가격 NFT 판매 프로그램',
      description: 'Solana에서 고정 가격으로 NFT 에디션을 판매하는 프로그램입니다. 지원 중단됨.',
      sections: { 'Fixed Price Sale': 'Fixed Price Sale' },
      links: { 'Introduction': '소개', 'Overview': '개요' },
    },
    zh: {
      headline: '固定价格NFT销售程序',
      description: '用于在Solana上以固定价格销售NFT版本的程序。已弃用。',
      sections: { 'Fixed Price Sale': 'Fixed Price Sale' },
      links: { 'Introduction': '简介', 'Overview': '概述' },
    },
  },
}
