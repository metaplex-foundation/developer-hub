'use client'

import { useState } from 'react'
import clsx from 'clsx'

const ClipboardIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
)

const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
)

/**
 * Enhanced copy button that allows copying and displaying code with full context
 * (imports, setup, main code, and output)
 */
export function CopyWithContext({ sections, language, showToggle = true, displayMode, onDisplayModeChange }) {
  const [copied, setCopied] = useState(false)

  if (!sections) {
    return null
  }

  const hasContext = sections.imports || sections.setup || sections.output

  const handleCopy = async () => {
    let textToCopy = ''

    if (displayMode === 'full' && hasContext) {
      // Build full runnable code
      const parts = []

      if (sections.imports) parts.push(sections.imports)
      if (sections.setup) parts.push(sections.setup)
      if (sections.main) parts.push(sections.main)
      if (sections.output) parts.push(sections.output)

      textToCopy = parts.join('\n\n')
    } else {
      // Just copy the main code
      textToCopy = sections.main || sections.full
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'code_copied', {
          mode: displayMode,
          language: language,
          hasContext: hasContext,
        })
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Toggle between display modes - styled as segmented control */}
      {showToggle && hasContext && (
        <div className="flex items-center rounded-md bg-muted p-0.5">
          <button
            onClick={() => onDisplayModeChange('main')}
            className={clsx(
              'rounded px-2.5 py-1 text-xs font-medium transition-all',
              displayMode === 'main'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Snippet
          </button>
          <button
            onClick={() => onDisplayModeChange('full')}
            className={clsx(
              'rounded px-2.5 py-1 text-xs font-medium transition-all',
              displayMode === 'full'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Full
          </button>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={clsx(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
          copied
            ? 'bg-green-500/20 text-green-400'
            : 'bg-card text-foreground hover:bg-card/80'
        )}
        title={displayMode === 'full' ? 'Copy with imports and setup' : 'Copy snippet only'}
      >
        {copied ? (
          <CheckIcon className="h-3.5 w-3.5" />
        ) : (
          <ClipboardIcon className="h-3.5 w-3.5" />
        )}
        <span>Copy</span>
      </button>
    </div>
  )
}
