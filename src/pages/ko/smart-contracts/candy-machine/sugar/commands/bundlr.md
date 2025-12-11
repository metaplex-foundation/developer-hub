---
title: bundlr
metaTitle: bundlr | Sugar
description: bundlr 명령어.
---

업로드 방법으로 Bundlr을 사용하는 경우 Sugar는 저장 비용을 충당하기 위해 Bundlr Network의 계정에 자동으로 자금을 지원합니다. 업로드가 완료되면 계정에 남은 자금이 있을 수 있습니다.

다음 명령으로 Bundlr Network의 잔액을 확인할 수 있습니다:

```
sugar bundlr balance
```

이렇게 하면 현재 키페어의 잔액이 검색됩니다. `--keypair` 옵션을 사용하여 대체 키페어를 지정할 수 있습니다. 남은 잔액(있는 경우)을 인출할 수 있습니다:

```
sugar bundlr withdraw
```

인출이 끝나면 Bundlr Network에서 사용 가능한 자금이 Solana 주소로 전송됩니다.
