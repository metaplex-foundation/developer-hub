---
title: 캐시 파일
metaTitle: 캐시 파일 | Sugar
description: Sugar 캐시 파일.
---

Sugar는 캐시 파일을 사용하여 Candy Machine 및 생성된 자산을 추적합니다. 이를 통해 Sugar는 모든 자산을 다시 업로드하지 않고도 자산 업로드를 재개할 수 있습니다. 또한 컬렉션 및 Candy Machine 생성자와 같은 Candy Machine 계정에 대한 정보를 제공합니다.

캐시 파일을 직접 수동으로 수정할 필요는 없습니다 – 이 파일은 Sugar 명령어에 의해 조작됩니다. 위에서 논의한 것처럼 수정해야 하는 특정 상황이 있습니다.

{% callout %}

캐시 파일에는 모든 자산 정보와 생성된 계정의 주소가 포함되어 있으므로 복사본을 보관하세요.

{% /callout %}

## 구조

캐시 파일은 다음 구조를 가진 JSON 문서입니다:

```json
{
  "program": {
    "candyMachine": "<PUBLIC KEY>",
    "candyGuard": "<PUBLIC KEY>",
    "candyMachineCreator": "<PUBLIC KEY>",
    "collectionMint": "<PUBLIC KEY>"
  },
  "items": {
    "-1": {
      "name": "My Collection",
      "image_hash": "6500707cb13044b7d133abb5ad68e0af660b154499229af49419c86a251a2b4d",
      "image_link": "https://arweave.net/KplI7R59EE24-mavSgai7WVJmkfvYQKhtTnqxXPlPdE?ext=png",
      "metadata_hash": "2009eda578d1196356abcfdfbba252ec3318fc6ffe42cc764a624b0c791d8471",
      "metadata_link": "https://arweave.net/K75J8IG1HcTYJyr1eC0KksYfpxuFMkPONJMpUNDmCuA",
      "onChain": true
    },
    "0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "https://arweave.net/6DRibEPNjLQKA90v3qa-JsYPPT5a6--VsgKumUnX3_0",
      "onChain": true
    },
    ...
  }
}
```

### `program`

`"program"` 섹션에는 Candy Machine, Candy Guard 계정 및 Candy Machine 생성자와 컬렉션 민트의 주소에 대한 정보가 포함됩니다. 이러한 세부 정보는 Candy Machine이 배포되면 채워집니다. Candy Guard 주소는 candy machine에서 가드를 활성화한 경우에만 존재합니다.

### `items`

`"items"` 섹션에는 Candy Machine의 자산에 대한 정보가 포함됩니다. 이 목록은 Sugar가 자산 폴더를 검증하면 생성됩니다. 이 시점에서 모든 `"name"`, `"image_hash"` 및 `"metadata_hash"`가 캐시 파일에 추가됩니다. 자산이 업로드되면 `"image_link"` 및 `"metadata_link"` 정보가 최종 값으로 업데이트됩니다. 마지막으로 Candy Machine이 배포되면 `"onChain"` 값이 `true`로 설정됩니다.

Sugar `upload`는 해당 "link" 값이 채워지지 않은 자산만 업로드합니다 – 예: 다음 항목이 포함된 캐시 파일로 `sugar upload`를 실행:

```json
"0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "",
      "onChain": false
},
```

이미지 링크가 이미 존재하므로 메타데이터 파일만 업로드됩니다.

Sugar는 이미지 및 메타데이터 파일의 "hash"를 저장하므로, 해당 파일을 변경한 결과로 해시 값이 변경되면 `sugar upload`를 실행하면 새 파일이 업로드됩니다. 이 시점에서 `"onChain"` 값은 `false`로 설정되며 변경 사항은 `sugar deploy`를 실행한 후에만 적용(온체인)됩니다.

## "고급" 캐시 관리

대부분의 경우 캐시 파일을 수동으로 수정할 필요가 없습니다. 그러나 수정해야 하는 경우가 있습니다.

### 동일한 항목으로 새 Candy Machine 배포

캐시 파일의 동일한 항목을 재사용하여 Candy Machine을 새 주소에 배포하려면 캐시 파일에서 `"candyMachine"` 공개 키 값을 제거하면 됩니다:

{% totem %}
{% totem-accordion title="예시" %}

```json
{
  "program": {
    "candyMachine": "",
    "candyGuard": "",
    "candyMachineCreator": "6DwuXCUnGEE2NktwQub22Ejt2EQUexGmGADZURN1RF6J",
    "collectionMint": "5TM8a74oX6HgyAtVnKaUaGuwu44hxMhWF5QT5i7PkuZY"
  },
  "items": {
    "-1": {
      "name": "My Collection",
      "image_hash": "6500707cb13044b7d133abb5ad68e0af660b154499229af49419c86a251a2b4d",
      "image_link": "https://arweave.net/KplI7R59EE24-mavSgai7WVJmkfvYQKhtTnqxXPlPdE?ext=png",
      "metadata_hash": "2009eda578d1196356abcfdfbba252ec3318fc6ffe42cc764a624b0c791d8471",
      "metadata_link": "https://arweave.net/K75J8IG1HcTYJyr1eC0KksYfpxuFMkPONJMpUNDmCuA",
      "onChain": true
    },
    "0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "https://arweave.net/6DRibEPNjLQKA90v3qa-JsYPPT5a6--VsgKumUnX3_0",
      "onChain": true
    },
    ...
  }
}
```

{% /totem-accordion %}
{% /totem %}

### 기존 링크 사용

자산에 대한 링크가 이미 있는 경우, Sugar가 다시 업로드하지 않도록 정보를 캐시 파일에 수동으로 추가할 수 있습니다. 이 경우 해당 링크로 `"image_link"` 및 `"metadata_link"`를 완성해야 합니다.
