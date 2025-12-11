import { useState } from 'react'
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
  const [program, setProgram] = useState('core')
  const [example, setExample] = useState('create-asset')
  const [framework, setFramework] = useState('umi')
  const [displayMode, setDisplayMode] = useState('snippet')

  const handleCopyCode = async () => {
    try {
      const exampleModule = require(`@/examples/${program}/${example}/index.js`)
      const exampleData = exampleModule.examples[framework]

      let code = ''

      if (displayMode === 'full' && exampleData?.sections) {
        const parts = []
        if (exampleData.sections.imports) parts.push(exampleData.sections.imports)
        if (exampleData.sections.setup) parts.push(exampleData.sections.setup)
        if (exampleData.sections.main) parts.push(exampleData.sections.main)
        if (exampleData.sections.output) parts.push(exampleData.sections.output)
        code = parts.join('\n\n')
      } else {
        code = exampleData?.sections?.main || exampleData?.code || ''
      }

      await navigator.clipboard.writeText(code)
      alert(`${displayMode === 'full' ? 'Full code' : 'Code snippet'} copied to clipboard!`)
    } catch (error) {
      console.error('Failed to copy code:', error)
      alert('Failed to copy code')
    }
  }

  const handleProgramChange = (newProgram) => {
    setProgram(newProgram)
    setExample(PROGRAMS[newProgram]?.examples[0] || '')
  }

  const availableExamples = PROGRAMS[program]?.examples || []

  return (
    <>
      <Head>
        <title>Playground - Metaplex Developers</title>
        <meta name="description" content="Interactive code examples for Metaplex programs" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-neutral-900">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white">
              Playground
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Interactive code examples for Metaplex programs.
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
                  onChange={(e) => setExample(e.target.value)}
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
                  onChange={(e) => setFramework(e.target.value)}
                  className="mt-1 block rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                >
                  <option value="kit">Kit (JS)</option>
                  <option value="umi">Umi (JS)</option>
                  <option value="shank">Shank (Rust)</option>
                  <option value="anchor">Anchor (Rust)</option>
                </select>
              </div>

              {/* Display Mode and Copy Button */}
              <div className="ml-auto flex items-center gap-3">
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
                  onClick={handleCopyCode}
                  className="rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:border-slate-600 hover:text-white"
                >
                  Copy Code
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
          />
        </div>
      </div>
    </>
  )
}
