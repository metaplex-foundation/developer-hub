import React, { useState, useEffect } from 'react'
import { Widget, defineCustomElements } from '@happyreact/react'

import '@happyreact/react/theme.css'
defineCustomElements()
const VotedYes = () => {
  return <span>Thanks for your feedback. We are glad you like it :)</span>
}

const VotedNo = () => {
  return (
    <>
      <div class="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-1">
        <div class="group relative rounded-xl border border-slate-200 dark:border-slate-800">
          <div class="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_bottom,var(--quick-links-hover-border))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]"></div>
          <div class="relative overflow-hidden rounded-xl p-6">
            <h2 class="mt-4 font-display text-base text-slate-900 dark:text-white">
              <span class="absolute -inset-px rounded-xl"></span>Thanks for your
              feedback. We will try to improve :(
            </h2>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Feedback({ resource }) {
  const [reaction, setReaction] = useState(null)

  const isReacted = reaction === 'Yes' || reaction === 'No'
  const _resource = String(resource).replace(/\//g, '-')

  const handleReaction = (params) => {
    setReaction(params.detail.icon)
  }

  const checkWidgetAndInsertDivs = () => {
    const widget = document.querySelector('hr-widget')
    if (widget) {
      // Widget is now in the DOM, insert divs before hr-reactions
      insertDivBeforeHrReaction()
    } else {
      // ugly but works for now...
      setTimeout(checkWidgetAndInsertDivs, 1000)
    }
  }

  useEffect(() => {
    checkWidgetAndInsertDivs()
  }, [])

  const insertDivBeforeHrReaction = () => {
    const hrReactions = document.querySelectorAll('.hr-reaction')
    hrReactions.forEach((hrReaction) => {
      const div = document.createElement('div')
      div.classList.add(
        'absolute',
        '-inset-px',
        'rounded-xl',
        'border-2',
        'border-transparent',
        'opacity-0',
        '[background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_bottom,var(--quick-links-hover-border))_border-box]',
        'group-hover:opacity-100',
        'dark:[--quick-links-hover-bg:theme(colors.slate.800)]'
      )
      hrReaction.parentNode.insertBefore(div, hrReaction)
    })
  }
  return (
    <>
      <div id="happyReact" class="prose prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-accent-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.accent.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.accent.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800 prose-table:m-0">
        <h2 class="mb-0 text-center">Was this page helpful?</h2>
        {!isReacted ? (
          <div>
            <Widget
              token="8c828a21-ead0-4998-b98b-f465fd3e4e4f"
              resource={_resource}
              onReaction={handleReaction}
              classes={{
                grid: 'not-prose grid grid-cols-1 gap-6 sm:grid-cols-2',
                cell: 'group relative rounded-xl border border-slate-200 dark:border-slate-800',
                reaction: 'relative overflow-hidden rounded-xl p-6',
              }}
            />
          </div>
        ) : reaction === 'No' ? (
          <VotedNo />
        ) : (
          <VotedYes />
        )}
      </div>
    </>
  )
}
