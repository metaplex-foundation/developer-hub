/**
 * Centralized Navigation Translations
 *
 * This file contains all common navigation translations used across products.
 * It eliminates duplication and provides a single source of truth for navigation text.
 *
 * Structure:
 * - Common section titles
 * - Common link titles
 * - Product-specific headlines and descriptions
 *
 * Usage:
 * - Use translation keys (e.g., 'nav.overview') instead of literal strings
 * - Call resolveNavigationTranslation(key, locale) to get translated text
 *
 * IMPORTANT: Translations marked with [REVIEW] need native-speaker verification
 */

export const NAVIGATION_TRANSLATIONS = {
  // Common Navigation Sections
  sections: {
    introduction: {
      en: 'Introduction',
      ja: '紹介',
      ko: '소개'
    },
    sdk: {
      en: 'SDK',
      ja: 'SDK',
      ko: 'SDK'
    },
    features: {
      en: 'Features',
      ja: '機能',
      ko: '기능'
    },
    advanced: {
      en: 'Advanced',
      ja: '高度',
      ko: '고급'
    },
    guides: {
      en: 'Guides',
      ja: 'ガイド',
      ko: '가이드'
    },
    references: {
      en: 'References',
      ja: 'リファレンス',
      ko: '참조'
    },
    methods: {
      en: 'Methods & Playground',
      ja: 'メソッドとプレイグラウンド',
      ko: '메서드와 플레이그라운드'
    },
    coreExtension: {
      en: 'Core Extension SDK',
      ja: 'Core拡張SDK',
      ko: 'Core 확장 SDK'
    }
  },

  // Common Navigation Links
  links: {
    overview: {
      en: 'Overview',
      ja: '概要',
      ko: '개요'
    },
    gettingStarted: {
      en: 'Getting Started',
      ja: 'はじめに',
      ko: '시작하기'
    },
    faq: {
      en: 'FAQ',
      ja: 'よくある質問',
      ko: '자주 묻는 질문'
    },
    javascript: {
      en: 'JavaScript',
      ja: 'JavaScript',
      ko: 'JavaScript'
    },
    rust: {
      en: 'Rust',
      ja: 'Rust',
      ko: 'Rust'
    },
    guidesOverview: {
      en: 'Guides Overview',
      ja: 'ガイド概要',
      ko: '가이드 개요'
    },
    // DAS API specific
    dasApiProviders: {
      en: 'DAS API RPC Providers',
      ja: 'DAS API RPCプロバイダー',
      ko: 'DAS API RPC 제공업체'
    },
    displayOptions: {
      en: 'Display Options',
      ja: '表示オプション',
      ko: '표시 옵션'
    },
    methodOverview: {
      en: 'Method Overview',
      ja: 'メソッド概要',
      ko: '메서드 개요'
    },
    getAsset: {
      en: 'Get Asset',
      ja: 'アセットの取得',
      ko: '에셋 가져오기'
    },
    getAssets: {
      en: 'Get Assets',
      ja: '複数アセットの取得',
      ko: '여러 에셋 가져오기'
    },
    getAssetProof: {
      en: 'Get Asset Proof',
      ja: 'アセット証明の取得',
      ko: '에셋 증명 가져오기'
    },
    getAssetProofs: {
      en: 'Get Asset Proofs',
      ja: '複数アセット証明の取得',
      ko: '여러 에셋 증명 가져오기'
    },
    getAssetSignatures: {
      en: 'Get Asset Signatures',
      ja: 'アセット署名の取得',
      ko: '에셋 서명 가져오기'
    },
    getAssetsByAuthority: {
      en: 'Get Assets By Authority',
      ja: '権限別アセットの取得',
      ko: '권한별 에셋 가져오기'
    },
    getAssetsByCreator: {
      en: 'Get Assets By Creator',
      ja: '作成者別アセットの取得',
      ko: '생성자별 에셋 가져오기'
    },
    getAssetsByGroup: {
      en: 'Get Assets By Group',
      ja: 'グループ別アセットの取得',
      ko: '그룹별 에셋 가져오기'
    },
    getAssetsByOwner: {
      en: 'Get Assets By Owner',
      ja: '所有者別アセットの取得',
      ko: '소유자별 에셋 가져오기'
    },
    getNftEditions: {
      en: 'Get NFT Editions',
      ja: 'NFTエディションの取得',
      ko: 'NFT 에디션 가져오기'
    },
    getTokenAccounts: {
      en: 'Get Token Accounts',
      ja: 'トークンアカウントの取得',
      ko: '토큰 계정 가져오기'
    },
    searchAssets: {
      en: 'Search Assets',
      ja: 'アセットの検索',
      ko: '에셋 검색'
    },
    pagination: {
      en: 'Pagination',
      ja: 'ページネーション',
      ko: '페이지네이션'
    },
    getCollectionNfts: {
      en: 'Get Collection NFTs',
      ja: 'コレクションNFTの取得',
      ko: '컬렉션 NFT 가져오기'
    },
    getNftsByOwner: {
      en: 'Get NFTs by Owner',
      ja: '所有者別NFTの取得',
      ko: '소유자별 NFT 가져오기'
    },
    getWalletTokens: {
      en: 'Get Wallet Tokens',
      ja: 'ウォレットトークンの取得',
      ko: '지갑 토큰 가져오기'
    },
    getFungibleAssets: {
      en: 'Get Fungible Assets',
      ja: 'ファンジブルアセットの取得',
      ko: '대체 가능 에셋 가져오기'
    },
    searchByCriteria: {
      en: 'Search by Criteria',
      ja: '条件による検索',
      ko: '조건별 검색'
    },
    ownerAndCollection: {
      en: 'Owner and Collection',
      ja: '所有者とコレクション',
      ko: '소유자와 컬렉션'
    },
    findCompressedNfts: {
      en: 'Find Compressed NFTs',
      ja: '圧縮NFTの検索',
      ko: '압축 NFT 찾기'
    },
    collectionStatistics: {
      en: 'Collection Statistics',
      ja: 'コレクション統計',
      ko: '컬렉션 통계'
    },
    findTokenHolders: {
      en: 'Find Token Holders',
      ja: 'トークン保有者の検索',
      ko: '토큰 보유자 찾기'
    },
    extensionOverview: {
      en: 'Extension Overview',
      ja: '拡張機能の概要',
      ko: '확장 개요'
    },
    getCoreAsset: {
      en: 'Get Core Asset',
      ja: 'Coreアセットの取得',
      ko: 'Core 에셋 가져오기'
    },
    getCoreCollection: {
      en: 'Get Core Collection',
      ja: 'Coreコレクションの取得',
      ko: 'Core 컬렉션 가져오기'
    },
    getCoreAssetsByAuthority: {
      en: 'Get Core Assets By Authority',
      ja: '権限別Coreアセットの取得',
      ko: '권한별 Core 에셋 가져오기'
    },
    getCoreAssetsByCollection: {
      en: 'Get Core Assets By Collection',
      ja: 'コレクション別Coreアセットの取得',
      ko: '컬렉션별 Core 에셋 가져오기'
    },
    getCoreAssetsByOwner: {
      en: 'Get Core Assets By Owner',
      ja: '所有者別Coreアセットの取得',
      ko: '소유자별 Core 에셋 가져오기'
    },
    searchCoreAssets: {
      en: 'Search Core Assets',
      ja: 'Coreアセットの検索',
      ko: 'Core 에셋 검색'
    },
    searchCoreCollections: {
      en: 'Search Core Collections',
      ja: 'Coreコレクションの検索',
      ko: 'Core 컬렉션 검색'
    },
    pluginDerivation: {
      en: 'Plugin Derivation',
      ja: 'プラグインの導出',
      ko: '플러그인 파생'
    },
    typeConversion: {
      en: 'Type Conversion',
      ja: '型変換',
      ko: '타입 변환'
    },
    // Bubblegum specific
    metaplexDasApiRpcs: {
      en: 'Metaplex DAS API RPCs',
      ja: 'Metaplex DAS API RPC',
      ko: 'Metaplex DAS API RPC'
    },
    creatingBubblegumTrees: {
      en: 'Creating Bubblegum Trees',
      ja: 'Bubblegumツリーの作成',
      ko: 'Bubblegum 트리 생성'
    },
    mintingCnfts: {
      en: 'Minting Compressed NFTs (cNFTs)',
      ja: '圧縮NFT（cNFT）のミント',
      ko: '압축 NFT(cNFT) 민팅'
    },
    fetchingCnfts: {
      en: 'Fetching cNFTs',
      ja: 'cNFTの取得',
      ko: 'cNFT 가져오기'
    },
    transferringCnfts: {
      en: 'Transferring cNFTs',
      ja: 'cNFTの転送',
      ko: 'cNFT 전송'
    },
    freezeAndThawCnfts: {
      en: 'Freeze and Thaw cNFTs',
      ja: 'cNFTの凍結と解凍',
      ko: 'cNFT 동결 및 해제'
    },
    updatingCnfts: {
      en: 'Updating cNFTs',
      ja: 'cNFTの更新',
      ko: 'cNFT 업데이트'
    },
    burningCnfts: {
      en: 'Burning cNFTs',
      ja: 'cNFTのバーン',
      ko: 'cNFT 소각'
    },
    delegatingCnfts: {
      en: 'Delegating cNFTs',
      ja: 'cNFTのデリゲート',
      ko: 'cNFT 위임'
    },
    delegatingTrees: {
      en: 'Delegating Trees',
      ja: 'ツリーのデリゲート',
      ko: '트리 위임'
    },
    collections: {
      en: 'Collections',
      ja: 'コレクション',
      ko: '컬렉션'
    },
    verifyingCreators: {
      en: 'Verifying Creators',
      ja: '作成者の検証',
      ko: '크리에이터 검증'
    },
    concurrentMerkleTrees: {
      en: 'Concurrent Merkle Trees',
      ja: '同時マークルツリー',
      ko: '동시 머클 트리'
    },
    storingAndIndexingNftData: {
      en: 'Storing and Indexing NFT Data',
      ja: 'NFTデータの保存とインデックス化',
      ko: 'NFT 데이터 저장 및 인덱싱'
    },
    hashingNftData: {
      en: 'Hashing NFT Data',
      ja: 'NFTデータのハッシュ化',
      ko: 'NFT 데이터 해싱'
    },
    merkleTreeCanopy: {
      en: 'Merkle Tree Canopy',
      ja: 'マークルツリーキャノピー',
      ko: '머클 트리 캐노피'
    }
  },

  // Product-specific headlines and descriptions
  products: {
    dasApi: {
      headline: {
        en: 'Fetch Digital Asset Data',
        ja: 'デジタルアセットデータの取得',
        ko: '디지털 에셋 데이터 가져오기'
      },
      description: {
        en: 'A DAS API Client to access Digital Asset data on chain',
        ja: 'オンチェーンデジタルアセットデータにアクセスするDAS APIクライアント',
        ko: '온체인 디지털 에셋 데이터에 접근하는 DAS API 클라이언트'
      }
    },
    bubblegumV2: {
      headline: {
        en: 'Improved Compressed NFTs',
        ja: '改良された圧縮NFT',
        ko: '개선된 압축 NFT'
      },
      description: {
        en: 'NFTs that scale to new orders of magnitude.',
        ja: '新たな桁のスケールを実現するNFT。',
        ko: '새로운 차원의 확장성을 제공하는 NFT입니다.'
      }
    }
  }
}

/**
 * Resolve a translation key to its localized value
 *
 * @param {string} key - Translation key (e.g., 'nav.sections.introduction')
 * @param {string} locale - Target locale (en, ja, ko)
 * @param {string} fallback - Fallback text if translation not found
 * @returns {string} Translated text or fallback
 */
export function resolveNavigationTranslation(key, locale = 'en', fallback = '') {
  const parts = key.split('.')
  let current = NAVIGATION_TRANSLATIONS

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      // Key not found, return fallback or key itself
      return fallback || key
    }
  }

  // If we have a translation object, get the locale value
  if (current && typeof current === 'object' && locale in current) {
    return current[locale]
  }

  // Fallback to English if locale not found
  if (current && typeof current === 'object' && 'en' in current) {
    return current.en
  }

  return fallback || key
}

/**
 * Build translations object for a product using keys OR inline translations
 *
 * This helper generates the localizedNavigation structure from translation keys.
 * Supports both centralized keys and product-specific inline translations.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.productKey - Product key for headline/description (uses centralized)
 * @param {Object} config.headlineTranslations - Inline translations for headline { ja: '...', ko: '...' }
 * @param {Object} config.descriptionTranslations - Inline translations for description { ja: '...', ko: '...' }
 * @param {Object} config.sectionKeys - Map of section titles to translation keys or inline translations
 * @param {Object} config.linkKeys - Map of link titles to translation keys or inline translations
 * @returns {Object} Complete localizedNavigation object for ja, ko
 *
 * @example
 * // Using centralized keys (preferred for common terms)
 * buildProductTranslations({
 *   linkKeys: {
 *     'Overview': 'links.overview'  // Uses centralized translation
 *   }
 * })
 *
 * @example
 * // Using inline translations (preferred for product-specific terms)
 * buildProductTranslations({
 *   linkKeys: {
 *     'Custom Feature': { ja: 'カスタム機能', ko: '커스텀 기능' }
 *   }
 * })
 *
 * @example
 * // Mixed approach (best of both worlds)
 * buildProductTranslations({
 *   linkKeys: {
 *     'Overview': 'links.overview',  // Common term - use centralized
 *     'Rare Product Feature': { ja: 'レア機能', ko: '희귀 기능' }  // Specific - inline
 *   }
 * })
 */
export function buildProductTranslations({
  productKey,
  headlineTranslations,
  descriptionTranslations,
  sectionKeys = {},
  linkKeys = {}
}) {
  const locales = ['ja', 'ko']
  const translations = {}

  locales.forEach(locale => {
    translations[locale] = {}

    // Priority 1: Use inline translations if provided (product-specific)
    if (headlineTranslations && headlineTranslations[locale]) {
      translations[locale].headline = headlineTranslations[locale]
    }
    // Priority 2: Fall back to centralized productKey
    else if (productKey && NAVIGATION_TRANSLATIONS.products[productKey]) {
      translations[locale].headline = NAVIGATION_TRANSLATIONS.products[productKey].headline[locale]
    }

    // Same for description
    if (descriptionTranslations && descriptionTranslations[locale]) {
      translations[locale].description = descriptionTranslations[locale]
    }
    else if (productKey && NAVIGATION_TRANSLATIONS.products[productKey]) {
      translations[locale].description = NAVIGATION_TRANSLATIONS.products[productKey].description[locale]
    }

    // Build sections translations
    if (Object.keys(sectionKeys).length > 0) {
      translations[locale].sections = {}
      Object.entries(sectionKeys).forEach(([title, keyOrTranslations]) => {
        // Check if it's an inline translation object { ja: '...', ko: '...' }
        if (typeof keyOrTranslations === 'object' && keyOrTranslations[locale]) {
          translations[locale].sections[title] = keyOrTranslations[locale]
        } else if (typeof keyOrTranslations === 'string') {
          // It's a key reference - resolve from centralized translations
          translations[locale].sections[title] = resolveNavigationTranslation(keyOrTranslations, locale, title)
        } else {
          // Fallback to title itself
          translations[locale].sections[title] = title
        }
      })
    }

    // Build links translations
    if (Object.keys(linkKeys).length > 0) {
      translations[locale].links = {}
      Object.entries(linkKeys).forEach(([title, keyOrTranslations]) => {
        // Check if it's an inline translation object { ja: '...', ko: '...' }
        if (typeof keyOrTranslations === 'object' && keyOrTranslations[locale]) {
          translations[locale].links[title] = keyOrTranslations[locale]
        } else if (typeof keyOrTranslations === 'string') {
          // It's a key reference - resolve from centralized translations
          translations[locale].links[title] = resolveNavigationTranslation(keyOrTranslations, locale, title)
        } else {
          // Fallback to title itself
          translations[locale].links[title] = title
        }
      })
    }
  })

  return translations
}
