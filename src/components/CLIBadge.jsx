import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

function useClickOutside(handler) {
  const ref = useRef(null)
  useEffect(() => {
    function onMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) handler()
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [handler])
  return ref
}

export function CLIBadge({ cliPath }) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(() => setOpen(false))

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Terminal / command-line icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        CLI available
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-72 origin-top-right rounded-md border border-border bg-background p-3 shadow-2xl ring-1 ring-white/10 dark:ring-white/10">
          <p className="mb-2 text-xs font-medium text-foreground">Metaplex CLI</p>
          <p className="mb-3 text-xs text-muted-foreground">
            This page includes CLI examples inline where available. For the full
            command reference, flags, and usage guide, see the{' '}
            <Link
              href={cliPath}
              className="text-primary underline underline-offset-2 hover:text-primary/80"
              onClick={() => setOpen(false)}
            >
              CLI documentation
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  )
}
