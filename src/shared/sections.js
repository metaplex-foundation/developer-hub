export const documentationSection = (productSlug) => ({
  id: 'documentation',
  title: 'Documentation',
  icon: 'SolidBookOpen',
  href: `/${productSlug}`,
  isFallbackSection: true,
})

export const referencesSection = (productSlug) => ({
  id: 'references',
  title: 'API References',
  icon: 'SolidCodeBracketSquare',
  href: `/${productSlug}/references`,
})

export const guidesSection = (productSlug) => ({
  id: 'guides',
  title: 'Guides',
  icon: 'SolidRectangleStack',
  href: `/${productSlug}/guides`,
})

export const recipesSection = (productSlug) => ({
  id: 'recipes',
  title: 'Recipes',
  icon: 'SolidRectangleStack',
  href: `/${productSlug}/recipes`,
})

export const changelogSection = (productSlug) => ({
  id: 'changelog',
  title: 'Changelog',
  icon: 'SolidClock',
  href: `/${productSlug}/changelog`,
})
