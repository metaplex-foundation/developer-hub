import Highlight, { defaultProps } from 'prism-react-renderer';
import { Fragment } from 'react';
import clsx from 'clsx';
import CopyToClipboardButton from './products/CopyToClipboard';
(typeof global !== 'undefined' ? global : window).Prism = Prism

require('prismjs/components/prism-kotlin')
require('prismjs/components/prism-csharp')
require('prismjs/components/prism-java')
require('prismjs/components/prism-php')
require('prismjs/components/prism-ruby')

/**
 * Parse line range strings like "1-5,7,10-12" into an array of line numbers
 */
function parseLineRange(rangeStr) {
  if (!rangeStr) return null

  const lines = new Set()
  const parts = rangeStr.split(',').map(p => p.trim())

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()))
      for (let i = start; i <= end; i++) {
        lines.add(i)
      }
    } else {
      lines.add(parseInt(part))
    }
  }

  return lines
}

/**
 * Enhanced Fence component with line numbers, highlighting, and ranges
 *
 * @param {Object} props
 * @param {string} props.children - The code to display
 * @param {string} props.language - Programming language for syntax highlighting
 * @param {boolean} props.showLineNumbers - Show line numbers (default: false)
 * @param {string} props.highlightLines - Lines to highlight (e.g., "1-5,7,10-12")
 * @param {string} props.showLines - Lines to display (e.g., "1-10,15-20")
 * @param {string} props.title - Title/filename to display above code block
 * @param {boolean} props.showCopy - Show copy button (default: true)
 */
export function Fence({
  children,
  language,
  showLineNumbers = false,
  highlightLines = '',
  showLines = '',
  title = '',
  showCopy = true
}) {
  const highlightedLines = parseLineRange(highlightLines)
  const visibleLines = parseLineRange(showLines)

  // Ensure children is a string
  const code = typeof children === 'string' ? children : String(children || '')

  return (
    <div className="not-prose">
      {/* Title bar */}
      {title && (
        <div className="rounded-t-lg border border-b-0 border-slate-200 bg-slate-100 px-4 py-2 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {title}
        </div>
      )}

      <Highlight
        {...defaultProps}
        code={code.trimEnd()}
        language={language}
        theme={undefined}
      >
        {({ className, style, tokens, getTokenProps }) => {
          // Filter tokens if showLines is specified
          const displayTokens = visibleLines
            ? tokens.filter((_, idx) => visibleLines.has(idx + 1))
            : tokens

          // Calculate starting line number for filtered view
          let lineNumberOffset = 0
          if (visibleLines) {
            lineNumberOffset = Math.min(...Array.from(visibleLines)) - 1
          }

          return (
            <pre
              className={clsx(
                className,
                'scrollbar relative',
                title ? 'rounded-t-none' : ''
              )}
              style={style}
            >
              {showCopy && <CopyToClipboardButton text={code} />}
              <code className={clsx(
                'block overflow-auto',
                showCopy ? 'w-[calc(100%-25px)]' : 'w-full'
              )}>
                {displayTokens.map((line, lineIndex) => {
                  const actualLineNumber = lineNumberOffset + lineIndex + 1
                  const isHighlighted = highlightedLines?.has(actualLineNumber)

                  return (
                    <div
                      key={lineIndex}
                      className={clsx(
                        'table-row',
                        isHighlighted && 'bg-yellow-100/10 dark:bg-yellow-500/10'
                      )}
                    >
                      {/* Line number column */}
                      {showLineNumbers && (
                        <span
                          className="table-cell select-none pr-4 text-right text-slate-500 dark:text-slate-600"
                          style={{ minWidth: '3em' }}
                        >
                          {actualLineNumber}
                        </span>
                      )}

                      {/* Code content column */}
                      <span className="table-cell">
                        {line
                          .filter((token) => !token.empty)
                          .map((token, tokenIndex) => (
                            <span key={tokenIndex} {...getTokenProps({ token })} />
                          ))}
                        {'\n'}
                      </span>
                    </div>
                  )
                })}
              </code>
            </pre>
          )
        }}
      </Highlight>
    </div>
  )
}
