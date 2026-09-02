---
title: Updates
metaTitle: Update an MPL-Distro Distribution
description: Update MPL-Distro configuration, change the authority, and change the permissioned distributor without recreating the distribution PDA.
keywords:
  - update MPL-Distro
  - change distribution authority
  - change Merkle root
  - permissioned distributor
about:
  - MPL-Distro
  - Distribution Updates
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
faqs:
  - q: Can the authority change the Merkle root during the active window?
    a: No. The root, tree height, start time, and claimant count are locked throughout the active window but can be changed before it starts or after it ends.
  - q: Can the claim end time be extended during an active distribution?
    a: Yes. The authority may update endTime while the distribution is active.
  - q: Does the new authority need to sign an authority change?
    a: No. Only the current authority signs updateDistribution. Verify the destination key before submitting.
---

The current [MPL-Distro](/smart-contracts/mpl-distro) authority can change selected distribution fields without creating a new PDA or invalidating existing claim receipts. {% .lead %}

## Summary

`updateDistribution` applies authority-approved configuration changes to an existing distribution.

- Change the full allocation configuration only outside the active claim window.
- Change operational fields such as authority and permissioned distributor during claims.
- Treat an authority change as immediate and security-sensitive.
- Publish replacement Merkle proofs atomically with any root update.

## Quick Start

Updating an MPL-Distro distribution is a signed configuration change on the existing account.

1. Confirm whether the cluster time is inside the inclusive `startTime`–`endTime` window.
2. Pass only the fields that should change to `updateDistribution`.
3. If the Merkle root changes, replace every off-chain proof at the same time.
4. Verify the stored authority and permissioned distributor after confirmation.

## MPL-Distro Update Permissions

The current authority must sign every distribution update.

| Field | Before start | During active window | After end |
|---|---:|---:|---:|
| `merkleRoot` | Yes | No | Yes |
| `treeHeight` | Yes | No | Yes |
| `startTime` | Yes | No | Yes |
| `endTime` | Yes | Yes | Yes |
| `totalClaimants` | Yes | No | Yes |
| `newAuthority` | Yes | Yes | Yes |
| `name` | Yes | Yes | Yes |
| `newPermissionedDistributor` | Yes | Yes | Yes |

The active window includes both boundary timestamps. The protected allocation fields are locked when `startTime <= clusterTime <= endTime`.

{% callout title="Root Updates Require Matching Proofs" type="warning" %}
Changing the Merkle root invalidates every proof generated for the previous root. Publish and preserve the replacement allocation file atomically with the on-chain update.
{% /callout %}

## Update MPL-Distro Configuration

Pass only the fields that should change to `updateDistribution`.

{% code-tabs-imported from="mpl-distro/update_distribution" frameworks="umi" filename="updateDistribution" /%}

When `totalClaimants` changes without an explicit `treeHeight`, the program infers a minimum height. Passing the `treeHeight` returned by the newly prepared tree is clearer and avoids coupling the update to claimant-count inference.

## Change the Distribution Authority

`updateDistribution` replaces the signer that can update, deposit, withdraw tokens, and withdraw subsidy.

{% code-tabs-imported from="mpl-distro/change_distribution_authority" frameworks="umi" filename="changeDistributionAuthority" /%}

The new authority does not need to sign the update. Verify the destination public key and make sure its signing infrastructure is operational before submitting the change.

## Change the Permissioned Distributor

`updateDistribution` changes the signer accepted for distributions configured with `AllowedDistributor.Permissioned`. Pass `newPermissionedDistributor` on `updateDistribution`.

The change does not alter the Merkle tree or existing receipts. In-flight transactions signed by the previous distributor fail after the update lands.

## Update Errors

Update errors protect authority and timing constraints.

| Error | Meaning | Resolution |
|---|---|---|
| `DistributionStarted` | A protected allocation field was changed during the active window | Wait until the distribution ends or leave the field unchanged |
| `InvalidDistributionAuthority` | The supplied signer is not the stored authority | Use the current authority |
| `InvalidTreeHeight` | Tree height exceeds the maximum | Use a value at or below 64 |
| `NameTooLong` | UTF-8 name exceeds 32 bytes | Shorten the distribution name |

## Notes

Configuration changes affect proof validity and operational authority immediately after confirmation.

- Changing `endTime` during an active window can extend or shorten the claim period.
- A post-window root update does not remove existing claim receipts.
- Existing receipts remain keyed to the distribution PDA after an update.

## FAQ

### Can the authority change the Merkle root during the active window?

No. The root, tree height, start time, and claimant count are locked throughout the active window but can be changed before it starts or after it ends.

### Can the claim end time be extended during an active distribution?

Yes. The authority may update `endTime` while the distribution is active.

### Does the new authority need to sign an authority change?

No. Only the current authority signs `updateDistribution`. Verify the destination key before submitting.
