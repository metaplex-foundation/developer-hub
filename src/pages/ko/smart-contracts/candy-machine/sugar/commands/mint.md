---
title: mint
metaTitle: mint | Sugar
description: mint 명령어.
---

`mint`` 명령은 명령줄에서 Candy Machine의 NFT를 민팅합니다.

기본 `cache.json`을 사용하는 경우 다음을 사용할 수 있습니다:

```
sugar mint
```

그렇지 않으면 `--cache` 옵션으로 캐시 파일을 지정하세요:

```
sugar mint --cache <CACHE>
```

`-n` 옵션을 사용하여 민팅할 NFT 수를 지정할 수도 있습니다(예: 10)`:

```
sugar mint -n 10
```

{% callout %}

가드가 활성화된 경우 mint 명령을 사용할 수 없습니다.

{% /callout %}
