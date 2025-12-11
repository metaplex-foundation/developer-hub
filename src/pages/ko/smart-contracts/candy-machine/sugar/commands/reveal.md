---
title: reveal
metaTitle: reveal | Sugar
description: reveal 명령어.
---

*hiddenSettings*를 사용하여 민트 및 reveal을 수행할 때 `reveal` 명령을 사용하여 민팅된 모든 NFT를 캐시 파일의 값으로 업데이트할 수 있습니다:

```
sugar reveal
```

먼저 Candy Machine에서 민팅된 모든 NFT를 검색한 다음 NFT 번호로 캐시 파일의 값과 일치시킨 다음 NFT 데이터를 업데이트하는 방식으로 작동합니다. 명령은 NFT URI가 이미 캐시 파일의 URI와 일치하는지 확인하고 일치하면 업데이트를 건너뛰므로 명령을 다시 실행하여 새로 민팅된 NFT만 업데이트하거나 첫 번째 실행에서 업데이트하지 못한 NFT를 재시도할 수 있습니다.
