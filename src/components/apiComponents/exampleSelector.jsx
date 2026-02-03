import { Select } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

const ApiExampleSelector = ({
  examples = [],
  selectedExample,
  handleSetExample,
}) => {
  if (!Array.isArray(examples)) {
    console.error('ApiExampleSelector: examples prop must be an array');
    return null;
  }

  const { mainnetExamples, devnetExamples } = examples.reduce(
    (acc, example) => {
      if (example?.chain === 'solanaMainnet') {
        acc.mainnetExamples.push(example);
      } else if (example?.chain === 'solanaDevnet') {
        acc.devnetExamples.push(example);
      }
      return acc;
    },
    { mainnetExamples: [], devnetExamples: [] }
  );

  const currentExample = selectedExample >= 0 && selectedExample < examples.length
    ? examples[selectedExample]
    : null;

  const handleExampleChange = (e) => {
    const selectedValue = e.target.value;
    if (!selectedValue) {
      handleSetExample(-1);
      return;
    }

    const index = parseInt(selectedValue, 10);
    if (!isNaN(index) && index >= 0 && index < examples.length) {
      handleSetExample(index);
    }
  };

  return (
    <div className="w-full">
      <label
        className="mb-3 text-sm font-medium text-muted-foreground"
        htmlFor="endPoint"
      >
        Example Queries
      </label>
      <div className="relative flex w-full gap-2">
        <div className="relative flex h-12 w-full">
          <Select
            onChange={handleExampleChange}
            value={selectedExample >= 0 ? selectedExample.toString() : ''}
            className={clsx(
              'block w-full appearance-none rounded-lg border border-border bg-card px-3 py-1.5 text-sm/6 text-foreground',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary/25',
              '*:text-foreground'
            )}
          >
            <option value="">-</option>
            {devnetExamples.length > 0 && (
              <optgroup label="Solana Devnet">
                {devnetExamples.map((example) => {
                  const originalIndex = examples.indexOf(example);
                  return (
                    <option key={`devnet-${originalIndex}`} value={originalIndex.toString()}>
                      {example.name}
                    </option>
                  );
                })}
              </optgroup>
            )}
            {mainnetExamples.length > 0 && (
              <optgroup label="Solana Mainnet">
                {mainnetExamples.map((example) => {
                  const originalIndex = examples.indexOf(example);
                  return (
                    <option key={`mainnet-${originalIndex}`} value={originalIndex.toString()}>
                      {example.name}
                    </option>
                  );
                })}
              </optgroup>
            )}
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute right-2.5 top-4 my-auto size-4 fill-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <button
          onClick={() => handleSetExample(-1)}
          className="block rounded-lg border border-border bg-card px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ApiExampleSelector;
