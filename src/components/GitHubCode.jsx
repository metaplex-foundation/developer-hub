import { Fence } from '@/components/Fence'
import { useEffect, useState } from 'react'

export function GitHubCode({ repo, filePath, startLine, endLine, language }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true)
        // Construct GitHub raw content URL
        // Format: https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
        // We'll default to the 'main' branch
        const branch = 'main'
        const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch code: ${response.statusText}`)
        }

        const allCode = await response.text()

        // Extract only the lines we want if startLine and endLine are provided
        if (startLine && endLine) {
          const lines = allCode.split('\n')
          const selectedLines = lines.slice(startLine - 1, endLine).join('\n')
          setCode(selectedLines)
        } else {
          setCode(allCode)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching code from GitHub:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCode()
  }, [repo, filePath, startLine, endLine])

  if (loading) {
    return (
      <div className="px-4 py-3 text-neutral-400">
        <span>Loading code from GitHub...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-3 text-red-400">
        <span>Error loading code: {error}</span>
      </div>
    )
  }

  return (
    <div>
      <Fence className="w-full" language={language}>
        {code}
      </Fence>
      <div className="px-4 py-2 text-xs text-neutral-500">
        <a
          href={`https://github.com/${repo}/blob/main/${filePath}${
            startLine ? `#L${startLine}-L${endLine}` : ''
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent-400"
        >
          View on GitHub
        </a>
      </div>
    </div>
  )
}
