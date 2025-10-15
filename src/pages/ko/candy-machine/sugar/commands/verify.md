---
title: verify
metaTitle: verify | Sugar
description: verify 명령어.
---

`verify` 명령은 캐시 파일의 모든 항목이 성공적으로 온체인에 기록되었는지 확인합니다:

```
sugar verify
```

기본 `cache.json`이 아닌 다른 캐시 파일을 지정하려면 `--cache` 옵션을 사용하세요:

```
sugar verify --cache <CACHE>
```

배포가 성공하면 검증에서 오류가 반환되지 않습니다.
