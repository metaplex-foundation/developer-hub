import { Fragment } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import CopyToClipboardButton from './products/CopyToClipboard'

export function Fence({ children, language }) {
  return (
    <Highlight
      {...defaultProps}
      code={children.trimEnd()}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre className={className + ' relative'} style={style}>
          <CopyToClipboardButton text={children} />
          <code>
            {tokens.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {'\n'}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  )
}
