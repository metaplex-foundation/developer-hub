import { useState } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import clsx from 'clsx'
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

/**
 * InteractiveCodeViewer - Code viewer with clickable lines, highlights, and comments
 *
 * @param {Object} props
 * @param {string} props.program - Program name (e.g., 'core')
 * @param {string} props.example - Example name (e.g., 'create-asset')
 * @param {string} props.framework - Framework (e.g., 'umi')
 * @param {string} props.displayMode - Display mode ('snippet' or 'full')
 * @param {Set} props.highlights - Set of highlighted line numbers
 * @param {Object} props.comments - Comments object { lineNumber: "comment text" }
 * @param {Function} props.onToggleHighlight - Callback to toggle line highlight
 * @param {Function} props.onAddComment - Callback to add/update comment
 */
export function InteractiveCodeViewer({
  program,
  example,
  framework,
  displayMode,
  highlights,
  comments,
  onToggleHighlight,
  onAddComment,
}) {
  const [editingLine, setEditingLine] = useState(null)
  const [commentText, setCommentText] = useState('')

  // Load example code
  let code = ''
  let language = 'javascript'

  try {
    const exampleModule = require(`@/examples/${program}/${example}`)
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
      <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
        <p className="font-semibold text-yellow-800 dark:text-yellow-200">
          Example not found
        </p>
        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
          Could not load: {program}/{example}/{framework}
        </p>
      </div>
    )
  }

  const handleLineClick = (lineNumber) => {
    if (highlights.has(lineNumber)) {
      // Already highlighted - open comment editor
      setEditingLine(lineNumber)
      setCommentText(comments[lineNumber] || '')
    } else {
      // Not highlighted - toggle highlight
      onToggleHighlight(lineNumber)
    }
  }

  const handleSaveComment = () => {
    if (editingLine !== null) {
      onAddComment(editingLine, commentText)
      setEditingLine(null)
      setCommentText('')
    }
  }

  const handleCancelComment = () => {
    setEditingLine(null)
    setCommentText('')
  }

  const handleDeleteComment = () => {
    if (editingLine !== null) {
      onAddComment(editingLine, '')
      setEditingLine(null)
      setCommentText('')
    }
  }

  const handleRemoveHighlight = () => {
    if (editingLine !== null) {
      onToggleHighlight(editingLine) // Remove the highlight
      onAddComment(editingLine, '') // Remove any comment
      setEditingLine(null)
      setCommentText('')
    }
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
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#0F1419]">
            <pre
              className={clsx(className, 'relative m-0 overflow-auto bg-white p-4 dark:bg-[#0F1419]')}
              style={style}
            >
              <code className="block">
                {tokens.map((line, lineIndex) => {
                  const lineNumber = lineIndex + 1
                  const isHighlighted = highlights.has(lineNumber)
                  const hasComment = comments[lineNumber]
                  const isEditing = editingLine === lineNumber

                  return (
                    <div key={lineIndex} className="group relative table-row">
                      {/* Line number - clickable */}
                      <span
                        onClick={() => handleLineClick(lineNumber)}
                        className={clsx(
                          'table-cell cursor-pointer select-none pr-4 text-right font-mono text-sm',
                          'transition-colors duration-150',
                          isHighlighted
                            ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-500/40 dark:text-yellow-100'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-400'
                        )}
                        style={{ minWidth: '3em', paddingTop: '2px', paddingBottom: '2px' }}
                      >
                        {lineNumber}
                      </span>

                      {/* Code content */}
                      <span
                        className={clsx(
                          'table-cell',
                          isHighlighted && 'bg-yellow-100 dark:bg-yellow-500/20'
                        )}
                        style={{ paddingTop: '2px', paddingBottom: '2px' }}
                      >
                        {line
                          .filter((token) => !token.empty)
                          .map((token, tokenIndex) => (
                            <span key={tokenIndex} {...getTokenProps({ token })} />
                          ))}

                        {/* Comment indicator */}
                        {hasComment && !isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLineClick(lineNumber)
                            }}
                            className="ml-2 inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                            title={comments[lineNumber]}
                          >
                            <ChatBubbleLeftIcon className="h-3 w-3" />
                            <span className="max-w-[200px] truncate">{comments[lineNumber]}</span>
                          </button>
                        )}
                        {'\n'}
                      </span>

                    </div>
                  )
                })}
              </code>
            </pre>

            {/* Legend */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-[#1A1F2E] dark:text-gray-400">
              <div className="flex gap-4">
                <span>💡 Click line number to highlight</span>
                <span>💬 Click highlighted line to add comment</span>
                <span>🗑️ Click again to remove highlight</span>
              </div>
            </div>
          </div>
        )}
      </Highlight>

      {/* Comment editor modal - appears as floating modal */}
      {editingLine !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg border border-gray-300 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-[#0F1419]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Comment for line {editingLine}
              </span>
              <button
                onClick={handleCancelComment}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment to explain this line..."
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base dark:border-gray-600 dark:bg-[#1A1F2E] dark:text-white"
              rows={6}
              autoFocus
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleSaveComment}
                  className="rounded-md bg-accent-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600"
                >
                  Save Comment
                </button>
                {comments[editingLine] && (
                  <button
                    onClick={handleDeleteComment}
                    className="rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete Comment
                  </button>
                )}
                <button
                  onClick={handleCancelComment}
                  className="rounded-md bg-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={handleRemoveHighlight}
                className="rounded-md bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
              >
                Remove Highlight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
