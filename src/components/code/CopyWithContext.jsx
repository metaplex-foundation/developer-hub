import { useState } from 'react'
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

/**
 * Enhanced copy button that allows copying and displaying code with full context
 * (imports, setup, main code, and output)
 *
 * @param {Object} props
 * @param {Object} props.sections - Code sections: { imports, setup, main, output, full }
 * @param {string} props.language - Programming language
 * @param {boolean} props.showToggle - Show toggle controls (default: true)
 * @param {string} props.displayMode - Current display mode ('main' or 'full')
 * @param {Function} props.onDisplayModeChange - Callback when display mode changes
 *
 * @example
 * <CopyWithContext
 *   sections={{
 *     imports: "import { create } from '@metaplex-foundation/mpl-core'",
 *     setup: "const umi = createUmi('https://api.devnet.solana.com')",
 *     main: "const asset = await create(umi, { ... })",
 *     output: "console.log('Created:', asset)"
 *   }}
 *   language="javascript"
 *   displayMode="main"
 *   onDisplayModeChange={(mode) => setDisplayMode(mode)}
 * />
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
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-foreground text-background hover:bg-foreground/90'
        )}
        title={displayMode === 'full' ? 'Copy with imports and setup' : 'Copy snippet only'}
      >
        {copied ? (
          <>
            <CheckIcon className="h-3.5 w-3.5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <ClipboardIcon className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  )
}
