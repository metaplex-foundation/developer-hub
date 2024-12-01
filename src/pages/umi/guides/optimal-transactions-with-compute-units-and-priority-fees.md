---
title: Optimal transaction landing using Compute Units (CU) and priority fees
metaTitle: Umi - Optimal transaction landing using Compute Units (CU) and priority fees
description: Improve your transactions by adding the optimal Compute Units (CU) and priority fees.
created: '12-01-2024'
updated: '12-01-2024'
---

When sending transactions on Solana, two key parameters can significantly improve your transaction's success rate and network efficiency:

## Priority Fees

Priority fees allow you to participate in local fee markets to prioritize your transaction. When multiple transactions try to write data to the same accounts, transactions with higher priority fees are more likely to be included in the next block. While this creates a small additional cost, it can be crucial for time-sensitive operations or when the network is busy. The amount of priorization Fees is paid for a transaction is calculated by multiplying the compute unit limit by the compute unit price.

## Compute Unit Limit

Every Solana transaction requires computational resources (Compute Units or CU) to execute. By default, transactions request a huge amount of CUs as a safety measure. However, this is often excessive and can be inefficient for two reasons:

1. You pay for all requested CUs, even if your transaction uses less
2. Each block has limited computational capacity - requesting excessive CUs means fewer transactions can fit in each block

By setting an appropriate CU limit based on your transaction's actual needs, you can:
- Reduce transaction costs by only paying for CUs you'll use
- Help the network process more transactions per block
- Still ensure your transaction has sufficient resources to execute

For example, a simple token transfer might only need 20,000 CUs, while an NFT mint could require 100,000 CUs. Setting these limits appropriately helps optimize both your costs and overall network throughput.

## How to use
General information on how you set those parameters in umi using mpl-toolbox can be found in the [umi documentation](https://developers.metaplex.com/umi/toolbox/priority-fees-and-compute-managment). In this guide we want to explore how to get the most useful numbers to not have to take random guesses, but have the numbers based on facts.

{% callout type="note" %}
Umi has not yet been extended to include some of the simulation and RPC calls we are using to calculate the numbers, therefore we are mixing web3.js@1 in here. Please be careful when mixing those packages since some types like Publickeys and Transactions are incompatible between each other and need to be converted to be used in the other package.

{% /callout %}

### Get Priority Fees
When using priority fees it is important to remember that those have the best effect when the competition is taken into account. Adding a huge number manually may result in overpaying more fees than required, while using a too low number might result in the transaction not being included into the block in case there is too much competition.

To get the last paid prioritization fees that were paid for the accounts in our transaction one can use the `getRecentPrioritizationFees` RPC call. We use the result to calculate an average based on the top 1000 fees paid. This number can be aligned according to your experience.

The below function shows how to get all the `uniquePublicKeys`, pass them into the RPC call and then calculates the priority fee we want to use based on a umi transaction that is being passed in. At the bottom of the page you can find a full example where a Sol Transfer is done.
```js
import {
  Transaction,
  Umi,
  uniquePublicKeys,
} from "@metaplex-foundation/umi";

const getPriorityFee = async (
  umi: Umi,
  transaction: Transaction
): Promise<number> => {
  const distinctPublicKeys = uniquePublicKeys(transaction.message.accounts);

  const response = await fetch(umi.rpc.getEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getRecentPrioritizationFees",
      params: [distinctPublicKeys],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as {
    jsonrpc: string;
    result: {
      prioritizationFee: number;
      slot: number;
    }[];
    id: number;
  };
  const fees = data.result.map((entry) => entry.prioritizationFee);

  const sortedFees = fees.sort((a, b) => b - a);

  const topFees = sortedFees.slice(0, 1000);

  const sumTopFees = topFees.reduce((sum, fee) => sum + fee, 0);
  const averageFees = Math.ceil(sumTopFees / topFees.length);

  return averageFees;
};
```

### Get Compute Units
When looking to get the best amount of compute units one can take advantage of transaction simulation. First the transaction is built with the maximum amount of 1400000 compute units.

Since umi does not support the `simulateTransaction` function right now we again manually build the rpc call and use `fetch` to get the result. When returning the number of compute units we multiply it by 1.1 as safeguard since for some functions the required CU may vary slightly.


```js
const getRequiredCU = async (umi: Umi, transaction: Transaction) => {
  const defaultCU = 800_000;
  const response = await fetch(umi.rpc.getEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "simulateTransaction",
      params: [
        base64.deserialize(umi.transactions.serialize(transaction)),
        {
          encoding: "base64",
          replaceRecentBlockhash: true,
          sigVerify: false,
        },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as any;
  if (!data.result.value.unitsConsumed) {
    return defaultCU;
  }
  return response.value.unitsConsumed * 1.1 || defaultCU;
};

```

### Full example for Sol Transfer
Following the code above and introducing some boilerplate to create the Umi instance could result in a script like this to create a Sol Transfer transaction:

```js

```

## Further Actions
- staked connection