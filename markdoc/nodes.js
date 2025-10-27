import { nodes as defaultNodes } from '@markdoc/markdoc'

import { Fence } from '@/components/Fence'

const nodes = {
  document: {
    render: undefined,
  },
  table: {
    ...defaultNodes.table,
    render: (props) => {
      const Table = defaultNodes.table.render
      return (
        <div className="my-6 overflow-x-auto">
          <Table {...props} />
        </div>
      )
    },
  },
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  fence: {
    render: Fence,
    attributes: {
      language: {
        type: String,
      },
      showLineNumbers: {
        type: Boolean,
        default: false,
      },
      highlightLines: {
        type: String,
        default: '',
      },
      showLines: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      showCopy: {
        type: Boolean,
        default: true,
      },
    },
  },
}

export default nodes
