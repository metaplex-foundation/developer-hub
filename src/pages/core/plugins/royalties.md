---
title: Royalties Plugin
metaTitle: Core - Enforcing Royalties
description: Learn how to enforce royalties on Core
---

The Royalties Plugin is a `Authority Managed` plugin that allows the authority of the Asset to set and change the Royalies Plugin data.

This plugin can be used on both the `MPL Core Asset` and the `MPL Core Collection`.

When assigned to both MPL Core Asset and the MPL Core Collection the MPL Core Asset Royalties Plugin will take precedence over the MPL Core Collection Plugin known as a plugin overide.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The Royalties Plugin requires the following arguments.

| Arg         | Value              |
| ----------- | ------------------ |
| basisPoints | number             |
| creators    | Array<CreatorArgs> |
| ruleset     | RuleSet            |

## basisPoints

This is the percentage in basispoints you wish to receieve in royalties on secondary sales. If your Royalties Plugin is set to 5000 this means 5%. So if you sell a MPL Core Asset for 1 SOL your creators will recieve a total of 0.05 SOL to be distributed between them. Some of our SDKs provide helper methods like `percentAmount` in umi, so that you do not have to do the calculation yourself.

## Creators

The creators list is a distribution list of where the earned royalties are sent. You can have up to 5 creators in your list that earn from royalties and the total share between all members must add up to 100%.

{% dialect-switcher title="Creators Array" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'

const creators = [
    { address: publicKey("11111111111111111111111111111111"), percentage: 80 }
    { address: publicKey("22222222222222222222222222222222"), percentage: 20 }
]
```

{% /dialect %}
{% /dialect-switcher %}

## RuleSets

RuleSets allow you to control what programs can or can not perform actions on your MPL Core Assets.

### Allowlist

An Allowlist is a list of programs that are allowed to interact with your MPL Core Asset/Collection. Any program not on this list will throw an error.

{% dialect-switcher title="RuleSet Allowlist" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const ruleSet = ruleSet('ProgramAllowList', [
    [
		publicKey("11111111111111111111111111111111")
		publicKey("22222222222222222222222222222222")
    ]
])
```

{% /dialect %}
{% /dialect-switcher %}

### DenyList

A Denylist is a list of programs that are not allowed to interact with your MPL Core Asset/Collection. Any program on this list will throw an error.

{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const ruleSet = ruleSet('ProgramDenyList', [
    [
		publicKey("11111111111111111111111111111111")
		publicKey("22222222222222222222222222222222")
    ]
])
```

{% /dialect %}
{% /dialect-switcher %}

### None

If you do not wish to set any ruleset rules then you can just pass the `__kind` as none.

{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { ruleSet } from '@metaplex-foundation/mpl-core'

const ruleSet = ruleSet('None')
```

{% /dialect %}
{% /dialect-switcher %}

## Adding the Royalties Plugin to an Asset code example

{% dialect-switcher title="Adding a Royalties Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPluginV1,
  createPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('2222222222222222222222222222222')

await addPluginV1(umi, {
  asset: asset.publicKey,
  plugin: createPlugin({
    type: 'Royalties',
    data: {
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 80 },
        { address: creator2, percentage: 20 },
      ],
      ruleSet: ruleSet('ProgramDenyList', [
        [
          publicKey('44444444444444444444444444444444'),
          publicKey('55555555555555555555555555555555'),
        ],
      ]),
    },
  }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding the Royalties Plugin to a Collection code example

{% dialect-switcher title="Add Royalties Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPluginV1,
  createPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('2222222222222222222222222222222')

await addCollectionPluginV1(umi, {
  collection: collection.publicKey,
  plugin: createPlugin({
    type: 'Royalties',
    data: {
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 80 },
        { address: creator2, percentage: 20 },
      ],
      ruleSet: ruleSet('ProgramDenyList', [
        [
          publicKey('44444444444444444444444444444444'),
          publicKey('55555555555555555555555555555555'),
        ],
      ]),
    },
  }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
