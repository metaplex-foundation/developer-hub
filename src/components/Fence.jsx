import Highlight, { defaultProps } from 'prism-react-renderer';
import { Fragment } from 'react';
import CopyToClipboardButton from './products/CopyToClipboard';
(typeof global !== 'undefined' ? global : window).Prism = Prism

require('prismjs/components/prism-kotlin')
require('prismjs/components/prism-csharp')
require('prismjs/components/prism-java')
require('prismjs/components/prism-php')
require('prismjs/components/prism-ruby')

export function Fence({ children, language }) {
  return (
    <Highlight
      {...defaultProps}
      code={children.trimEnd()}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre className={className + ' scrollbar relative '} style={style}>
          <CopyToClipboardButton text={children} />
          <code className="block w-[calc(100%-25px)] overflow-auto ">
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
