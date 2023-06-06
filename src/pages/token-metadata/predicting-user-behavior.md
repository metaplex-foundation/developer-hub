---
title: Predicting user behavior
description: Quidem magni aut exercitationem maxime rerum eos.
---

Quasi sapiente voluptates aut minima non doloribus similique quisquam. In quo expedita ipsum nostrum corrupti incidunt. Et aut eligendi ea perferendis.

---

## Quis vel iste dicta

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur.

{% diagram %}
  {% node #wallet theme="slate" label="Wallet Account" %}
  {% node-section %}
    Owner: System Program {% .italic %}
  {% /node-section %}
  {% /node %}

  {% node #token parent="wallet" x="200" theme="blue" label="(Associated) Token Account" %}
  {% node-section %}
    Owner: (Associated) Token Program {% .italic %}
  {% /node-section %}
  {% node-section label="Mint" /%}
  {% node-section label="Owner" /%}
  {% node-section label="Amount" /%}
  {% node-section label="Delegate" /%}
  {% node-section label="State" /%}
  {% node-section label="Is Native" /%}
  {% node-section label="Delegated Amount" /%}
  {% node-section label="Close Authority" /%}
  {% /node %}

  {% node #token-pda parent="token" y="-100" theme="crimson" label="PDA" %}
  {% node-section label="Owner + Program ID + Mint" /%}
  {% /node %}

  {% node #mint parent="token" x="300" theme="blue" label="Mint Account" %}
  {% node-section %}
    Owner: System Program {% .italic %}
  {% /node-section %}
  {% node-section label="Mint Authority" /%}
  {% node-section label="Supply" /%}
  {% node-section label="Decimals" /%}
  {% node-section label="Is Initialized" /%}
  {% node-section label="Freeze Authority" /%}
  {% /node %}

  {% node #metadata parent="mint" x="200" theme="indigo" label="Metadata Account" %}
  {% node-section %}
    Owner: Token Metadata Program {% .italic %}
  {% /node-section %}
  {% node-section label="Key = MetadataV1" /%}
  {% node-section label="Update Authority" /%}
  {% node-section label="Mint" /%}
  {% node-section label="Name" /%}
  {% node-section label="Symbol" /%}
  {% node-section label="URI" /%}
  {% node-section label="Seller Fee Basis Points" /%}
  {% node-section label="Creators" /%}
  {% node-section label="Primary Sale Happened" /%}
  {% node-section label="Is Mutable" /%}
  {% node-section label="Edition Nonce" /%}
  {% node-section label="Token Standard" /%}
  {% node-section label="Collection" /%}
  {% node-section label="Uses" /%}
  {% node-section label="Collection Details" /%}
  {% node-section label="Programmable Config" /%}
  {% node-section %}
    [API References](/token-metadata/references)
  {% /node-section %}
  {% /node %}

  {% node #metadata-pda parent="metadata" y="-100" theme="crimson" label="PDA" %}
  {% node-section label="\"metadata\" + Program ID + Mint" /%}
  {% /node %}

  {% node #offchain-metadata parent="metadata" x="250" theme="indigo" label="Off-Chain Metadata" %}
  {% node-section %}
    Owner: (Associated) Token Program {% .italic %}
  {% /node-section %}
  {% node-section label="Name" /%}
  {% node-section label="Description" /%}
  {% node-section label="Image" /%}
  {% node-section label="Animation URL" /%}
  {% node-section label="Attributes" /%}
  {% node-section label="..." /%}
  {% /node %}

  {% edge from="wallet" to="token-pda" /%}
  {% edge from="token-pda" to="token" /%}
  {% edge from="mint" to="token-pda" /%}
  {% edge from="mint" to="metadata-pda" /%}
  {% edge from="metadata-pda" to="metadata" /%}
  {% edge from="metadata" to="offchain-metadata" animated="true" theme="indigo" /%}
{% /diagram %}

### Et pariatur ab quas

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur quaerat exercitationem. Consequatur et cum atque mollitia qui quia necessitatibus.

```js
/** @type {import('@tailwindlabs/lorem').ipsum} */
export default {
  lorem: 'ipsum',
  dolor: ['sit', 'amet', 'consectetur'],
  adipiscing: {
    elit: true,
  },
}
```

Possimus saepe veritatis sint nobis et quam eos. Architecto consequatur odit perferendis fuga eveniet possimus rerum cumque. Ea deleniti voluptatum deserunt voluptatibus ut non iste. Provident nam asperiores vel laboriosam omnis ducimus enim nesciunt quaerat. Minus tempora cupiditate est quod.

### Natus aspernatur iste

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur quaerat exercitationem. Consequatur et cum atque mollitia qui quia necessitatibus.

Voluptas beatae omnis omnis voluptas. Cum architecto ab sit ad eaque quas quia distinctio. Molestiae aperiam qui quis deleniti soluta quia qui. Dolores nostrum blanditiis libero optio id. Mollitia ad et asperiores quas saepe alias.


{% diagram %}
  {% node #wallet theme="slate" label="Wallet Account" %}
  {% node-section %}
    Owner: System Program {% .italic %}
  {% /node-section %}
  {% /node %}

  {% node #token parent="wallet" x="200" theme="blue" label="(Associated) Token Account" %}
  {% node-section %}
    Owner: (Associated) Token Program {% .italic %}
  {% /node-section %}
  {% node-section label="Mint" /%}
  {% node-section label="Owner" /%}
  {% node-section label="Amount" /%}
  {% node-section label="Delegate" /%}
  {% node-section label="State" /%}
  {% node-section label="Is Native" /%}
  {% node-section label="Delegated Amount" /%}
  {% node-section label="Close Authority" /%}
  {% /node %}

  {% node #token-pda parent="token" y="-100" theme="crimson" label="PDA" %}
  {% node-section label="Owner + Program ID + Mint" /%}
  {% /node %}

  {% node #mint parent="token" x="300" theme="blue" label="Mint Account" %}
  {% node-section %}
    Owner: System Program {% .italic %}
  {% /node-section %}
  {% node-section label="Mint Authority" /%}
  {% node-section label="Supply" /%}
  {% node-section label="Decimals" /%}
  {% node-section label="Is Initialized" /%}
  {% node-section label="Freeze Authority" /%}
  {% /node %}

  {% node #metadata parent="mint" x="200" theme="indigo" label="Metadata Account" %}
  {% node-section %}
    Owner: Token Metadata Program {% .italic %}
  {% /node-section %}
  {% node-section label="Key = MetadataV1" /%}
  {% node-section label="Update Authority" /%}
  {% node-section label="Mint" /%}
  {% node-section label="Name" /%}
  {% node-section label="Symbol" /%}
  {% node-section label="URI" /%}
  {% node-section label="Seller Fee Basis Points" /%}
  {% node-section label="Creators" /%}
  {% node-section label="Primary Sale Happened" /%}
  {% node-section label="Is Mutable" /%}
  {% node-section label="Edition Nonce" /%}
  {% node-section label="Token Standard" /%}
  {% node-section label="Collection" /%}
  {% node-section label="Uses" /%}
  {% node-section label="Collection Details" /%}
  {% node-section label="Programmable Config" /%}
  {% node-section %}
    [API References](/token-metadata/references)
  {% /node-section %}
  {% /node %}

  {% node #metadata-pda parent="metadata" y="-100" theme="crimson" label="PDA" %}
  {% node-section label="\"metadata\" + Program ID + Mint" /%}
  {% /node %}

  {% node #offchain-metadata parent="metadata" x="250" theme="indigo" label="Off-Chain Metadata" %}
  {% node-section %}
    Owner: (Associated) Token Program {% .italic %}
  {% /node-section %}
  {% node-section label="Name" /%}
  {% node-section label="Description" /%}
  {% node-section label="Image" /%}
  {% node-section label="Animation URL" /%}
  {% node-section label="Attributes" /%}
  {% node-section label="..." /%}
  {% /node %}

  {% edge from="wallet" to="token-pda" /%}
  {% edge from="token-pda" to="token" /%}
  {% edge from="mint" to="token-pda" /%}
  {% edge from="mint" to="metadata-pda" /%}
  {% edge from="metadata-pda" to="metadata" /%}
  {% edge from="metadata" to="offchain-metadata" animated="true" theme="indigo" /%}
{% /diagram %}

---

## Quos porro ut molestiae

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur.

### Voluptatem quas possimus

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur quaerat exercitationem. Consequatur et cum atque mollitia qui quia necessitatibus.

Possimus saepe veritatis sint nobis et quam eos. Architecto consequatur odit perferendis fuga eveniet possimus rerum cumque. Ea deleniti voluptatum deserunt voluptatibus ut non iste. Provident nam asperiores vel laboriosam omnis ducimus enim nesciunt quaerat. Minus tempora cupiditate est quod.

### Id vitae minima

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur quaerat exercitationem. Consequatur et cum atque mollitia qui quia necessitatibus.

Voluptas beatae omnis omnis voluptas. Cum architecto ab sit ad eaque quas quia distinctio. Molestiae aperiam qui quis deleniti soluta quia qui. Dolores nostrum blanditiis libero optio id. Mollitia ad et asperiores quas saepe alias.

---

## Vitae laborum maiores

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur.

### Corporis exercitationem

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur quaerat exercitationem. Consequatur et cum atque mollitia qui quia necessitatibus.

Possimus saepe veritatis sint nobis et quam eos. Architecto consequatur odit perferendis fuga eveniet possimus rerum cumque. Ea deleniti voluptatum deserunt voluptatibus ut non iste. Provident nam asperiores vel laboriosam omnis ducimus enim nesciunt quaerat. Minus tempora cupiditate est quod.

### Reprehenderit magni

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur quaerat exercitationem. Consequatur et cum atque mollitia qui quia necessitatibus.

Voluptas beatae omnis omnis voluptas. Cum architecto ab sit ad eaque quas quia distinctio. Molestiae aperiam qui quis deleniti soluta quia qui. Dolores nostrum blanditiis libero optio id. Mollitia ad et asperiores quas saepe alias.
