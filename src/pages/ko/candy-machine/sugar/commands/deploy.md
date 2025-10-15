---
title: deploy
metaTitle: deploy | Sugar
description: deploy 명령어.
---

모든 자산이 업로드되고 캐시 파일이 성공적으로 생성되면 항목을 Solana에 배포할 준비가 된 것입니다:

```
sugar deploy
```

deploy 명령은 캐시 파일의 정보를 온체인의 Candy Machine 계정에 씁니다. 이렇게 하면 Candy Machine이 효과적으로 생성되고 온체인 ID(공개 키)가 표시됩니다 — 이 ID를 사용하여 [탐색기](https://explorer.solana.com)를 사용하여 온체인 정보를 쿼리할 수 있습니다. 기본 이름을 사용하지 않는 경우 `-c` 옵션으로 구성 파일의 경로를 지정하고(기본값 `config.json`) `--cache` 옵션으로 캐시 파일의 이름을 지정할 수 있습니다(기본값 `cache.json`).
