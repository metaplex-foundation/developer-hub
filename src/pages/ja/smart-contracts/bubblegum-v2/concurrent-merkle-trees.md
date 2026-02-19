---
title: 同時マークルツリー
metaTitle: 同時マークルツリー | Bubblegum V2
description: 同時マークルツリーとBubblegumでの使用方法について詳しく学びます。
---

## はじめに

マークルツリーは、各リーフノードが何らかのデータを表すハッシュでラベル付けされたツリーデータ構造です。隣接するリーフは一緒にハッシュ化され、結果として得られるハッシュがそれらのリーフの親であるノードのラベルになります。同じレベルのノードは再び一緒にハッシュ化され、結果として得られるハッシュがそれらのノードの親であるノードのラベルになります。このプロセスは、ルートノードに対して単一のハッシュが作成されるまで続きます。この単一のハッシュは、ツリー全体のデータ整合性を暗号学的に表し、マークルルートと呼ばれます。

ほとんどのマークルツリーは二進ツリーですが、そうである必要はありません。Bubblegum圧縮NFT（cNFT）に使用されるマークルツリーは、私たちの図に示されているように二進ツリーです。

{% diagram %}

{% node %}
{% node #root label="マークルルート" /%}
{% node label="Hash(ノード 1, ノード 2)" /%}
{% /node %}

{% node parent="root" y=100 x=-220 %}
{% node #i-node-1 label="ノード 1" /%}
{% node label="Hash(ノード 3, ノード 4)" /%}
{% /node %}

{% node parent="root" y=100 x=220 %}
{% node #i-node-2 label="ノード 2" /%}
{% node label="Hash(ノード 5, ノード 6)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=-110 %}
{% node #i-node-3 label="ノード 3" /%}
{% node label="Hash(リーフ 1, リーフ 2)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=110 %}
{% node #i-node-4 label="ノード 4" /%}
{% node label="Hash(リーフ 3, リーフ 4)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=-110 %}
{% node #i-node-5 label="ノード 5" /%}
{% node label="Hash(リーフ 5, リーフ 6)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=110 %}
{% node #i-node-6 label="ノード 6" /%}
{% node label="Hash(リーフ 7, リーフ 8)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="-40" %}
{% node #leaf-1 label="リーフ 1" /%}
{% node label="Hash(cNFT 1)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="70" %}
{% node #leaf-2 label="リーフ 2" /%}
{% node label="Hash(cNFT 2)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="-40" %}
