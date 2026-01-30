import { useState, useEffect, createContext, useContext } from 'react'
import clsx from 'clsx'
import { Fence } from '../Fence'
import CopyToClipboardButton from '../products/CopyToClipboard'

// Context to share active language between CodeTabs and CodeTab
const CodeTabsContext = createContext()

/**
 * Extract text content from Markdoc children
 * Markdoc may pass children as nested objects/arrays, so we need to recursively extract text
 */
function extractTextFromChildren(children) {
  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('')
  }

  if (children && typeof children === 'object') {
    // Markdoc fence nodes have the code in children
    if (children.props && children.props.content) {
      return children.props.content
    }
    if (children.props && children.props.children) {
      return extractTextFromChildren(children.props.children)
    }
    if (children.children) {
      return extractTextFromChildren(children.children)
    }
    // Check if it's a React element with props.children
    if (children.type && children.props) {
      return extractTextFromChildren(children.props.children)
    }
  }

  return String(children || '')
}

/**
 * CodeTabs - Multi-language code block component with tabs
 *
 * Allows displaying the same code example in multiple programming languages
 * with persistent language preference storage.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - CodeTab components
 * @param {string} props.defaultLanguage - Default language to show (e.g., 'javascript')
 * @param {boolean} props.persist - Whether to save preference to localStorage (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onLanguageChange - Callback when language changes
 *
 * @example
 * <CodeTabs defaultLanguage="javascript">
 *   <CodeTab language="javascript" label="JavaScript">
 *     const x = 1
 *   </CodeTab>
 *   <CodeTab language="rust" label="Rust">
 *     let x = 1;
 *   </CodeTab>
 * </CodeTabs>
 */
export function CodeTabs({
  children,
  defaultLanguage = 'javascript',
  persist = true,
  className,
  onLanguageChange,
}) {
  // Extract CodeTab children and their languages
  const tabs = Array.isArray(children) ? children : [children]
  const validTabs = tabs.filter(Boolean)

  // Create unique IDs for each tab (use index since labels might repeat)
  const tabsWithIds = validTabs.map((tab, index) => ({
    ...tab,
    tabId: `tab-${index}`,
    index,
  }))

  // Always start with the default language tab on initial render (both server and client)
  // This prevents hydration mismatch errors
  const defaultIndex = Math.max(
    0,
    tabsWithIds.findIndex(t => t.props.language === defaultLanguage)
  )

  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex)
  const [isHydrated, setIsHydrated] = useState(false)

  // After hydration, update to user's preferred language if available
  useEffect(() => {
    if (!isHydrated && persist && typeof window !== 'undefined') {
      const preferredLang = localStorage.getItem('preferred-code-language')
      if (preferredLang) {
        const index = tabsWithIds.findIndex(t => t.props.language === preferredLang)
        if (index >= 0 && index !== defaultIndex) {
          setActiveTabIndex(index)
        }
      }
      setIsHydrated(true)
    }
  }, [isHydrated, persist, tabsWithIds, defaultIndex])

  // Ensure active tab index is valid when tabs change
  useEffect(() => {
    if (activeTabIndex >= tabsWithIds.length) {
      setActiveTabIndex(0)
    }
  }, [tabsWithIds.length, activeTabIndex])

  const handleTabChange = (index) => {
    setActiveTabIndex(index)
    const language = tabsWithIds[index]?.props.language

    // Save to localStorage
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem('preferred-code-language', language)
    }

    // Call callback if provided
    if (onLanguageChange) {
      onLanguageChange(language)
    }

    // Track analytics
    if (typeof window !== 'undefined' && window.gtag) {
      const prevLanguage = tabsWithIds[activeTabIndex]?.props.language
      window.gtag('event', 'code_language_switched', {
        from: prevLanguage,
        to: language,
      })
    }
  }

  const activeLanguage = tabsWithIds[activeTabIndex]?.props.language

  return (
    <CodeTabsContext.Provider value={{ activeLanguage, setActiveLanguage: (lang) => {
      const index = tabsWithIds.findIndex(t => t.props.language === lang)
      if (index >= 0) handleTabChange(index)
    }}}>
      <div className={clsx('code-tabs not-prose my-6 overflow-hidden rounded-lg border border-border', className)}>
        {/* Tab buttons */}
        <div
          className="flex items-center gap-2 overflow-x-auto border-b border-border bg-muted px-4"
          role="tablist"
          aria-label="Code examples in different languages"
        >
          {tabsWithIds.map((tab, index) => {
            const { language, label } = tab.props
            const isActive = activeTabIndex === index

            return (
              <button
                key={tab.tabId}
                onClick={() => handleTabChange(index)}
                className={clsx(
                  'relative whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
                role="tab"
                aria-selected={isActive}
                aria-controls={`code-panel-${tab.tabId}`}
                id={`tab-${tab.tabId}`}
              >
                {label || language.charAt(0).toUpperCase() + language.slice(1)}
              </button>
            )
          })}
        </div>

        {/* Tab panels */}
        <div className="relative">
          {tabsWithIds.map((tab, index) => {
            const { language, children: code } = tab.props
            const isActive = activeTabIndex === index

            // Extract text content from Markdoc structure
            const codeString = extractTextFromChildren(code)

            return (
              <div
                key={tab.tabId}
                role="tabpanel"
                id={`code-panel-${tab.tabId}`}
                aria-labelledby={`tab-${tab.tabId}`}
                hidden={!isActive}
                className={clsx(!isActive && 'hidden')}
              >
                {/* Render the code using existing Fence component */}
                <Fence language={language}>{codeString}</Fence>
              </div>
            )
          })}
        </div>
      </div>
    </CodeTabsContext.Provider>
  )
}

/**
 * CodeTab - Individual tab within CodeTabs
 *
 * Must be used as a child of CodeTabs component.
 *
 * @param {Object} props
 * @param {string} props.language - Programming language (e.g., 'javascript', 'rust')
 * @param {string} props.label - Display label for the tab (optional, defaults to capitalized language)
 * @param {string} props.children - The code content
 *
 * @example
 * <CodeTab language="javascript" label="JavaScript">
 *   const x = 1
 * </CodeTab>
 */
export function CodeTab({ language, label, children }) {
  // This component is just a container for props
  // The actual rendering is handled by CodeTabs parent
  return null
}

/**
 * Custom hook to access code tabs context
 * Useful for creating language-aware components
 */
export function useCodeTabs() {
  const context = useContext(CodeTabsContext)
  if (!context) {
    throw new Error('useCodeTabs must be used within CodeTabs')
  }
  return context
}
