---
title: Get Asset Proofs
metaTitle: Get Asset Proofs | DAS API
description: 여러 압축된 자산에 대한 머클 트리 증명 정보를 반환합니다
tableOfContents: false
---

여러 압축된 자산에 대한 머클 트리 증명 정보를 반환합니다. 이 메서드는 압축된 NFT의 진위를 확인하기 위해 머클 증명을 검색하는 데 사용됩니다.

## 매개변수

| 이름            | 필수 | 설명                                |
| --------------- | :------: | ------------------------------------------ |
| `ids`           |    ✅    | 증명을 가져올 자산 ID 배열입니다.   |

## Playground

{% apiRenderer method="getAssetProofs" /%}
