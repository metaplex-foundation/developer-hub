import React from 'react'
import dynamic from 'next/dynamic'
const BaseAskCookbook = dynamic(
  () => import('@cookbookdev/docsbot/react'),
  { ssr: false }
)

/* It's a public key used to identify the project, so it's fine to expose it here */
const COOKBOOK_PUBLIC_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmJkMzUyMjZkMjk4YjBkZjY4OWYxNjEiLCJpYXQiOjE3MjM2NzU5MzgsImV4cCI6MjAzOTI1MTkzOH0.mAt3-sCVYfKCuZ8T_6KYSKkHg6aTazmIiS2Di8yjMGE'

export default function AskCookbook() {
  return (
    <>
      <BaseAskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} />
    </>
  )
}
