import { useRouter } from 'next/router'
import Script from 'next/script'

// public/assets/plgrnd holds the @plgrnd/embed 1.0.1 build, as published at https://plgrnd.io/sdk/1.0.1/
export function PlgrndFlow({ flow }) {
  const { basePath } = useRouter()

  return (
    <>
      <Script
        src={`${basePath}/assets/plgrnd/plgrnd-flow-1.0.1.js`}
        integrity="sha384-Y2BkqcJKLd+pVOsJ4EU/v0QoThcL8XpjFHeKoy7sLj24U73lzYK2VnShhVe7qv3B"
      />
      <plgrnd-flow
        flow={flow}
        theme="dark"
        link-ref="metaplex-docs"
        style={{ display: 'block', aspectRatio: '16/9', minHeight: 320 }}
      />
    </>
  )
}
