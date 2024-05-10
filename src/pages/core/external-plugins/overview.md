---
title: External Plugins
metaTitle: Core - External Plugins
description: Learn about the MPL Core External Plugins
---

## What are External Plugins?

External Plugins are [Authority Managed](/core/plugins#authority-managed-plugins) consisting of 2 parts, the `adapter`, and the `plugin`.

### The External Plugin Adapter

A `Plugin Adapter` is assigned to the Assets/Collection as a `plugin` and allows data and validations to to be passed from an External Plugin.

### The External Plugin

The External Plugin ties everything together and provides data and validations for the `Plugin Adapter`.

## Lifecycle Checks

Each External Plugin comes with the ability to assign lifecycle checks to Lifecycle Events influencing the behavior of the lifecycle event that is trying to take place. The lifecycle checks available are:

- Create
- Transfer
- Update
- Burn

Each of the life cycle events can be assigned with the following checks:

- Can Listen
- Can Deny
- Can Approve

### Can Listen

A web3 type webhook that alerts the plugin that a lifecycle event has taken place.

This is useful for tracking data or performing another task based on an event that's taken place.

### Can Deny

The plugin has the ability to deny a lifecycle events action.

### Can Approve

The plugin has the ability to approve a lifecycle event.

## Data Authority

An External Plugin may have a data area in which projects can store data to that particular plugin.

The Data Authority of an External Plugin is the only authority allowed to write to the External Plugins data section. The update authority of the plugin does not have permission unless they are also the Data Authority.

## Plugins

### Oracle Plugin

The Oracle Plugin is designed for simplicity in a web 2.5 - 3.0 workflow. The Oracle Plugin can access an onchain Solana Oracle Accounts external from the MPL Core Asset that can reject the use of lifecycle events set by the authority on the Asset at that given time. The external Oracle Account can also be updated at any time to change the authorization behavior of the life cycle events making for a dynamic experience.

You can read more about the Oracle Plugin [here](/core//external-plugins/oracle).
