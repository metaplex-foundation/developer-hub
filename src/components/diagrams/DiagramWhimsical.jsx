import clsx from 'clsx'
import { memo } from 'react'
import { Handle, Position, getRectOfNodes } from 'reactflow'
import { LabelOrContent } from './utils'

const themes = {
  default: {
    node: 'border-[#c3cfd9]',
    edge: '#788796',
  },
  slate: {
    node: 'border-[#788796] bg-[#ced8e0] dark:bg-[#788796]/20',
    edge: '#788796',
  },
  blue: {
    node: 'border-[#2c88d9] bg-[#d5e7f7] dark:bg-[#2c88d9]/20',
    edge: '#2c88d9',
  },
  indigo: {
    node: 'border-[#6558f5] bg-[#e1defe] dark:bg-[#6558f5]/20',
    edge: '#6558f5',
  },
  purple: {
    node: 'border-[#730fc3] bg-[#e3cff3] dark:bg-[#730fc3]/20',
    edge: '#730fc3',
  },
  pink: {
    node: 'border-[#bd35d1] bg-[#f2d6f6] dark:bg-[#bd35d1]/20',
    edge: '#bd35d1',
  },
  mint: {
    node: 'border-[#19ae9f] bg-[#d1efec] dark:bg-[#19ae9f]/20',
    edge: '#19ae9f',
  },
  green: {
    node: 'border-[#207869] bg-[#d2e4e1] dark:bg-[#207869]/20',
    edge: '#207869',
  },
  brown: {
    node: 'border-[#887b5f] bg-[#e6e4de] dark:bg-[#887b5f]/20',
    edge: '#887b5f',
  },
  crimson: {
    node: 'border-[#ac6263] bg-[#efdfe0] dark:bg-[#ac6263]/20',
    edge: '#ac6263',
  },
  red: {
    node: 'border-[#d3455c] bg-[#f6dade] dark:bg-[#d3455c]/20',
    edge: '#d3455c',
  },
  orange: {
    node: 'border-[#e8833a] bg-[#fae6d8] dark:bg-[#e8833a]/20',
    edge: '#e8833a',
  },
  yellow: {
    node: 'border-[#f7c325] bg-[#fdf3d3] dark:bg-[#f7c325]/20',
    edge: '#f7c325',
  },
}

function TransparentHandles() {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
      />
    </>
  )
}

export const Node = memo(function Node({ data }) {
  const tree = data.tree
  const hasSections = data.sections?.length > 0
  const hasParent = tree.parent !== null
  const hasChildren = tree.children?.length > 0
  const isFirstSibling = hasParent && tree.parentIndex === 0
  const isLastSibling =
    hasParent && tree.parentIndex === tree.siblings.length - 1

  if (hasChildren && !hasParent) {
    return (
      <div
        className={clsx(
          'h-full w-full rounded-md bg-white text-slate-700 shadow dark:bg-slate-700 dark:text-slate-300'
        )}
      >
        <TransparentHandles />
      </div>
    )
  }

  if (hasChildren) {
    return (
      <div className="h-full w-full">
        <TransparentHandles />
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'h-full w-full bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        {
          'rounded-t-md': isFirstSibling,
          'rounded-b-md': isLastSibling,
          'rounded-md shadow': !hasParent,
        }
      )}
    >
      <div
        className={clsx(
          'h-full w-full border',
          themes[data.theme ?? 'default'].node,
          {
            'rounded-t-md': hasSections || isFirstSibling,
            'rounded-b-md': isLastSibling,
            'rounded-md': !hasSections && !hasParent,
            '-mt-px': !hasSections && !isFirstSibling,
          }
        )}
      >
        <div
          className={clsx({
            'px-4 py-1 text-center font-medium': !hasParent || isFirstSibling,
            'px-2 py-0.5 leading-tight': hasParent && !isFirstSibling,
          })}
        >
          <LabelOrContent data={data} />
        </div>
      </div>
      {hasSections && (
        <div
          className={clsx(
            'divide-y divide-[#c3cfd9] rounded-b-md border border-t-0 border-[#c3cfd9] text-left text-xs',
            'dark:divide-[#788796] dark:border-[#788796]'
          )}
        >
          {data.sections?.map((section, i) => (
            <div key={i} className="px-2 py-0.5 leading-tight">
              <LabelOrContent data={section} />
            </div>
          ))}
        </div>
      )}
      <TransparentHandles />
    </div>
  )
})

export function transformNodes(nodes, getNode) {
  const stack = [] // Array<id>
  const visited = {} // Record<id, node>

  const visit = (node) => {
    if (visited[node.id]) {
      return visited[node.id]
    }
    if (stack.includes(node.id)) {
      throw new Error(
        `Circular relative nodes detected: ${[...stack, node.id].join(' -> ')}`
      )
    }
    stack.push(node.id)
    const childrenIds = node.data?.tree?.children ?? []
    const children = nodes.filter(({ id }) => childrenIds.includes(id))
    const visitedChildren = children.map((child) => visit(child))
    stack.pop()

    if (node.data.tree.parent) {
      const previousSiblingId =
        node.data.tree.siblings[node.data.tree.parentIndex - 1]
      const previousSibling = visited[previousSiblingId]
      const previousSiblingPos = previousSibling?.position ?? { x: 0, y: 0 }
      const previousSiblingDim = previousSibling
        ? getNode(previousSibling.id)
        : { width: 0, height: 0 }
      node = {
        ...node,
        position: {
          x: node.position.x,
          y: node.position.y + previousSiblingPos.y + previousSiblingDim.height,
        },
        style: {
          zIndex: node.data.tree.parentIndex === 0 ? 1 : undefined,
          ...node.style,
        },
      }
    }

    if (visitedChildren.length > 0) {
      const childrenRect = visitedChildren.map((child) => {
        const renderedChild = getNode(child.id)
        return {
          position: child.position,
          width: child.style?.width ?? renderedChild.width,
          height: child.style?.height ?? renderedChild.height,
        }
      })
      const parentRect = getRectOfNodes(childrenRect)
      node = {
        ...node,
        style: {
          ...node.style,
          width: parentRect.width + 1,
          height: parentRect.height,
        },
      }
    }

    visited[node.id] = node
    return node
  }

  return nodes
    .map((node) => visit(node))
    .map((node) => {
      if (!node.data.tree.ancestor) return node
      const ancestor = visited[node.data.tree.ancestor]
      return { ...node, style: { ...node.style, width: ancestor.style.width } }
    })
}

export function transformEdges(edges) {
  return edges.map((edge) => {
    const color = themes[edge.data?.theme ?? 'default'].edge
    return {
      ...edge,
      style: { ...edge.style, stroke: color },
      markerEnd: { ...edge.markerEnd, type: 'arrowclosed', color },
    }
  })
}
