import { useMemo, useState } from 'react'

const MerkleTreeConfigTable = () => {
  const maxCanopyDepth = 17

  const [maxDepth, setMaxDepth] = useState()
  const [maxBuffer, setMaxBuffer] = useState()
  const [numberOfProofs, setNumberOfProofs] = useState()
  const [canopySize, setCanopySize] = useState()

  const maxNumberOptions = [
    { nfts: 16384, depth: 14 },
    { nfts: 32768, depth: 15 },
    { nfts: 65536, depth: 16 },
    { nfts: 131072, depth: 17 },
    { nfts: 262144, depth: 18 },
    { nfts: 524288, depth: 19 },
    { nfts: 1048576, depth: 20 },
    { nfts: 16777216, depth: 24 },
    { nfts: 67108864, depth: 26 },
    { nfts: 1073741824, depth: 30 },
  ]

  const canopySizeOptions = useMemo(() => {
    let options = []

    const maxProofBytes = maxDepth * 32

    for (let i = 0; i < 17; i++) {
      const proofBytes = maxProofBytes - i * 32
      const proofsNeeded = Math.ceil(proofBytes / 32)

      if (proofsNeeded < 0) {
        continue
      }
      console.log('proofsNeeded: ' + proofsNeeded)

      console.log(i)
      if (proofsNeeded < 8) {
        console.log({
          i,
          proofsNeeded,
        })
        options.unshift(
          <option key={i} value={proofsNeeded}>
            {proofsNeeded} <span>({maxProofBytes - i * 32} bytes)</span>
          </option>
        )
      } else if (proofsNeeded === 8) {
        console.log({
          i,
          proofsNeeded,
        })
        options.unshift(
          <option key={i} value={proofsNeeded} selected>
            {proofsNeeded} Recommended{' '}
            <span>({maxProofBytes - i * 32} bytes)</span>
          </option>
        )
      } else if (proofsNeeded > 8) {
        console.log({
          i,
          proofsNeeded,
        })
        options.unshift(
          <option key={i} value={proofsNeeded}>
            {proofsNeeded} <span>({maxProofBytes - i * 32} bytes)</span>
          </option>
        )
      }
    }

    console.log(options)
    return (
      <>
        <optgroup label="Less Composable"></optgroup>
        {options}
        <optgroup label="More Composable"></optgroup>
      </>
    )
  }, [maxDepth])

  return (
    <div>
      <h1>Merkle Tree Configuration</h1>
      <div>
        <div>
          <div>Number of cNFTs</div>
          <select
            className="w-full rounded p-2 text-black"
            onChange={(e) => setMaxDepth(e.target.value)}
          >
            {maxNumberOptions.map((option) => (
              <option key={option.nfts} value={option.depth}>
                {option.nfts.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div>Number of Proofs</div>
          <select
            className="w-full rounded p-2 text-black"
            onChange={(e) => {
              setNumberOfProofs(e.target.value)
            }}
          >
            {canopySizeOptions}
          </select>
        </div>
      </div>
    </div>
  )
}

export default MerkleTreeConfigTable
