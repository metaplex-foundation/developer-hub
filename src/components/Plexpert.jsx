import Script from 'next/script'

export function Plexpert() {
  return (
    <Script
      src="https://metaplex.useanything.com/embed/anythingllm-chat-widget.min.js"
      data-embed-id="e86b14ea-f7f4-4af4-94dc-913d320e9b9d"
      data-base-api-url="https://metaplex.useanything.com/api/embed"
      data-chat-icon="magic"
      data-brand-image-url="https://avatars.githubusercontent.com/u/4599573?s=280&v=4"
      data-assistant-name="Plexpert (alpha)"
      data-assistant-icon="https://avatars.githubusercontent.com/u/4599573?s=280&v=4"
      data-greeting="Hello! I'm Plexert, an experimental AI assistant. How can I help you today?"
    ></Script>
  )
}
