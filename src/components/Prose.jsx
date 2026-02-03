import clsx from 'clsx'

export function Prose({ as: Component = 'div', className, ...props }) {
  return (
    <Component
      className={clsx(
        className,
        'prose max-w-none text-muted-foreground',
        // headings
        'prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal prose-headings:text-foreground lg:prose-headings:scroll-mt-[8.5rem]',
        // lead
        'prose-lead:text-muted-foreground',
        // links
        'prose-a:font-semibold prose-a:text-primary prose-a:underline prose-a:decoration-primary/30 hover:prose-a:decoration-primary/60',
        // pre
        'prose-pre:rounded-xl prose-pre:bg-card prose-pre:ring-1 prose-pre:ring-border',
        // hr
        'prose-hr:border-border',
        // table - match card border colors
        'prose-table:m-0',
        'prose-tr:border-border prose-th:border-border prose-td:border-border prose-thead:border-border',
        // strong/bold
        'prose-strong:text-foreground',
        // code
        'prose-code:text-foreground prose-code:text-sm',
        // pre (code blocks)
        'prose-pre:text-sm'
      )}
      {...props}
    />
  )
}
