---
title: hash
metaTitle: hash | Sugar
description: hash 명령어.
---

*hiddenSettings*를 사용할 때 민팅이 완료되고 reveal이 수행될 때 자산을 검증할 수 있도록 구성 파일에 해시 값을 지정해야 합니다. 해시 값은 *hiddenSettings*가 활성화되면 deploy 명령에 의해 자동으로 업데이트되지만 캐시 파일을 수동으로 수정하는 시나리오가 있을 수 있습니다.

`hash` 명령은 캐시 파일의 해시를 계산하고 구성 파일의 해시 값을 업데이트합니다.

```
sugar hash
```

또한 `--compare` 옵션을 사용하여 게시된 해시 값을 캐시 파일의 값과 비교할 수 있습니다. 캐시 파일은 `--cache`로 수동으로 지정할 수 있으며, 지정하지 않으면 현재 디렉토리의 `cache.json` 파일이 기본값입니다.

기본 `cache.json`에 대해 `--compare` 실행:

```
sugar hash --compare 44oZ3goi9ivakeUnbjWbWJpvdgcWCrsi
```

특정 캐시 파일에 대해 `--compare` 실행:

```
sugar hash --compare 44oZ3goi9ivakeUnbjWbWJpvdgcWCrsi --cache my_custom_cache.json
```

{% callout %}

해시 값을 업데이트한 후 `update` 명령을 사용하여 새 값이 온체인에 반영되도록 Candy Machine 구성을 업데이트해야 합니다.

{% /callout %}
