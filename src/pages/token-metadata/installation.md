---
title: Installation
description: Quidem magni aut exercitationem maxime rerum eos.
---

Quasi sapiente voluptates aut minima non doloribus similique quisquam. In quo expedita ipsum nostrum corrupti incidunt. Et aut eligendi ea perferendis.

---

## Totems

Here's an example of a "Totem" markdoc tag that can be used to combine code, text and accordions.

{% totem %}
This is a simple paragraph inside the totem.

{% totem-prose %}
This is a prose section inside the totem.

It is made of [multiple](#) paragraphs and a `code` block.

```js
export const foo = 3;
```
{% /totem-prose %}

```js
/** This is a simple code block inside the totem. */
export default {
  lorem: 'ipsum',
  dolor: ['sit', 'amet', 'consectetur'],
  adipiscing: {
    elit: true,
  },
}
```

{% totem-accordion title="Here's an example" %}
This is an accordion section inside the totem.

```js
export const foo = 3;
```
{% /totem-accordion %}

{% totem-accordion title="Here's another example" %}
There can be many of them.

```js
export const foo = 42;
```
{% /totem-accordion %}

{% /totem %}

### Regular code block

Here's a regular code block to compare it with.

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

## Dialect switcher

Dialect switcher enables multiple languages/framework within the same documentation page. It can be used with regular code blocks or with totems to include even more information within a given dialect.

### With regular code block

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur quaerat exercitationem. Consequatur et cum atque mollitia qui quia necessitatibus.

{% dialect-switcher title="Some optional title here that can flex wrap" %}

{% dialect title="JavaScript" id="js" %}
```js
export const foo = 3;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
struct Foo {}
let foo = 3;
```
{% /dialect %}

{% dialect title="PHP" id="php" %}
```php
$foo = 3;
```
{% /dialect %}

{% dialect title="Python" id="python" %}
```python
foo = 3
```
{% /dialect %}

{% /dialect-switcher %}

Possimus saepe veritatis sint nobis et quam eos. Architecto consequatur odit perferendis fuga eveniet possimus rerum cumque. Ea deleniti voluptatum deserunt voluptatibus ut non iste. Provident nam asperiores vel laboriosam omnis ducimus enim nesciunt quaerat. Minus tempora cupiditate est quod.

### With totems

Sit commodi iste iure molestias qui amet voluptatem sed quaerat. Nostrum aut pariatur. Sint ipsa praesentium dolor error cumque velit tenetur quaerat exercitationem. Consequatur et cum atque mollitia qui quia necessitatibus.

{% dialect-switcher %}

{% dialect title="JavaScript" id="js" %}

{% totem %}
This is a simple paragraph inside the totem.

{% totem-prose %}
This is a prose section inside the totem.

It is made of [multiple](#) paragraphs and a `code` block.

```js
export const foo = 3;
```
{% /totem-prose %}

```js
/** This is a simple code block inside the totem. */
export default {
  lorem: 'ipsum',
  dolor: ['sit', 'amet', 'consectetur'],
  adipiscing: {
    elit: true,
  },
}
```

{% totem-accordion title="Here's an example" %}
This is an accordion section inside the totem.

```js
export const foo = 3;
```
{% /totem-accordion %}

{% totem-accordion title="Here's another example" %}
There can be many of them.

```js
export const foo = 42;
```
{% /totem-accordion %}

{% /totem %}
{% /dialect %}

{% dialect title="Rust" id="rust" %}
We can add some text too.

```rust
struct Foo {}
let foo = 3;
```
{% /dialect %}

{% dialect title="PHP" id="php" %}
```php
$foo = 3;
```
{% /dialect %}

{% dialect title="Python" id="python" %}
```python
foo = 3
```
{% /dialect %}

{% /dialect-switcher %}

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
