---
title: upload
metaTitle: upload | Sugar
description: upload 명령어.
---

`upload`` 명령은 자산을 지정된 저장소에 업로드하고 Candy Machine에 대한 캐시 파일을 생성합니다.

기본 자산 폴더 위치(예: 현재 디렉토리의 `assets` 폴더)를 사용하여 다음 명령으로 모든 자산을 업로드할 수 있습니다:

```
sugar upload
```

또는 다른 폴더를 지정할 수 있습니다:

```
sugar upload <ASSETS DIR>
```

{% callout %}

`upload` 명령은 업로드가 성공적으로 완료되지 않은 경우 언제든지 재개(재실행)할 수 있습니다 — 아직 업로드되지 않은 파일만 처리됩니다. 또한 미디어/메타데이터 파일의 내용이 변경되면 자동으로 감지하고 다시 업로드하여 캐시 파일을 적절히 업데이트합니다. 즉, 파일을 변경해야 하는 경우 새(수정된) 파일을 자산 폴더에 복사하고 업로드 명령을 다시 실행하기만 하면 됩니다. 캐시 파일을 수동으로 편집할 필요가 없습니다.

{% /callout %}

## 예시 이미지 및 메타데이터

Candy Machine의 예시 이미지 및 메타데이터에 액세스하려면 GitHub 저장소를 방문하여 녹색 `code` 버튼을 클릭하고 `Download ZIP`를 선택하여 zip 파일을 다운로드하세요.

[https://github.com/metaplex-foundation/example-candy-machine-assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

Git이 설치되어 있는 경우 다음 명령을 사용하여 저장소를 시스템에 복제하거나 zip 사본을 다운로드할 수도 있습니다:

```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```
