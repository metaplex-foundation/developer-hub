'use client'

import { useState, useMemo, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Constants: valid (maxDepth, maxBufferSize) pairs from SPL Account Compression
// ---------------------------------------------------------------------------
const VALID_DEPTH_BUFFER_PAIRS = [
  { maxDepth: 3, maxBufferSize: 8 },
  { maxDepth: 5, maxBufferSize: 8 },
  { maxDepth: 6, maxBufferSize: 16 },
  { maxDepth: 7, maxBufferSize: 16 },
  { maxDepth: 8, maxBufferSize: 16 },
  { maxDepth: 9, maxBufferSize: 16 },
  { maxDepth: 10, maxBufferSize: 32 },
  { maxDepth: 11, maxBufferSize: 32 },
  { maxDepth: 12, maxBufferSize: 32 },
  { maxDepth: 13, maxBufferSize: 32 },
  { maxDepth: 14, maxBufferSize: 64 },
  { maxDepth: 14, maxBufferSize: 256 },
  { maxDepth: 14, maxBufferSize: 1024 },
  { maxDepth: 14, maxBufferSize: 2048 },
  { maxDepth: 15, maxBufferSize: 64 },
  { maxDepth: 16, maxBufferSize: 64 },
  { maxDepth: 17, maxBufferSize: 64 },
  { maxDepth: 18, maxBufferSize: 64 },
  { maxDepth: 19, maxBufferSize: 64 },
  { maxDepth: 20, maxBufferSize: 64 },
  { maxDepth: 20, maxBufferSize: 256 },
  { maxDepth: 20, maxBufferSize: 1024 },
  { maxDepth: 20, maxBufferSize: 2048 },
  { maxDepth: 24, maxBufferSize: 64 },
  { maxDepth: 24, maxBufferSize: 256 },
  { maxDepth: 24, maxBufferSize: 512 },
  { maxDepth: 24, maxBufferSize: 1024 },
  { maxDepth: 24, maxBufferSize: 2048 },
  { maxDepth: 26, maxBufferSize: 512 },
  { maxDepth: 26, maxBufferSize: 1024 },
  { maxDepth: 26, maxBufferSize: 2048 },
  { maxDepth: 30, maxBufferSize: 512 },
  { maxDepth: 30, maxBufferSize: 1024 },
  { maxDepth: 30, maxBufferSize: 2048 },
]

const UNIQUE_DEPTHS = [...new Set(VALID_DEPTH_BUFFER_PAIRS.map((p) => p.maxDepth))]

const LAMPORTS_PER_SOL = 1_000_000_000

// ---------------------------------------------------------------------------
// Bubblegum program constraints
// ---------------------------------------------------------------------------
// Maximum number of proof accounts that fit in a single Solana transaction.
// Defined as MAX_ACC_PROOFS_SIZE in mpl-bubblegum create_tree.rs.
const MAX_ACC_PROOFS = 17

// Minimum canopy depth required by Bubblegum's check_canopy_size validation.
// Trees with maxDepth > MAX_ACC_PROOFS must store enough canopy on-chain so
// that the remaining proof fits in a transaction.
function getMinCanopyDepth(maxDepth) {
  return Math.max(0, maxDepth - MAX_ACC_PROOFS)
}

// Maximum practical canopy depth.  Canopy stores (2^(n+1) - 2) * 32 bytes.
// At canopy depth 18 the canopy alone exceeds Solana's 10 MB account limit,
// so 17 is the hard ceiling.  For shallow trees the canopy cannot exceed the
// tree depth itself.
function getMaxCanopyDepth(maxDepth) {
  return Math.min(maxDepth, MAX_ACC_PROOFS)
}

// ---------------------------------------------------------------------------
// Math: mirrors getConcurrentMerkleTreeAccountSize from SPL Account Compression
// ---------------------------------------------------------------------------
function getConcurrentMerkleTreeAccountSize(maxDepth, maxBufferSize, canopyDepth) {
  const headerSize = 56
  const treeSize = 64 + maxBufferSize * (40 + maxDepth * 32) + maxDepth * 32
  const canopySize = canopyDepth > 0 ? (Math.pow(2, canopyDepth + 1) - 2) * 32 : 0
  return headerSize + treeSize + canopySize
}

function getRentExemptionLamports(accountSize) {
  return (accountSize + 128) * 6960
}

function lamportsToSol(lamports) {
  return lamports / LAMPORTS_PER_SOL
}

function formatSol(sol) {
  if (sol < 0.0001) return sol.toFixed(8)
  if (sol < 1) return sol.toFixed(4)
  if (sol < 100) return sol.toFixed(2)
  return sol.toFixed(1)
}

function formatNumber(n) {
  return new Intl.NumberFormat().format(n)
}

// ---------------------------------------------------------------------------
// Tree Visualization (SVG)
// ---------------------------------------------------------------------------
function MerkleTreeVisualization({ maxDepth, canopyDepth }) {
  const displayDepth = Math.min(maxDepth, 7)
  const proofDepth = displayDepth - Math.min(canopyDepth, displayDepth)
  const leafLevel = displayDepth
  const canopyLevel = Math.min(canopyDepth, displayDepth)

  const width = 600
  const height = 280
  const paddingX = 30
  const paddingTop = 24
  const paddingBottom = 20
  const usableWidth = width - paddingX * 2
  const usableHeight = height - paddingTop - paddingBottom

  const levelHeight = usableHeight / Math.max(displayDepth, 1)

  const nodes = []
  const edges = []

  for (let level = 0; level <= displayDepth; level++) {
    const count = Math.pow(2, level)
    const spacing = usableWidth / (count + 1)

    for (let i = 0; i < count; i++) {
      const x = paddingX + spacing * (i + 1)
      const y = paddingTop + level * levelHeight

      let type = 'proof'
      if (level < canopyLevel) type = 'canopy'
      else if (level === canopyLevel && canopyLevel > 0) type = 'canopy'
      if (level === displayDepth) type = 'leaf'

      nodes.push({ x, y, level, index: i, type })

      if (level > 0) {
        const parentCount = Math.pow(2, level - 1)
        const parentSpacing = usableWidth / (parentCount + 1)
        const parentIndex = Math.floor(i / 2)
        const parentX = paddingX + parentSpacing * (parentIndex + 1)
        const parentY = paddingTop + (level - 1) * levelHeight

        let edgeType = 'proof'
        if (level <= canopyLevel) edgeType = 'canopy'

        edges.push({ x1: parentX, y1: parentY, x2: x, y2: y, type: edgeType })
      }
    }
  }

  const truncated = maxDepth > 7

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900/50">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: '280px' }}>
        {edges.map((e, i) => (
          <line
            key={`e-${i}`}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={e.type === 'canopy' ? '#22c55e' : '#94a3b8'}
            strokeWidth={e.type === 'canopy' ? 1.5 : 1}
            opacity={e.type === 'canopy' ? 0.8 : 0.4}
          />
        ))}
        {nodes.map((n, i) => {
          let fill = '#94a3b8'
          let r = 4
          if (n.type === 'canopy') { fill = '#22c55e'; r = 5 }
          if (n.type === 'leaf') { fill = '#3b82f6'; r = 4 }
          return (
            <circle
              key={`n-${i}`}
              cx={n.x}
              cy={n.y}
              r={r}
              fill={fill}
              opacity={0.9}
            />
          )
        })}
        {truncated && (
          <text
            x={width / 2}
            y={height - 4}
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500"
            fontSize="10"
          >
            Showing {displayDepth} of {maxDepth} levels
          </text>
        )}
      </svg>
      <div className="flex items-center justify-center gap-4 border-t border-slate-200 px-3 py-2 text-xs dark:border-slate-700">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-slate-600 dark:text-slate-400">Canopy (on-chain)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span className="text-slate-600 dark:text-slate-400">Proof nodes</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-slate-600 dark:text-slate-400">Leaves (cNFTs)</span>
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
function StatCard({ label, value, sublabel, accent }) {
  const borderClass = accent === 'green'
    ? 'border-green-200 dark:border-green-800/50'
    : accent === 'blue'
    ? 'border-blue-200 dark:border-blue-800/50'
    : 'border-slate-200 dark:border-slate-700'

  return (
    <div className={`rounded-lg border ${borderClass} bg-white p-3 dark:bg-slate-800/50`}>
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      {sublabel && (
        <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sublabel}</div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Calculator Component
// ---------------------------------------------------------------------------
export function BubblegumCalculator() {
  const [mode, setMode] = useState('simple')
  const [desiredNfts, setDesiredNfts] = useState(1000000)
  const [advMaxDepth, setAdvMaxDepth] = useState(14)
  const [advMaxBuffer, setAdvMaxBuffer] = useState(64)
  const [advCanopyDepth, setAdvCanopyDepth] = useState(8)

  // Simple mode: auto-select closest tree
  const autoConfig = useMemo(() => {
    const nodes = Math.max(1, desiredNfts || 1)
    let depth = UNIQUE_DEPTHS[0]
    for (const d of UNIQUE_DEPTHS) {
      if (Math.pow(2, d) >= nodes) {
        depth = d
        break
      }
      depth = d
    }
    const validBuffers = VALID_DEPTH_BUFFER_PAIRS.filter((p) => p.maxDepth === depth)
    const buffer = validBuffers[0]?.maxBufferSize ?? 8
    const minCanopy = getMinCanopyDepth(depth)
    const maxCanopy = getMaxCanopyDepth(depth)

    const minDesc = minCanopy > 0
      ? `Canopy ${minCanopy} (Bubblegum minimum)`
      : 'No canopy — largest proof size'

    return [
      { maxDepth: depth, maxBufferSize: buffer, canopyDepth: minCanopy, label: 'Minimum cost', desc: minDesc },
      { maxDepth: depth, maxBufferSize: buffer, canopyDepth: Math.max(minCanopy, maxCanopy - 3), label: 'Balanced', desc: 'Moderate canopy — good composability' },
      { maxDepth: depth, maxBufferSize: buffer, canopyDepth: maxCanopy, label: 'Maximum composability', desc: 'Full canopy — smallest proof size' },
    ]
  }, [desiredNfts])

  // Advanced mode: valid buffers for selected depth
  const advValidBuffers = useMemo(
    () => VALID_DEPTH_BUFFER_PAIRS.filter((p) => p.maxDepth === advMaxDepth).map((p) => p.maxBufferSize),
    [advMaxDepth],
  )

  const advMinCanopy = useMemo(
    () => getMinCanopyDepth(advMaxDepth),
    [advMaxDepth],
  )

  const advMaxCanopy = useMemo(
    () => getMaxCanopyDepth(advMaxDepth),
    [advMaxDepth],
  )

  // When depth changes, reset buffer and canopy
  const handleDepthChange = useCallback(
    (newDepth) => {
      setAdvMaxDepth(newDepth)
      const validBuffers = VALID_DEPTH_BUFFER_PAIRS.filter((p) => p.maxDepth === newDepth)
      setAdvMaxBuffer(validBuffers[0]?.maxBufferSize ?? 8)
      const minCanopy = getMinCanopyDepth(newDepth)
      const maxCanopy = getMaxCanopyDepth(newDepth)
      setAdvCanopyDepth((prev) => Math.max(minCanopy, Math.min(prev, maxCanopy)))
    },
    [],
  )

  // Compute cost for a config
  const computeCost = useCallback((maxDepth, maxBufferSize, canopyDepth) => {
    const size = getConcurrentMerkleTreeAccountSize(maxDepth, maxBufferSize, canopyDepth)
    const lamports = getRentExemptionLamports(size)
    return lamportsToSol(lamports)
  }, [])

  const handleNftInput = useCallback((e) => {
    const raw = e.target.value.replace(/,/g, '')
    const num = parseInt(raw, 10)
    if (isNaN(num) || num < 1) {
      setDesiredNfts(1)
    } else if (num > Math.pow(2, 30)) {
      setDesiredNfts(Math.pow(2, 30))
    } else {
      setDesiredNfts(num)
    }
  }, [])

  return (
    <div className="not-prose my-6 space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/50">
        <button
          onClick={() => setMode('simple')}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'simple'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Quick Estimate
        </button>
        <button
          onClick={() => setMode('advanced')}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'advanced'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Advanced
        </button>
      </div>

      {mode === 'simple' ? (
        <SimpleMode
          desiredNfts={desiredNfts}
          onNftInput={handleNftInput}
          setDesiredNfts={setDesiredNfts}
          autoConfig={autoConfig}
          computeCost={computeCost}
        />
      ) : (
        <AdvancedMode
          maxDepth={advMaxDepth}
          maxBuffer={advMaxBuffer}
          canopyDepth={advCanopyDepth}
          validBuffers={advValidBuffers}
          minCanopy={advMinCanopy}
          maxCanopy={advMaxCanopy}
          onDepthChange={handleDepthChange}
          onBufferChange={setAdvMaxBuffer}
          onCanopyChange={setAdvCanopyDepth}
          computeCost={computeCost}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Simple Mode
// ---------------------------------------------------------------------------
function SimpleMode({ desiredNfts, onNftInput, setDesiredNfts, autoConfig, computeCost }) {
  const depth = autoConfig[0].maxDepth
  const capacity = Math.pow(2, depth)

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          How many compressed NFTs do you need?
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={desiredNfts.toLocaleString()}
            onChange={onNftInput}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { label: '16K', value: 16_384 },
            { label: '1M', value: 1_000_000 },
            { label: '10M', value: 10_000_000 },
            { label: '1B', value: 1_000_000_000 },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setDesiredNfts(value)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                desiredNfts === value
                  ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Closest tree depth: <strong>{depth}</strong> (holds up to {formatNumber(capacity)} cNFTs)
        </p>
        {depth > MAX_ACC_PROOFS && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Bubblegum requires a minimum canopy depth of {getMinCanopyDepth(depth)} for this tree size.
            Only {MAX_ACC_PROOFS} proof accounts fit in a single transaction.
          </p>
        )}
      </div>

      {/* Three Option Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {autoConfig.map((config, i) => {
          const cost = computeCost(config.maxDepth, config.maxBufferSize, config.canopyDepth)
          const proofSize = config.maxDepth - config.canopyDepth
          const costPerNft = cost / capacity

          return (
            <div
              key={i}
              className={`rounded-lg border p-4 ${
                i === 1
                  ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {config.label}
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatSol(cost)} SOL
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {config.desc}
              </div>
              <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-xs dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Canopy depth</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{config.canopyDepth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Proof size</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{proofSize} nodes ({proofSize * 32} bytes)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Cost per cNFT</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{costPerNft.toFixed(8)} SOL</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tree Vis for middle (recommended) option */}
      <MerkleTreeVisualization maxDepth={depth} canopyDepth={autoConfig[1].canopyDepth} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Advanced Mode
// ---------------------------------------------------------------------------
function AdvancedMode({
  maxDepth,
  maxBuffer,
  canopyDepth,
  validBuffers,
  minCanopy,
  maxCanopy,
  onDepthChange,
  onBufferChange,
  onCanopyChange,
  computeCost,
}) {
  const cost = computeCost(maxDepth, maxBuffer, canopyDepth)
  const capacity = Math.pow(2, maxDepth)
  const proofSize = maxDepth - canopyDepth
  const proofBytes = proofSize * 32
  const accountSize = getConcurrentMerkleTreeAccountSize(maxDepth, maxBuffer, canopyDepth)
  const costPerNft = cost / capacity

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Max Depth */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Max Depth
            </label>
            <select
              value={maxDepth}
              onChange={(e) => onDepthChange(parseInt(e.target.value, 10))}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              {UNIQUE_DEPTHS.map((d) => (
                <option key={d} value={d}>
                  {d} ({formatNumber(Math.pow(2, d))} cNFTs)
                </option>
              ))}
            </select>
          </div>

          {/* Max Buffer Size */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Max Buffer Size
            </label>
            <select
              value={maxBuffer}
              onChange={(e) => onBufferChange(parseInt(e.target.value, 10))}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              {validBuffers.map((b) => (
                <option key={b} value={b}>
                  {formatNumber(b)}
                </option>
              ))}
            </select>
          </div>

          {/* Canopy Depth */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Canopy Depth
              <span className="ml-1 font-normal text-slate-400">({minCanopy}–{maxCanopy})</span>
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="range"
                min={minCanopy}
                max={maxCanopy}
                value={canopyDepth}
                onChange={(e) => onCanopyChange(parseInt(e.target.value, 10))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-green-500 dark:bg-slate-700"
              />
              <span className="min-w-[2rem] text-right font-mono text-sm font-medium text-slate-700 dark:text-slate-300">
                {canopyDepth}
              </span>
            </div>
            {minCanopy > 0 && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Bubblegum requires canopy ≥ {minCanopy} for depth {maxDepth} (proof must fit in {MAX_ACC_PROOFS} accounts)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cost Display */}
      <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:border-green-800/50 dark:from-green-900/10 dark:to-emerald-900/10">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-sm font-medium text-green-800 dark:text-green-300">Estimated Tree Cost</div>
            <div className="mt-1 text-3xl font-bold text-green-900 dark:text-green-100">
              {formatSol(cost)} SOL
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-green-700 dark:text-green-400">Cost per cNFT</div>
            <div className="font-mono text-sm font-medium text-green-800 dark:text-green-300">
              {costPerNft.toFixed(8)} SOL
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Max cNFTs"
          value={formatNumber(capacity)}
          sublabel={`2^${maxDepth}`}
          accent="blue"
        />
        <StatCard
          label="Proof Size"
          value={`${proofSize} nodes`}
          sublabel={`${proofBytes} bytes`}
        />
        <StatCard
          label="Account Size"
          value={`${formatNumber(accountSize)} bytes`}
          sublabel={`${(accountSize / 1024).toFixed(1)} KB`}
        />
        <StatCard
          label="Buffer Size"
          value={formatNumber(maxBuffer)}
          sublabel="concurrent changes / block"
        />
      </div>

      {/* Tree Visualization */}
      <MerkleTreeVisualization maxDepth={maxDepth} canopyDepth={canopyDepth} />
    </div>
  )
}
