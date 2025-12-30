---
title: External Plugins
metaTitle: External Plugins | Core
description: Learn about the MPL Core External Plugins and their functionality.
---

## What are External Plugins?

External Plugins are [Authority Managed](/smart-contracts/core/plugins#authority-managed-plugins), consisting of 2 parts, the **Adapter**, and the **Plugin**. A **Plugin Adapter** is assigned to the Assets/Collection and allows data and validations to to be passed from an External Plugin. The External Plugin provides data and validations for the **Plugin Adapter**.

## Lifecycle Checks

Each External Plugin comes with the ability to assign lifecycle checks to Lifecycle Events influencing the behavior of the lifecycle event that is trying to take place. The lifecycle checks available are:

- Create
- Transfer
- Update
- Burn

Each of the lifecycle events can be assigned with the following checks:

- Can Listen
- Can Reject
- Can Approve

### Can Listen

A web3 type webhook that alerts the plugin that a lifecycle event has taken place. This is useful for tracking data or performing another task based on an event that's taken place.

### Can Reject

The plugin has the ability to reject a lifecycle events action.

### Can Approve

The plugin has the ability to approve a lifecycle event.

## Data Authority

An External Plugin may have a data area in which projects can securely store data to that particular plugin.

The Data Authority of an External Plugin is the only authority allowed to write to the External Plugin's data section. The Update Authority of the plugin does not have permission unless they are also the Data Authority.

## Plugins

### Oracle Plugin

The Oracle Plugin is designed for simplicity in a web 2.0-3.0 workflow. The Oracle Plugin can access onchain Oracle accounts external from the MPL Core Asset that can reject the use of lifecycle events set by the authority. The external Oracle Account can also be updated at any time to change the authorization behavior of the lifecycle events, making for a dynamic experience.

You can read more about the Oracle Plugin [here](/smart-contracts/core//external-plugins/oracle).
