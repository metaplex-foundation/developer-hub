'use client'

import { useLocale, useTranslations } from '@/contexts/LocaleContext';
import { getLocalizedHref } from '@/config/languages';
import { Popover } from '@headlessui/react';
import Link from 'next/link';
import { SwitcherPopover } from './products/SwitcherPopover';
import { productCategories } from './products/index';

const createATokenMenuItem = {
  name: 'Create A Token',
  headline: 'Create token data on chain using Metaplex SDKs.',
  description: 'Create a fungible token with metadata on Solana.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/create-a-token',
  localizedNavigation: {
    ja: { name: 'トークンを作成', headline: 'Metaplex SDKを使用してオンチェーンでトークンデータを作成します。' },
    ko: { name: '토큰 생성', headline: 'Metaplex SDK를 사용하여 온체인에서 토큰 데이터를 생성합니다.' },
    zh: { name: '创建代币', headline: '使用Metaplex SDK在链上创建代币数据。' },
  },
}

const mintTokensMenuItem = {
  name: 'Mint Tokens',
  headline: 'Mint additional tokens using Metaplex SDKs.',
  description: 'Mint additional fungible tokens to a wallet.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/mint-tokens',
  localizedNavigation: {
    ja: { name: 'トークンを発行', headline: 'Metaplex SDKを使用して追加のトークンを発行します。' },
    ko: { name: '토큰 발행', headline: 'Metaplex SDK를 사용하여 추가 토큰을 발행합니다.' },
    zh: { name: '铸造代币', headline: '使用Metaplex SDK铸造额外的代币。' },
  },
}

const updateATokenMenuItem = {
  name: 'Update A Token',
  headline: 'Update token metadata using Metaplex SDKs.',
  description: 'Update the metadata of a fungible token.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/update-token',
  localizedNavigation: {
    ja: { name: 'トークンを更新', headline: 'Metaplex SDKを使用してトークンメタデータを更新します。' },
    ko: { name: '토큰 업데이트', headline: 'Metaplex SDK를 사용하여 토큰 메타데이터를 업데이트합니다.' },
    zh: { name: '更新代币', headline: '使用Metaplex SDK更新代币元数据。' },
  },
}

const burnATokenMenuItem = {
  name: 'Burn Tokens',
  headline: 'Burn tokens using Metaplex SDKs.',
  description: 'Burn fungible tokens to remove them from circulation.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/burn-tokens',
  localizedNavigation: {
    ja: { name: 'トークンをバーン', headline: 'Metaplex SDKを使用してトークンをバーンします。' },
    ko: { name: '토큰 소각', headline: 'Metaplex SDK를 사용하여 토큰을 소각합니다.' },
    zh: { name: '销毁代币', headline: '使用Metaplex SDK销毁代币。' },
  },
}

const transferATokenMenuItem = {
  name: 'Transfer Tokens',
  headline: 'Transfer tokens using Metaplex SDKs.',
  description: 'Transfer fungible tokens between wallets.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/transfer-a-token',
  localizedNavigation: {
    ja: { name: 'トークンを転送', headline: 'Metaplex SDKを使用してトークンを転送します。' },
    ko: { name: '토큰 전송', headline: 'Metaplex SDK를 사용하여 토큰을 전송합니다.' },
    zh: { name: '转移代币', headline: '使用Metaplex SDK转移代币。' },
  },
}

const launchTokenMenuItem = {
  name: 'Launch Token',
  headline: 'Run a TGE or fair launch on Solana.',
  description: 'Launch a token generation event (TGE) on Solana using Genesis Launch Pools. Users deposit SOL during a window and receive tokens proportional to their share.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/launch-token',
  localizedNavigation: {
    ja: { name: 'トークンをローンチ', headline: 'Metaplex Genesisでトークンをローンチします。' },
    ko: { name: '토큰 런칭', headline: 'Metaplex Genesis로 토큰을 런칭합니다.' },
    zh: { name: '发行代币', headline: '使用Metaplex Genesis发行代币。' },
  },
}

export const tokenMenuCategory = [launchTokenMenuItem, createATokenMenuItem, mintTokensMenuItem, transferATokenMenuItem, updateATokenMenuItem, burnATokenMenuItem]

export const nftMenuCategory = [
  {
    name: 'Create A NFT',
    headline: 'Create NFT data on chain using Metaplex SDKs.',
    description: 'Create NFT data on chain using Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/create-nft',
    localizedNavigation: {
      ja: { name: 'NFTを作成', headline: 'Metaplex SDKを使用してオンチェーンでNFTデータを作成します。' },
      ko: { name: 'NFT 생성', headline: 'Metaplex SDK를 사용하여 온체인에서 NFT 데이터를 생성합니다.' },
      zh: { name: '创建NFT', headline: '使用Metaplex SDK在链上创建NFT数据。' },
    },
  },
  {
    name: 'Read A NFT',
    headline: 'Read NFT data on chain using DAS and Metaplex SDKs.',
    description: 'Read NFT data on chain using DAS and Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/fetch-nft',
    localizedNavigation: {
      ja: { name: 'NFTを読み取る', headline: 'DASとMetaplex SDKを使用してオンチェーンのNFTデータを読み取ります。' },
      ko: { name: 'NFT 조회', headline: 'DAS와 Metaplex SDK를 사용하여 온체인 NFT 데이터를 조회합니다.' },
      zh: { name: '读取NFT', headline: '使用DAS和Metaplex SDK读取链上NFT数据。' },
    },
  },
  {
    name: 'Update A NFT',
    headline: 'Update NFT data on chain using DAS and Metaplex SDKs.',
    description: 'Update NFT data on chain using DAS and Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/update-nft',
    localizedNavigation: {
      ja: { name: 'NFTを更新', headline: 'DASとMetaplex SDKを使用してオンチェーンのNFTデータを更新します。' },
      ko: { name: 'NFT 업데이트', headline: 'DAS와 Metaplex SDK를 사용하여 온체인 NFT 데이터를 업데이트합니다.' },
      zh: { name: '更新NFT', headline: '使用DAS和Metaplex SDK更新链上NFT数据。' },
    },
  },
  {
    name: 'Burn A NFT',
    headline: 'Burn NFT data on chain using DAS and Metaplex SDKs.',
    description: 'Burn NFT data on chain using DAS and Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/burn-nft',
    localizedNavigation: {
      ja: { name: 'NFTをバーン', headline: 'DASとMetaplex SDKを使用してオンチェーンのNFTデータをバーンします。' },
      ko: { name: 'NFT 소각', headline: 'DAS와 Metaplex SDK를 사용하여 온체인 NFT 데이터를 소각합니다.' },
      zh: { name: '销毁NFT', headline: '使用DAS和Metaplex SDK销毁链上NFT数据。' },
    },
  },
  {
    name: 'Transfer A NFT',
    headline: 'Transfer NFT data on chain using Metaplex SDKs.',
    description: 'Transfer NFT data on chain using Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/transfer-nft',
    localizedNavigation: {
      ja: { name: 'NFTを転送', headline: 'Metaplex SDKを使用してオンチェーンのNFTデータを転送します。' },
      ko: { name: 'NFT 전송', headline: 'Metaplex SDK를 사용하여 온체인 NFT 데이터를 전송합니다.' },
      zh: { name: '转移NFT', headline: '使用Metaplex SDK转移链上NFT数据。' },
    },
  },
]


const NavList = () => {
  const t = useTranslations('header')
  const { locale } = useLocale()

  const getTranslatedCategory = (category) => {
    const categoryMap = {
      'Tokens': t('tokens', 'Tokens'),
      'NFTs': t('nfts', 'NFTs'),
      'Programs': t('programs', 'Programs'),
      'Smart Contracts': t('smartContracts', 'Smart Contracts'),
      'Dev Tools': t('devTools', 'Dev Tools'),
    }
    return categoryMap[category] || category
  }

  return (
    <div className="hidden cursor-pointer gap-6 lg:flex">
      {/* <div className="hidden flex-col lg:flex">
        <Link href={getLocalizedHref("/#", locale)}>
          <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
            {t('token', 'Tokens')}
          </div>
        </Link>
      </div>
      <div className="hidden flex-col lg:flex">
        <Link href={getLocalizedHref("/#", locale)}>
          <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
            {t('nfts', 'NFTs')}
          </div>
        </Link>
      </div> */}
      {productCategories.map((item, index) => {
        // Map categories to their index page paths
        const categoryPaths = {
          'Tokens': '/tokens',
          'NFTs': '/nfts',
          'Smart Contracts': '/smart-contracts',
          'Dev Tools': '/dev-tools',
        }

        const path = categoryPaths[item]
        if (path) {
          return (
            <div className="hidden flex-col lg:flex" key={index}>
              <Link href={getLocalizedHref(path, locale)}>
                <div className="-mx-3 -my-2 whitespace-nowrap rounded-lg px-3 py-2 text-black dark:text-white">
                  {getTranslatedCategory(item)}
                </div>
              </Link>
            </div>
          )
        }

        // Fallback to dropdown for any other categories
        return (
          <div className="hidden flex-col lg:flex" key={index}>
            <SwitcherPopover menuItem={productCategories[index]}>
              <Popover.Button className="-mx-3 -my-2 whitespace-nowrap rounded-lg px-3 py-2 text-black dark:text-white">
                {getTranslatedCategory(item)}
              </Popover.Button>
            </SwitcherPopover>
          </div>
        )
      })}

      {/* <div className="hidden flex-col lg:flex">
        <Link href="/code-viewer">
          <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
            Playground
          </div>
        </Link>
      </div> */}
    </div>
  )
}

export default NavList
