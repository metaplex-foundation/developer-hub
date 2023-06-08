---
title: Predicting user behavior
description: Quidem magni aut exercitationem maxime rerum eos.
---

Quasi sapiente voluptates aut minima non doloribus similique quisquam. In quo expedita ipsum nostrum corrupti incidunt. Et aut eligendi ea perferendis.

---

## Quis vel iste dicta

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur.

{% diagram %}
{% node %}
  {% node #wallet theme="slate" label="Wallet Account" /%}
  {% node theme="dimmed" %}
    Owner: System Program {% .italic %}
  {% /node %}
{% /node %}

{% node parent="wallet" x="200" %}
  {% node #token theme="blue" label="(Associated) Token Account" /%}
  {% node theme="dimmed" %}
    Owner: (Associated) Token Program {% .italic %}
  {% /node %}
  {% node #token-mint label="Mint" /%}
  {% node #token-owner label="Owner" /%}
  {% node label="Amount" /%}
  {% node label="Delegate" /%}
  {% node label="State" /%}
  {% node label="Is Native" /%}
  {% node label="Delegated Amount" /%}
  {% node label="Close Authority" /%}
{% /node %}

{% node #token-pda-group parent="token" y="-100" %}
  {% node #token-pda theme="crimson" label="PDA" /%}
  {% node label="Owner + Program ID + Mint" /%}
{% /node %}

{% node parent="token" x="300" %}
  {% node #mint theme="blue" label="Mint Account" /%}
  {% node theme="dimmed" %}
    Owner: System Program {% .italic %}
  {% /node %}
  {% node label="Mint Authority" /%}
  {% node label="Supply" /%}
  {% node label="Decimals" /%}
  {% node label="Is Initialized" /%}
  {% node label="Freeze Authority" /%} 
{% /node %}

{% node parent="mint" x="200" %}
  {% node #metadata theme="indigo" label="Metadata Account" /%}
  {% node theme="dimmed" %}
    Owner: Token Metadata Program {% .italic %}
  {% /node %}
  {% node label="Key = MetadataV1" /%}
  {% node label="Update Authority" /%}
  {% node label="Mint" /%}
  {% node label="Name" /%}
  {% node label="Symbol" /%}
  {% node #metadata-uri label="URI" theme="pink" z="1" /%}
  {% node label="Seller Fee Basis Points" /%}
  {% node label="Creators" /%}
  {% node label="Primary Sale Happened" /%}
  {% node label="Is Mutable" /%}
  {% node label="Edition Nonce" /%}
  {% node label="Token Standard" /%}
  {% node label="Collection" /%}
  {% node label="Uses" /%}
  {% node label="Collection Details" /%}
  {% node label="Programmable Config" /%}
  {% node %}
    [API References](/token-metadata/references)
  {% /node %}
{% /node %}

{% node #metadata-pda-group parent="metadata" y="-100" %}
  {% node #metadata-pda theme="crimson" label="PDA" /%}
  {% node label="\"metadata\" + Program ID + Mint" /%}
{% /node %}

{% node parent="metadata-uri" x="250" y="-9" %}
  {% node #offchain-metadata theme="pink" label="Off-Chain Metadata" /%}
  {% node label="Name" /%}
  {% node label="Description" /%}
  {% node label="Image" /%}
  {% node label="Animation URL" /%}
  {% node label="Attributes" /%}
  {% node label="..." /%}
{% /node %}

{% edge from="wallet" to="token-pda" fromPosition="top" /%}
{% edge from="wallet" to="token-owner" dashed="true" arrow="none" /%}
{% edge from="token-pda-group" to="token" /%}
{% edge from="mint" to="token-pda" /%}
{% edge from="mint" to="token-mint" dashed="true" arrow="none" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="metadata-pda-group" to="metadata" path="straight" /%}
{% edge from="metadata-uri" to="offchain-metadata" animated="true" theme="pink" /%}
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
