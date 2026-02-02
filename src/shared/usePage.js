import { slugifyWithCounter } from '@sindresorhus/slugify'
import { useRouter } from 'next/router'

import { products } from '@/components/products'
import { useLocale } from '@/contexts/LocaleContext'
import { getLocalizedSections } from '@/shared/localizedSections'
import { getLocalizedHref } from '@/config/languages'

export function usePage(pageProps) {
  const { pathname } = useRouter()
  const { locale, t } = useLocale()
  
  // Remove locale prefix for product matching (for /ja/core -> core, /en/core -> core)
  // Note: For English, the pathname may be /en/* due to Next.js rewrites
  let normalizedPathname = pathname
  if (pathname.startsWith('/en/') || pathname === '/en') {
    normalizedPathname = pathname.slice('/en'.length) || '/'
  } else if (locale !== 'en' && pathname.startsWith(`/${locale}`)) {
    normalizedPathname = pathname.slice(`/${locale}`.length) || '/'
  }
  
  const title = pageProps.markdoc?.frontmatter.title ?? t('meta.defaultTitle', 'Metaplex Documentation')
  const rawProduct = getActiveProduct(normalizedPathname, pageProps)
  const product = rawProduct ? localizeProduct(rawProduct, locale) : rawProduct
  // Pass both normalized pathname (for section matching) and original pathname (for link matching after localization)
  const activeSection = getActiveSection(normalizedPathname, product, pageProps, pathname)
  const activeHero = getActiveHero(normalizedPathname, product, pageProps)

  // Special handling for 404 pages - localize the title
  const localizedTitle = title === 'Page Not Found' ? t('404.title') : title
  const localizedMetaTitle = pageProps.markdoc?.frontmatter.metaTitle === 'Page Not Found | Metaplex Developer Hub' 
    ? t('404.metaTitle') 
    : (pageProps.markdoc?.frontmatter.metaTitle ?? localizedTitle)

  return {
    title: localizedTitle,
    metaTitle: localizedMetaTitle,
    description: pageProps.markdoc?.frontmatter.description,
    created: pageProps.markdoc?.frontmatter.created ?? null,
    updated: pageProps.markdoc?.frontmatter.updated ?? null,
    pathname: normalizedPathname,
    originalPathname: pathname,
    locale,
    product,
    activeHero,
    activeSection,
    isIndexPage: product?.path ? normalizedPathname === `/${product.path}` : normalizedPathname === '/',
    tableOfContents: pageProps.markdoc?.frontmatter.tableOfContents != false && pageProps.markdoc?.content
      ? parseTableOfContents(pageProps.markdoc.content)
      : [],
    // Enhanced JSON-LD schema fields
    keywords: pageProps.markdoc?.frontmatter.keywords ?? null,
    about: pageProps.markdoc?.frontmatter.about ?? null,
    proficiencyLevel: pageProps.markdoc?.frontmatter.proficiencyLevel ?? null,
    programmingLanguage: pageProps.markdoc?.frontmatter.programmingLanguage ?? null,
    faqs: pageProps.markdoc?.frontmatter.faqs ?? null,
    howToSteps: pageProps.markdoc?.frontmatter.howToSteps ?? null,
    howToTools: pageProps.markdoc?.frontmatter.howToTools ?? null,
  }
}

function getActiveProduct(pathname, pageProps) {
  const normalizedPathname = pathname.replace(/^\/|\/$/, '')
  const foundProduct = products.find((product) => {
    const defaultIsPageFromProduct = () => {
      if (product.isFallbackProduct) return false
      // Support nested paths like 'smart-contracts/core'
      // Check if pathname starts with product.path
      return normalizedPathname === product.path ||
             normalizedPathname.startsWith(`${product.path}/`)
    }
    return product.isPageFromProduct
      ? product.isPageFromProduct({ pathname, product, pageProps })
      : defaultIsPageFromProduct()
  })
  if (foundProduct) return foundProduct

  const fallbackProduct = products.find((product) => product.isFallbackProduct)
  if (fallbackProduct) return fallbackProduct

  throw new Error('No product found')
}

function getActiveHero(pathname, product, pageProps) {
  if (!product?.heroes) return undefined
  return (
    product.heroes.find((hero) => {
      return hero.doesPageHaveHero
        ? hero.doesPageHaveHero({ pathname, hero, product, pageProps })
        : pathname === hero.path
    })?.component ?? undefined
  )
}

function getActiveSection(pathname, product, pageProps, originalPathname) {
  if (!product?.sections) return undefined

  // Find active section.
  const foundSection = product.sections.find((section) => {
    const defaultIsPageFromSection = () => {
      if (section.isFallbackSection) return false
      return (
        pathname.startsWith(`${section.href}/`) || pathname === section.href
      )
    }
    return section.isPageFromSection
      ? section.isPageFromSection({ pathname, section, product, pageProps })
      : defaultIsPageFromSection()
  })
  const fallbackSection = product.sections.find(
    (section) => section.isFallbackSection
  )
  const activeSection =
    foundSection || fallbackSection
      ? { ...(foundSection ?? fallbackSection) }
      : undefined

  // Add navigation helpers.
  // For non-English locales, links are localized with locale prefix, so use originalPathname
  // For English, links don't have /en/ prefix, so use normalized pathname
  if (activeSection && activeSection.navigation) {
    const allLinks = activeSection.navigation.flatMap((group) => group.links)
    // Check if links have locale prefix by looking at first link
    const linksHaveLocalePrefix = allLinks.length > 0 && allLinks[0].href.match(/^\/(?:ja|ko|zh)\//)
    const linkPathname = linksHaveLocalePrefix ? originalPathname : pathname
    const linkIndex = allLinks.findIndex((link) => link.href === linkPathname)
    activeSection.previousPage = allLinks[linkIndex - 1]
    activeSection.nextPage = allLinks[linkIndex + 1]
    activeSection.navigationGroup = activeSection.navigation.find((group) =>
      group.links.find((link) => link.href === linkPathname)
    )
  }

  return activeSection
}

function parseTableOfContents(nodes, slugify = slugifyWithCounter()) {
  let sections = []

  for (let node of nodes) {
    if (node.name === 'h2' || node.name === 'h3') {
      let title = getNodeText(node)
      if (title) {
        let id = node.attributes.id ?? slugify(title)
        node.attributes.id = id
        if (node.name === 'h3') {
          if (!sections[sections.length - 1]) {
            throw new Error(
              'Cannot add `h3` to table of contents without a preceding `h2`'
            )
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          })
        } else {
          sections.push({ ...node.attributes, title, children: [] })
        }
      }
    }

    sections.push(...parseTableOfContents(node.children ?? [], slugify))
  }

  return sections
}

function getNodeText(node) {
  let text = ''
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

function localizeProduct(product, locale) {
  if (locale === 'en') return product

  const sections = getLocalizedSections(locale)

  // Helper to adjust href paths for non-English locales
  const getHref = (path) => getLocalizedHref(path, locale)

  // Clone the product to avoid mutating the original
  const localizedProduct = { ...product }

  // Localize product headline and description
  if (product.localizedNavigation && product.localizedNavigation[locale]) {
    const productNav = product.localizedNavigation[locale]
    if (productNav.headline) {
      localizedProduct.headline = productNav.headline
    }
    if (productNav.description) {
      localizedProduct.description = productNav.description
    }
  }

  // Localize sections
  if (product.sections) {
    localizedProduct.sections = product.sections.map(section => {
      const localizedSection = { ...section }

      // Update section title based on section id
      if (section.id === 'documentation') {
        localizedSection.title = sections.documentationSection().title
      } else if (section.id === 'guides') {
        localizedSection.title = sections.guidesSection().title
      } else if (section.id === 'references') {
        localizedSection.title = sections.referencesSection().title
      } else if (section.id === 'changelog') {
        localizedSection.title = sections.changelogSection().title
      }

      // Update href for non-English locales
      if (section.href && locale !== 'en') {
        localizedSection.href = getHref(section.href)
      }

      // Localize navigation using product-specific translations
      if (product.localizedNavigation && product.localizedNavigation[locale] && section.navigation) {
        const productNav = product.localizedNavigation[locale]
        localizedSection.navigation = section.navigation.map(navGroup => ({
          ...navGroup,
          title: (productNav.sections && productNav.sections[navGroup.title]) || navGroup.title,
          links: navGroup.links.map(link => ({
            ...link,
            title: (productNav.links && productNav.links[link.title]) || link.title,
            href: getHref(link.href)
          }))
        }))
      } else if (section.navigation) {
        // Even without translations, update hrefs for non-English locales
        localizedSection.navigation = section.navigation.map(navGroup => ({
          ...navGroup,
          links: navGroup.links.map(link => ({
            ...link,
            href: getHref(link.href)
          }))
        }))
      }

      return localizedSection
    })
  }

  return localizedProduct
}

