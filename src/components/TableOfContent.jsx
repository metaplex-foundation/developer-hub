import clsx from 'clsx'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id)

  let getHeadings = useCallback((tableOfContents) => {
    return tableOfContents
      .flatMap((node) => [node.id])
      .map((id) => {
        let el = document.getElementById(id)
        if (!el) return null

        let style = window.getComputedStyle(el)
        let scrollMt = parseFloat(style.scrollMarginTop)

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt
        return { id, top }
      })
      .filter(Boolean) // Remove null/undefined entries
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0) return
    let headings = getHeadings(tableOfContents)
    function onScroll() {
      let top = window.scrollY
      let current = headings[0]?.id
      for (let heading of headings) {
        if (heading && top >= heading.top) {
          current = heading.id
        } else {
          break
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [getHeadings, tableOfContents])

  return currentSection
}

export function TableOfContent({ tableOfContents }) {
  let currentSection = useTableOfContents(tableOfContents)

  function isActive(section) {
    if (section.id === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  return (
    <nav aria-labelledby="on-this-page-title" className="w-56">
      {tableOfContents.length > 0 && (
        <>
          <h2
            id="on-this-page-title"
            className="font-display text-sm font-medium text-foreground"
          >
            On this page
          </h2>
          <ol role="list" className="mt-4 space-y-1 text-sm">
            {tableOfContents.map((section) => (
              <li key={section.id} className="relative">
                <h3>
                  <Link
                    href={`#${section.id}`}
                    className={clsx(
                      'block w-full py-0.5 pl-3.5 before:pointer-events-none before:absolute before:-left-[2px] before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2',
                      isActive(section)
                        ? 'bg-primary/10 font-medium text-primary before:bg-primary'
                        : 'font-normal text-muted-foreground before:hidden before:bg-primary hover:text-foreground hover:before:block'
                    )}
                  >
                    {section.title}
                  </Link>
                </h3>
              </li>
            ))}
          </ol>
        </>
      )}
    </nav>
  )
}
