---
title: update
metaTitle: update | Sugar
description: update 명령어.
---

`update` 명령은 Candy Machine의 현재 구성을 수정하는 데 사용됩니다. 이 명령으로 대부분의 구성 설정을 업데이트할 수 있지만 다음은 제외됩니다:

- Candy Machine의 항목 수는 `hiddenSettings`를 사용하는 경우에만 업데이트할 수 있습니다;
- `hiddenSettings` 사용으로 전환하는 것은 항목 수가 0인 경우에만 가능합니다. 전환 후 항목 수를 업데이트할 수 있습니다.

구성을 업데이트하려면 config.json(또는 동등한 파일) 파일을 수정하고 다음을 실행하세요:

```
sugar update
```

`--config` 및 `--cache` 옵션으로 사용자 정의 구성 및 캐시 파일을 지정할 수도 있습니다:

```
sugar update -c <CONFIG> --cache <CACHE>
```

{% callout %}

잘못된 값을 설정하면 즉시 기능에 영향을 미치므로 라이브 Candy Machine을 업데이트할 때 주의해야 합니다.

{% /callout %}
