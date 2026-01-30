import { getLocalizedHref } from '@/config/languages'
import { useLocale, useTranslations } from '@/contexts/LocaleContext'
import Link from 'next/link'
import { anchorTokenMenuCategory, nftMenuCategory, tokenMenuCategory } from '../NavList'
import { Card, CardContent } from '../ui/card'
import { products as allProducts, productCategories } from './index'

const ProductCard = ({ item, locale, learnMoreText }) => {
  const href = getLocalizedHref(item.href || `/${item.path}`, locale)

  return (
    <Link
      href={href}
      // className="group relative flex flex-col rounded-lg border border-border bg-transparent p-6 transition-all duration-200 hover:border-accent-400"
      {...(item.target && { target: item.target })}
    >
      <Card className="hover:border-accent-400 group relative flex flex-col">
        <CardContent className="p-0">
          <h3 className="text-sm font-medium text-balance md:text-lg">
            {item.name}
          </h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">
            {item.headline || item.description}
          </p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-accent-400">
            {learnMoreText}
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ProductCardGrid({ category }) {
  const { locale } = useLocale()
  const t = useTranslations('homepage')

  // Get items based on category
  let items = []

  if (category === 'Tokens') {
    items = tokenMenuCategory
  } else if (category === 'NFTs') {
    items = nftMenuCategory;
  } else if (category === 'Anchor') {
    items = anchorTokenMenuCategory;
  } else {
    // For Smart Contracts and Dev Tools, use products
    items = allProducts.filter(
      (product) =>
        category === product.navigationMenuCatergory && !product.deprecated
    )
  }

  // Localize product names, headlines and descriptions
  const localizeItem = (item) => {
    if (
      locale === 'en' ||
      !item.localizedNavigation ||
      !item.localizedNavigation[locale]
    ) {
      return item
    }

    const localizedItem = { ...item }
    const itemNav = item.localizedNavigation[locale]

    if (itemNav.name) {
      localizedItem.name = itemNav.name
    }
    if (itemNav.headline) {
      localizedItem.headline = itemNav.headline
    }
    if (itemNav.description) {
      localizedItem.description = itemNav.description
    }

    return localizedItem
  }

  const learnMoreText = t('learnMore', 'Learn more')

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => {
        const localizedItem = localizeItem(item)
        return (
          <ProductCard
            key={item.path || item.href}
            item={localizedItem}
            locale={locale}
            learnMoreText={learnMoreText}
          />
        )
      })}
    </div>
  )
}

export function AllProductCardGrids() {
  const t = useTranslations('homepage')

  const getCategoryName = (category) => {
    const categoryKeys = {
      Tokens: 'tokens',
      NFTs: 'nfts',
      'Smart Contracts': 'smartContracts',
      'Dev Tools': 'devTools',
    }
    const key = categoryKeys[category]
    return key ? t(`categories.${key}`, category) : category
  }

  const getCategoryDescription = (category) => {
    const categoryKeys = {
      Tokens: 'tokens',
      NFTs: 'nfts',
      'Smart Contracts': 'smartContracts',
      'Dev Tools': 'devTools',
    }
    const key = categoryKeys[category]
    const defaultDescriptions = {
      Tokens:
        'Create, read, update, burn, and transfer tokens on the Solana blockchain using Metaplex SDKs.',
      NFTs: 'Create, read, update, burn, and transfer NFTs on the Solana blockchain using Metaplex SDKs.',
      'Smart Contracts':
        'On-chain programs for creating and managing digital assets on Solana.',
      'Dev Tools':
        'Tools and utilities to help you build with Metaplex programs.',
    }
    return key
      ? t(`categoryDescriptions.${key}`, defaultDescriptions[category] || '')
      : ''
  }

  return (
    <div className="not-prose">
      {productCategories.map((category) => (
        <div
          key={category}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            {getCategoryName(category)}
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            {getCategoryDescription(category)}
          </p>
          <ProductCardGrid category={category} />
        </div>
      ))}
    </div>
  )
}

// Markdoc wrapper for use in markdown files
export function MarkdocProductCardGrid({ category }) {
  return (
    <div className="not-prose">
      <ProductCardGrid category={category} />
    </div>
  )
}
