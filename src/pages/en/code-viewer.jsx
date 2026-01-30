import { useState } from 'react'
import Head from 'next/head'
import { InteractiveCodeViewer } from '@/components/code/InteractiveCodeViewer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

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

      <div className="min-h-screen bg-background">
        {/* Controls */}
        <div className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end gap-4">
              {/* Program Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs">Program</Label>
                <Select value={program} onValueChange={handleProgramChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROGRAMS).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Example Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs">Example</Label>
                <Select value={example} onValueChange={setExample}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableExamples.map((ex) => (
                      <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Framework Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs">Framework</Label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kit">Kit (JS)</SelectItem>
                    <SelectItem value="umi">Umi (JS)</SelectItem>
                    <SelectItem value="shank">Shank (Rust)</SelectItem>
                    <SelectItem value="anchor">Anchor (Rust)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Display Mode and Copy Button */}
              <div className="ml-auto flex items-center gap-3">
                <ToggleGroup
                  type="single"
                  value={displayMode}
                  onValueChange={(value) => value && setDisplayMode(value)}
                  size="sm"
                >
                  <ToggleGroupItem value="snippet">Snippet</ToggleGroupItem>
                  <ToggleGroupItem value="full">Full</ToggleGroupItem>
                </ToggleGroup>

                <Button variant="outline" onClick={handleCopyCode}>
                  Copy Code
                </Button>
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
