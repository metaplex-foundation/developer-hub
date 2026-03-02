---
title: 同時マークルツリー
metaTitle: 同時マークルツリー - Bubblegum V2
description: 同時マークルツリーとBubblegumでの使用方法について詳しく学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - concurrent merkle tree
  - SPL account compression
  - tree buffer
  - max buffer
  - merkle proof
  - leaf validation
  - change log
about:
  - Merkle trees
  - Data structures
  - Solana programs
proficiencyLevel: Advanced
---

## Summary

**同時マークルツリー**は、圧縮NFTの基盤となるデータ構造を説明します。このページでは、マークルツリーの仕組み、リーフパス、証明、検証、および同じSolanaブロック内での並行書き込みを可能にする同時実行メカニズムについて説明します。

- マークルツリーは、ツリー全体を表す単一のルートを持つハッシュ化されたリーフとしてcNFTデータを保存します
- 証明により、ツリー全体を再ハッシュせずに特定のcNFTの存在を検証できます
- 同時実行メカニズムは、ChangeLogバッファを使用してブロックごとの複数の書き込みを処理します
- 最右端の証明はオンチェーンに保存され、証明データを送信せずにミンティングを可能にします


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
{% node #leaf-3 label="リーフ 3" /%}
{% node label="Hash(cNFT 3)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="70" %}
{% node #leaf-4 label="リーフ 4" /%}
{% node label="Hash(cNFT 4)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="-40" %}
{% node #leaf-5 label="リーフ 5" /%}
{% node label="Hash(cNFT 5)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="70" %}
{% node #leaf-6 label="リーフ 6" /%}
{% node label="Hash(cNFT 6)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="-40" %}
{% node #leaf-7 label="リーフ 7" /%}
{% node label="Hash(cNFT 7)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="70" %}
{% node #leaf-8 label="リーフ 8" /%}
{% node label="Hash(cNFT 8)" /%}
{% /node %}

{% edge from="i-node-1" to="root" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-2" to="root" fromPosition="top" toPosition="bottom" /%}

{% edge from="i-node-3" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-4" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-6" to="i-node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-5" to="i-node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-3" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-5" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="i-node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="i-node-6" fromPosition="top" toPosition="bottom" /%}

{% /diagram %}

## Notes

- ツリー作成時に設定された最大バッファサイズにより、ブロックごとに高速転送できる同時変更の数が決まります。
- バッファサイズが許可する数を超える同時変更が発生した場合、一部のトランザクションは失敗し、再試行が必要です。
- DAS APIから取得した証明は、フェッチと使用の間にツリーが変更された場合、古くなる可能性があります。ChangeLogメカニズムは、同時操作に対してこれを軽減します。
- 最右端の証明の最適化により、新しいリーフは常に最右端の位置に追加されるため、証明データなしでミンティング（追加）が可能です。

## Glossary

| 用語 | 定義 |
|------|------|
| **マークルツリー** | 各ノードがその子のハッシュであり、リーフがcNFTデータを表すバイナリツリー |
| **マークルルート** | ツリー全体の整合性を表す単一のトップレベルハッシュ |
| **リーフパス** | リーフノードハッシュとルートに至るすべての中間ノード |
| **証明** | 特定のリーフからルートを再計算するために必要な兄弟ハッシュ |
| **ChangeLog** | 古い証明を高速転送することで同時書き込みを可能にする最近のツリー変更のバッファ |
| **spl-account-compression** | オンチェーンの同時マークルツリーを管理するSolanaプログラム |
