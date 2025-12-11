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
}

const mintTokensMenuItem = {
  name: 'Mint Tokens',
  headline: 'Mint additional tokens using Metaplex SDKs.',
  description: 'Mint additional fungible tokens to a wallet.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/mint-tokens',
}

const updateATokenMenuItem = {
  name: 'Update A Token',
  headline: 'Update token metadata using Metaplex SDKs.',
  description: 'Update the metadata of a fungible token.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/update-token',
}

const burnATokenMenuItem = {
  name: 'Burn Tokens',
  headline: 'Burn tokens using Metaplex SDKs.',
  description: 'Burn fungible tokens to remove them from circulation.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/burn-tokens',
}

const transferATokenMenuItem = {
  name: 'Transfer Tokens',
  headline: 'Transfer tokens using Metaplex SDKs.',
  description: 'Transfer fungible tokens between wallets.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/transfer-a-token',
}

const launchTokenMenuItem = {
  name: 'Launch Token',
  headline: 'Launch a token with Metaplex Genesis.',
  description: 'Launch a token using Genesis Launch Pools, where users deposit SOL during a window and receive tokens proportional to their share of total deposits.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/launch-token',
}

export const tokenMenuCategory = [launchTokenMenuItem, createATokenMenuItem, mintTokensMenuItem, transferATokenMenuItem, updateATokenMenuItem, burnATokenMenuItem]

export const nftMenuCategory = [
  {
    name: 'Create A NFT',
    headline: 'Create NFT data on chain using Metaplex SDKs.',
    description: 'Create NFT data on chain using Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/create-nft',
  },
  {
    name: 'Read A NFT',
    headline: 'Read NFT data on chain using DAS and Metaplex SDKs.',
    description: 'Read NFT data on chain using DAS and Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/fetch-nft',
  },
  {
    name: 'Update A NFT',
    headline: 'Update NFT data on chain using DAS and Metaplex SDKs.',
    description: 'Update NFT data on chain using DAS and Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/update-nft',
  },
  {
    name: 'Burn A NFT',
    headline: 'Burn NFT data on chain using DAS and Metaplex SDKs.',
    description: 'Burn NFT data on chain using DAS and Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/transfer-nft',
  },
  {
    name: 'Transfer A NFT',
    headline: 'Transfer NFT data on chain using Metaplex SDKs.',
    description: 'Transfer NFT data on chain using Metaplex SDKs.',
    navigationMenuCatergory: 'NFTs',
    href: '/nfts/burn-nft',
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
    <div className="hidden cursor-pointer  gap-8 lg:flex">
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
                <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
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
              <Popover.Button className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
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
