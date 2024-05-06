---
title: External Plugins
metaTitle: Core - External Plugins
description: Learn about the MPL Core External Plugins
---

## What are External Plugins?

`External Plugins` are plugins that have external influences on their behaviour.

External Plugins

There are 3 different External Plugins you can apply to your Asset each with their own degree of intergration level and composability.

## Lifecycle Checks

When setting up an External Plugin you can associate Lifecycle Checks to Lifecycle Events. The checks include:

- Can Listen
- Can Deny
- Can Approve

### Can Listen

A web3 type webhook that alerts the account that a lifecycle event has happened.


### Can Deny
The plugin has the ability to approve a lifecycle event and deny its action.

### Can Approve
The plugin has the ability to approve a lifecycle event.

## Data Authority

The Data Authority of an External Plugin is the only authority allowed to write to the External Plugins data section. The update authority of the plugin does not have permission unless they are also the Data Authority.

## Plugins

### Oracle Plugin

The Oracle Plugin is designed for simplictiy in a web 2.5 workflow. The Oracle plugin can access an onchain Solana account external from the MPL Core program that can authorise or deny the use of lifecycle events on the Asset at that given time. The external Oracle Account can also be updated at any time to change the authorisation behaviour.

You can read more about the Oracle Plugin [here](/external-plugins/oracle).


### Data Store Plugin

The Data Store Plugin is a plugin that can store arbitory data that can be writen and updated only via the 'Data Authority'.

The plugin supports both Binary and JSON data and will soon include MsgPack via a future update.

The data in the Data Store plugin will be indexable and readable via DAS enabled RPCs.

You can read more about the Data Store Plugin [here](/external-plugins/data-store)


### Lifecycle Hook

The Lifecycle Hook plugin is most synonymous with transfer hooks but will also work with the other lifecycle methods of an Asset.

// Need to add more here after a little research.