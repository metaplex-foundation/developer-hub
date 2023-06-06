import { Tag } from '@markdoc/markdoc'
import clsx from 'clsx'
import { toPng } from 'html-to-image'
import { useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  Panel,
  ReactFlowProvider,
  getRectOfNodes,
  getTransformForBounds,
  useReactFlow,
} from 'reactflow'

import { Icon } from '@/components/Icon'
import * as whimsical from './DiagramWhimsical'
import { FloatingEdge } from './FloatingEdge'

const nodeTypes = {
  whimsical: whimsical.Node,
}

const edgeTypes = {
  floating: FloatingEdge,
}

export function Diagram(props) {
  return (
    <ReactFlowProvider>
      <WrappedDiagram {...props} />
    </ReactFlowProvider>
  )
}

export function WrappedDiagram({ height = 'h-64 md:h-96', nodes, edges }) {
  const { fitView, getNodes } = useReactFlow()

  // Fullscreen mode.
  const [fullscreen, setFullscreen] = useState(false)
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
    setTimeout(fitView, 10)
  }
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && fullscreen) {
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [fullscreen])

  // Download image.
  const imageWidth = 1024
  const imageHeight = 768
  const downloadImage = () => {
    const nodesBounds = getRectOfNodes(getNodes())
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    )
    const isDarkMode = document.querySelector('html').classList.contains('dark')
    toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadDataUrl)
  }

  return (
    <div
      className={clsx('diagram-prose w-full', {
        [height]: !fullscreen,
        relative: !fullscreen,
        'fixed inset-0 z-[99999] h-full w-full': fullscreen,
      })}
    >
      <Panel position="top-right">
        <div className="flex gap-1 rounded-md bg-white p-1 shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
          <button
            onClick={downloadImage}
            className="rounded p-1 hover:bg-slate-100 hover:dark:bg-slate-600/40"
          >
            <Icon icon="InboxArrowDown" className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="rounded p-1 hover:bg-slate-100 hover:dark:bg-slate-600/40"
          >
            <Icon
              icon={fullscreen ? 'ArrowsPointingIn' : 'ArrowsPointingOut'}
              className="h-5 w-5"
            />
          </button>
        </div>
      </Panel>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        className="rounded-xl bg-slate-50 dark:bg-slate-800"
      >
        <Background
          color="currentColor"
          className="text-slate-400 dark:text-slate-600"
        />
      </ReactFlow>
    </div>
  )
}

export function transformDiagramTag(node, config) {
  const attributes = node.transformAttributes(config)
  const children = node.transformChildren(config)

  const type = attributes.type ?? 'whimsical'
  const rawNodes = children.filter((child) => child.name === 'Node')
  const rawEdges = children.filter((child) => child.name === 'Edge')
  const nodes = transformNodes(rawNodes, type)
  const edges = transformEdges(rawEdges, type)

  return new Tag(this.render, { ...attributes, nodes, edges, type }, children)
}

function transformNodes(rawNodes, type) {
  let nodes = rawNodes.map(({ attributes, children }, index) => ({
    id: attributes.id ?? `node-${index}`,
    type: attributes.type ?? (type in nodeTypes ? type : 'whimsical'),
    parentNode: attributes.parent,
    data: {
      children,
      label: attributes.label,
      theme: attributes.theme,
      sections: attributes.sections,
    },
    position: {
      x: parseInt(attributes.x ?? 0, 10),
      y: parseInt(attributes.y ?? 0, 10),
    },
  }))

  switch (type) {
    case 'whimsical':
      return whimsical.transformNodes(nodes)
    default:
      return nodes
  }
}

function transformEdges(rawEdges, type) {
  const edges = rawEdges.map(({ attributes, children }, index) => ({
    id: attributes.id ?? `edge-${index}`,
    type: attributes.type ?? (type in edgeTypes ? type : 'floating'),
    source: attributes.from,
    target: attributes.to,
    animated: attributes.animated ?? false,
    data: {
      children,
      label: attributes.label,
      theme: attributes.theme,
      fromPosition: attributes.fromPosition,
      toPosition: attributes.toPosition,
      path: attributes.path,
    },
  }))

  switch (type) {
    case 'whimsical':
      return whimsical.transformEdges(edges)
    default:
      return edges
  }
}

function downloadDataUrl(dataUrl, name = 'diagram.png') {
  const a = document.createElement('a')
  a.setAttribute('download', name)
  a.setAttribute('href', dataUrl)
  a.click()
}

// function resolveRelativeNodePositions(nodes) {
//   const stack = [] // Array<id>
//   const visited = {} // Record<id, node>

//   const visit = (node) => {
//     if (visited[node.id]) {
//       return visited[node.id]
//     }
//     if (!node.data.from) {
//       visited[node.id] = node
//       return node
//     }
//     const relativeNode = nodes.find(({ id }) => id === node.data.from)
//     if (!relativeNode) {
//       throw new Error(`Relative node "${node.data.from}" not found`)
//     }
//     if (stack.includes(node.id)) {
//       throw new Error(
//         `Circular relative nodes detected: ${[...stack, node.id].join(' -> ')}`
//       )
//     }
//     stack.push(node.id)
//     const visitedRelativeNode = visit(relativeNode)
//     stack.pop(node.id)
//     const resolvedNode = {
//       ...node,
//       position: {
//         x: visitedRelativeNode.position.x + node.position.x,
//         y: visitedRelativeNode.position.y + node.position.y,
//       },
//     }
//     visited[node.id] = resolvedNode
//     return resolvedNode
//   }

//   return nodes.map((node) => visit(node))
// }
