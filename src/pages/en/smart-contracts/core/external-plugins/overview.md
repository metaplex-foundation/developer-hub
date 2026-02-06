---
title: External Plugins
metaTitle: External Plugins | Metaplex Core
description: Extend Core NFTs with external programs using Oracle and AppData plugins. Add custom validation logic and store arbitrary data on Assets.
updated: '01-31-2026'
keywords:
  - external plugins
  - Oracle plugin
  - AppData plugin
  - custom validation
about:
  - External integrations
  - Plugin adapters
  - Custom logic
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: When should I use External Plugins vs Built-in Plugins?
    a: Use External Plugins when you need custom validation logic (Oracle) or third-party data storage (AppData). Use built-in plugins for standard NFT functionality like freezing, royalties, or attributes.
  - q: Can External Plugins reject transfers?
    a: Yes. Oracle plugins can reject lifecycle events (create, transfer, update, burn) based on external account state. This enables time-based restrictions, price-based rules, or any custom logic.
  - q: Who can write to AppData?
    a: Only the Data Authority can write to an AppData plugin. This is separate from the plugin authority and provides secure, partitioned storage for third-party applications.
  - q: Can I have multiple External Plugins on one Asset?
    a: Yes. You can add multiple Oracle or AppData plugins to a single Asset, each with different configurations and authorities.
  - q: Are External Plugins indexed by DAS?
    a: Yes. AppData with JSON or MsgPack schemas is automatically indexed by DAS for easy querying.
---
**External Plugins** connect Core Assets to external programs for advanced functionality. Use Oracle plugins for custom validation logic and AppData plugins for storing arbitrary data that third-party apps can read and write. {% .lead %}
{% callout title="What You'll Learn" %}

- Understand External Plugin architecture (Adapters + Plugins)
- Configure lifecycle checks (create, transfer, update, burn)
- Set up data authorities for secure data storage
- Choose between Oracle and AppData plugins
{% /callout %}

## Summary

External Plugins extend Core Assets with external program functionality. They consist of two parts: a **Plugin Adapter** attached to the Asset/Collection, and an **External Plugin** (Oracle account or AppData storage) that provides data and validations.

- Authority Managed plugins (update authority controls)
- Support lifecycle validation: approve, reject, or listen
- Data Authority controls who can write plugin data
- Works with Assets and Collections

## Out of Scope

Built-in plugins (see [Plugins Overview](/smart-contracts/core/plugins)), creating Oracle programs (see [Oracle guide](/smart-contracts/core/guides/oracle-plugin-example)), and Token Metadata extensions.

## Quick Start

**Jump to:** [Oracle Plugin](/smart-contracts/core/external-plugins/oracle) · [AppData Plugin](/smart-contracts/core/external-plugins/app-data) · [Adding External Plugins](/smart-contracts/core/external-plugins/adding-external-plugins)

1. Choose plugin type: Oracle (validation) or AppData (data storage)
2. Create/deploy the external account (Oracle) or configure data authority (AppData)
3. Add the plugin adapter to your Asset or Collection

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
You can read more about the Oracle Plugin [here](/smart-contracts/core/external-plugins/oracle).

### AppData Plugin

The AppData Plugin provides secure, partitioned data storage on Assets. Each AppData plugin has a Data Authority that exclusively controls writes to that data section. Useful for third-party apps storing user data, game state, or application-specific metadata.
You can read more about the AppData Plugin [here](/smart-contracts/core/external-plugins/app-data).

## External Plugins vs Built-in Plugins

| Feature | External Plugins | Built-in Plugins |
|---------|------------------|------------------|
| Data storage | External account or on-asset | On-asset only |
| Custom validation | ✅ Full control | ❌ Predefined behavior |
| Dynamic updates | ✅ Update external account | ✅ Update plugin |
| Complexity | Higher (external program) | Lower (built-in) |
| Use case | Custom logic, third-party apps | Standard NFT functionality |

## FAQ

### When should I use External Plugins vs Built-in Plugins?

Use External Plugins when you need custom validation logic (Oracle) or third-party data storage (AppData). Use built-in plugins for standard NFT functionality like freezing, royalties, or attributes.

### Can External Plugins reject transfers?

Yes. Oracle plugins can reject lifecycle events (create, transfer, update, burn) based on external account state. This enables time-based restrictions, price-based rules, or any custom logic.

### Who can write to AppData?

Only the Data Authority can write to an AppData plugin. This is separate from the plugin authority and provides secure, partitioned storage for third-party applications.

### Can I have multiple External Plugins on one Asset?

Yes. You can add multiple Oracle or AppData plugins to a single Asset, each with different configurations and authorities.

### Are External Plugins indexed by DAS?

Yes. AppData with JSON or MsgPack schemas is automatically indexed by DAS for easy querying.

## Glossary

| Term | Definition |
|------|------------|
| **Plugin Adapter** | On-chain component attached to Asset that connects to external plugin |
| **External Plugin** | External account (Oracle) or data storage (AppData) providing functionality |
| **Lifecycle Check** | Validation that can approve, reject, or listen to events |
| **Data Authority** | Address with exclusive write permission to AppData |
| **Oracle Account** | External account storing validation results |

## Related Pages

- [Oracle Plugin](/smart-contracts/core/external-plugins/oracle) - Custom validation logic
- [AppData Plugin](/smart-contracts/core/external-plugins/app-data) - Third-party data storage
- [Adding External Plugins](/smart-contracts/core/external-plugins/adding-external-plugins) - Code examples
- [Built-in Plugins](/smart-contracts/core/plugins) - Standard plugin functionality
