'use client'

import { getLocalizedHref } from '@/config/languages';
import { useLocale, useTranslations } from '@/contexts/LocaleContext';
import { Popover } from '@headlessui/react';
import Link from 'next/link';
import { SwitcherPopover } from './products/SwitcherPopover';
import { productCategories } from './products/index';

const createATokenMenuItem = {
  name: 'Create A Token',
  headline: 'Create a fungible SPL token with metadata.',
  description: 'Create a fungible SPL token with metadata.',
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
  headline: 'Mint fungible tokens to a wallet address.',
  description: 'Mint fungible tokens to a wallet address.',
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
  headline: 'Update the metadata of a fungible token.',
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
  headline: 'Burn fungible tokens from circulation.',
  description: 'Burn fungible tokens from circulation.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/burn-tokens',
  localizedNavigation: {
    ja: { name: 'トークンをバーン', headline: 'Metaplex SDKを使用してトークンをバーンします。' },
    ko: { name: '토큰 소각', headline: 'Metaplex SDK를 사용하여 토큰을 소각합니다.' },
    zh: { name: '销毁代币', headline: '使用Metaplex SDK销毁代币。' },
  },
}

const anchorCreateTokenMenuItem = {
  name: 'Create Token with Anchor',
  headline: 'Build an SPL token with Rust and Anchor.',
  description: 'Build an SPL token with Rust and Anchor.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/anchor/create-token',
  localizedNavigation: {
    ja: { name: 'Anchorでトークンを作成', headline: 'RustとAnchorフレームワークを使用してトークンを作成します。' },
    ko: { name: 'Anchor로 토큰 생성', headline: 'Rust와 Anchor 프레임워크를 사용하여 토큰을 생성합니다.' },
    zh: { name: '使用Anchor创建代币', headline: '使用Rust和Anchor框架创建代币。' },
  },
}

const transferATokenMenuItem = {
  name: 'Transfer Tokens',
  headline: 'Transfer tokens between wallet addresses.',
  description: 'Transfer tokens between wallet addresses.',
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
  headline: 'Fair launch tokens on Solana with Genesis.',
  description: 'Fair launch tokens on Solana with Genesis.',
  navigationMenuCatergory: 'Tokens',
  href: '/tokens/launch-token',
  localizedNavigation: {
    ja: { name: 'トークンをローンチ', headline: 'Metaplex Genesisでトークンをローンチします。' },
    ko: { name: '토큰 런칭', headline: 'Metaplex Genesis로 토큰을 런칭합니다.' },
    zh: { name: '发行代币', headline: '使用Metaplex Genesis发行代币。' },
  },
}

export const tokenMenuCategory = [launchTokenMenuItem, createATokenMenuItem, mintTokensMenuItem, transferATokenMenuItem, updateATokenMenuItem, burnATokenMenuItem]

export const anchorTokenMenuCategory = [anchorCreateTokenMenuItem]

export const agentMenuCategory = [
  {
    name: 'Skill',
    headline: 'Metaplex knowledge base for AI agents.',
    description: 'Metaplex knowledge base for AI agents.',
    navigationMenuCatergory: 'Agents',
    href: '/agents/skill',
    localizedNavigation: {
      ja: { name: 'スキル', headline: 'AIエージェントの知識ベース' },
      ko: { name: '스킬', headline: 'AI 에이전트 지식 베이스' },
      zh: { name: '技能', headline: 'AI代理的知识库' },
    },
  },
  {
    name: 'Mint an Agent',
    headline: 'Mint an agent and register its Identity PDA.',
    description: 'Mint an agent and register its Identity PDA.',
    navigationMenuCatergory: 'Agents',
    href: '/agents/mint-agent',
    localizedNavigation: {
      ja: { name: 'エージェントのミント', headline: '1回のトランザクションでオンチェーンAIエージェントを作成します。' },
      ko: { name: '에이전트 민팅', headline: '단일 트랜잭션으로 온체인 AI 에이전트를 생성합니다.' },
      zh: { name: '铸造 Agent', headline: '在单笔交易中创建链上 AI Agent。' },
    },
  },
  {
    name: 'Register an Agent',
    headline: 'Register an agent on the Metaplex registry.',
    description: 'Register an agent on the Metaplex registry.',
    navigationMenuCatergory: 'Agents',
    href: '/agents/register-agent',
    localizedNavigation: {
      ja: { name: 'エージェントを登録', headline: 'Metaplex 014エージェントレジストリにエージェントを登録します。' },
      ko: { name: '에이전트 등록', headline: 'Metaplex 014 에이전트 레지스트리에 에이전트를 등록합니다.' },
      zh: { name: '注册代理', headline: '在Metaplex 014代理注册表上注册代理。' },
    },
  },
  {
    name: 'Read Agent Data',
    headline: 'Read and verify agent identity on Solana.',
    description: 'Read and verify agent identity on Solana.',
    navigationMenuCatergory: 'Agents',
    href: '/agents/run-agent',
    localizedNavigation: {
      ja: { name: 'エージェントデータを読み取る', headline: 'Solana上でエージェントIDを読み取り、検証します。' },
      ko: { name: '에이전트 데이터 읽기', headline: 'Solana에서 에이전트 ID를 읽고 검증합니다.' },
      zh: { name: '读取代理数据', headline: '在Solana上读取和验证代理身份。' },
    },
  },
  {
    name: 'Create an Agent Token',
    headline: 'Launch a token from an agent\'s onchain wallet.',
    description: 'Launch a token from an agent\'s onchain wallet.',
    navigationMenuCatergory: 'Agents',
    href: '/agents/create-agent-token',
    localizedNavigation: {
      ja: { name: 'エージェントトークンの作成', headline: 'エージェントのオンチェーンウォレットからトークンを発行します。' },
      ko: { name: '에이전트 토큰 생성', headline: '에이전트의 온체인 지갑에서 토큰을 발행합니다.' },
      zh: { name: '创建代理代币', headline: '从代理的链上钱包发行代币。' },
    },
  },
  {
    name: 'Run an Agent',
    headline: 'Delegate execution to run an agent on Solana.',
    description: 'Delegate execution to run an agent on Solana.',
    navigationMenuCatergory: 'Agents',
    href: '/agents/run-an-agent',
    localizedNavigation: {
      ja: { name: 'エージェントを実行', headline: '実行を委任して自律エージェントを実行します。' },
      ko: { name: '에이전트 실행', headline: '실행을 위임하여 자율 에이전트를 실행합니다.' },
      zh: { name: '运行代理', headline: '委托执行以运行自主代理。' },
    },
  },
]

export const nftMenuCategory = [
  {
    name: 'Create A NFT',
    headline: 'Mint an NFT on Solana with Metaplex Core.',
    description: 'Mint an NFT on Solana with Metaplex Core.',
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
    headline: 'Fetch NFT metadata from Solana via the DAS API.',
    description: 'Fetch NFT metadata from Solana via the DAS API.',
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
    headline: 'Update NFT metadata or royalties on Solana.',
    description: 'Update NFT metadata or royalties on Solana.',
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
    headline: 'Burn an NFT and reclaim its rent on Solana.',
    description: 'Burn an NFT and reclaim its rent on Solana.',
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
    headline: 'Transfer an NFT between wallets on Solana.',
    description: 'Transfer an NFT between wallets on Solana.',
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
      'Agents': t('agents', 'Agents'),
      'NFTs': t('nfts', 'NFTs'),
      'Programs': t('programs', 'Programs'),
      'Smart Contracts': t('smartContracts', 'Smart Contracts'),
      'Dev Tools': t('devTools', 'Dev Tools'),
      'Solana': t('solana', 'Solana'),
    }
    return categoryMap[category] || category
  }

  return (
    <div className="hidden cursor-pointer gap-6 nav:flex">
      {/* <div className="hidden flex-col nav:flex">
        <Link href={getLocalizedHref("/#", locale)}>
          <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
            {t('token', 'Tokens')}
          </div>
        </Link>
      </div>
      <div className="hidden flex-col nav:flex">
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
          'Agents': '/agents',
          'NFTs': '/nfts',
          'Smart Contracts': '/smart-contracts',
          'Dev Tools': '/dev-tools',
          'Solana': '/guides',
        }

        const path = categoryPaths[item]
        if (path) {
          return (
            <div className="hidden flex-col nav:flex" key={index}>
              <Link href={getLocalizedHref(path, locale)}>
                <div className="-mx-3 -my-2 whitespace-nowrap rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">
                  {getTranslatedCategory(item)}
                </div>
              </Link>
            </div>
          )
        }

        // Fallback to dropdown for any other categories
        return (
          <div className="hidden flex-col nav:flex" key={index}>
            <SwitcherPopover menuItem={productCategories[index]}>
              <Popover.Button className="-mx-3 -my-2 whitespace-nowrap rounded-lg px-3 py-2 text-black dark:text-white">
                {getTranslatedCategory(item)}
              </Popover.Button>
            </SwitcherPopover>
          </div>
        )
      })}

      {/* <div className="hidden flex-col nav:flex">
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
