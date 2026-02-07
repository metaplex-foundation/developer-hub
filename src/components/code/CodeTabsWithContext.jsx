import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Fence } from '../Fence'
import { CopyWithContext } from './CopyWithContext'

/**
 * CodeTabsWithContext - Multi-language code tabs with enhanced copy functionality
 *
 * Similar to CodeTabs but with copy-with-context support for centralized examples
 *
 * @param {Object} props
 * @param {Array} props.examples - Array of example objects with code and sections
 * @param {string} props.defaultLanguage - Default language to show
 * @param {boolean} props.persist - Save preference to localStorage
 * @param {boolean} props.showLineNumbers - Show line numbers in all tabs
 * @param {string} props.highlightLines - Lines to highlight in all tabs
 * @param {string} props.showLines - Lines to display in all tabs
 * @param {boolean} props.showCopy - Show copy button (default: true)
 * @param {string} props.filename - Optional filename to display (extension added automatically based on framework)
 */

const FRAMEWORK_EXTENSIONS = {
  Kit: '.ts',
  Umi: '.ts',
  DAS: '.ts',
  Shank: '.rs',
  Anchor: '.rs',
  CLI: '.sh',
  cURL: '.sh',
}

function getFilenameForFramework(filename, framework) {
  if (!filename) return ''
  const ext = FRAMEWORK_EXTENSIONS[framework] || ''
  return `${filename}${ext}`
}

export function CodeTabsWithContext({
  examples,
  defaultLanguage = 'javascript',
  persist = true,
  showLineNumbers = true,
  highlightLines = '',
  showLines = '',
  showCopy = true,
  filename = ''
}) {
  // Create tabs with IDs
  const tabsWithIds = examples.map((example, index) => ({
    ...example,
    tabId: `tab-${index}`,
    index,
  }))

  // Find default tab index - default to first tab (index 0) if no match
  const defaultIndex = Math.max(
    0,
    tabsWithIds.findIndex(t => t.language === defaultLanguage)
  )

  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex)
  const [isHydrated, setIsHydrated] = useState(false)
  const [displayMode, setDisplayMode] = useState('full') // 'main' or 'full', default to 'full'

  // After hydration, update to user's preferred language and display mode if available
  useEffect(() => {
    if (!isHydrated && persist && typeof window !== 'undefined') {
      const preferredLang = localStorage.getItem('preferred-code-language')
      if (preferredLang) {
        const index = tabsWithIds.findIndex(t => t.language === preferredLang)
        if (index >= 0 && index !== defaultIndex) {
          setActiveTabIndex(index)
        }
      }

      // Load display mode preference
      const preferredDisplayMode = localStorage.getItem('preferred-display-mode')
      if (preferredDisplayMode && (preferredDisplayMode === 'main' || preferredDisplayMode === 'full')) {
        setDisplayMode(preferredDisplayMode)
      }

      setIsHydrated(true)
    }
  }, [isHydrated, persist, tabsWithIds, defaultIndex])

  // Listen for display mode changes from other components on the page
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleDisplayModeSync = (event) => {
      if (event.detail?.mode) {
        setDisplayMode(event.detail.mode)
      }
    }

    window.addEventListener('displayModeChanged', handleDisplayModeSync)
    return () => window.removeEventListener('displayModeChanged', handleDisplayModeSync)
  }, [])

  // Ensure active tab index is valid
  useEffect(() => {
    if (activeTabIndex >= tabsWithIds.length) {
      setActiveTabIndex(0)
    }
  }, [tabsWithIds.length, activeTabIndex])

  const handleTabChange = (index) => {
    setActiveTabIndex(index)
    const language = tabsWithIds[index]?.language

    // Save to localStorage
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem('preferred-code-language', language)
    }

    // Track analytics
    if (typeof window !== 'undefined' && window.gtag) {
      const prevLanguage = tabsWithIds[activeTabIndex]?.language
      window.gtag('event', 'code_language_switched', {
        from: prevLanguage,
        to: language,
      })
    }
  }

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode)

    // Save to localStorage
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem('preferred-display-mode', mode)
    }

    // Notify all other code blocks on the page to sync
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('displayModeChanged', {
        detail: { mode }
      })
      window.dispatchEvent(event)
    }

    // Track analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'code_display_mode_changed', {
        mode: mode,
      })
    }
  }

  const activeExample = tabsWithIds[activeTabIndex]

  return (
    <div className="code-tabs not-prose my-6 overflow-hidden rounded-lg border border-border">
      {/* Tab buttons with copy button */}
      <div
        className="flex items-center justify-between gap-2 border-b border-border bg-muted px-4 py-2"
        role="tablist"
        aria-label="Code examples in different languages"
      >
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabsWithIds.map((tab, index) => {
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
                {tab.label || (
                  tab.framework.toLowerCase() === 'curl'
                    ? 'DAS (cURL)'
                    : tab.language === 'bash' || tab.language === 'shell'
                      ? tab.framework
                      : `${tab.framework} (${tab.language === 'javascript' ? 'JS' : 'RS'})`
                )}
              </button>
            )
          })}
        </div>

        {/* Copy with context button for active tab */}
        {activeExample?.sections && (
          <CopyWithContext
            sections={activeExample.sections}
            language={activeExample.language}
            displayMode={displayMode}
            onDisplayModeChange={handleDisplayModeChange}
          />
        )}
      </div>

      {/* Tab panels */}
      <div className="relative">
        {tabsWithIds.map((tab, index) => {
          const isActive = activeTabIndex === index

          // Determine what to display based on display mode
          let displayCode
          if (displayMode === 'full' && tab.sections) {
            // Build full code from sections (without markers)
            const parts = []
            if (tab.sections.imports) parts.push(tab.sections.imports)
            if (tab.sections.setup) parts.push(tab.sections.setup)
            if (tab.sections.main) parts.push(tab.sections.main)
            if (tab.sections.output) parts.push(tab.sections.output)
            displayCode = parts.join('\n\n')
            // Fallback: if sections are empty but full code exists, use that
            // (needed for CLI/bash examples that don't have sectioned code)
            if ((!displayCode || !displayCode.trim()) && tab.code) {
              displayCode = tab.code
            }
          } else {
            // Show just the main section
            displayCode = tab.sections?.main || tab.code
          }

          return (
            <div
              key={tab.tabId}
              role="tabpanel"
              id={`code-panel-${tab.tabId}`}
              aria-labelledby={`tab-${tab.tabId}`}
              hidden={!isActive}
              className={clsx(!isActive && 'hidden')}
            >
              {/* Render the code using enhanced Fence component */}
              {/* Key forces re-render when displayMode changes */}
              <Fence
                key={`${tab.tabId}-${displayMode}`}
                language={tab.language}
                showLineNumbers={tab.showLineNumbers ?? showLineNumbers}
                highlightLines={tab.highlightLines ?? highlightLines}
                showLines={tab.showLines ?? showLines}
                title={displayMode === 'full' ? (tab.title || getFilenameForFramework(filename, tab.framework)) : ''}
                showCopy={false}
              >
                {displayCode}
              </Fence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
