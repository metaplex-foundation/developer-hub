---
title: 시작하기
metaTitle: 시작하기 | Amman
description: Metaplex Amman 로컬 검증자 도구 키트의 설치 및 설정.
---

## 전제 조건

Amman을 실행하기 전에 시스템에 몇 가지를 설치해야 합니다.

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solanalabs.com/cli/install)
- [NodeJs](https://nodejs.org/en/download)

## 설치

새 프로젝트를 시작했거나 기존 프로젝트를 열었다면 패키지 매니저를 통해 Amman을 설치할 수 있습니다.

```js
npm i @metaplex-foundation/amman
```

## 스크립트에 추가 (선택사항)

사용 편의를 위해 package.json 스크립트에 Amman 실행을 추가할 수 있습니다.

{% dialect-switcher title="package.json" %}
{% dialect title="JavaScript" id="js" %}

```js
"scripts": {
    ...
    "amman:start": "npx amman start"
  },
```
{% /dialect %}
{% /dialect-switcher %}
