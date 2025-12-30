// Simple helper to get translated product names
export const getProductTranslation = (productKey, locale = 'en') => {
  const translations = {
    en: {
      core: 'Core',
      candyMachine: 'Candy Machine',
      coreCandyMachine: 'Core Candy Machine',
      tokenMetadata: 'Token Metadata',
      bubblegum: 'Bubblegum',
      bubblegumV2: 'Bubblegum V2',
      mplHybrid: 'MPL Hybrid',
      tokenAuthRules: 'Token Auth Rules',
      fusion: 'Fusion',
      hydra: 'Hydra',
      inscription: 'Inscription',
      dasApi: 'DAS API',
      umi: 'UMI',
      cli: 'CLI',
      shank: 'Shank',
      amman: 'Amman',
      sugar: 'Sugar',
      legacyDocumentation: 'Legacy Documentation',
      guides: 'Guides'
    },
    ja: {
      core: 'Core',
      candyMachine: 'Candy Machine',
      coreCandyMachine: 'Core Candy Machine',
      tokenMetadata: 'Token Metadata',
      bubblegum: 'Bubblegum',
      bubblegumV2: 'Bubblegum V2',
      mplHybrid: 'MPL Hybrid',
      tokenAuthRules: 'Token Auth Rules',
      fusion: 'Fusion',
      hydra: 'Hydra',
      inscription: 'Inscription',
      dasApi: 'DAS API',
      umi: 'UMI',
      cli: 'CLI',
      shank: 'Shank',
      amman: 'Amman',
      sugar: 'Sugar',
      legacyDocumentation: 'レガシードキュメント',
      guides: 'ガイド'
    },
    ko: {
      core: 'Core',
      candyMachine: 'Candy Machine',
      coreCandyMachine: 'Core Candy Machine',
      tokenMetadata: 'Token Metadata',
      bubblegum: 'Bubblegum',
      bubblegumV2: 'Bubblegum V2',
      mplHybrid: 'MPL Hybrid',
      tokenAuthRules: 'Token Auth Rules',
      fusion: 'Fusion',
      hydra: 'Hydra',
      inscription: 'Inscription',
      dasApi: 'DAS API',
      umi: 'UMI',
      cli: 'CLI',
      shank: 'Shank',
      amman: 'Amman',
      sugar: 'Sugar',
      legacyDocumentation: '레거시 문서',
      guides: '가이드'
    }
  };

  return translations[locale]?.[productKey] || translations.en[productKey] || productKey;
};