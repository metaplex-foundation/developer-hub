---
title: Paginate DAS API Requests
metaTitle: Pagination | DAS API
description: Learn how to paginate DAS API Requests
---

# Paginating DAS API Requests

The Digital Asset Standard (DAS) API has a limit of 1,000 records per request. When you need to retrieve more data, pagination becomes essential. This guide covers the available pagination methods and best practices for implementing them.

## Understanding Sort Options

Before diving into pagination, it's important to understand the available sorting options as they affect how you'll paginate through results:

- `id` (Default): Sorts assets by their binary ID
- `created`: Sorts by creation timestamp
- `recent_action`: Sorts by last update timestamp
- `updated`: Sorts by last update timestamp
- `none`: No sorting applied (not recommended for pagination)

{% callout type="note" %}

While disabling sorting can improve performance, it may lead to inconsistent results during pagination.

{% /callout %}

In addition to the sorting options, you can also use the `sortDirection` parameters `asc` or `desc` to sort the results in ascending or descending order.


## Pagination Methods

### Page-Based Pagination

This is the easiest method for beginners, but has an effect on the performance of the request, therefore cursor based pagination is recommended.

#### How it works:
- Specify a page number and items per page
- Navigate through results by incrementing the page number
- Best for datasets under 500,000 items

#### Key parameters:
- `page`: The current page number (starts at 1)
- `limit`: Number of items per page (usually max 1,000)
- `sortBy`: Sorting configuration

#### Considerations:
- Simple to implement and understand
- Works fine for most common use cases
- Performance may degrade with large page numbers
- Not recommended for datasets requiring deep pagination

{% totem %}
{% totem-accordion title="Example Code" %}

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  // Step 1: Initialize Umi with DAS API Endpoint
  const umi = createUmi("Aura Endpoint URL").use(dasApi());

  const limit = 1000;
  const collection = "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w";

  
  //Step 3: Get all assets
  let page = 1;
  let allAssets: any[] = [];
  let assets;
  do {
    // Get assets from current page
    assets = await umi.rpc.getAssetsByGroup({
      groupKey: "collection",
      groupValue: collection,
      limit: limit,
      page: page,
    });

    // Add items from current page to our combined array
    allAssets = [...allAssets, ...assets.items];
    page++;
    // Stop if we've reached the end of the list
  } while (assets.items.length === limit);

  console.log("Total number of assets:", allAssets.length);
  console.log("Combined assets:", allAssets);
})();
```
{% /totem-accordion %}
{% /totem %}

### Keyset Pagination

For larger datasets or when performance is critical, keyset pagination offers better efficiency. This method comes in two variants:

#### Cursor-Based
- Uses a cursor string to track position
- Simpler to implement than range-based
- Cursor value is returned with each response and can be passed to the next request to get the next page
- Perfect for sequential data traversal

Key parameters:
- `cursor`: Position marker for the next set of results
- `limit`: Number of items per page (max 1,000)
- `sortBy`: Must be set to `id` for keyset pagination

{% totem %}
{% totem-accordion title="Example Code" %}

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {

  // Step 1: Initialize Umi with DAS API Endpoint
  const umi = createUmi("Aura Endpoint URL").use(dasApi());

  //Step 2: Set up helper variables
  const limit = 100;
  let allAssets: any[] = [];
  let cursor: string | undefined;
  
  //Step 3: Get all assets
  do {
    // Get assets from current page
    const response = await umi.rpc.searchAssets({
      grouping: ["collection", "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w"],
      limit: limit,
      page: null, // only works with page null.
      cursor: cursor,
    });

    // Add items from current page to our combined array
    allAssets = [...allAssets, ...response.items];
    
    // Update cursor for next iteration
    cursor = response.cursor;
    console.log(cursor)
    console.log("Fetched page with", response.items.length, "items");
    
  } while (cursor !== undefined);

  console.log("Total number of assets:", allAssets.length);
})();
```

{% /totem-accordion %}
{% /totem %}

#### Range-Based
- Allows querying specific ranges using `before` and `after` parameters
- More flexible than cursor-based
- Ideal for targeted data retrieval

Key parameters:
- `before`: Upper bound asset ID
- `after`: Lower bound asset ID
- `limit`: Number of items per page (max 1,000)
- `sortBy`: Must be set to `id` for keyset pagination

## Best Practices

1. **Choose the Right Method**:
   - Use page-based for simple use cases
   - Use keyset pagination for large collections 
   - Consider cursor-based for sequential traversal

2. **Error Handling**:
   - Always check for empty result sets
   - Implement retry logic for failed requests
   - Handle rate limits appropriately

3. **Performance Optimization**:
   - Keep track of the last processed item
   - Implement proper caching strategies
   - Use appropriate sorting methods

4. **Data Consistency**:
   - Always use sorting when paginating
   - Maintain consistent sort parameters between requests
   - Consider implementing checkpoints for long-running operations

## Conclusion

Choosing the right pagination strategy depends on your specific use case. For most applications, page-based pagination provides a good balance of simplicity and functionality. However, when dealing with large datasets or requiring more complex querying patterns, keyset pagination (either cursor-based or range-based) offers better performance and flexibility.


