const ApiExampleSelector = ({ examples, selectedExample, handleSetExample }) => {

return <div className="w-full">
<label
  className="mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400"
  htmlFor="endPoint"
>
  Loaded Example
</label>
<div className="flex w-full gap-2">
  <select
    onChange={(e) => handleSetExample(e.target.value)}
    value={selectedExample}
    className="block w-full rounded-lg border border-gray-200 px-2 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
  >
    <option value={-1}>-</option>
    {examples.map((example, index) => {
      return (
        <option key={index} value={index}>
          {example.name}
        </option>
      )
    })}
  </select>
  <button
    onClick={() => handleSetExample(-1)}
    className="block rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
  >
    Clear
  </button>
</div>
</div>
}

export default ApiExampleSelector