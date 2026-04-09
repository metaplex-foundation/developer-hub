import Link from 'next/link'
import { useState } from 'react'
import { useClickOutside } from '@/shared/useClickOutside'

const SKILL_REPO = 'https://github.com/metaplex-foundation/skill'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!navigator?.clipboard) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex-shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
          <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
        </svg>
      )}
    </button>
  )
}

function CodeRow({ label, command }) {
  return (
    <div>
      {label && <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>}
      <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1.5">
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">{command}</code>
        <CopyButton text={command} />
      </div>
    </div>
  )
}

export function SkillBadge() {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(() => setOpen(false))

  const gitClone = `git clone ${SKILL_REPO}`
  const npxAdd = `npx skills add metaplex-foundation/skill`

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11.9842 0C11.2889 6.28058 6.28058 11.289 0 11.9842C6.28058 12.6795 11.289 17.6879 11.9842 23.9685C12.6795 17.688 17.6879 12.6795 23.9685 11.9842C17.688 11.289 12.6795 6.28058 11.9842 0Z" />
        </svg>
        Skill file available
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-96 origin-top-right rounded-md border border-border bg-background p-3 shadow-2xl ring-1 ring-white/10 dark:ring-white/10">
          <p className="mb-2 text-xs font-medium text-foreground">Metaplex Skill File</p>
          <p className="mb-3 text-xs text-muted-foreground">
            This product is part of the{' '}
            <a
              href={SKILL_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Metaplex Skill package
            </a>
            {' '}— a collection of skill files that give AI coding agents full knowledge of Metaplex programs, SDKs, and CLI tools.
            {' '}Learn more in the{' '}
            <Link
              href="/agents/skill"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
              onClick={() => setOpen(false)}
            >
              Skill docs
            </Link>
            .
          </p>
          <div className="space-y-2.5">
            <CodeRow label="NPX Install" command={npxAdd} />
            <CodeRow label="Git Clone Skill Repo" command={gitClone} />
          </div>
        </div>
      )}
    </div>
  )
}
