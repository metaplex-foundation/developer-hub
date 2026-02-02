import Highlight, { defaultProps } from 'prism-react-renderer'
import clsx from 'clsx'

/**
 * InteractiveCodeViewer - Code viewer for examples
 *
 * @param {Object} props
 * @param {string} props.program - Program name (e.g., 'core')
 * @param {string} props.example - Example name (e.g., 'create-asset')
 * @param {string} props.framework - Framework (e.g., 'umi')
 * @param {string} props.displayMode - Display mode ('snippet' or 'full')
 */
export function InteractiveCodeViewer({
  program,
  example,
  framework,
  displayMode,
}) {
  // Load example code
  let code = ''
  let language = 'javascript'

  try {
    const exampleModule = require(`@/examples/${program}/${example}/index.js`)
    const exampleData = exampleModule.examples[framework]

    if (exampleData) {
      language = exampleData.language || 'javascript'

      // Build code based on display mode
      if (displayMode === 'full' && exampleData.sections) {
        // Build full code from sections
        const parts = []
        if (exampleData.sections.imports) parts.push(exampleData.sections.imports)
        if (exampleData.sections.setup) parts.push(exampleData.sections.setup)
        if (exampleData.sections.main) parts.push(exampleData.sections.main)
        if (exampleData.sections.output) parts.push(exampleData.sections.output)
        code = parts.join('\n\n')
      } else {
        // Show just the snippet (main section)
        code = exampleData.sections?.main || exampleData.code || ''
      }
    }
  } catch (error) {
    console.error('Failed to load example:', error)
  }

  if (!code) {
    return (
      <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="font-semibold text-amber-800 dark:text-amber-200">
          Example not found
        </p>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
          Could not load: {program}/{example}/{framework}
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <Highlight
        {...defaultProps}
        code={code.trimEnd()}
        language={language}
        theme={undefined}
      >
        {({ className, style, tokens, getTokenProps }) => (
          <div className="relative overflow-hidden rounded-lg border border-border bg-card">
            <pre
              className={clsx(className, 'relative m-0 overflow-auto bg-card p-4')}
              style={style}
            >
              <code className="block text-sm">
                {tokens.map((line, lineIndex) => {
                  const lineNumber = lineIndex + 1

                  return (
                    <div key={lineIndex} className="table-row">
                      {/* Line number */}
                      <span
                        className="table-cell select-none pr-4 text-right font-mono text-sm text-muted-foreground"
                        style={{ minWidth: '3em', paddingTop: '2px', paddingBottom: '2px' }}
                      >
                        {lineNumber}
                      </span>

                      {/* Code content */}
                      <span
                        className="table-cell"
                        style={{ paddingTop: '2px', paddingBottom: '2px' }}
                      >
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
          </div>
        )}
      </Highlight>
    </div>
  )
}
