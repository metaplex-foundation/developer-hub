---
title: 시작하기
metaTitle: 시작하기 | Sugar
description: Sugar 시작하기.
---

시작하려면 먼저 시스템에 Sugar가 설치되어 있는지 확인하세요:

```bash
sugar --version
```

위 명령은 Sugar 버전을 출력해야 합니다 – 예: `sugar-cli 2.5.0`.

기본적으로 Sugar는 `solana-cli`의 키페어 및 RPC 설정을 사용합니다. 다음을 실행하여 현재 설정을 확인할 수 있습니다:

```bash
solana config get
```

그리고 다음을 실행하여 다른 설정을 지정할 수 있습니다:

```bash
solana config set --url <rpc url> --keypair <path to keypair file>
```

{% callout %}

Sugar는 시스템에 `solana-cli`가 설치되어 있을 필요가 없습니다. Sugar의 모든 명령은 사용할 값을 구성하기 위해 `-k` (키페어) 및 `-r` (RPC) 플래그를 허용합니다.

{% /callout %}

## 파일 준비

프로젝트를 위한 폴더를 만들고 그 안에 json 메타데이터와 이미지 파일 쌍을 `0.json`, `0.png`, `1.json`, `1.png` 등의 명명 규칙으로 저장할 `assets`라는 폴더를 만드세요. 메타데이터 확장자는 `.json`이고 이미지 파일은 `.png`, `.gif`, `.jpg` 및 `.jpeg`일 수 있습니다. 또한 컬렉션 NFT에 대한 정보가 포함된 `collection.json` 및 `collection.png` 파일이 필요합니다.

프로젝트 디렉토리는 다음과 같습니다:
{% diagram %}
{% node %}
{% node #my-project label="my-project/" theme="blue" /%}
{% /node %}

{% node parent="my-project" y="50" x="100" %}
{% node #assets label="assets/" theme="indigo" /%}
{% /node %}

{% node #0-json parent="assets" y="50" x="100" label="0.json" theme="mint" /%}
{% node #0-png parent="assets" y="95" x="100" label="0.png" theme="mint" /%}
{% node #1-json parent="assets" y="140" x="100" label="1.json" theme="orange" /%}
{% node #1-png parent="assets" y="185" x="100" label="1.png" theme="orange" /%}
{% node #2-json parent="assets" y="230" x="100" label="2.json" theme="mint" /%}
{% node #2-png parent="assets" y="275" x="100" label="2.png" theme="mint" /%}
{% node #more parent="assets" y="320" x="100" label=". . ." theme="orange" /%}
{% node #collection-json parent="assets" y="365" x="100" label="collection.json" theme="purple" /%}
{% node #collection-png parent="assets" y="410" x="100" label="collection.png" theme="purple" /%}

{% edge from="my-project" to="assets" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="0-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="0-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="1-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="1-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="2-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="2-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="more" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="collection-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="collection-png" fromPosition="bottom" toPosition="left" /%}
{% /diagram %}

## Sugar 실행

프로젝트 디렉토리 내에서 `launch` 명령을 사용하여 구성 파일 생성 및 Solana에 Candy Machine 배포의 대화형 프로세스를 시작하세요:

```bash
sugar launch
```

launch 명령 실행이 끝나면 Candy Machine이 온체인에 배포됩니다. `mint` 명령을 사용하여 NFT를 민팅할 수 있습니다:

```bash
sugar mint
```

모든 NFT가 민팅되면 Candy Machine을 닫고 계정 렌트를 회수할 수 있습니다:

```bash
sugar withdraw
```

{% callout %}

`withdraw` 명령은 Candy Machine이 비어 있지 않더라도 닫으므로 주의해서 사용하세요.

{% /callout %}
