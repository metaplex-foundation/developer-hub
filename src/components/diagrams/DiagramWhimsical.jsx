import clsx from 'clsx'
import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { LabelOrChildren } from './utils'

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

export const Node = memo(function ({ data }) {
  const hasSections = data.sections?.length > 0

  return (
    <div className="rounded-md bg-white text-slate-700 shadow dark:bg-slate-700 dark:text-slate-300">
      <div
        className={clsx(
          'border',
          themes[data.theme ?? 'default'].node,
          hasSections ? 'rounded-t-md' : 'rounded-md'
        )}
      >
        <div className="px-4 py-1 text-center font-medium">
          <LabelOrChildren data={data} />
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
              <LabelOrChildren data={section} />
            </div>
          ))}
        </div>
      )}

      <Handle type="target" position={Position.Top} className="!bg-transparent" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent" />
    </div>
  )
})

export function transformNodes(nodes) {
  return nodes
}

export function transformEdges(edges) {
  return edges.map((edge) => {
    const color = themes[edge.data?.theme ?? 'default'].edge
    return {
      ...edge,
      style: { stroke: color },
      markerEnd: { type: 'arrowclosed', color },
    }
  })
}
