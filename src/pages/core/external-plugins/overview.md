---
title: External Plugins
metaTitle: Core - External Plugins
description: Learn about the MPL Core External Plugins
---
```
///
///
/// Needs a quick rewrite, I believe some of this info is wrong.
///
///
```

## What are External Plugins?

`External Plugins` are plugins that have external influences on their own behaviour such as influencing life cycle events and allowing 3rd parties to store inside them.


## Lifecycle Checks

Each External Plugin comes with the ability to assign lifecycle checks to Lifecycle Events influencing the behaviour of the lifecycle event that is trying to take place. The life cycle checks available are:

- Create
- Transfer
- Update
- Burn


Each of the life cycle events can be assigned with the following checks:
- Can Listen
- Can Deny
- Can Approve

### Can Listen

A web3 type webhook that alerts the account that a lifecycle event has happened.


### Can Deny
The plugin has the ability to deny a lifecycle events action.

### Can Approve
The plugin has the ability to approve a lifecycle event.

## Data Authority

An External Plugin may have a data area in which projects can store data to that particular plugin.

The Data Authority of an External Plugin is the only authority allowed to write to the External Plugins data section. The update authority of the plugin does not have permission unless they are also the Data Authority.

## Plugins

### Oracle Plugin

The Oracle Plugin is designed for simplictiy in a web 2.5 - 3.0 workflow. The Oracle Plugin can access an onchain Solana Oracle Account external from the MPL Core program that can reject the use of lifecycle events set by the user on the Asset at that given time. The external Oracle Account can also be updated at any time to change the authorisation behaviour of the life cycle events making for a dynamic experiance.

You can read more about the Oracle Plugin [here](/core//external-plugins/oracle).


