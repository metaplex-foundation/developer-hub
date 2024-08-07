import clsx from 'clsx'

export function Prose({ as: Component = 'div', className, ...props }) {
  return (
    <Component
      className={clsx(
        className,
        'prose prose-neutral max-w-none dark:prose-invert dark:text-neutral-400',
        // headings
        'prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem]',
        // lead
        'prose-lead:text-neutral-500 dark:prose-lead:text-neutral-400',
        // links
        'prose-a:font-semibold dark:prose-a:text-accent-400',
        // link underline
        'prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.accent.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.neutral.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.accent.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px]',
        // pre
        'prose-pre:rounded-xl prose-pre:bg-neutral-800 prose-pre:shadow-lg dark:prose-pre:bg-neutral-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-neutral-300/10',
        // hr
        'dark:prose-hr:border-neutral-800',
        // table
        'prose-table:m-0'
      )}
      {...props}
    />
  )
}
