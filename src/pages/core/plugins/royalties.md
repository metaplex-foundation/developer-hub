---
title: Royalties Plugin
metaTitle: Core - Enforcing Royalties
description: Learn how to enforce royalties on Core
---

## Overview

The Royalties Plugin is a `Authority Managed` plugin that allows the authority of the Asset to set and change the Royalies Plugin data.

This plugin can be used on both the `MPL Core Asset` and the `MPL Core Collection`.

When assigned to both MPL Core Asset and the MPL Core Collection the MPL Core Asset Royalties Plugin will take precedence over the MPL Core Collection Plugin known as a plugin overide.

## Arguments

| Arg        | Value              |
| ---------- | ------------------ |
| percentage | number             |
| creators   | Array<CreatorArgs> |
| ruleset    | RuleSet            |

## Percentage

This is the x% you wish to receieve in royalties on secondary sales. If your Royalties Plug is set to 5% and you sell a MPL Core Asset for 1 SOL your creators will recieve a total of 0.05 SOL to be distributed between them.

## Creators

The creators list is a distribution list of where the earned royalties are sent. You can have up to 5 creators in your list that earn from royalties and the total share between all memembers must add up to 100%.

{% dialect-switcher title="Creators Array" %}
{% dialect title="JavaScript" id="js" %}

```ts
const creators = [
    { address: PublicKey; percentage: number }
    { address: PublicKey; percentage: number }
]
```

{% /dialect %}
{% /dialect-switcher %}

## RuleSets

RuleSets allow you to control what programs can or can not perform actions on your MPL Core Assets.

### Allowlist

An Allowlist is a list of programs that are allow to interaction with your MPL Core Asset/Collection. Any program not on this list will throw an error.

{% dialect-switcher title="RuleSet Allowlist" %}
{% dialect title="JavaScript" id="js" %}

```ts
const ruleSet = {
	__kind: 'ProgramAllowList',
	fields: [
		publicKey("11111111111111111111111111111111")
		publicKey("22222222222222222222222222222222")
	]
}
```

{% /dialect %}
{% /dialect-switcher %}

### DenyList

A Denylist is a list of programs that are not allowed to interact with your MPL Core Asset/Collection. Any program on this list will throw an error.

{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}

```ts
const ruleSet = {
	__kind: 'ProgramDenyList',
	fields: [
		publicKey("11111111111111111111111111111111")
		publicKey("22222222222222222222222222222222")
	]
}
```

{% /dialect %}
{% /dialect-switcher %}

### None

If you do not wish to set any ruleset rules then you can just pass the `__kind` as none.

{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}

```ts
const ruleSet = { __kind: 'None'}
```

{% /dialect %}
{% /dialect-switcher %}

## Adding the Royalties Plugin to an Asset

{% dialect-switcher title="Adding a Royalties Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin, plugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: plugin('Royalties', [
    {
        precentage: 5,
        creators: [
            { address: PublicKey; percentage: number }
            { address: PublicKey; percentage: number }
        ],
      	ruleset: {
			__kind: 'ProgramDenyList',
			fields: [
				publicKey("11111111111111111111111111111111")
				publicKey("22222222222222222222222222222222")
			]
		},
    },
  ]),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
