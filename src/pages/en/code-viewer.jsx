import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { InteractiveCodeViewer } from '@/components/code/InteractiveCodeViewer'

const PROGRAMS = {
  core: {
    label: 'MPL Core',
    examples: ['create-asset', 'transfer-asset', 'update-asset', 'burn-asset'],
  },
  'token-metadata': {
    label: 'Token Metadata',
    examples: ['create-nft', 'update-nft', 'transfer-nft', 'burn-nft'],
  },
  bubblegum: {
    label: 'Bubblegum (cNFTs)',
    examples: ['create-tree', 'mint-cnft', 'transfer-cnft', 'burn-cnft'],
  },
}

export default function CodeViewerPage() {
  const router = useRouter()

  // State from URL or defaults
  const [program, setProgram] = useState('core')
  const [example, setExample] = useState('create-asset')
  const [framework, setFramework] = useState('umi')
  const [highlights, setHighlights] = useState(new Set())
  const [comments, setComments] = useState({}) // { lineNumber: "comment text" }
  const [displayMode, setDisplayMode] = useState('snippet') // 'snippet' or 'full'

  // Load state from URL on mount
  useEffect(() => {
    if (!router.isReady) return

    const { program: urlProgram, example: urlExample, framework: urlFramework, highlights: urlHighlights, comments: urlComments, mode: urlMode } = router.query

    if (urlProgram) setProgram(urlProgram)
    if (urlExample) setExample(urlExample)
    if (urlFramework) setFramework(urlFramework)
    if (urlMode && (urlMode === 'snippet' || urlMode === 'full')) setDisplayMode(urlMode)

    // Parse highlights: "3,5-7,10" -> Set(3,5,6,7,10)
    if (urlHighlights) {
      const highlightSet = new Set()
      urlHighlights.split(',').forEach(part => {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number)
          for (let i = start; i <= end; i++) {
            highlightSet.add(i)
          }
        } else {
          highlightSet.add(Number(part))
        }
      })
      setHighlights(highlightSet)
    }

    // Parse comments: "5:Check_this|10:Important" -> { 5: "Check this", 10: "Important" }
    if (urlComments) {
      const commentObj = {}
      urlComments.split('|').forEach(item => {
        const [line, text] = item.split(':')
        if (line && text) {
          commentObj[Number(line)] = decodeURIComponent(text.replace(/_/g, ' '))
        }
      })
      setComments(commentObj)
    }
  }, [router.isReady, router.query])

  // Generate shareable URL
  const generateShareUrl = () => {
    const params = new URLSearchParams()
    params.set('program', program)
    params.set('example', example)
    params.set('framework', framework)
    params.set('mode', displayMode)

    // Encode highlights: Set(3,5,6,7,10) -> "3,5-7,10"
    if (highlights.size > 0) {
      const sortedHighlights = Array.from(highlights).sort((a, b) => a - b)
      const ranges = []
      let rangeStart = sortedHighlights[0]
      let rangeEnd = sortedHighlights[0]

      for (let i = 1; i < sortedHighlights.length; i++) {
        if (sortedHighlights[i] === rangeEnd + 1) {
          rangeEnd = sortedHighlights[i]
        } else {
          ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`)
          rangeStart = sortedHighlights[i]
          rangeEnd = sortedHighlights[i]
        }
      }
      ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`)
      params.set('highlights', ranges.join(','))
    }

    // Encode comments: { 5: "Check this", 10: "Important" } -> "5:Check_this|10:Important"
    if (Object.keys(comments).length > 0) {
      const commentStr = Object.entries(comments)
        .map(([line, text]) => `${line}:${encodeURIComponent(text).replace(/%20/g, '_')}`)
        .join('|')
      params.set('comments', commentStr)
    }

    return `${window.location.origin}/code-viewer?${params.toString()}`
  }

  const handleShare = async () => {
    const url = generateShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      alert('Share URL copied to clipboard!')
    } catch (error) {
      prompt('Copy this URL to share:', url)
    }
  }

  const handleCopyCode = async () => {
    // Load the current code
    try {
      const exampleModule = require(`@/examples/${program}/${example}/index.js`)
      const exampleData = exampleModule.examples[framework]

      let code = ''

      if (displayMode === 'full' && exampleData?.sections) {
        // Build full code from sections
        const parts = []
        if (exampleData.sections.imports) parts.push(exampleData.sections.imports)
        if (exampleData.sections.setup) parts.push(exampleData.sections.setup)
        if (exampleData.sections.main) parts.push(exampleData.sections.main)
        if (exampleData.sections.output) parts.push(exampleData.sections.output)
        code = parts.join('\n\n')
      } else {
        // Just copy the main snippet
        code = exampleData?.sections?.main || exampleData?.code || ''
      }

      await navigator.clipboard.writeText(code)
      alert(`${displayMode === 'full' ? 'Full code' : 'Code snippet'} copied to clipboard!`)
    } catch (error) {
      console.error('Failed to copy code:', error)
      alert('Failed to copy code')
    }
  }

  const handleClearAll = () => {
    if (highlights.size === 0 && Object.keys(comments).length === 0) {
      alert('Nothing to clear!')
      return
    }

    if (confirm('Clear all highlights and comments?')) {
      setHighlights(new Set())
      setComments({})
    }
  }

  const handleProgramChange = (newProgram) => {
    const hasAnnotations = highlights.size > 0 || Object.keys(comments).length > 0

    if (hasAnnotations && !confirm('Changing the program will clear all highlights and comments. Continue?')) {
      return
    }

    setProgram(newProgram)
    // Reset to first example of new program
    setExample(PROGRAMS[newProgram]?.examples[0] || '')
    // Clear highlights and comments when switching
    setHighlights(new Set())
    setComments({})
  }

  const handleExampleChange = (newExample) => {
    const hasAnnotations = highlights.size > 0 || Object.keys(comments).length > 0

    if (hasAnnotations && !confirm('Changing the example will clear all highlights and comments. Continue?')) {
      return
    }

    setExample(newExample)
    // Clear highlights and comments when switching
    setHighlights(new Set())
    setComments({})
  }

  const handleFrameworkChange = (newFramework) => {
    const hasAnnotations = highlights.size > 0 || Object.keys(comments).length > 0

    if (hasAnnotations && !confirm('Changing the framework will clear all highlights and comments. Continue?')) {
      return
    }

    setFramework(newFramework)
    // Clear highlights and comments when switching frameworks
    setHighlights(new Set())
    setComments({})
  }

  const toggleHighlight = (lineNumber) => {
    setHighlights(prev => {
      const newSet = new Set(prev)
      if (newSet.has(lineNumber)) {
        newSet.delete(lineNumber)
      } else {
        newSet.add(lineNumber)
      }
      return newSet
    })
  }

  const addComment = (lineNumber, text) => {
    if (text.trim()) {
      setComments(prev => ({
        ...prev,
        [lineNumber]: text
      }))
    } else {
      // Remove comment if text is empty
      setComments(prev => {
        const newComments = { ...prev }
        delete newComments[lineNumber]
        return newComments
      })
    }
  }

  const availableExamples = PROGRAMS[program]?.examples || []

  return (
    <>
      <Head>
        <title>Playground - Metaplex Developers</title>
        <meta name="description" content="Interactive code examples with annotations and sharing to help others understand Metaplex programs" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-neutral-900">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white">
              Playground
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Interactive code examples with annotations and sharing to help others understand Metaplex programs.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4">
              {/* Program Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-400">
                  Program
                </label>
                <select
                  value={program}
                  onChange={(e) => handleProgramChange(e.target.value)}
                  className="mt-1 block rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                >
                  {Object.entries(PROGRAMS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Example Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-400">
                  Example
                </label>
                <select
                  value={example}
                  onChange={(e) => handleExampleChange(e.target.value)}
                  className="mt-1 block rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                >
                  {availableExamples.map((ex) => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>

              {/* Framework Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-400">
                  Framework
                </label>
                <select
                  value={framework}
                  onChange={(e) => handleFrameworkChange(e.target.value)}
                  className="mt-1 block rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                >
                  <option value="kit">Kit (JS)</option>
                  <option value="umi">Umi (JS)</option>
                  <option value="shank">Shank (Rust)</option>
                  <option value="anchor">Anchor (Rust)</option>
                </select>
              </div>

              {/* Copy Mode Toggle and Action Buttons */}
              <div className="ml-auto flex items-center gap-3">
                {/* Display mode toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-400">View:</span>
                  <div className="flex items-center rounded-md bg-slate-800 p-0.5">
                    <button
                      onClick={() => setDisplayMode('snippet')}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                        displayMode === 'snippet'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Snippet
                    </button>
                    <button
                      onClick={() => setDisplayMode('full')}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                        displayMode === 'full'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Full
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleClearAll}
                  className="rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:border-red-500 hover:text-red-500"
                  title="Clear all highlights and comments"
                >
                  Clear
                </button>
                <button
                  onClick={handleCopyCode}
                  className="rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:border-slate-600 hover:text-white"
                >
                  Copy Code
                </button>
                <button
                  onClick={handleShare}
                  className="rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-600"
                >
                  Share
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Code Viewer */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <InteractiveCodeViewer
            program={program}
            example={example}
            framework={framework}
            displayMode={displayMode}
            highlights={highlights}
            comments={comments}
            onToggleHighlight={toggleHighlight}
            onAddComment={addComment}
          />
        </div>
      </div>
    </>
  )
}
