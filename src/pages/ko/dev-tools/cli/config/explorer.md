---
title: 탐색기 구성
metaTitle: 탐색기 구성 | Metaplex CLI
description: 선호하는 블록체인 탐색기 설정
---

`mplx config explorer` 명령어를 사용하여 거래와 계정을 조회할 때 사용할 선호 블록체인 탐색기를 설정할 수 있습니다.

## 기본 사용법

### 탐색기 설정

```bash
mplx config explorer set
```

## 명령어

### 탐색기 설정

사용 가능한 옵션 목록에서 선호하는 블록체인 탐색기를 설정합니다.

#### 예시

```bash
mplx config explorer set
```

#### 참고사항

- 사용 가능한 탐색기에서 선택할 수 있는 대화형 프롬프트가 열립니다
- 구성에서 활성 탐색기를 업데이트합니다
- 선택한 탐색기가 거래와 계정 조회에 사용됩니다
- 사용 가능한 탐색기:
  - Solana Explorer (<https://explorer.solana.com>)
  - Solscan (<https://solscan.io>)
  - Solana FM (<https://solana.fm>)

## 구성 파일

탐색기 구성은 구성 파일(기본값: `~/.mplx/config.json`)에 저장됩니다. 구조는 다음과 같습니다:

```json
{
  "explorer": "https://explorer.solana.com"
}
```

## 참고사항

- 탐색기 설정은 거래와 계정에 대한 링크를 표시할 때 사용됩니다
- 구성 파일이 존재하지 않으면 자동으로 생성됩니다
- 언제든지 선호 탐색기를 변경할 수 있습니다
- 선택한 탐색기가 명령어 출력의 모든 탐색기 링크에 사용됩니다
- 각 탐색기는 블록체인 데이터를 조회하기 위한 다양한 기능과 인터페이스를 제공합니다
