---
title: Inscriptions CLI를 사용해서 시작하기
metaTitle: CLI | Inscription
description: Inscriptions CLI를 사용해서 시작하기
---

## 작업 공간 설정

[mpl-inscription 저장소](https://github.com/metaplex-foundation/mpl-inscription/)를 클론합니다.

```bash
git clone https://github.com/metaplex-foundation/mpl-inscription.git
```

CLI는 저장소의 `clients/cli` 하위 디렉토리에 위치합니다. 실행하기 전에 종속성을 먼저 설치해야 합니다.

```bash
pnpm install
```

그 후 다음 명령을 사용하여 대량 Inscribing을 호출할 수 있습니다. 선택적인 명령은 표시됩니다.

## NFT 다운로드

이 명령은 inscription할 자산을 초기화하는 데 사용됩니다. 다운로드 과정에서 실행 디렉토리에 캐시 폴더를 생성하고 NFT와 관련된 JSON(.json) 및 미디어(.png, .jpg, .jpeg) 파일을 저장하며, 다른 CLI 명령을 위한 데이터를 저장하는 .metadata 파일도 함께 저장합니다. 각 파일의 이름은 inscription할 NFT의 민트 주소가 됩니다.

inscription할 JSON 또는 미디어 파일을 수동으로 재정의하려면, 캐시 디렉토리의 관련 파일을 대신 inscription하고 싶은 파일로 교체하세요.

{% dialect-switcher title="NFT 자산을 다운로드하세요." %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli download hashlist -r <RPC_URL> -k <KEYPAIR_FILE> -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 비용 예측 (선택사항)

이 명령을 사용하여 NFT inscription의 총 비용을 확인할 수 있습니다. 계정 오버헤드와 캐시 디렉토리의 파일 크기를 기반으로 NFT inscription의 SOL 임대료 비용을 계산합니다.

{% dialect-switcher title="총 NFT Inscription 비용을 예측하세요." %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli cost hashlist -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## JSON 필드 정리 (선택사항)

이 명령은 NFT와 관련된 .json 파일에서 JSON 필드를 정리하는 데 사용할 수 있습니다. 종종 NFT JSON 데이터에는 Inscription 과정에서 비용 절약을 위해 제거할 수 있는 더 이상 사용되지 않는 필드가 포함되어 있습니다. 예를 들어 'seller_fee_basis_points', 'creators', 'collection' 필드는 모두 JSON 데이터에서 더 이상 사용되지 않으며 임대료 비용 절약을 위해 제거할 수 있습니다. 또한 설명 필드는 종종 길기 때문에 제작자가 비용 절약을 위해 이를 제거하고 싶어할 수 있습니다. `--remove` 옵션이 제공되지 않으면 기본적으로 제거될 필드는 'symbol', 'description', 'seller_fee_basis_points', 'collection'입니다.

{% dialect-switcher title="JSON 필드를 정리하세요." %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli compress json --fields symbol
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 이미지 압축 (선택사항)

CLI는 inscription 전에 이미지를 압축하여 임대료 비용을 더욱 절약할 수 있는 기능도 제공합니다. 세 가지 기준으로 압축할 수 있습니다:

- 품질 (숫자 1-100, 기본값: 80) (jpeg에만 적용) - 이미지의 전반적인 선명도와 사용 가능한 색상을 줄입니다.
- 크기 (숫자 1-100, 기본값: 100) - 낮은 숫자일수록 더 작은 이미지로 전체 이미지 크기를 줄입니다.
- 확장자 (png 또는 jpg, 기본값: jpg) - 이미지를 지정된 파일 유형으로 변경하며, jpeg는 일반적으로 png보다 작지만 손실이 있습니다.

{% dialect-switcher title="이미지를 압축하세요." %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli compress images -q <QUALITY> -s <SIZE> -e <EXTENSION>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Inscribe

{% dialect-switcher title="NFT 자산을 다운로드하세요." %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli inscribe hashlist -r <RPC_URL> -k <KEYPAIR_FILE> -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
