---
title: config
metaTitle: config | Sugar
description: config 명령어.
---

`config` 명령을 사용하면 Candy Machine 구성을 관리할 수 있습니다. 기본적으로 Sugar는 현재 디렉토리에서 `config.json` 파일을 찾아 Candy Machine 구성을 로드합니다 – 구성 파일 이름은 이를 필요로 하는 모든 명령에서 `-c` 또는 `--config` 옵션으로 지정할 수 있습니다.

이 [지침](/ko/smart-contracts/candy-machine/sugar/configuration)에 따라 이 파일을 수동으로 만들거나 config create 명령을 사용할 수 있습니다:

```
sugar config create
```

명령을 실행하면 모든 구성 옵션에 대한 정보를 수집하기 위한 일련의 프롬프트로 구성된 대화형 프로세스가 시작됩니다. 끝에서 구성 파일이 저장되거나(기본값은 config.json) 그 내용이 화면에 표시됩니다. 사용자 정의 파일 이름을 지정하려면 `-c` 옵션을 사용하세요:

```
sugar config create -c my-config.json
```

Candy Machine이 배포되면 구성 파일의 모든 변경 사항은 `update` 하위 명령을 사용하여 Candy Machine 계정에 설정해야 합니다:

```
sugar config update
```

`-n` 옵션을 사용하여 Candy Machine 권한(Candy Machine을 제어하는 공개 키)을 업데이트할 수 있습니다:

```
sugar config update -n <NEW PUBLIC KEY>
```

`set` 하위 명령을 사용하여 Candy Machine을 통해 민팅된 자산의 토큰 표준을 변경할 수도 있습니다. 이 명령은 `-t` 옵션을 사용하여 자산 유형을 `NFT` 또는 `pNFT`로 변경하는 것을 지원합니다. 또한 민팅된 pNFT에 대한 규칙 세트를 지정할 수 있습니다.

```
sugar config set -t "pnft" --rule-set <PUBLIC KEY>
```
